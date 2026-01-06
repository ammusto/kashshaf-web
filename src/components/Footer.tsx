const Footer = () => {
  return (
    <footer>
      <div className="div-footer">
        <div className="footer-link-container">
          <a href="https://github.com/ammusto/kashshaf" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://github.com/ammusto/kashshaf/issues" target="_blank" rel="noopener noreferrer">
            Report Issue
          </a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Kashshaf
        </div>
      </div>
    </footer>
  );
};

export default Footer;
