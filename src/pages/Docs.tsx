import { useState } from 'react';

type DocTab = 'overview' | 'term-search' | 'search-modes' | 'wildcards' | 'name-search' | 'reader' | 'features';

const A = ({ children }: { children: string }) => <span className="arabic">{children}</span>;
const C = ({ children }: { children: string }) => <code className="arabic">{children}</code>;

const Docs = () => {
  const [activeTab, setActiveTab] = useState<DocTab>('overview');

  const tabs: { id: DocTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'term-search', label: 'Term Search' },
    { id: 'search-modes', label: 'Search Modes' },
    { id: 'wildcards', label: 'Wildcards' },
    { id: 'name-search', label: 'Name Search' },
    { id: 'reader', label: 'Reader' },
    { id: 'features', label: 'Features' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2>Al-Kashshāf Overview</h2>
            <p>
              Al-Kashshāf is a research environment for exploring medieval Arabic texts. It searches a corpus of
              some 7,200 texts by surface form, lemma, or root, with phrases, Boolean and proximity queries,
              wildcards, and a dedicated name search.
            </p>

            <h3>Getting Started</h3>
            <ul>
              <li>The <strong>sidebar</strong> on the left holds the search forms. The <strong>Terms</strong> tab has
                <strong> Boolean</strong> and <strong>Proximity</strong> forms; the <strong>Names</strong> tab has the name form</li>
              <li>Results appear in the bottom panel; click a result to open the page in the reader above</li>
              <li>The sidebar folds away when you search; <strong>Ctrl+B</strong> brings it back with your query intact
                (this can be turned off in Settings)</li>
              <li><strong>Select Texts</strong> in the top bar limits every search to chosen texts; the bar shows
                what you are searching, e.g. "Searching: 120 Texts" or "All Texts"</li>
              <li><strong>Browse Texts</strong> in the top bar opens the corpus metadata</li>
            </ul>

            <h3>The Top Bar</h3>
            <ul>
              <li><strong>Menu</strong>: settings, corpus download and updates, data folder</li>
              <li><strong>Browse Texts</strong>, <strong>History</strong>, <strong>Saved</strong>, <strong>Collections</strong></li>
              <li><strong>Help</strong>, <strong>Bug?</strong> (report a problem), <strong>About</strong></li>
              <li><strong>Select Texts</strong> and the "Searching:" status</li>
            </ul>

            <h3>Search Tabs</h3>
            <p>
              Each search opens a new tab, so results from different queries can be compared.
              Click a tab to switch between searches, or close tabs you no longer need.
            </p>
          </div>
        );

      case 'term-search':
        return (
          <div>
            <h2>Term Search</h2>
            <p>
              Term search finds pages containing your terms. Each term has its own mode (surface, lemma, or root)
              and its own "Ignore clitics" switch.
            </p>

            <h3>Phrases</h3>
            <p>
              Several words in one box are a phrase: the words must be adjacent, in that order. Phrases work in
              every mode, so a lemma phrase <A>ولي الله</A> also matches <A>أولياء الله</A>. A phrase split by a
              page turn is still found and is highlighted on both pages.
            </p>

            <h3>Boolean Search (AND/OR)</h3>
            <ul>
              <li>The <strong>AND</strong> and <strong>OR</strong> tabs hold two lists of terms, up to three each; <strong>+ Add search term</strong> adds a row</li>
              <li>Every AND term must appear on the page; at least one OR term must appear as well, if any are given</li>
              <li>Terms in one search may use different modes</li>
              <li><strong>Reset Search</strong> clears the form</li>
            </ul>

            <h3>Proximity Search</h3>
            <ul>
              <li>Two terms and a distance: the terms must occur within that many tokens (words) of each other</li>
              <li><strong>+ Add Proximity Term</strong> chains a third term with its own distance to the second</li>
              <li><strong>Ordered</strong> requires the terms in the order written; otherwise any order counts</li>
              <li><strong>+ Add AND Term</strong> names up to two terms (under "Also on the page") that the page must
                contain anywhere; the reader highlights them in a second colour</li>
              <li>Each term can use a different mode, so a root can be sought near a surface form</li>
              <li>Distances run from 1 to 100 tokens. A match split across a page break is found and attributed to the
                page holding more of it</li>
            </ul>

            <h3>Ignore Clitics</h3>
            <p>
              When enabled for a term, the search also matches the word with common proclitics (و، ف، ب، ل، ك)
              attached, so <A>الكتاب</A> also finds <A>والكتاب</A> and <A>بالكتاب</A>.
            </p>

            <h3>Counts</h3>
            <p>
              Counts are exact, except that a search matching a very large number of pages stops after 20,000
              verified hits and shows the count with a "+". Scrolling continues through the verified pages. On the
              desktop with local data, Settings → <strong>Exact counts</strong> makes such searches run to the end.
            </p>
          </div>
        );

      case 'search-modes':
        return (
          <div>
            <h2>Search Modes</h2>
            <p>
              Three modes determine how a term is matched against the text. Each term in a form chooses its own.
            </p>

            <h3>Surface Form</h3>
            <p>Matches the word as written in the text, after normalisation.</p>
            <ul>
              <li>Diacritics (tashkīl) are ignored; hamza carriers and Persian/Urdu letter variants are unified</li>
              <li>The only mode that supports wildcards (*)</li>
              <li>Best for a specific word form</li>
            </ul>

            <h3>Lemma</h3>
            <p>Matches the dictionary headword, finding every inflected form.</p>
            <ul>
              <li><A>كتاب</A> finds <A>كتب، كتابا، كتابين، الكتاب، والكتاب</A></li>
              <li>A lemma term also matches the exact word you typed, so a name or a clitic form (<A>احمد</A>, <A>وسلم</A>) is found even where the analysis gave it another lemma</li>
              <li>No wildcards</li>
              <li>Best for a concept regardless of form</li>
            </ul>

            <h3>Root</h3>
            <p>Matches the triliteral (or quadriliteral) root.</p>
            <ul>
              <li>Broadest matching: <A>ك.ت.ب</A> finds <A>كتاب، مكتبة، كاتب، استكتب</A></li>
              <li>No wildcards</li>
              <li>Best for exploring a semantic field</li>
            </ul>
          </div>
        );

      case 'wildcards':
        return (
          <div>
            <h2>Wildcard Search</h2>
            <p>
              The asterisk (*) matches any sequence of letters, anywhere in a word and as often as you need.
            </p>

            <h3>Rules</h3>
            <ul>
              <li><strong>Surface mode only</strong></li>
              <li><strong>At least two letters:</strong> every word with a * must keep at least two ordinary letters (<C>ا*</C> is too short, <C>اب*</C> is fine)</li>
              <li><strong>Any position, any number:</strong> the * may start, end, or sit inside a word, and a word may carry several</li>
              <li><strong>Phrases:</strong> any word of a phrase may carry wildcards; each word expands on its own</li>
            </ul>

            <h3>Patterns</h3>
            <ul>
              <li><strong>Prefix:</strong> <C>كتا*</C> matches <A>كتاب، كتابة، كتابه</A></li>
              <li><strong>Suffix:</strong> <C>*ية</C> matches <A>عربية، إسلامية، الشافعية</A></li>
              <li><strong>Internal:</strong> <C>أح*مد</C> matches <A>أحمد، أحامد</A></li>
              <li><strong>Contains:</strong> <C>*قول*</C> matches <A>قول، يقول، مقولة، الأقوال</A></li>
              <li><strong>Several stars:</strong> <C>مع*رف*</C> matches <A>معرف، معارف، معرفة، معترفون</A></li>
            </ul>

            <h3>Counts and Speed</h3>
            <ul>
              <li>A single wildcard word always gives an exact count, however broad (<C>ال*</C> alone matches most of the corpus in under a second)</li>
              <li>A phrase with a very broad wildcard word (<C>ابن ال*</C>) is verified page by page in reading order and stops at 20,000 verified pages, showing the count with a "+"; the Exact counts setting runs it to the end</li>
              <li>A longer literal beginning expands faster than a very short one; patterns starting with * scan the whole vocabulary but still finish quickly</li>
            </ul>
          </div>
        );

      case 'name-search':
        return (
          <div>
            <h2>Name Search</h2>
            <p>
              Name search finds Arabic personal names in the forms they take in classical texts. From the parts
              you enter it generates the patterns a text might use and searches them all at once.
            </p>

            <h3>Name Parts</h3>
            <ul>
              <li><strong>Kunya / laqab (<A>كنية/لقب</A>):</strong> <A>أبو منصور</A>, <A>شمس الدين</A>; <strong>+ Add Laqab</strong> for more than one</li>
              <li><strong>Nasab (<A>نسب</A>):</strong> the lineage, <A>معمر بن أحمد بن زياد</A></li>
              <li><strong>Nisba (<A>نسبة</A>):</strong> <A>الأصبهاني</A>, <A>الصوفي</A>; <strong>+ Add Nisba</strong> for more than one</li>
              <li><strong>Shuhra (<A>شهرة</A>):</strong> the name a person is known by, via <strong>+ Add Shuhra</strong></li>
            </ul>

            <h3>Generated Patterns</h3>
            <ul>
              <li>Kunya in its cases (<A>أبو/أبا/أبي</A>)</li>
              <li>Nasab with and without the <A>ابن</A> connectors, in one- and two-part lengths</li>
              <li>Combinations of kunya, nasab, and nisba, chosen with the "Include" switches (kunya + nisba, kunya + first nasab, one-part nasab, one-part nasab + nisba, two-part nasab)</li>
              <li>Proclitic variants (و، ف، …) on the first word</li>
            </ul>
            <p>
              The patterns are listed below the form, so you can see exactly what will be searched. One name is
              searched at a time; the results panel can show the variants found and re-run any one of them.
            </p>
          </div>
        );

      case 'reader':
        return (
          <div>
            <h2>The Reader</h2>
            <ul>
              <li>Clicking a result opens the book at that page. Pages scroll continuously; the wheel, the arrow keys, and the scrollbar move through the book</li>
              <li>Search highlights follow you as you scroll, and <strong>Prev</strong> / <strong>Next</strong> step between matches</li>
              <li>Type a volume and page and press <strong>Go</strong> to place a page. Volume labels and page numbers are as printed in the source edition</li>
              <li><strong>Ctrl+T</strong> shows or hides the table of contents beside the text; it follows your position, and clicking a heading places its page. Books opened from a result show it by default (Settings)</li>
              <li>Click any word for its morphological analysis: lemma, root, part of speech, grammatical features, and clitics</li>
            </ul>
          </div>
        );

      case 'features':
        return (
          <div>
            <h2>Additional Features</h2>

            <h3>Metadata Browser</h3>
            <p><strong>Browse Texts</strong> in the top bar lists every text in the corpus:</p>
            <ul>
              <li>Filter by author, death date, genre, and title; sort by any column</li>
              <li>Token and page counts for each text</li>
              <li>Citations in Chicago and MLA style</li>
              <li>Export the filtered or complete metadata to CSV or Excel</li>
            </ul>

            <h3>Text Selection</h3>
            <p>
              <strong>Select Texts</strong> in the top bar limits your searches to particular texts, authors, periods,
              or genres. The selection persists across searches until you clear it; Cancel restores what you had.
            </p>

            <h3>Collections</h3>
            <p>Collections are named groups of texts (mini-corpora) that persist across sessions:</p>
            <ul>
              <li><strong>Create:</strong> select texts, then use the save icon in the top bar or "Save Collection" in the selection window</li>
              <li><strong>Manage:</strong> <strong>Collections</strong> in the top bar lists, edits, and deletes them</li>
              <li><strong>Use:</strong> in the selection window, the Collection filter selects the texts of one or more collections</li>
            </ul>

            <h3>Exporting Results</h3>
            <ul>
              <li>The export button in the results panel header saves up to 2,000 rows as CSV or Excel</li>
              <li>Rows carry the metadata, the volume and page, and the matched text</li>
            </ul>

            <h3>History and Saved Searches</h3>
            <ul>
              <li><strong>History</strong> in the top bar lists past searches with their text selection; click one to run it again</li>
              <li><strong>Saved</strong> keeps the searches you have marked</li>
            </ul>

            <h3>Settings</h3>
            <ul>
              <li><strong>Auto-collapse search sidebar on search</strong> and <strong>Auto-show table of contents</strong>, both on by default</li>
              <li><strong>Exact counts</strong> (desktop, local data): searches that would stop at 20,000 hits run to the end</li>
              <li>The data folder where the corpus lives</li>
            </ul>

            <h3>Online and Offline</h3>
            <p>
              The desktop application can download the corpus (about 10 GB) and work offline, or run in online
              mode against the server. The web application always uses the server.
            </p>

            <h3>Reporting a Problem</h3>
            <p>
              <strong>Bug?</strong> in the top bar opens a GitHub issue with the details prefilled, or shows the
              address to write to and a details block to copy. The application sends nothing unless you use it.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="docs-section">
      <h1>Documentation</h1>

      <div className="docs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="docs-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Docs;
