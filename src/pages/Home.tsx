import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

const Home = () => {
  return (
    <div>
      <div className="hero-row">
        <img src="/icon.png" alt="al-Kashshaf" className="hero-logo" />
        <p>
          An <a href="https://github.com/ammusto/kashshaf" target="_blank" rel="noopener noreferrer">open-source</a> tool for advanced search of medieval Arabic texts, as a desktop application and as a web application. al-Kashshāf provides powerful search capabilities across a large corpus of nearly 7,200 Arabic texts (up to 1348 AH/1930 CE), with morphological analysis and flexible query options, including root, lemma, and surface queries in addition to proximity search and other <Link to="/features">features</Link>. To learn more see <Link to="/docs">documentation</Link> or the <Link to="/about">about</Link> page.
        </p>
      </div>

      <div className="status-note">
        <p>
          al-Kashshāf is currently in private testing with a public release soon. If you would like to receive updates, enter your email below!
        </p>
        <SignupForm />
      </div>
    </div>
  );
};

export default Home;
