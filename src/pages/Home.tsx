import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import Lightbox, { type LightboxImage } from '../components/Lightbox';

/** The screenshot under the signup. Swap the file and caption here. */
const SHOT: LightboxImage = {
  src: '/screenshots/front-page.png',
  alt: 'al-Kashshāf search view',
  caption: 'The search view: the query form, the reader and the results',
};

const Home = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="hero-row">
        <img src="/icon.png" alt="al-Kashshaf" className="hero-logo" />
        <p>
          An <a href="https://github.com/ammusto/kashshaf" target="_blank" rel="noopener noreferrer">open-source</a> tool for advanced search of Arabic texts, as a desktop application and as a web application. al-Kashshāf provides powerful search capabilities across a large meta-corpus of nearly 7,200 Arabic texts (up to 1348 AH/1930 CE), with morphological analysis and flexible query options, including root, lemma, and surface queries in addition to proximity search and other <Link to="/features">features</Link>. The primary goal of this project is to increase accessibility to digitized texts that are not represented in the major  searchable corpora and/or are not available to the non-technical user. To learn more see the <Link to="/about">about</Link> and <Link to="/features">features</Link> pages.
        </p>
      </div>

      <div className="status-note">
        <p>
          al-Kashshāf is currently in private testing with a public release soon. If you would like to receive updates, enter your email below!
        </p>
        <SignupForm />
      </div>

      <div className="screenshot-container large">
        <div className="screenshot-window">
          <img src={SHOT.src} alt={SHOT.alt} className="zoomable" onClick={() => setOpen(true)} />
        </div>
        {SHOT.caption && <p className="screenshot-caption">{SHOT.caption}</p>}
      </div>

      {open && <Lightbox images={[SHOT]} index={0} onClose={() => setOpen(false)} onChange={() => {}} />}
    </div>
  );
};

export default Home;
