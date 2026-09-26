import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as XLSX from 'xlsx';
import type { BookMetadata } from '../types';

const API_BASE = 'https://api.kashshaf.com';
const METADATA_URL = '/metadata.xlsx';

// Bump this to invalidate every client's cached copy of metadata.xlsx and /genres.
const CACHE_NAME = 'kashshaf-corpus-v1';

// Wraps fetch with the browser Cache API: subsequent page loads return the
// cached Response without hitting the network. Bump CACHE_NAME to invalidate.
async function fetchWithCache(url: string): Promise<Response> {
  if (typeof caches === 'undefined') return fetch(url);
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);
    if (cached) return cached;
    const response = await fetch(url);
    if (response.ok) {
      // Clone so the caller can still read the body. Fire-and-forget the put.
      cache.put(url, response.clone()).catch(() => undefined);
    }
    return response;
  } catch {
    return fetch(url);
  }
}

interface BooksContextValue {
  books: BookMetadata[];
  booksMap: Map<number, BookMetadata>;
  authorsMap: Map<number, string>;
  genresMap: Map<number, string>;
  loading: boolean;
  error: string | null;
}

const BooksContext = createContext<BooksContextValue | null>(null);

interface XlsxRow {
  id: number | string;
  metadata_json: string;
}

interface RowMetadata {
  title?: string;
  author_id?: string;
  author_name?: string;
  death_ah?: string;
  century_ah?: string;
  genre_id?: string;
}

interface ParsedMeta {
  id?: string;
  corpus?: string;
  original_id?: string;
  row_metadata?: RowMetadata;
  // Other fields preserved untouched (BookPage parses them itself)
  [k: string]: unknown;
}

function toIntOrUndefined(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = typeof v === 'number' ? v : parseInt(String(v), 10);
  return Number.isFinite(n) ? n : undefined;
}

// Yield to the browser between chunks so parsing doesn't freeze the page.
async function chunkedMap<T, R>(
  items: T[],
  fn: (item: T, idx: number) => R,
  chunkSize = 250
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  for (let i = 0; i < items.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, items.length);
    for (let j = i; j < end; j++) out[j] = fn(items[j], j);
    await new Promise<void>((r) => setTimeout(r, 0));
  }
  return out;
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [authorsMap, setAuthorsMap] = useState<Map<number, string>>(new Map());
  const [genresMap, setGenresMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        // Two parallel fetches: the big metadata blob and a small genre lookup.
        // Genre names aren't stored in metadata_json, so we still pull them from
        // the API. /authors is unnecessary because each book's metadata_json
        // already carries its author name.
        const [xlsxBuf, genresJson] = await Promise.all([
          fetchWithCache(METADATA_URL).then((r) => {
            if (!r.ok) throw new Error(`metadata.xlsx returned ${r.status}`);
            return r.arrayBuffer();
          }),
          fetchWithCache(`${API_BASE}/genres`).then((r) => r.json()).catch(() => [] as [number, string][]),
        ]);
        if (cancelled) return;

        // Parse the workbook (synchronous, ~200-500ms for a 3 MB sheet).
        const workbook = XLSX.read(xlsxBuf, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<XlsxRow>(sheet);

        // Parse each row's metadata_json in chunks so the UI thread stays responsive.
        const authors = new Map<number, string>();
        const parsedBooks = await chunkedMap(rows, (row) => {
          const id = toIntOrUndefined(row.id);
          let meta: ParsedMeta | null = null;
          try {
            meta = row.metadata_json ? JSON.parse(row.metadata_json) : null;
          } catch {
            meta = null;
          }
          const rowMeta = meta?.row_metadata ?? {};
          const authorId = toIntOrUndefined(rowMeta.author_id);
          if (authorId !== undefined && rowMeta.author_name) {
            // First author_name we encounter for an id wins; consistent across books.
            if (!authors.has(authorId)) authors.set(authorId, rowMeta.author_name);
          }
          const book: BookMetadata = {
            id: id ?? -1,
            corpus: typeof meta?.corpus === 'string' ? meta.corpus : undefined,
            title: rowMeta.title || '',
            author_id: authorId,
            death_ah: toIntOrUndefined(rowMeta.death_ah),
            century_ah: toIntOrUndefined(rowMeta.century_ah),
            genre_id: toIntOrUndefined(rowMeta.genre_id),
            original_id: typeof meta?.original_id === 'string' ? meta.original_id : undefined,
            in_corpus: true,
            metadata_json: row.metadata_json,
          };
          return book;
        });
        if (cancelled) return;

        const filtered = parsedBooks.filter((b) => b.id >= 0);

        const genres = new Map<number, string>();
        if (Array.isArray(genresJson)) {
          for (const entry of genresJson as [number, string][]) {
            if (Array.isArray(entry) && entry.length >= 2) {
              genres.set(Number(entry[0]), String(entry[1]));
            }
          }
        }

        setBooks(filtered);
        setAuthorsMap(authors);
        setGenresMap(genres);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(`Failed to load corpus: ${err instanceof Error ? err.message : err}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const booksMap = useMemo(() => {
    const m = new Map<number, BookMetadata>();
    for (const b of books) m.set(b.id, b);
    return m;
  }, [books]);

  const value: BooksContextValue = {
    books,
    booksMap,
    authorsMap,
    genresMap,
    loading,
    error,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks(): BooksContextValue {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooks must be used inside BooksProvider');
  return ctx;
}
