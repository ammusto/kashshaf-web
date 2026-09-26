import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBooks } from '../contexts/BooksContext';
import Spinner from '../components/Spinner';
import {
  formatCitation,
  parseCitation,
  stripCitationMarkup,
} from '../utils/citation';
import type { CitationStyle } from '../utils/citation';

interface MetadataValue {
  value_raw: string;
  source_key?: string;
}

interface MetadataPerson {
  name_raw: string;
  role_raw?: string;
  source_key?: string;
}

interface ParsedMetadata {
  titles?: { main?: MetadataValue[]; [k: string]: MetadataValue[] | undefined };
  responsible_persons?: {
    authors?: MetadataPerson[];
    editors?: MetadataPerson[];
    translators?: MetadataPerson[];
    commentators?: MetadataPerson[];
    arrangers?: MetadataPerson[];
    reviewers?: MetadataPerson[];
    transmitters?: MetadataPerson[];
    preface_by?: MetadataPerson[];
    transcribers?: MetadataPerson[];
    digital_encoders?: MetadataPerson[];
    digital_preparers?: MetadataPerson[];
    contributors?: MetadataPerson[];
    [k: string]: MetadataPerson[] | undefined;
  };
  publication?: {
    publishers?: MetadataValue[];
    places?: MetadataValue[];
    dates?: MetadataValue[];
    edition?: MetadataValue[];
    series?: MetadataValue[];
    volumes?: MetadataValue[];
    page_range?: MetadataValue[];
    page_count_meta?: MetadataValue[];
    container_titles?: MetadataValue[];
    [k: string]: MetadataValue[] | undefined;
  };
}

const PUBLICATION_FIELDS: Array<[string, string]> = [
  ['publishers', 'Publisher'],
  ['places', 'Place'],
  ['dates', 'Date'],
  ['edition', 'Edition'],
  ['series', 'Series'],
  ['volumes', 'Volumes'],
  ['page_range', 'Page Range'],
  ['page_count_meta', 'Page Count'],
  ['container_titles', 'Container Title'],
];

const EDITION_PERSON_FIELDS: Array<[string, string]> = [
  ['editors', 'Editors'],
  ['translators', 'Translators'],
  ['commentators', 'Commentators'],
  ['arrangers', 'Arrangers'],
  ['reviewers', 'Reviewers'],
  ['transmitters', 'Transmitters'],
  ['preface_by', 'Preface By'],
  ['transcribers', 'Transcribers'],
  ['digital_encoders', 'Digital Encoders'],
  ['digital_preparers', 'Digital Preparers'],
  ['contributors', 'Contributors'],
];

function parseMetadataJson(jsonStr?: string | null): ParsedMetadata | null {
  if (!jsonStr) return null;
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed as ParsedMetadata;
  } catch {
    return null;
  }
}

function cleanValues(items?: MetadataValue[]): string[] {
  if (!items) return [];
  return items.map((it) => it.value_raw).filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function cleanNames(items?: MetadataPerson[]): string[] {
  if (!items) return [];
  return items.map((p) => p.name_raw).filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const { booksMap, authorsMap, genresMap, loading, error } = useBooks();

  const [citeStyle, setCiteStyle] = useState<CitationStyle>('chicago');
  const [copied, setCopied] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const bookId = id ? parseInt(id, 10) : NaN;
  const book = !isNaN(bookId) ? booksMap.get(bookId) : undefined;

  const meta = useMemo(() => parseMetadataJson(book?.metadata_json), [book?.metadata_json]);
  const citation = useMemo(() => parseCitation(book?.citation_json), [book?.citation_json]);
  const tags: string[] = useMemo(() => {
    if (!book?.tags) return [];
    try {
      const parsed = JSON.parse(book.tags);
      return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : [];
    } catch {
      return [];
    }
  }, [book?.tags]);

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

  if (!book) {
    return (
      <div className="corpus-page">
        <p>
          Book not found. <Link to="/corpus">Back to corpus</Link>
        </p>
      </div>
    );
  }

  const authorName = book.author_id !== undefined ? authorsMap.get(book.author_id) : undefined;
  const genreName = book.genre_id !== undefined ? genresMap.get(book.genre_id) : undefined;

  // Build the merged Book and Edition Metadata rows
  const metaRows: Array<{ label: string; values: string[] }> = [];
  if (meta) {
    const titleVals = cleanValues(meta.titles?.main);
    if (titleVals.length) metaRows.push({ label: 'Title', values: titleVals });

    const authorVals = cleanNames(meta.responsible_persons?.authors);
    if (authorVals.length) metaRows.push({ label: 'Author', values: authorVals });

    if (meta.publication) {
      for (const [key, label] of PUBLICATION_FIELDS) {
        let values = cleanValues(meta.publication[key]);
        if (key === 'volumes') {
          values = values.filter((v) => {
            const t = v.trim();
            return t !== '1' && t !== '١';
          });
        }
        if (values.length) metaRows.push({ label, values });
      }
    }

    if (meta.responsible_persons) {
      for (const [key, label] of EDITION_PERSON_FIELDS) {
        const vals = cleanNames(meta.responsible_persons[key]);
        if (vals.length) metaRows.push({ label, values: vals });
      }
    }
  }

  const citationHtml = citation ? formatCitation(citation, citeStyle) : '';
  const showPaginationWarning = book.paginated === false;

  const handleCopy = async () => {
    if (!citationHtml) return;
    try {
      await navigator.clipboard.writeText(stripCitationMarkup(citationHtml));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const TAGS_PREVIEW = 3;
  const visibleTags = tagsExpanded || tags.length <= TAGS_PREVIEW ? tags : tags.slice(0, TAGS_PREVIEW);
  const hasMoreTags = tags.length > TAGS_PREVIEW;

  return (
    <div className="corpus-page">
      <h1 className="book-title arabic" dir="rtl">
        {book.title}
      </h1>
      <div className="book-author arabic" dir="rtl">
        {book.author_id !== undefined ? (
          <Link to={`/author/${book.author_id}`}>{authorName || 'Unknown Author'}</Link>
        ) : (
          'Unknown Author'
        )}
        {book.death_ah !== undefined && book.death_ah !== 0 && (
          <span className="book-death"> (ت {book.death_ah})</span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="book-tags">
          {visibleTags.map((t, i) => (
            <span key={i} className="book-tag">
              {t}
            </span>
          ))}
          {hasMoreTags && !tagsExpanded && <span className="book-tag">…</span>}
          {hasMoreTags && (
            <button
              type="button"
              onClick={() => setTagsExpanded((e) => !e)}
              className="book-tag book-tag-toggle"
            >
              {tagsExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
      )}

      <section className="book-section">
        <h2>Kashshāf Data</h2>
        <div className="book-grid">
          <Field label="Kashshāf ID" value={String(book.id)} />
          <Field label="Genre" value={genreName || '—'} capitalize />
          <Field label="Token Count" value={book.token_count?.toLocaleString() || '—'} />
          <Field label="Author ID" value={book.author_id !== undefined ? String(book.author_id) : '—'} />
          <Field label="Death" value={book.death_ah !== undefined ? `${book.death_ah} AH` : '—'} />
          <Field label="Page Count" value={book.page_count?.toLocaleString() || '—'} />
          <Field label="Source Corpus" value={book.corpus || '—'} />
          <Field label="Source ID" value={book.original_id || '—'} className="span-2" />
        </div>
      </section>

      {(metaRows.length > 0 || showPaginationWarning) && (
        <section className="book-section">
          <h2>Book and Edition Metadata</h2>
          {metaRows.length > 0 && (
            <div className="meta-rows">
              {metaRows.map(({ label, values }) => (
                <div className="meta-row" key={label}>
                  <div className="meta-label">{label}</div>
                  <div className="meta-values">
                    {values.map((v, i) => (
                      <div key={i} className="meta-value" dir="rtl">
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {showPaginationWarning && (
            <div className={`pagination-warning${metaRows.length > 0 ? ' with-divider' : ''}`}>
              Kashshāf pagination does not match the printed edition
            </div>
          )}
        </section>
      )}

      <section className="book-section">
        <h2>Citation</h2>
        {citation ? (
          <>
            <div className="citation-controls">
              <span className="citation-label">Style:</span>
              <button
                type="button"
                onClick={() => setCiteStyle('chicago')}
                className={`citation-style-btn ${citeStyle === 'chicago' ? 'active' : ''}`}
              >
                Chicago
              </button>
              <button
                type="button"
                onClick={() => setCiteStyle('mla')}
                className={`citation-style-btn ${citeStyle === 'mla' ? 'active' : ''}`}
              >
                MLA
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="citation-copy-btn"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div
              className="citation-rendered"
              dir="auto"
              dangerouslySetInnerHTML={{ __html: citationHtml }}
            />
            {citation.warnings.length > 0 && (
              <ul className="citation-warnings">
                {citation.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="muted">No citation data is available for this text.</p>
        )}
      </section>
    </div>
  );
};

function Field({
  label,
  value,
  capitalize,
  className = '',
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  className?: string;
}) {
  return (
    <div className={`book-field ${className}`}>
      <div className="book-field-label">{label}</div>
      <div className={`book-field-value${capitalize ? ' capitalize' : ''}`}>{value}</div>
    </div>
  );
}

export default BookPage;
