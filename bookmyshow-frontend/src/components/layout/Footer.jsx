import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <h4>BookMyShow</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4>Help</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/report">Report an Issue</Link></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4>Follow Us</h4>
            <div className={styles.social}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>FB</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>TW</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>IG</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>YT</a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>&copy; 2023 BookMyShow Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 