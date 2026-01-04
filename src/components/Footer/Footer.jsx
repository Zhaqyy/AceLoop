import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section: Logo, Tagline, Social Icons */}
      <div className="footer-top">
        <div className="footer-top-left">
          <div className="footer-logo">ACELOOP</div>
          <div className="footer-tagline">
            <p>Creative engineering</p>
            <p>for thoughtful brands</p>
          </div>
        </div>
        <div className="footer-top-right">
          <div className="footer-social">
            <a href="https://behance.net" className="footer-social-link" aria-label="Behance">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7.3c0-1-.3-1.7-.8-2.2C20.5 4.5 19.3 4 17.7 4H6.2C4.6 4 3.4 4.5 2.8 5.1c-.5.5-.8 1.2-.8 2.2v9.4c0 1 .3 1.7.8 2.2.6.6 1.8 1.1 3.4 1.1h11.5c1.6 0 2.8-.5 3.4-1.1.5-.5.8-1.2.8-2.2V7.3zm-7.1 4.2c-1.1 0-1.9-.4-2.4-1.2-.5-.8-.7-1.9-.7-3.3h4.8c0 .8.1 1.4.3 1.8.2.4.5.7 1 .7.4 0 .7-.1.9-.3.2-.2.3-.5.3-.9 0-.3-.1-.6-.3-.8-.2-.2-.5-.3-.9-.3-.6 0-1 .2-1.2.6-.1.2-.2.5-.2.9H9.8c.1-1.1.4-1.9.9-2.5.5-.6 1.3-.9 2.3-.9 1.1 0 1.9.3 2.4.8.5.5.8 1.2.8 2.1 0 .6-.1 1.1-.4 1.5-.3.4-.7.7-1.2.9.7.2 1.2.5 1.5 1 .3.5.5 1.1.5 1.8 0 1-.3 1.8-1 2.3-.7.5-1.7.8-3 .8zm-8.5-1.2h-2.1v2.1h2.1c.6 0 1-.2 1.2-.6.2-.4.2-.9 0-1.5-.2-.5-.6-.7-1.2-.7zm2.1-3.3H9.2v2.1h1.2c.6 0 1-.2 1.2-.6.2-.4.2-.9 0-1.5-.2-.5-.6-.7-1.2-.7z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://instagram.com" className="footer-social-link" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="17" cy="7" r="1" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://twitter.com" className="footer-social-link" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Center Section: Large Brand Name */}
      <div className="footer-center">
        <h1 className="footer-brand">ACELOOP</h1>
      </div>

      {/* Bottom Section: Address, Navigation, Contact */}
      <div className="footer-bottom">
        <div className="footer-section footer-left">
          <div className="footer-address">
            <p>Königsallee 27, Düsseldorf,</p>
            <p>Germany</p>
          </div>
          <div className="footer-email">
            <a href="mailto:info@orchidstudio.com">info@orchidstudio.com</a>
          </div>
        </div>

        <div className="footer-section footer-middle">
          <nav className="footer-nav">
            <a href="/about" className="footer-link">About</a>
            <a href="/works" className="footer-link">Works</a>
            <a href="/journal" className="footer-link">Journal</a>
          </nav>
        </div>

        <div className="footer-section footer-right">
          <nav className="footer-nav">
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/privacy" className="footer-link">Privacy policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

