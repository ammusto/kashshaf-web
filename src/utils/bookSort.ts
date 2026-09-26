import type { BookMetadata, SortKey, SortDir } from '../types';

export function compareBooks(
  a: BookMetadata,
  b: BookMetadata,
  sortKey: SortKey,
  sortDir: SortDir,
  authorsMap: Map<number, string>,
  genresMap: Map<number, string>
): number {
  let cmp = 0;
  if (sortKey === 'title') {
    cmp = (a.title || '').localeCompare(b.title || '', 'ar');
  } else if (sortKey === 'author') {
    const aName = a.author_id !== undefined ? authorsMap.get(a.author_id) ?? '' : '';
    const bName = b.author_id !== undefined ? authorsMap.get(b.author_id) ?? '' : '';
    cmp = aName.localeCompare(bName, 'ar');
  } else if (sortKey === 'death') {
    const aDeath = a.death_ah ?? Infinity;
    const bDeath = b.death_ah ?? Infinity;
    if (aDeath === bDeath) cmp = 0;
    else if (!isFinite(aDeath)) return 1;
    else if (!isFinite(bDeath)) return -1;
    else cmp = aDeath - bDeath;
  } else if (sortKey === 'genre') {
    const aGenre = a.genre_id !== undefined ? genresMap.get(a.genre_id) ?? '' : '';
    const bGenre = b.genre_id !== undefined ? genresMap.get(b.genre_id) ?? '' : '';
    cmp = aGenre.localeCompare(bGenre, 'ar');
  }
  return sortDir === 'asc' ? cmp : -cmp;
}

export function normalizeArabicForSearch(text: string): string {
  return text
    .replace(/[ً-ٰٟٱ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ى/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/[یے]/g, 'ي')
    .replace(/[ۀە]/g, 'ه')
    .replace(/ۃ/g, 'ة')
    .toLowerCase();
}
