import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo">Quick<span>Rev</span></Link>
          <p>Turning raw notes into an adaptive revision engine.</p>
        </div>
        <div className="footer-links">
          <h4>Site</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/#features">Features</Link>
        </div>
        <div className="footer-links">
          <h4>Contact</h4>
          <a href="mailto:quickrev.org@gmail.com">quickrev.org@gmail.com</a>
          <a href="tel:+916383874330">+91 63838 74330</a>
          <a href="tel:+918778034787">+91 87780 34787</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} QuickRev</p>
      </div>
    </footer>
  );
}
