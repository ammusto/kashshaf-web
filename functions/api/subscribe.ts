/**
 * POST /api/subscribe — the front-page signup.
 *
 * The body is {email, website, token, page}. The address is e-mailed to
 * EMAIL_TO with the subject "[Updates] <address>" through Cloudflare's Email
 * Service REST API. Nothing else is kept: the only state is a per-IP counter
 * in KV, keyed by a hash of the caller's IP, expiring after an hour.
 *
 * Abuse handling. A filled honeypot, a malformed address, a hit rate limit,
 * or a failed Turnstile check all answer {ok: true} without sending, so a bot
 * learns nothing. Only a failure to send answers {ok: false}, so a person can
 * be told to write directly.
 *
 * GET /api/subscribe — {siteKey} for the Turnstile widget on the page.
 *
 * Local development (wrangler pages dev, host localhost/127.0.0.1): Cloudflare's
 * published test keys stand in for the Turnstile pair, and with no
 * EMAIL_API_TOKEN the message is logged instead of sent.
 *
 * Pages environment (Settings → Variables and Secrets, Settings → Bindings):
 *   TURNSTILE_SITE_KEY    variable  the widget's site key (public)
 *   TURNSTILE_SECRET_KEY  secret    the widget's secret key
 *   EMAIL_API_TOKEN       secret    API token with Email Sending: Send
 *   CF_ACCOUNT_ID         variable  the account id the token belongs to
 *   EMAIL_FROM            variable  sender on the onboarded domain (default updates@kashshaf.com)
 *   EMAIL_TO              variable  recipient (default antonio@kashshaf.com)
 *   RATE_LIMIT            KV namespace binding
 */

interface Env {
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  EMAIL_API_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  RATE_LIMIT?: KVNamespace;
}

const DEFAULT_FROM = 'updates@kashshaf.com';
const DEFAULT_TO = 'antonio@kashshaf.com';
const MAX_BODY_BYTES = 4096;
const MAX_PER_HOUR = 5;
const WINDOW_SECONDS = 3600;
const TURNSTILE_ACTION = 'subscribe';

// Cloudflare's published Turnstile test pair: a visible widget that always passes.
const TEST_SITE_KEY = '1x00000000000000000000AA';
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

const ok = () => json({ ok: true });
const failed = () => json({ ok: false }, 502);

function isLocalDev(request: Request): boolean {
  const host = new URL(request.url).hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) =>
  json({ siteKey: isLocalDev(request) ? TEST_SITE_KEY : (env.TURNSTILE_SITE_KEY ?? '') });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const local = isLocalDev(request);
  const length = Number(request.headers.get('content-length') ?? '0');
  if (!Number.isFinite(length) || length > MAX_BODY_BYTES) return ok();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return ok();
  }
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const honeypot = typeof body.website === 'string' ? body.website : '';
  const token = typeof body.token === 'string' ? body.token : '';
  const pageFromBody = typeof body.page === 'string' ? body.page : '';

  // Bots fill the field a person never sees.
  if (honeypot !== '') return ok();
  if (!validEmail(email)) return ok();

  const ip = request.headers.get('cf-connecting-ip') ?? '';
  if (await overLimit(env.RATE_LIMIT, ip)) return ok();

  const secret = local ? TEST_SECRET_KEY : (env.TURNSTILE_SECRET_KEY ?? '');
  const turnstile = await verifyTurnstile(secret, token, ip);
  if (turnstile === 'error') return failed();
  if (turnstile === 'fail') return ok();

  const page = clean(request.headers.get('referer') ?? pageFromBody, 500);
  const when = new Date().toISOString();
  const message = {
    to: env.EMAIL_TO || DEFAULT_TO,
    from: env.EMAIL_FROM || DEFAULT_FROM,
    subject: `[Updates] ${email}`,
    text: `Address: ${email}\nTime: ${when}\nPage: ${page || '(none)'}\n`,
  };
  if (local && !env.EMAIL_API_TOKEN) {
    console.log('[subscribe] would send:', message);
    return ok();
  }
  return (await sendEmail(env, message)) ? ok() : failed();
};

/** One local part, one @, a dotted domain, no whitespace or control characters, RFC length. */
function validEmail(s: string): boolean {
  if (s.length < 6 || s.length > 254) return false;
  if (/\s/.test(s) || hasControl(s)) return false;
  return /^[^@]+@[^@]+\.[^@.]{2,}$/.test(s);
}

function isControl(code: number): boolean {
  return code < 0x20 || code === 0x7f;
}

function hasControl(s: string): boolean {
  for (let i = 0; i < s.length; i++) if (isControl(s.charCodeAt(i))) return true;
  return false;
}

/** Printable characters only, capped, so nothing odd reaches the mail body. */
function clean(s: string, max: number): string {
  let out = '';
  for (const ch of s) if (!isControl(ch.charCodeAt(0))) out += ch;
  return out.slice(0, max);
}

/** MAX_PER_HOUR per caller IP, counted in KV under a hash of the IP. Without the binding, nothing is limited. */
async function overLimit(kv: KVNamespace | undefined, ip: string): Promise<boolean> {
  if (!kv || !ip) return false;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const key = 'rl:' + Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  const count = Number((await kv.get(key)) ?? '0');
  if (count >= MAX_PER_HOUR) return true;
  await kv.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });
  return false;
}

/** 'pass', 'fail' (the token did not verify), or 'error' (siteverify itself could not be reached). */
async function verifyTurnstile(secret: string, token: string, ip: string): Promise<'pass' | 'fail' | 'error'> {
  if (!secret || !token) return 'fail';
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }),
    });
    if (!res.ok) return 'error';
    const data = (await res.json()) as { success?: boolean; action?: string };
    return data.success && (!data.action || data.action === TURNSTILE_ACTION) ? 'pass' : 'fail';
  } catch {
    return 'error';
  }
}

async function sendEmail(env: Env, message: { to: string; from: string; subject: string; text: string }): Promise<boolean> {
  if (!env.EMAIL_API_TOKEN || !env.CF_ACCOUNT_ID) return false;
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.EMAIL_API_TOKEN}`, 'content-type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
