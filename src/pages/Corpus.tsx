import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useBooks } from '../contexts/BooksContext';
import type { SortDir, SortKey } from '../types';
import { compareBooks, normalizeArabicForSearch } from '../utils/bookSort';
import Spinner from '../components/Spinner';

const ROW_HEIGHT = 56;

const Corpus = () => {
  const { books, authorsMap, genresMap, loading, error } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('death');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = normalizeArabicForSearch(searchQuery);
    return books.filter((b) => {
      const t = normalizeArabicForSearch(b.title);
      const author = b.author_id !== undefined ? authorsMap.get(b.author_id) : undefined;
      const a = author ? normalizeArabicForSearch(author) : '';
      return t.includes(q) || a.includes(q);
    });
  }, [books, searchQuery, authorsMap]);

  const sorted = useMemo(() => {
    const out = [...filtered];
    out.sort((a, b) => compareBooks(a, b, sortKey, sortDir, authorsMap, genresMap));
    return out;
  }, [filtered, sortKey, sortDir, authorsMap, genresMap]);

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const arrow = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : '');

  return (
    <div className="corpus-page">
      <div className="hero">
        <h1>Corpus</h1>
      </div>

      <div className="corpus-controls">
        <span className="corpus-count">
          {loading ? '' : `${sorted.length.toLocaleString()} of ${books.length.toLocaleString()} texts`}
        </span>
        {!loading && (
          <input
            type="text"
            dir="rtl"
            placeholder="Search title or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="corpus-search"
          />
        )}
      </div>

      {error && <p className="corpus-error">{error}</p>}

      {loading && <Spinner label="Loading corpus metadata…" />}

      <div className="corpus-table" style={{ display: loading ? 'none' : undefined }}>
        <div className="corpus-thead" dir="rtl">
          <button
            type="button"
            onClick={() => handleSort('title')}
            className={`corpus-th col-title ${sortKey === 'title' ? 'active' : ''}`}
          >
            Title <span className="sort-arrow">{arrow('title')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSort('author')}
            className={`corpus-th col-author ${sortKey === 'author' ? 'active' : ''}`}
          >
            Author <span className="sort-arrow">{arrow('author')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSort('death')}
            className={`corpus-th col-death ${sortKey === 'death' ? 'active' : ''}`}
          >
            Death <span className="sort-arrow">{arrow('death')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSort('genre')}
            className={`corpus-th col-genre ${sortKey === 'genre' ? 'active' : ''}`}
          >
            Genre <span className="sort-arrow">{arrow('genre')}</span>
          </button>
        </div>

        <div ref={parentRef} className="corpus-tbody-scroll">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((vRow) => {
              const book = sorted[vRow.index];
              if (!book) return null;
              const authorName = book.author_id !== undefined ? authorsMap.get(book.author_id) : undefined;
              const genreName = book.genre_id !== undefined ? genresMap.get(book.genre_id) : undefined;
              const death = book.death_ah && book.death_ah !== 0 ? `${book.death_ah} AH` : '—';
              return (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${vRow.size}px`,
                    transform: `translateY(${vRow.start}px)`,
                  }}
                  className="corpus-row"
                  dir="rtl"
                >
                  <div className="corpus-cell col-title arabic">{book.title}</div>
                  <div className="corpus-cell col-author arabic">{authorName || 'Unknown'}</div>
                  <div className="corpus-cell col-death">{death}</div>
                  <div className="corpus-cell col-genre">{genreName || '—'}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corpus;
