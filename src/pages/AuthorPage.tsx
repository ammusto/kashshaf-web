import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../contexts/BooksContext';
import Spinner from '../components/Spinner';

const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, authorsMap, genresMap, loading, error } = useBooks();

  const authorId = id ? parseInt(id, 10) : NaN;
  const authorName = !isNaN(authorId) ? authorsMap.get(authorId) : undefined;

  const authorBooks = useMemo(() => {
    if (isNaN(authorId)) return [];
    return books
      .filter((b) => b.author_id === authorId)
      .sort((a, b) => {
        const ad = a.death_ah ?? Infinity;
        const bd = b.death_ah ?? Infinity;
        if (ad !== bd) {
          if (!isFinite(ad)) return 1;
          if (!isFinite(bd)) return -1;
          return ad - bd;
        }
        return (a.title || '').localeCompare(b.title || '', 'ar');
      });
  }, [books, authorId]);

  const deathAh = authorBooks.find((b) => b.death_ah !== undefined && b.death_ah !== 0)?.death_ah;

  if (loading) {
    return (
      <div className="corpus-page">
        <Spinner label="Loading corpus metadata…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="corpus-page">
        <p className="corpus-error">{error}</p>
      </div>
    );
  }

  if (!authorName) {
    return (
      <div className="corpus-page">
        <p>
          Author not found. <Link to="/corpus">Back to corpus</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="corpus-page">
      <button onClick={() => navigate('/corpus')} className="back-link">
        ← Back to Corpus
      </button>

      <h1 className="book-title arabic" dir="rtl">
        {authorName}
      </h1>
      {deathAh !== undefined && (
        <div className="book-author arabic" dir="rtl">
          <span className="book-death">(ت {deathAh})</span>
        </div>
      )}

      <section className="book-section">
        <h2>
          {authorBooks.length} {authorBooks.length === 1 ? 'book' : 'books'} in the corpus
        </h2>
        {authorBooks.length === 0 ? (
          <p className="muted">No books found for this author.</p>
        ) : (
          <div className="corpus-table no-virtualize">
            <div className="corpus-thead" dir="rtl">
              <div className="corpus-th col-title">Title</div>
              <div className="corpus-th col-death">Death</div>
              <div className="corpus-th col-genre">Genre</div>
            </div>
            {authorBooks.map((book) => {
              const genreName = book.genre_id !== undefined ? genresMap.get(book.genre_id) : undefined;
              const death = book.death_ah && book.death_ah !== 0 ? `${book.death_ah} AH` : '—';
              return (
                <Link key={book.id} to={`/book/${book.id}`} className="corpus-row" dir="rtl">
                  <div className="corpus-cell col-title arabic">{book.title}</div>
                  <div className="corpus-cell col-death">{death}</div>
                  <div className="corpus-cell col-genre">{genreName || '—'}</div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AuthorPage;
