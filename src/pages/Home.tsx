import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="hero-row">
        <img src="/icon.png" alt="al-Kashshaf" className="hero-logo" />
        <p>
          A desktop application for linguistically precise search of medieval Arabic texts.
          al-Kashshāf provides powerful search capabilities across a large corpus of classical
          Arabic literature, with morphological analysis and flexible query options.
        </p>
      </div>
      <div className="screenshot-container large">
        <div className="screenshot-window">
          <img src="/screenshots/main.png" alt="Kashshaf main interface" />
        </div>
      </div>
      <div className="hero-buttons">
        <Link to="/download" className="btn btn-primary">
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
