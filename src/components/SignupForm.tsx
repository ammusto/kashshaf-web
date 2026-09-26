import { useState, type FormEvent } from 'react';
import { subscribeUrl } from '../mailingList';

type State = 'idle' | 'sending' | 'done' | 'error';

/**
 * One e-mail field posted to the MailerLite form endpoint, the same request
 * MailerLite's own embedded form makes. On success the form is replaced by
 * a confirmation line; MailerLite sends the double opt-in message.
 */
const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const url = subscribeUrl();
    if (!url) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const body = new FormData();
      body.set('fields[email]', email.trim());
      body.set('ml-submit', '1');
      body.set('anticsrf', 'true');
      const res = await fetch(url, { method: 'POST', body, headers: { Accept: 'application/json' } });
      const data = (await res.json()) as { success?: boolean };
      setState(res.ok && data.success ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className="signup-done">
        Thanks. Check your inbox for a confirmation message; once you confirm, you will hear from us when al-Kashshāf opens.
      </p>
    );
  }

  return (
    <form className="signup-form" onSubmit={submit}>
      <label htmlFor="signup-email" className="signup-label">
        One e-mail when al-Kashshāf opens, nothing else.
      </label>
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
      {state === 'error' && <p className="signup-error">That did not go through. Please try again in a moment.</p>}
    </form>
  );
};

export default SignupForm;
