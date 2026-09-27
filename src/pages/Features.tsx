import { useState } from 'react';
import Lightbox, { type LightboxImage } from '../components/Lightbox';
import Screenshot from '../components/Screenshot';

/** The screenshots on this page, in order, for the lightbox. */
const SHOTS: LightboxImage[] = [
  { src: '/screenshots/lemma-phrase.png', alt: 'Lemma phrase search', caption: 'Lemma phrase search for ولي الله, which matches ولي الله, أولياء الله, وليُّكم الله, etc.' },
  { src: '/screenshots/cross-page.png', alt: 'A phrase found across two pages', caption: 'The phrase "عند قبر سري السقطي" is split across two pages, but is identified.' },
  { src: '/screenshots/name-search.png', alt: 'Name search', caption: 'Specialized name search' },
  { src: '/screenshots/proximity-search.png', alt: 'Proximity search results', caption: 'Proximity search between a root (عرف) and a term (الله)' },
  { src: '/screenshots/token-features.png', alt: 'Token morphological analysis popup', caption: 'Morphological analysis popup showing lemma, root, and grammatical features' },
  { src: '/screenshots/custom-colections.png', alt: 'Custom collection', caption: 'You can create and save custom collections to search' },
  { src: '/screenshots/filter-example.png', alt: 'Text filter example', caption: 'You can filter texts by author, genre, title, and year' },
];

const Features = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {/* Lemma phrase search screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot-window">
          <Screenshot full={{ src: '/screenshots/lemma-phrase.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/lemma-phrase-mobile.png', width: 885, height: 963 }} alt="Lemma phrase search" onClick={() => setOpen(0)} />
        </div>
        <p className="screenshot-caption">Lemma phrase search for ولي الله, which matches  ولي الله، أولياء الله، وليُّكم الله, etc.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Search Modes</h3>
          <p>
            Three search modes for maximum flexibility:
          </p>
          <ul>
            <li><strong>Surface Form:</strong> Match exact word forms as they appear</li>
            <li><strong>Lemma:</strong> Find all inflections of a word</li>
            <li><strong>Root:</strong> Search by Arabic triliteral root</li>
          </ul>
        </div>
        <div className="feature-card">
          <h3>Phrases and Boolean Search</h3>
          <p>
            Several words in one box are a phrase, in any mode. Combine up to three
            AND terms and three OR terms; all AND terms must appear on the same page,
            while OR terms provide alternatives.
          </p>
        </div>
      </div>
{/* Lemma phrase search screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot-window">
          <Screenshot full={{ src: '/screenshots/cross-page.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/cross-page-mobile.png', width: 886, height: 963 }} alt="A phrase found across two pages" lazy onClick={() => setOpen(1)} />
        </div>
        <p className="screenshot-caption">The phrase "عند قبر سري السقطي" is split across two pages, but is identified.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Find Results Across Pages</h3>
          <p>
            Text that spans two pages is a common limitation of current search tools. If part of your quote (up to 20 tokens) appears on a second page, Kashshāf will be able to find it.
          </p>
        </div>
        <div className="feature-card">
          <h3>Export Results</h3>
          <p>
            Export search results (up to 2,000) to CSV or Excel with metadata, page references,
            and matched text for external analysis.
          </p>
        </div>
      </div>
      {/* Name search screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot-window">
          <Screenshot full={{ src: '/screenshots/name-search.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/name-search-mobile.png', width: 956, height: 963 }} alt="Name search" lazy onClick={() => setOpen(2)} />
        </div>
        <p className="screenshot-caption">Specialized name search</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Name Search</h3>
          <p>
            Specialized search for Arabic personal names with automatic pattern generation
            for kunya, laqab, nasab, nisba, and shuhra variants.
          </p>
        </div>
        <div className="feature-card">
          <h3>Clitic Handling</h3>
          <p>
            Option to ignore common Arabic proclitics (و، ف، ب، ل، ك) in searches,
            so <span className="arabic">الكتاب</span> also finds <span className="arabic">والكتاب</span> and <span className="arabic">بالكتاب</span>.
          </p>
        </div>
      </div>

      {/* Proximity search screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot">
          <Screenshot full={{ src: '/screenshots/proximity-search.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/proximity-search-mobile.png', width: 1083, height: 963 }} alt="Proximity search results" lazy onClick={() => setOpen(3)} />
        </div>
        <p className="screenshot-caption">Proximity search between a root (عرف) and a term (الله)</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Proximity Search</h3>
          <p>
            Chain up to three terms, each within a chosen distance of the next, in any order or
            in the order written. Each term can use its own mode (e.g., root near surface form),
            and up to two further terms can be required anywhere on the page.
          </p>
        </div>
        <div className="feature-card">
          <h3>Wildcard Search</h3>
          <p>
            Use * anywhere in a word, and more than once, in Surface mode:
          </p>
          <ul>
            <li><code className="arabic">كتا*</code> matches <span className="arabic">كتاب، كتابة، كتابه</span></li>
            <li><code className="arabic">*ية</code> matches <span className="arabic">عربية، إسلامية</span></li>
            <li><code className="arabic">مع*رف*</code> matches <span className="arabic">معرفة، معارف، معترفون</span></li>
          </ul>
        </div>
      </div>

      {/* Token popup screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot">
          <Screenshot full={{ src: '/screenshots/token-features.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/token-features-mobile.png', width: 863, height: 963 }} alt="Token morphological analysis popup" lazy onClick={() => setOpen(4)} />
        </div>
        <p className="screenshot-caption">Morphological analysis popup showing lemma, root, and grammatical features</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Token Overlay</h3>
          <p>
            Click any word to see its morphological analysis including lemma, root,
            part of speech, grammatical features, and clitics.
          </p>
        </div>
        <div className="feature-card">
          <h3>Search History</h3>
          <p>
            Automatically saved searches with the ability to reload any
            previous query with its text filters intact.
          </p>
        </div>
      </div>

      {/* Custom collection screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot">
          <Screenshot full={{ src: '/screenshots/custom-colections.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/custom-colections-mobile.png', width: 953, height: 963 }} alt="Custom collection" lazy onClick={() => setOpen(5)} />
        </div>
        <p className="screenshot-caption">You can create and save custom collections to search</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Collections</h3>
          <p>
            Save named groups of texts as reusable mini-corpora. Create collections
            like "Sufi texts" or "4th century authors" and quickly switch between
            research contexts. Collections persist across sessions.
          </p>
        </div>
        <div className="feature-card">
          <h3>Online & Offline Modes</h3>
          <p>
            Works offline with local corpus (~10 GB download) or online via API
            for users with storage constraints.
          </p>
        </div>
      </div>

      {/* Filter example screenshot */}
      <div className="screenshot-container large">
        <div className="screenshot">
          <Screenshot full={{ src: '/screenshots/filter-example.png', width: 1744, height: 963 }} mobile={{ src: '/screenshots/filter-example-mobile.png', width: 982, height: 963 }} alt="Text filter example" lazy onClick={() => setOpen(6)} />
        </div>
        <p className="screenshot-caption">You can filter texts by author, genre, title, and year</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Text Selection</h3>
          <p>
            Limit searches to specific texts, authors, time periods, or genres
            for focused research.
          </p>
        </div>
        <div className="feature-card">
          <h3>Metadata Browser</h3>
          <p>
            Browse all texts in the corpus with filtering by author, death date,
            genre, and title. Export metadata to CSV or Excel.
          </p>
        </div>
      </div>
      {open !== null && <Lightbox images={SHOTS} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </div>
  );
};

export default Features;
