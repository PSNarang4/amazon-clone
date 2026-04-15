import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer>
      <div className="footer-back-to-top" onClick={scrollToTop}>
        Back to top
      </div>

      <div className="footer-links-section">
        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <ul>
            <li><a href="#!">About Amazon</a></li>
            <li><a href="#!">Careers</a></li>
            <li><a href="#!">Press Releases</a></li>
            <li><a href="#!">Amazon Cares</a></li>
            <li><a href="#!">Gift a Smile</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Connect with Us</h4>
          <ul>
            <li><a href="#!">Facebook</a></li>
            <li><a href="#!">Twitter</a></li>
            <li><a href="#!">Instagram</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <ul>
            <li><a href="#!">Sell on Amazon</a></li>
            <li><a href="#!">Sell under Amazon Accelerator</a></li>
            <li><a href="#!">Amazon Associates</a></li>
            <li><a href="#!">Fulfillment by Amazon</a></li>
            <li><a href="#!">Advertise Your Products</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Let Us Help You</h4>
          <ul>
            <li><a href="#!">COVID-19 and Amazon</a></li>
            <li><Link to="/orders">Your Account</Link></li>
            <li><Link to="/orders">Returns Centre</Link></li>
            <li><a href="#!">100% Purchase Protection</a></li>
            <li><a href="#!">Amazon App Download</a></li>
            <li><a href="#!">Help</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <Link to="/" className="footer-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-in">.in</span>
        </Link>
        <div className="footer-bottom-links">
          <a href="#!">Conditions of Use &amp; Sale</a>
          <a href="#!">Privacy Notice</a>
          <a href="#!">Interest-Based Ads Notice</a>
        </div>
        <p className="footer-copy">© 1996–2025, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
}

export default Footer;
