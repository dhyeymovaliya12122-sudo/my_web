import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from './api';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm(prev => ({ ...prev, name: user.name, email: user.email }));
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ text: '', type: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return setStatus({ text: 'Please fill in all required fields.', type: 'error' });
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ text: '✅ Your message has been sent! Our team will reach out within 24 hours.', type: 'success' });
        setForm({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
      } else {
        setStatus({ text: data.message || 'Unable to send. Please try again.', type: 'error' });
      }
    } catch {
      setStatus({ text: 'Cannot connect to server. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      {/* Page Header */}
      <div style={{ marginBottom: 36 }}>
      <div className="section-label">Get In Touch</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, marginBottom: 8 }}>
          Contact DriveLine Motors
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Have a question about inventory, financing, or a test drive? Send us a message and our team will respond promptly.
        </p>
      </div>

      <div className="contact-grid">

        {/* Info Card */}
        <div className="contact-info-card">
          <h3>Our Information</h3>

          {[
            { icon: '', label: 'Address', value: '456 MG Road, Andheri West\nMumbai - 400053' },
            { icon: '', label: 'Phone', value: <a href="tel:+919876543210">+91 98765 43210</a> },
            { icon: '', label: 'Email', value: <a href="mailto:sales@drivelinemotors.in">sales@drivelinemotors.in</a> },
            { icon: '', label: 'Hours', value: 'Mon-Sat: 9am - 7pm\nSun: 10am - 5pm' },
          ].map(item => (
            <div key={item.label} className="contact-item">
              <div className="contact-item-icon">{item.icon}</div>
              <div>
                <div className="contact-item-label">{item.label}</div>
                <div className="contact-item-value" style={{ whiteSpace: 'pre-line' }}>{item.value}</div>
              </div>
            </div>
          ))}

          {/* Map placeholder */}
          <div style={{
            marginTop: 24, borderRadius: 14, overflow: 'hidden',
            height: 160, background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.05))',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8
          }}>
            <div style={{ fontSize: '2rem' }}> </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>456 MG Road, Mumbai</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="contact-form-card">
          <h3>Send a Message</h3>

          {user && (
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
              Signed in as <strong>{user.name}</strong> - name & email pre-filled.
            </div>
          )}

          {status.text && (
            <div className={`form-msg ${status.type}`}>{status.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  name="name" type="text" value={form.name}
                  onChange={handleChange} placeholder="Your name"
                  className="form-input"
                  readOnly={!!user}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input
                  name="phone" type="tel" value={form.phone}
                  onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="form-input"
                readOnly={!!user}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                name="message" rows="5" value={form.message}
                onChange={handleChange}
                placeholder="Tell us what you're looking for — car type, budget, or any questions…"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 40 }}>
        {[
          { icon: '📅', title: 'Book Test Drive', desc: 'Schedule a free test drive at your convenience', action: 'Schedule Now' },
          { icon: '💳', title: 'Financing Options', desc: 'Talk to our finance team about EMI plans', action: 'Learn More' },
          { icon: '🔄', title: 'Trade-In Your Car', desc: 'Get the best value for your existing vehicle', action: 'Get Quote' },
        ].map(q => (
          <div key={q.title} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '24px 20px', transition: 'all 0.25s',
            cursor: 'pointer'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{q.icon}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, marginBottom: 6 }}>{q.title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 14 }}>{q.desc}</div>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>{q.action} →</span>
          </div>
        ))}
      </div>

    </section>
  );
}
