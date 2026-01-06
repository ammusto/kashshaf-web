import { useState } from 'react';

type DocTab = 'overview' | 'term-search' | 'search-modes' | 'wildcards' | 'name-search' | 'features';

const Docs = () => {
  const [activeTab, setActiveTab] = useState<DocTab>('overview');

  const tabs: { id: DocTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'term-search', label: 'Term Search' },
    { id: 'search-modes', label: 'Search Modes' },
    { id: 'wildcards', label: 'Wildcards' },
    { id: 'name-search', label: 'Name Search' },
    { id: 'features', label: 'Features' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2>al-Kashshāf Overview</h2>
            <p>
              al-Kashshāf is a research environment for exploring medieval Arabic texts. It provides powerful
              search capabilities across a large corpus of classical Arabic literature, with morphological
              analysis and flexible query options.
            </p>

            <h3>Getting Started</h3>
            <ul>
              <li>Use the <strong>sidebar</strong> on the left to enter search queries</li>
              <li>Switch between <strong>Terms</strong> and <strong>Names</strong> modes using the tabs</li>
              <li>Results appear in the bottom panel; click any result to view the full page above</li>
              <li>Use <strong>Browse Texts</strong> in the toolbar to explore the corpus metadata</li>
              <li>Filter searches to specific texts using <strong>Select Texts</strong></li>
            </ul>

            <h3>Search Tabs</h3>
            <p>
              Each search creates a new tab, allowing you to compare results from different queries.
              Click a tab to switch between searches, or close tabs you no longer need.
            </p>
          </div>
        );

      case 'term-search':
        return (
          <div>
            <h2>Term Search</h2>
            <p>
              Term search finds pages containing your query terms. You can search by surface form,
              lemma, or root, and combine multiple terms with Boolean operators.
            </p>

            <h3>Boolean Search (AND/OR)</h3>
            <p>Combine multiple search terms using AND and OR logic:</p>
            <ul>
              <li><strong>AND terms:</strong> All AND terms must appear on the same page</li>
              <li><strong>OR terms:</strong> At least one OR term must match (in addition to all AND terms)</li>
              <li>Click <strong>+ Add Term</strong> to add more search inputs</li>
              <li>Use the dropdown to switch between AND and OR for each term</li>
            </ul>

            <h3>Proximity Search</h3>
            <p>Find two terms that appear near each other within a specified distance:</p>
            <ul>
              <li>Enter two terms and the maximum token distance between them</li>
              <li>Distance is measured in tokens (words), not characters</li>
              <li>Each term can use a different search mode (surface, lemma, root)</li>
              <li>Useful for finding phrases or related concepts</li>
            </ul>

            <h3>Ignore Clitics</h3>
            <p>
              When enabled, the search will also match words with common Arabic proclitics
              (و، ف، ب، ل، ك) attached. For example, searching for <span className="arabic">الكتاب</span> will
              also find <span className="arabic">والكتاب</span> and <span className="arabic">بالكتاب</span>.
            </p>
          </div>
        );

      case 'search-modes':
        return (
          <div>
            <h2>Search Modes</h2>
            <p>
              al-Kashshāf offers three search modes that determine how your query is matched against the text.
              Understanding these modes is key to effective searching.
            </p>

            <h3>Surface Form</h3>
            <p>Matches the exact surface form of words as they appear in the text (without diacritics).</p>
            <ul>
              <li>Most precise matching</li>
              <li>Diacritics (tashkil) are normalized away</li>
              <li>Supports wildcards (*)</li>
              <li>Best for finding specific word forms</li>
            </ul>

            <h3>Lemma</h3>
            <p>Matches the dictionary form (lemma) of words, finding all inflected forms.</p>
            <ul>
              <li>Searching <span className="arabic">كتاب</span> finds <span className="arabic">كتب، كتابا، كتابين، الكتاب، والكتاب</span></li>
              <li>Morphologically aware - understands Arabic word patterns</li>
              <li>Does NOT support wildcards</li>
              <li>Best for conceptual searches where form doesn't matter</li>
            </ul>

            <h3>Root</h3>
            <p>Matches the triliteral (or quadriliteral) root of words.</p>
            <ul>
              <li>Broadest matching - finds all words from the same root</li>
              <li>Searching root <span className="arabic">ك.ت.ب</span> finds <span className="arabic">كتاب، مكتبة، كاتب، استكتب</span></li>
              <li>Does NOT support wildcards</li>
              <li>Best for exploring semantic fields</li>
            </ul>
          </div>
        );

      case 'wildcards':
        return (
          <div>
            <h2>Wildcard Search</h2>
            <p>
              Wildcards allow you to search for words matching a pattern. Use the asterisk (*)
              character to match any sequence of characters.
            </p>

            <h3>Wildcard Rules</h3>
            <ul>
              <li><strong>Surface mode only:</strong> Wildcards only work in Surface search mode</li>
              <li><strong>One wildcard per term:</strong> Each search term can have at most one *</li>
              <li><strong>No leading wildcard:</strong> The * cannot be at the start of a word (<code className="arabic">كتاب*</code> is invalid)</li>
              <li><strong>Internal wildcards need 2+ chars:</strong> For wildcards in the middle of a word, at least 2 characters must precede the *</li>
            </ul>

            <h3>Wildcard Types</h3>
            <p><strong>Prefix Wildcard (word ending)</strong></p>
            <p><code className="arabic">*كتا</code> matches <span className="arabic">كتاب، كتابة، كتابه</span>, etc.</p>

            <p><strong>Internal Wildcard</strong></p>
            <p><code className="arabic">مع*ة</code> matches <span className="arabic">معرفة، معاملة، معاينة</span>, etc.</p>

            <h3>Performance Considerations</h3>
            <p>Some wildcard patterns are more "expensive" (slower) than others:</p>
            <ul>
              <li><strong>Faster:</strong> Longer prefixes before the * (e.g., <code className="arabic">*استكت</code> is faster than <code className="arabic">*كت</code>)</li>
              <li><strong>Slower:</strong> Short prefixes match many more terms and take longer</li>
            </ul>
          </div>
        );

      case 'name-search':
        return (
          <div>
            <h2>Name Search</h2>
            <p>
              Name search is designed specifically for finding Arabic personal names in their various
              traditional forms. It generates multiple pattern variants to match how names appear in classical texts.
            </p>

            <h3>Name Components</h3>
            <ul>
              <li><strong>Kunya (<span className="arabic">كنية</span>):</strong> Patronymic like <span className="arabic">أبو منصور</span> - can add multiple</li>
              <li><strong>Nasab (<span className="arabic">نسب</span>):</strong> Lineage chain like <span className="arabic">معمر بن أحمد بن زياد</span></li>
              <li><strong>Nisba (<span className="arabic">نسبة</span>):</strong> Attributive names like <span className="arabic">الأصبهاني</span> or <span className="arabic">الصوفي</span> - can add multiple</li>
            </ul>

            <h3>How It Works</h3>
            <p>The name search automatically generates variants including:</p>
            <ul>
              <li>Different grammatical cases for kunya (<span className="arabic">أبو/أبا/أبي</span>)</li>
              <li>Combinations with and without <span className="arabic">ابن</span> connectors</li>
              <li>Various orderings of nasab and nisba elements</li>
              <li>Proclitic variants (و، ف، etc.) on the first word</li>
            </ul>
            <p>
              The generated patterns are shown below the form so you can see exactly what will be searched.
            </p>

            <h3>Multiple Name Forms</h3>
            <p>
              Click <strong>+ Add Name Form</strong> to search for multiple different people in the same query.
              Results will include pages mentioning any of the specified names.
            </p>
          </div>
        );

      case 'features':
        return (
          <div>
            <h2>Additional Features</h2>

            <h3>Metadata Browser</h3>
            <p>Access via <strong>Browse Texts</strong> in the toolbar. The metadata browser lets you:</p>
            <ul>
              <li>View all texts in the corpus with their metadata</li>
              <li>Filter by author, death date, genre, and title</li>
              <li>Sort by any column</li>
              <li>Export filtered or complete metadata to CSV</li>
              <li>See token and page counts for each text</li>
            </ul>

            <h3>Text Selection</h3>
            <p>
              Click <strong>Select Texts</strong> in the sidebar to limit your searches to specific texts.
              This is useful for focused research on particular authors, time periods, or genres.
              The filter persists across searches until you clear it.
            </p>

            <h3>Exporting Search Results</h3>
            <ul>
              <li><strong>Term/Name search:</strong> Click the export button in the results panel header</li>
              <li>Exports include metadata, page references, and matched text</li>
              <li>Results are saved as CSV files you can open in Excel or other tools</li>
            </ul>

            <h3>Search History</h3>
            <ul>
              <li>Click <strong>Search History</strong> in the toolbar to view history</li>
              <li>Searches are saved with their text filters</li>
              <li>Click any saved search to re-run it instantly</li>
              <li>Delete searches you no longer need</li>
            </ul>

            <h3>Token Information</h3>
            <p>
              Click on any word in the reader panel to see its morphological analysis, including
              lemma, root, part of speech, and grammatical features. This is powered by CAMeL Tools
              morphological analysis.
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
