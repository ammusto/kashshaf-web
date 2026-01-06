import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header>
      <div className="header-container">
        <div className="header-text">
          <Link to="/">al-kashshāf</Link>
        </div>
        <nav>
          <ul>
            <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
            <li><Link to="/features" className={isActive('/features') ? 'active' : ''}>Features</Link></li>
            <li><Link to="/download" className={isActive('/download') ? 'active' : ''}>Download</Link></li>
            <li><Link to="/docs" className={isActive('/docs') ? 'active' : ''}>Docs</Link></li>
            <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
