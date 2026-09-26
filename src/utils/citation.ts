export type CitationStyle = 'mla' | 'chicago';

export interface CitationData {
  title: string;
  authors: string[];
  editors: string[];
  translators: string[];
  arrangers: string[];
  place: string | null;
  publisher: string | null;
  date: string | null;
  edition: string | null;
  volumes: string | null;
  warnings: string[];
}

export function parseCitation(jsonStr?: string | null): CitationData | null {
  if (!jsonStr) return null;
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      authors: Array.isArray(parsed.authors) ? parsed.authors.filter((x: unknown) => typeof x === 'string') : [],
      editors: Array.isArray(parsed.editors) ? parsed.editors.filter((x: unknown) => typeof x === 'string') : [],
      translators: Array.isArray(parsed.translators) ? parsed.translators.filter((x: unknown) => typeof x === 'string') : [],
      arrangers: Array.isArray(parsed.arrangers) ? parsed.arrangers.filter((x: unknown) => typeof x === 'string') : [],
      place: typeof parsed.place === 'string' ? parsed.place : null,
      publisher: typeof parsed.publisher === 'string' ? parsed.publisher : null,
      date: typeof parsed.date === 'string' ? parsed.date : null,
      edition: typeof parsed.edition === 'string' ? parsed.edition : null,
      volumes: typeof parsed.volumes === 'string' ? parsed.volumes : null,
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings.filter((x: unknown) => typeof x === 'string') : [],
    };
  } catch {
    return null;
  }
}

function joinClean(parts: (string | null | undefined)[], sep: string): string {
  return parts.filter((p): p is string => !!p && p.length > 0).join(sep);
}

function withTerminalPeriod(value: string): string {
  const trimmed = value.trimEnd();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatChicago(c: CitationData): string {
  const parts: string[] = [];
  if (c.authors.length > 0) parts.push(c.authors.join(', ') + '.');
  parts.push(`<em>${escapeHtml(c.title)}</em>.`);
  if (c.editors.length > 0) parts.push(`Edited by ${c.editors.join(', ')}.`);
  if (c.translators.length > 0) parts.push(`Translated by ${c.translators.join(', ')}.`);
  if (c.arrangers.length > 0) parts.push(`Arranged by ${c.arrangers.join(', ')}.`);
  if (c.edition) parts.push(withTerminalPeriod(c.edition));

  const pub = joinClean(
    [
      c.place,
      c.publisher ? `${c.place ? ': ' : ''}${c.publisher}` : null,
      c.date ? `${(c.place || c.publisher) ? ', ' : ''}${c.date}` : null,
    ],
    ''
  );
  if (pub) parts.push(withTerminalPeriod(pub));

  return parts.join(' ');
}

export function formatMLA(c: CitationData): string {
  const parts: string[] = [];
  if (c.authors.length > 0) parts.push(c.authors.join(', ') + '.');
  const hasMore =
    c.editors.length > 0 ||
    c.translators.length > 0 ||
    c.arrangers.length > 0 ||
    !!c.edition ||
    !!c.publisher ||
    !!c.date;
  parts.push(`<em>${escapeHtml(c.title)}</em>${hasMore ? ',' : '.'}`);

  const middle: string[] = [];
  if (c.editors.length > 0) middle.push(`edited by ${c.editors.join(', ')}`);
  if (c.translators.length > 0) middle.push(`translated by ${c.translators.join(', ')}`);
  if (c.arrangers.length > 0) middle.push(`arranged by ${c.arrangers.join(', ')}`);
  if (c.edition) middle.push(c.edition);
  if (c.publisher) middle.push(c.publisher);
  if (c.date) middle.push(c.date);
  if (middle.length > 0) parts.push(withTerminalPeriod(middle.join(', ')));

  return parts.join(' ');
}

export function formatCitation(c: CitationData, style: CitationStyle): string {
  return style === 'mla' ? formatMLA(c) : formatChicago(c);
}

export function stripCitationMarkup(html: string): string {
  return html.replace(/<\/?em>/g, '');
}
