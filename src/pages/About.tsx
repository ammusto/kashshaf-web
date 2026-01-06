const About = () => {
  return (
    <div className="about-section">
      <h1>About al-Kashshāf</h1>

      <div className="text-content">
        <h2>Project Overview</h2>
        <p>
          Al-Kashshāf (<span className="arabic">الكشّاف</span>) is a desktop application designed
          for  working with medieval Arabic texts (currently the corpus contains pre-750/1350 texts). It provides linguistically
          precise search capabilities that include morphological features.
        </p>

        <h3>The Corpus</h3>
        <p>
          Al-Kashshāf searches across a large corpus of classical Arabic literature, including texts from
          various genres such as jurisprudence (fiqh), Sufism (tasawwuf), theology, history, and more.
          Each text has been processed with state-of-the-art morphological analysis to enable
          lemma and root-based searching.
        </p>
        <p>
          The corpus draws primarily from the texts in{' '}
          <a href="https://shamela.ws/" target="_blank" rel="noopener noreferrer">al-Maktaba al-Shamela</a>,
          but includes additional texts collected by the{' '}
          <a href="https://openiti.org/" target="_blank" rel="noopener noreferrer">OpenITI</a> initiative
          and{' '}
          <a href="https://kitab-project.org/" target="_blank" rel="noopener noreferrer">KITAB project</a>.
        </p>

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
