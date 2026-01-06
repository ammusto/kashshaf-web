const About = () => {
  return (
    <div className="about-section">
      <h1>About al-Kashshāf</h1>

      <div className="text-content">
        <h2>Project Overview</h2>
        <p>
          Al-Kashshāf (<span className="arabic">الكشّاف</span>) is a desktop application designed
          for  working with medieval Arabic texts (currently the corpus contains pre-750/1350 texts). It provides linguistically
          precise search capabilities that include morphological features. The corpus will soon be expanded to include all text up to 1348/1930.
        </p>

        <h3>The Corpus</h3>
        <p>
          Al-Kashshāf searches across a large corpus of classical Arabic literature, including texts from
          various genres such as jurisprudence (fiqh), Sufism (taṣawwuf), theology, history, and more.
          Each text has been processed with state-of-the-art morphological analysis to enable
          lemma and root-based searching.
        </p>
        <p>
          The corpus draws primarily from the texts in{' '}
          <a href="https://shamela.ws/" target="_blank" rel="noopener noreferrer">al-Maktaba al-Shamela</a>,
          but includes additional texts collected by the{' '}
          <a href="https://openiti.org/" target="_blank" rel="noopener noreferrer">OpenITI</a>
          {' '}and{' '}
          <a href="https://kitab-project.org/" target="_blank" rel="noopener noreferrer">KITAB</a> projects.
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
            database using deduplicated token definitions, allowing efficient retrieval of
            detailed analysis for any word in the corpus.
          </li>
        </ul>

        <h3>Technology</h3>
        <p>
          The application is built using modern technologies:
        </p>
        <ul>
          <li><strong>Tauri:</strong> Cross-platform desktop framework for native performance</li>
          <li><strong>Tantivy:</strong> High-performance full-text search engine</li>
          <li><strong>CAMeL Tools:</strong> State-of-the-art Arabic NLP for morphological analysis</li>
          <li><strong>React:</strong> Modern user interface</li>
        </ul>
        <h3>Development</h3>
        <p>Initital funding for this project under the name mutūn was provided by NYU's faculty DH seed grant program, with <a href="https://www.antoniomusto.com>"  target="_blank" rel="noopener noreferrer">Antonio Musto</a> as the PI and Giovanni DiRusso and Jeremy Farrell as team members. Project development went into hiatus due to lack of funding opportunities, but was restarted by Antonio, who is the sole developer.</p>
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
