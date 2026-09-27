import { useEffect, useRef, useState, type FormEvent } from 'react';

type State = 'idle' | 'sending' | 'done' | 'error';

const CONTACT = 'antonio@kashshaf.com';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface Turnstile {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }
  ) => string;
  reset: (widgetId: string) => void;
  getResponse: (widgetId: string) => string | undefined;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

/** Load the Turnstile script once; resolve when window.turnstile exists. */
function loadTurnstile(): Promise<Turnstile> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${TURNSTILE_SCRIPT}"]`);
    const script = existing ?? document.createElement('script');
    const onLoad = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', () => reject(new Error('turnstile failed to load')), { once: true });
    if (!existing) {
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}

/**
 * One e-mail field posted as JSON to /api/subscribe (a Pages Function that
 * mails the address on). A Managed-mode Turnstile widget sits under the field
 * and its token travels with the address; a hidden "website" field is the
 * honeypot. On success the form gives way to a confirmation line; on failure
 * a line gives the address to write to directly.
 */
const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<State>('idle');
  const [token, setToken] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/subscribe', { headers: { accept: 'application/json' } });
        const { siteKey } = (await res.json()) as { siteKey?: string };
        if (!siteKey || cancelled) return;
        const turnstile = await loadTurnstile();
        if (cancelled || !widgetRef.current || widgetId.current) return;
        widgetId.current = turnstile.render(widgetRef.current, {
          sitekey: siteKey,
          action: 'subscribe',
          callback: (t) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      } catch {
        /* no widget: the server rejects the submission and the failure line shows */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), website, token, page: window.location.href }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (res.ok && data.ok) {
        setState('done');
      } else {
        setState('error');
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
        setToken('');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="signup-done">You will receive information about updates, including release—Thank you!.</p>;
  }

  return (
    <form className="signup-form" onSubmit={submit}>

      <div className="signup-row">
        <input
          id="signup-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === 'sending'}
        />
        <button type="submit" className="btn btn-primary" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Notify me'}
        </button>
      </div>
      {/* Honeypot: off-screen, not tabbable, hidden from assistive tech; people never fill it. */}
      <div className="signup-hp" aria-hidden="true">
        <label htmlFor="signup-website">Website</label>
        <input id="signup-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div className="signup-turnstile" ref={widgetRef} />
      {state === 'error' && (
        <p className="signup-error">
          That did not go through. Write to {CONTACT} and we will add you.
        </p>
      )}
    </form>
  );
};

export default SignupForm;
