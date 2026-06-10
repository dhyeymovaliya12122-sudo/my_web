import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#38bdf8,#818cf8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🚗</div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>DriveLine Motors</span>
          </div>
          <p>Your trusted destination for premium new and certified pre-owned vehicles. Quality, transparency, and service — always.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {['Facebook', 'Instagram', 'Twitter'].map(s => (
              <div key={s} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>
                {s[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signin">Sign In / Register</Link>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+919876543210">📞 +91 98765 43210</a>
          <a href="mailto:sales@drivelinemotors.in">✉️ sales@drivelinemotors.in</a>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', paddingTop: 4 }}>📍 456 MG Road, Mumbai</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.87rem', display: 'block', paddingTop: 4 }}>🕒 Mon–Sat: 9am – 7pm</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 DriveLine Motors. All rights reserved.</span>
        <span style={{ display: 'flex', gap: 20 }}>
          <a href="#privacy" style={{ color: 'inherit' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: 'inherit' }}>Terms of Use</a>
        </span>
      </div>
    </footer>
  );
}