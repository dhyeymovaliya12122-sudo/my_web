import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from './api';

export default function Contact() {
  var auth = useAuth();
  var user = auth.user;

  var formState = useState({ name: '', email: '', phone: '', message: '' });
  var form = formState[0];
  var setForm = formState[1];

  var statusState = useState({ text: '', type: '' });
  var status = statusState[0];
  var setStatus = statusState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  useEffect(function() {
    if (user) {
      setForm(function(prevForm) {
        return {
          name: user.name,
          email: user.email,
          phone: prevForm.phone,
          message: prevForm.message
        };
      });
    }
  }, [user, setForm]);

  function handleChange(e) {
    var newForm = { name: form.name, email: form.email, phone: form.phone, message: form.message };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
    setStatus({ text: '', type: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return setStatus({ text: 'Please fill in all required fields.', type: 'error' });
    }

    setLoading(true);
    try {
      var res = await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
      });
      var data = await res.json();

      if (res.ok) {
        setStatus({ text: 'Your message has been sent! Our team will reach out within 24 hours.', type: 'success' });
        var resetName = user ? user.name : '';
        var resetEmail = user ? user.email : '';
        setForm({ name: resetName, email: resetEmail, phone: '', message: '' });
      } else {
        setStatus({ text: data.message || 'Unable to send. Please try again.', type: 'error' });
      }
    } catch (e) {
      setStatus({ text: 'Cannot connect to server. Please try again later.', type: 'error' });
    }
    setLoading(false);
  }

  return (
    <div className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      <div style={{ marginBottom: '36px' }}>
        <div className="section-label">Get In Touch</div>
        <h1 style={{ fontWeight: '900', marginBottom: '8px', fontSize: '2.4rem' }}>
          Contact DriveLine Motors
        </h1>
        <p style={{ color: '#B8C1D6', maxWidth: '520px' }}>
          Have a question about inventory, financing, or a test drive? Send us a message and our team will respond promptly.
        </p>
      </div>

      <div className="contact-grid">

        <div className="contact-info-card">
          <h3>Our Information</h3>

          <div className="contact-item">
            <div className="contact-item-icon"></div>
            <div>
              <div className="contact-item-label">Address</div>
              <div className="contact-item-value" style={{ whiteSpace: 'pre-line' }}>456 MG Road, Andheri West{'\n'}Mumbai - 400053</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"></div>
            <div>
              <div className="contact-item-label">Phone</div>
              <div className="contact-item-value"><a href="tel:+919876543210">+91 98765 43210</a></div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"></div>
            <div>
              <div className="contact-item-label">Email</div>
              <div className="contact-item-value"><a href="mailto:sales@drivelinemotors.in">sales@drivelinemotors.in</a></div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon"></div>
            <div>
              <div className="contact-item-label">Hours</div>
              <div className="contact-item-value" style={{ whiteSpace: 'pre-line' }}>Mon-Sat: 9am - 7pm{'\n'}Sun: 10am - 5pm</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderRadius: '14px', overflow: 'hidden', height: '160px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', paddingTop: '50px' }}>
            <div style={{ color: '#8C98B0', fontSize: '0.85rem' }}>456 MG Road, Mumbai</div>
          </div>
        </div>

        <div className="contact-form-card">
          <h3>Send a Message</h3>

          {user && (
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.85rem', color: '#34d399', fontWeight: '600' }}>
              Signed in as <strong>{user.name}</strong> - name &amp; email pre-filled.
            </div>
          )}

          {status.text && (
            <div className={'form-msg ' + status.type}>{status.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                placeholder="Tell us what you're looking for..."
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

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'inline-block', width: '32%', marginRight: '2%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px 20px', cursor: 'pointer', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}></div>
          <div style={{ fontWeight: '800', marginBottom: '6px' }}>Book Test Drive</div>
          <div style={{ color: '#8C98B0', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '14px' }}>Schedule a free test drive at your convenience</div>
          <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem' }}>Schedule Now →</span>
        </div>
        <div style={{ display: 'inline-block', width: '32%', marginRight: '2%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px 20px', cursor: 'pointer', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}></div>
          <div style={{ fontWeight: '800', marginBottom: '6px' }}>Financing Options</div>
          <div style={{ color: '#8C98B0', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '14px' }}>Talk to our finance team about EMI plans</div>
          <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem' }}>Learn More →</span>
        </div>
        <div style={{ display: 'inline-block', width: '32%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px 20px', cursor: 'pointer', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}></div>
          <div style={{ fontWeight: '800', marginBottom: '6px' }}>Trade-In Your Car</div>
          <div style={{ color: '#8C98B0', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '14px' }}>Get the best value for your existing vehicle</div>
          <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem' }}>Get Quote →</span>
        </div>
      </div>

    </div>
  );
}
