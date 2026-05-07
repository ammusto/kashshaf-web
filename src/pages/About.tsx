const About = () => {
  return (
    <div className="about-section">
      <h1>About al-Kashshāf</h1>

      <div className="text-content">
        <h2>Project Overview</h2>
        <p>
          Al-Kashshāf (<span className="arabic">الكشّاف</span>) is available as both a <a href="https://app.kashshaf.com/" target="_blank" rel="noopener noreferrer">web application</a> and a desktop application, designed
          for working with pre-modern Arabic texts (although the corpus contains texts up to 1348 AH/1930 CE). It provides 
          precise search capabilities that include morphological features. As it stands, it is the largest collection of searchable pre-modern Arabic texts available in a single interface.
        </p>

        <h3>The Corpus</h3>
        <p>
          Al-Kashshāf searches across a large corpus of classical Arabic texts.
          Each text has been processed with state-of-the-art morphological analysis to enable
          lemma and root-based searching.
        </p>

        <blockquote>
          <p dir="auto"><strong>NB:</strong> Morphological analysis uses CAMeL Tools with the MSA morphological database. While MSA and Classical Arabic share core grammar, archaic vocabulary or rare classical forms may produce inaccurate lemmas, POS tags, or other features.</p>
        </blockquote>
        <p>
          The corpus draws primarily from the texts in{' '}
          <a href="https://shamela.ws/" target="_blank" rel="noopener noreferrer">al-Maktaba al-Shamela</a>,
          but includes additional texts collected by the{' '}
          <a href="https://openiti.org/" target="_blank" rel="noopener noreferrer">OpenITI</a> 
          {' '}and{' '}
          <a href="https://kitab-project.org/" target="_blank" rel="noopener noreferrer">KITAB</a> projects, and the  <a href="https://nusus.net/" target="_blank" rel="noopener noreferrer">Nuṣūṣ</a> corpus.
        </p>
        <h4>Corpus Statistics</h4>
        <table className="corpus-stats">
          <tbody>
            <tr>
              <td>Books</td>
              <td>7,176</td>
            </tr>
            <tr>
              <td>Pages</td>
              <td>5,711,697</td>
            </tr>
            <tr>
              <td>Tokens</td>
              <td>987,907,098</td>
            </tr>
            {/* <tr>
              <td>Unique token</td>
              <td>3,389,004</td>
            </tr> */}
            <tr>
              <td>Database size</td>
              <td>~17 GB</td>
            </tr>
          </tbody>
        </table>

        <h4>Corpus Versioning</h4>
        <p>
          The corpus is versioned and periodically rebuilt as new texts are added or the cleaning pipeline is refined. If you are citing the corpus in publications should reference a specific version, since counts and individual token analyses can change between builds.
        </p>

        <h4>Available Metadata</h4>
        <p>
          Each book in the corpus carries metadata that can be used for filtering and analysis: title, author, author's death date (Hijri), century, genre, source corpus, page count, token count, and the book's original identifier in its source corpus. Searches can be constrained by any of these fields, and metadata can be exported alongside results for external analysis.
        </p>

        <h4>Data Aggregation and Cleaning</h4>
        <p>
          The corpus is compiled from three major sources of digitized Arabic texts:{' '}
          <a href="https://shamela.ws/" target="_blank" rel="noopener noreferrer">al-Maktaba al-Shamela</a>,{' '}
          <a href="https://openiti.org/" target="_blank" rel="noopener noreferrer">OpenITI</a>, and{' '}
          <a href="https://nusus.net/" target="_blank" rel="noopener noreferrer">Nuṣūṣ</a>.
          Only texts with authors who died before 1348 AH (1930 CE) are included to avoid copyright concerns.
          After aggregating texts from these three sources, the corpus underwent a multi-stage cleaning process before reaching its final count of 7,176 books.
        </p>
        <p>
          <strong>OCR Quality Filtering:</strong> The OpenITI corpus includes some texts produced through automatic OCR
          (Kraken, AOCP, Escriptorium, Tesseract) that contain significant errors. These low-quality OCR texts
          were removed from the corpus.
        </p>
        <p>
          <strong>Morphological Data Cleaning:</strong> The CAMeL Tools BERT disambiguator occasionally misclassifies
          tokens as proper nouns (<em>noun_prop</em>) with unknown roots. While many of these are legitimate proper nouns
          (like people or places), others are common words, abbreviations,
          or OCR artifacts that were incorrectly tagged. A cleaning pipeline was applied to fix unambiguous cases
           and apply a handful of curated corrections for known systematic errors
          such as abbreviations (<em>ثنا</em>, <em>نا</em>), adverbs (<em>حيث</em>, <em>هكذا</em>), and other grammatical particles.
          This process corrected approximately 14.8 million token classifications.
        </p>
        <h3>Text Processing Pipeline</h3>
        <p>
          Each text in the corpus undergoes a multi-stage processing pipeline to enable morphologically-aware search:
        </p>
        <ul>
          <li>
            <strong>Tokenization:</strong> Arabic text is tokenized into individual words, with
            diacritics (tashkīl) stripped and characters normalized (ḥamza carriers, Persian/Urdu
            variants unified to standard Arabic forms).
          </li>
          <li>
            <strong>Morphological Analysis:</strong> Every token is processed through{' '}
            <a href="https://camel-tools.readthedocs.io/" target="_blank" rel="noopener noreferrer">CAMeL Tools</a>{' '}
            BERTUnfactoredDisambiguator, which provides lemma, root, part of speech, grammatical
            features (state, number, gender, case), and clitic information for each word.
          </li>
          <li>
            <strong>Indexing:</strong> Processed pages are indexed into a{' '}
            <a href="https://github.com/quickwit-oss/tantivy" target="_blank" rel="noopener noreferrer">Tantivy</a>{' '}
            full-text search engine with separate fields for surface forms, lemmas, and roots,
            enabling flexible cross-field queries.
          </li>
          <li>
            <strong>Token Storage:</strong> Morphological data is stored in a compressed SQLite
            database using deduplicated token definitions. Each unique combination of surface, lemma, root, part of speech, features, and clitics is stored once and referenced by ID across all of its occurrences, yielding roughly 10 to 50 times compression compared to naive per-token storage.
          </li>
        </ul>

        <h4>Per-Token Data</h4>
        <p>
          Every token in the corpus carries the following morphological data:
        </p>
        <ul>
          <li><strong>Surface form:</strong> the word as it appears after normalization</li>
          <li><strong>Lemma:</strong> the dictionary headword</li>
          <li><strong>Root:</strong> the Arabic triliteral or quadriliteral root, where applicable</li>
          <li><strong>Part of speech:</strong> noun, verb, adjective, particle, and so on</li>
          <li><strong>Grammatical features:</strong> state, number, gender, case, mood, voice, and others as applicable</li>
          <li><strong>Clitics:</strong> attached proclitics and enclitics</li>
        </ul>
        <p>
          For example, the surface form <span className="arabic">بالكتاب</span> is analyzed as: lemma <span className="arabic">كتاب</span>, root <span className="arabic">ك-ت-ب</span>, part of speech noun, features [definite, masculine, singular, genitive], and clitic <em>bi+</em>.
        </p>

        <h4>Citing Search Results</h4>
        <p>
          Each page in the corpus is identified by its book, volume label, and page number, preserved as printed in the source edition. Volume labels (such as <span className="arabic">الجزء الأول</span>) and page numbers, which may be non-numeric in some texts, appear with every search result. When citing a hit found through al-Kashshāf in a publication, reference the volume and page as they appear in the source edition, along with the corpus version.
        </p>

        <h3>Key Features</h3>
        <ul>
          <li><strong>Multiple search modes:</strong> Surface form, lemma, and root-based searching</li>
          <li><strong>Boolean and proximity search:</strong> Combine terms with AND/OR logic or find terms near each other</li>
          <li><strong>Name search:</strong> Specialized search for Arabic personal names with automatic pattern generation</li>
          <li><strong>Collections:</strong> Save named groups of texts as reusable mini-corpora that persist across sessions</li>
          <li><strong>Search history and saved searches:</strong> Automatically saved queries for quick access</li>
          <li><strong>Export:</strong> Export search results and metadata to CSV for external analysis</li>
        </ul>

        <h3>Technology</h3>
        <p>
          The application is built using:
        </p>
        <ul>
          <li><strong>Tauri:</strong> Cross-platform desktop framework for native performance</li>
          <li><strong>Tantivy:</strong> High-performance full-text search engine</li>
          <li><strong>CAMeL Tools:</strong> State-of-the-art Arabic NLP for morphological analysis</li>
          <li><strong>React:</strong> Performant UI</li>
        </ul>
        <h3>Development</h3>
        <p>Initital funding for this project under the name mutūn was provided by NYU's faculty DH seed grant program, with <a href="https://www.antoniomusto.com" target="_blank" rel="noopener noreferrer">Antonio Musto</a> as the PI and Giovanni DiRusso and Jeremy Farrell as team members. Project development went into hiatus due to lack of funding opportunities, but was restarted by Antonio, who is the sole developer.</p>
        <h3>Open Source</h3>
        <p>
          Al-Kashshāf is open source software. You can view the source code, report issues, or
          contribute on <a href="https://github.com/ammusto/kashshaf" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>

        <h3>Contact</h3>
        <p>
          For questions, bug reports, or feature requests, please open an issue on the{' '}
          <a href="https://github.com/ammusto/kashshaf/issues" target="_blank" rel="noopener noreferrer">
            GitHub issues page
          </a>.
        </p>
      </div>
    </div>
  );
};

export default About;
