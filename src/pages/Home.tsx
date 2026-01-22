import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="hero-row">
        <img src="/icon.png" alt="al-Kashshaf" className="hero-logo" />
        <p>
          An <a href="https://github.com/ammusto/kashshaf" target="_blank" rel="noopener noreferrer">open-source</a> tool for advanced search of medieval Arabic texts, available to <Link to="/download">download</Link>  as a desktop application or <a href="https://app.kashshaf.com/" target="_blank" rel="noopener noreferrer">online</a> as a web application. al-Kashshāf provides powerful search capabilities across a large corpus of nearly 6,800 Arabic texts (up to 1348 AH/1930 CE), with morphological analysis and flexible query options, including root, lemma, and surface queries in addition to proximity search and other <Link to="/features">features</Link>. To learn more see <Link to="/docs">documentation</Link> or the <Link to="/about">about</Link> page.
        </p>
      </div>
      <div className="screenshot-container large">
        <div className="screenshot-window">
          <img src="/screenshots/front-page.png" alt="Kashshaf main interface" />
        </div>
      </div>
      <div className="hero-buttons">
        <a href="https://app.kashshaf.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Use Online
        </a>
        <Link to="/download" className="btn btn-secondary">
          Download
        </Link>
        <Link to="/features" className="btn btn-secondary">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Home;
