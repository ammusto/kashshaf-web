const Features = () => {
  return (
    <div>
      <div className="hero">
        <h1>Features</h1>
      </div>

      {/* Main interface screenshot - window style */}
      <div className="screenshot-container large">
        <div className="screenshot-window">
          <img src="/screenshots/name.png" alt="Kashshaf main interface" />
        </div>
        <p className="screenshot-caption">Specialized name search</p>
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
          <h3>Boolean Search</h3>
          <p>
            Combine multiple terms with AND/OR logic to find exactly what you're looking for.
            All AND terms must appear on the same page, while OR terms provide alternatives.
          </p>
        </div>

        <div className="feature-card">
          <h3>Proximity Search</h3>
          <p>
            Find terms that appear near each other within a specified distance.
            Supports cross-field proximity (e.g., root near surface form).
          </p>
        </div>

        <div className="feature-card">
          <h3>Name Search</h3>
          <p>
            Specialized search for Arabic personal names with automatic pattern generation
            for kunya, nasab, nisba, and shuhra variants.
          </p>
        </div>

        <div className="feature-card">
          <h3>Wildcard Search</h3>
          <p>
            Use wildcards (*) for flexible pattern matching:
          </p>
          <ul>
            <li><code className="arabic">أب*</code> matches <span className="arabic">أبو، أبي، أبا</span></li>
            <li><code className="arabic">مع*ة</code> matches <span className="arabic">معرفة، معاملة</span></li>
          </ul>
        </div>

        <div className="feature-card">
          <h3>Clitic Handling</h3>
          <p>
            Option to ignore common Arabic proclitics (و، ف، ب، ل، ك) in searches,
            so <span className="arabic">الكتاب</span> also finds <span className="arabic">والكتاب</span> and <span className="arabic">بالكتاب</span>.
          </p>
        </div>
      </div>

      {/* Search results screenshot - simple frame */}
      <div className="screenshot-container large">
        <div className="screenshot">
          <img src="/screenshots/highlight-query.png" alt="Search results with highlighting" />
        </div>
        <p className="screenshot-caption">Proximity search between a root (عرف) and a term (الله) </p>
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
          <h3>Metadata Browser</h3>
          <p>
            Browse all texts in the corpus with filtering by author, death date,
            genre, and title. Export metadata to CSV or Excel.
          </p>
        </div>

        <div className="feature-card">
          <h3>Text Selection</h3>
          <p>
            Limit searches to specific texts, authors, time periods, or genres
            for focused research.
          </p>
        </div>

        <div className="feature-card">
          <h3>Search History</h3>
          <p>
            Automatically saved searches with the ability to reload any
            previous query with its text filters intact.
          </p>
        </div>

        <div className="feature-card">
          <h3>Export Results</h3>
          <p>
            Export search results to CSV or Excel with metadata, page references,
            and matched text for external analysis.
          </p>
        </div>

        <div className="feature-card">
          <h3>Online & Offline Modes</h3>
          <p>
            Works offline with local corpus (~8 GB download) or online via API
            for users with storage constraints.
          </p>
        </div>
      </div>

      {/* Token popup screenshot - minimal style */}
      <div className="screenshot-container large">
        <div className="screenshot">
          <img src="/screenshots/token.png" alt="Token morphological analysis popup" />
        </div>
        <p className="screenshot-caption">Morphological analysis popup showing lemma, root, and grammatical features</p>
      </div>
    </div>
  );
};

export default Features;
