import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function Contact() {
  const { user } = useAuth();
  const [form,   setForm]   = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill name & email when user is logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');

    if (!form.name || !form.email || !form.message) {
      return setStatus('Please complete all fields.');
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5500/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Your inquiry has been sent. We will reply soon.');
        setForm({ name: user?.name || '', email: user?.email || '', message: '' });
      } else {
        setStatus(data.message || 'Unable to send your inquiry.');
      }
    } catch {
      setStatus('Cannot connect to backend. Start the server on port 5500.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page contact-page">
      <h1>Contact DriveLine Motors</h1>
      <p>Questions about inventory, financing, or test drives? Send us a message and our sales team will reach out.</p>

      <div className="contact-grid">
        <div className="contact-info">
          <h3>Visit Us</h3>
          <p>456 MG Road, Mumbai</p>
          <p>Phone: <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p>Email: <a href="mailto:sales@drivelinemotors.in">sales@drivelinemotors.in</a></p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {user && (
            <p style={{ color: '#34d399', fontSize: '0.85rem', margin: '0 0 8px' }}>
              Signed in as <strong>{user.name}</strong> - fields pre-filled.
            </p>
          )}
          {status && (
            <p className={status.startsWith('✅') ? 'msg-success' : 'msg-error'}>{status}</p>
          )}

          <div>
            <label>Name</label>
            <input
              name="name" type="text" value={form.name}
              onChange={handleChange} placeholder="Your name"
              readOnly={!!user}
              style={user ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="Your email"
              readOnly={!!user}
              style={user ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            />
          </div>
          <div>
            <label>Message</label>
            <textarea
              name="message" rows="5" value={form.message}
              onChange={handleChange} placeholder="Tell us what you need..."
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
