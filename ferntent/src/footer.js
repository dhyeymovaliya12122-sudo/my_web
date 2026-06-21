import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <div style={{ display: 'inline-block', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', borderRadius: '8px', display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}></div>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#f1f5f9', verticalAlign: 'middle' }}>DriveLine Motors</span>
          </div>
          <p>Your trusted destination for premium new and certified pre-owned vehicles. Quality, transparency, and service — always.</p>
          <div style={{ marginTop: '18px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer', marginRight: '8px' }}>F</div>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer', marginRight: '8px' }}>I</div>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>T</div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signin">Sign In / Register</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:sales@drivelinemotors.in">sales@drivelinemotors.in</a>
          <span style={{ color: '#8C98B0', fontSize: '0.9rem', display: 'block', paddingTop: '4px' }}>456 MG Road, Mumbai</span>
          <span style={{ color: '#8C98B0', fontSize: '0.87rem', display: 'block', paddingTop: '4px' }}>Mon-Sat: 9am - 7pm</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 DriveLine Motors. All rights reserved.</span>
        <span>
          <a href="#privacy" style={{ color: 'inherit', marginRight: '20px' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: 'inherit' }}>Terms of Use</a>
        </span>
      </div>
    </div>
  );
}
