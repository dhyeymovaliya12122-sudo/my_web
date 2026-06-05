import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API = 'https://my-web-89so.onrender.com';

export default function Signin() {
  const { user, login }   = useAuth();
  const navigate          = useNavigate();
  const [tab, setTab]     = useState('register');
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [msg, setMsg]     = useState({ text: '', type: '' });
  const [loading, setLoading]   = useState(false);
  const [dbOnline, setDbOnline] = useState(null);

  // If already logged in, go straight to home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Check backend health on mount
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

  function showMsg(text, type) { setMsg({ text, type }); }

  // ── Register ──────────────────────────────────────────────────────
  async function handleRegister() {
    if (form.name.trim().length < 2)  return showMsg('Name must be at least 2 characters.', 'error');
    if (!form.email.includes('@'))    return showMsg('Enter a valid email address.', 'error');
    if (form.password.length < 6)     return showMsg('Password must be at least 6 characters.', 'error');

    setLoading(true);
    try {
      const res  = await fetch(`${API}/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      });
      const data = await res.json();

      if (data.success) {
        // Save user to global context + localStorage
        login({ name: data.user.name, email: data.user.email, createdAt: new Date().toISOString() });
        showMsg(`Account created. Welcome, ${data.user.name}!`, 'success');
        setTimeout(() => navigate('/'), 1200);
      } else {
        showMsg(data.message || 'Registration failed.', 'error');
      }
    } catch {
      showMsg('Cannot reach server. Make sure the backend is running on port 5500.', 'error');
      setDbOnline(false);
    } finally {
      setLoading(false);
    }
  }

  // ── Login ─────────────────────────────────────────────────────────
  async function handleLogin() {
    if (!form.email.includes('@')) return showMsg('Enter a valid email address.', 'error');
    if (form.password.length < 6)  return showMsg('Password must be at least 6 characters.', 'error');

    setLoading(true);
    try {
      const res  = await fetch(`${API}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email.trim(), password: form.password })
      });
      const data = await res.json();

      if (data.success) {
        // Save user to global context + localStorage
        login({ name: data.user.name, email: data.user.email, createdAt: data.user.createdAt || new Date().toISOString() });
        showMsg(`Welcome back, ${data.user.name}!`, 'success');
        setTimeout(() => navigate('/'), 1200);
      } else {
        showMsg(data.message || 'Login failed.', 'error');
      }
    } catch {
      showMsg('Cannot reach server. Make sure the backend is running on port 5500.', 'error');
      setDbOnline(false);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (tab === 'register') handleRegister();
    else handleLogin();
  }

  // ── Styles ────────────────────────────────────────────────────────
  const card = {
    background: 'rgba(18,18,28,0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '430px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
  };
  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600', marginBottom: '6px', display: 'block' };
  const btnPrimary = {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg,#00f2fe,#4facfe)', border: 'none',
    borderRadius: '10px', color: '#0a0a1a', fontWeight: '800', fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '8px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={card}>

        {/* Tabs */}
        <div style={{ display:'flex', marginBottom:'28px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          {['login','register'].map(t => (
            <button key={t} type="button" onClick={() => switchTab(t)} style={{
              flex:1, background:'none', border:'none',
              color: tab===t ? '#00f2fe' : '#64748b',
              fontWeight:'700', fontSize:'1rem', padding:'10px', cursor:'pointer',
              borderBottom: tab===t ? '2px solid #00f2fe' : '2px solid transparent',
              transition:'all 0.2s', textTransform:'capitalize'
            }}>
              {t === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Title */}
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <h2 style={{ margin:0, fontSize:'1.7rem', fontWeight:'800', color:'#f1f5f9' }}>
            {tab === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ margin:'8px 0 0', color:'#64748b', fontSize:'0.87rem' }}>
            {tab === 'register'
              ? 'Register to save favorites and get priority service.'
              : 'Sign in to access your account and saved vehicles.'}
          </p>
        </div>

        {/* DB status banner */}
        {dbOnline === null && (
          <div style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px' }}>
            <span style={{ color:'#fbbf24', fontSize:'0.87rem' }}>Checking server...</span>
          </div>
        )}
        {dbOnline === false && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <span style={{ color:'#f87171', fontSize:'0.87rem' }}>Backend offline - start server first.</span>
            <button onClick={checkHealth} style={{ background:'#f87171', color:'#000', border:'none', padding:'4px 10px', borderRadius:'6px', cursor:'pointer', fontWeight:'700', fontSize:'0.75rem' }}>Retry</button>
          </div>
        )}
        {dbOnline === true && (
          <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px' }}>
            <span style={{ color:'#34d399', fontSize:'0.87rem' }}>Server and Database connected.</span>
          </div>
        )}

        {/* Message */}
        {msg.text && (
          <div style={{
            background: msg.type==='success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: msg.type==='success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
            color: msg.type==='success' ? '#34d399' : '#f87171',
            borderRadius:'10px', padding:'11px 14px', fontSize:'0.9rem', marginBottom:'16px'
          }}>
            {msg.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {tab === 'register' && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                placeholder="Your full name" style={inputStyle} autoComplete="name" required />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" style={inputStyle} autoComplete="email" required />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters" style={inputStyle}
              autoComplete={tab==='register' ? 'new-password' : 'current-password'} required />
          </div>
          <button type="submit" style={btnPrimary} disabled={loading}>
            {loading
              ? (tab==='register' ? 'Creating account…' : 'Signing in…')
              : (tab==='register' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Switch tab link */}
        <p style={{ textAlign:'center', marginTop:'20px', color:'#64748b', fontSize:'0.87rem' }}>
          {tab==='register' ? 'Already have an account? ' : "Don't have an account? "}
          <button type="button" onClick={() => switchTab(tab==='register'?'login':'register')}
            style={{ background:'none', border:'none', color:'#00f2fe', cursor:'pointer', fontWeight:'700', fontSize:'0.87rem', padding:0 }}>
            {tab==='register' ? 'Log In' : 'Register'}
          </button>
        </p>

      </div>
    </div>
  );
}