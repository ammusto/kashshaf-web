/**
 * The announcement list lives on MailerLite. Both IDs come from the code of
 * an embedded form there (Forms → Embedded forms → the form → "HTML code"):
 * the action URL reads
 *   https://assets.mailerlite.com/jsonp/<ACCOUNT>/forms/<FORM>/subscribe
 * Fill the two in and the form on the front page posts straight to it.
 */
export const MAILERLITE_ACCOUNT = '';
export const MAILERLITE_FORM = '';

export function subscribeUrl(): string | null {
  if (!MAILERLITE_ACCOUNT || !MAILERLITE_FORM) return null;
  return `https://assets.mailerlite.com/jsonp/${MAILERLITE_ACCOUNT}/forms/${MAILERLITE_FORM}/subscribe`;
}
