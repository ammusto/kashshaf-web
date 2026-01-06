import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="hero-row">
        <img src="/icon.png" alt="al-Kashshaf" className="hero-logo" />
        <p>
          A tool for advanced search of medieval Arabic texts, available online and as a desktop application.
          al-Kashshāf provides powerful search capabilities across a large corpus of classical
          Arabic texts, with morphological analysis and flexible query options, including root, lemma, and surface queries in addition to proximity search and other features.
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
