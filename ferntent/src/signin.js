import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import API from './api';

export default function Signin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]     = useState('login');
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [msg, setMsg]     = useState({ text: '', type: '' });
  const [loading, setLoading]   = useState(false);
  const [dbOnline, setDbOnline] = useState(null);
  const [showPw, setShowPw]     = useState(false);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { checkHealth(); }, []);

  async function checkHealth() {
    setDbOnline(null);
    try {
      const res  = await fetch(`${API}/health`);
      const data = await res.json();
      setDbOnline(data.dbConnected === true);
    } catch {
      setDbOnline(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ text: '', type: '' });
  }

  function switchTab(t) {
    setTab(t);
    setForm({ name: '', email: '', password: '' });
    setMsg({ text: '', type: '' });
  }

  async function handleRegister() {
    if (form.name.trim().length < 2)  return setMsg({ text: 'Name must be at least 2 characters.', type: 'error' });
    if (!form.email.includes('@'))    return setMsg({ text: 'Enter a valid email address.', type: 'error' });
    if (form.password.length < 6)     return setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });

    setLoading(true);
    try {
      const res  = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      });
      const data = await res.json();
      if (data.success) {
        login({ name: data.user.name, email: data.user.email, createdAt: new Date().toISOString() });
        setMsg({ text: `🎉 Welcome, ${data.user.name}! Redirecting…`, type: 'success' });
        setTimeout(() => navigate('/'), 1200);
      } else {
        setMsg({ text: data.message || 'Registration failed.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Cannot reach server. Make sure the backend is running.', type: 'error' });
      setDbOnline(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!form.email.includes('@')) return setMsg({ text: 'Enter a valid email address.', type: 'error' });
    if (form.password.length < 6)  return setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });

    setLoading(true);
    try {
      const res  = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password })
      });
      const data = await res.json();
      if (data.success) {
        login({ name: data.user.name, email: data.user.email, createdAt: data.user.createdAt || new Date().toISOString() });
        setMsg({ text: `✅ Welcome back, ${data.user.name}!`, type: 'success' });
        setTimeout(() => navigate('/'), 1200);
      } else {
        setMsg({ text: data.message || 'Login failed.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Cannot reach server. Make sure the backend is running.', type: 'error' });
      setDbOnline(false);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (tab === 'register') handleRegister(); else handleLogin();
  }

  return (
    <div className="signin-page">
      <div className="signin-card">

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}>🚗</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#94a3b8' }}>
            DriveLine Motors
          </div>
        </div>

        {/* Tabs */}
        <div className="signin-tabs">
          {['login', 'register'].map(t => (
            <button key={t} className={`signin-tab${tab === t ? ' active' : ''}`}
              onClick={() => switchTab(t)}>
              {t === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Title */}
        <h2 className="signin-title">
          {tab === 'login' ? 'Welcome Back 👋' : 'Create Account ✨'}
        </h2>
        <p className="signin-subtitle">
          {tab === 'login'
            ? 'Sign in to access your account and saved vehicles.'
            : 'Join DriveLine to save favourites and get priority service.'}
        </p>

        {/* DB Status */}
        {dbOnline === null && (
          <div className="status-banner checking">⏳ Checking server connection…</div>
        )}
        {dbOnline === false && (
          <div className="status-banner offline">
            <span>⚠️ Backend offline — start server first.</span>
            <button className="retry-btn" onClick={checkHealth}>Retry</button>
          </div>
        )}
        {dbOnline === true && (
          <div className="status-banner online">✅ Server & database connected</div>
        )}

        {/* Message */}
        {msg.text && (
          <div className={`form-msg ${msg.type}`} style={{ marginBottom: 18 }}>
            {msg.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                placeholder="Your full name" className="form-input" autoComplete="name" required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" className="form-input" autoComplete="email" required />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Password</span>
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </label>
            <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
              onChange={handleChange} placeholder="Min. 6 characters" className="form-input"
              autoComplete={tab === 'register' ? 'new-password' : 'current-password'} required />
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading
              ? (tab === 'register' ? '⏳ Creating account…' : '⏳ Signing in…')
              : (tab === 'register' ? '🚀 Create Account' : '🔐 Sign In')}
          </button>
        </form>

        {/* Switch tab */}
        <div className="signin-switch">
          {tab === 'register' ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => switchTab(tab === 'register' ? 'login' : 'register')}>
            {tab === 'register' ? 'Log In' : 'Register'}
          </button>
        </div>

      </div>
    </div>
  );
}