import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import API from './api';

export default function Signin() {
  var auth = useAuth();
  var user = auth.user;
  var login = auth.login;
  var navigate = useNavigate();

  var tabState = useState('login');
  var tab = tabState[0];
  var setTab = tabState[1];

  var formState = useState({ name: '', email: '', password: '' });
  var form = formState[0];
  var setForm = formState[1];

  var msgState = useState({ text: '', type: '' });
  var msg = msgState[0];
  var setMsg = msgState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var dbOnlineState = useState(null);
  var dbOnline = dbOnlineState[0];
  var setDbOnline = dbOnlineState[1];

  var showPwState = useState(false);
  var showPw = showPwState[0];
  var setShowPw = showPwState[1];

  useEffect(function () {
    if (user) navigate('/');
  }, [user, navigate]);

  var checkHealth = useCallback(async function () {
    setDbOnline(null);
    try {
      var res = await fetch(`${API}/health`);
      var data = await res.json();
      if (data.dbConnected === true) {
        setDbOnline(true);
      } else {
        setDbOnline(false);
      }
    } catch (e) {
      setDbOnline(false);
    }
  }, [setDbOnline]);

  useEffect(function () {
    checkHealth();
  }, [checkHealth]);

  function handleChange(e) {
    var newForm = { name: form.name, email: form.email, password: form.password };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
    setMsg({ text: '', type: '' });
  }

  function switchTab(t) {
    setTab(t);
    setForm({ name: '', email: '', password: '' });
    setMsg({ text: '', type: '' });
  }

  async function handleRegister() {
    if (form.name.trim().length < 2) return setMsg({ text: 'Name must be at least 2 characters.', type: 'error' });
    if (!form.email.includes('@')) return setMsg({ text: 'Enter a valid email address.', type: 'error' });
    if (form.password.length < 6) return setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });

    setLoading(true);
    try {
      var res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      });
      var data = await res.json();
      if (data.success) {
        login({ name: data.user.name, email: data.user.email, createdAt: new Date().toISOString() });
        setMsg({ text: 'Welcome, ' + data.user.name + '! Redirecting...', type: 'success' });
        setTimeout(function () { navigate('/'); }, 1200);
      } else {
        setMsg({ text: data.message || 'Registration failed.', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Cannot reach server. Make sure the backend is running.', type: 'error' });
      setDbOnline(false);
    }
    setLoading(false);
  }

  async function handleLogin() {
    if (!form.email.includes('@')) return setMsg({ text: 'Enter a valid email address.', type: 'error' });
    if (form.password.length < 6) return setMsg({ text: 'Password must be at least 6 characters.', type: 'error' });

    setLoading(true);
    try {
      var res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password })
      });
      var data = await res.json();
      if (data.success) {
        login({ name: data.user.name, email: data.user.email, createdAt: data.user.createdAt || new Date().toISOString() });
        setMsg({ text: 'Welcome back, ' + data.user.name + '!', type: 'success' });
        setTimeout(function () { navigate('/'); }, 1200);
      } else {
        setMsg({ text: data.message || 'Login failed.', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Cannot reach server. Make sure the backend is running.', type: 'error' });
      setDbOnline(false);
    }
    setLoading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (tab === 'register') {
      handleRegister();
    } else {
      handleLogin();
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-card">

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            display: 'inline-block'
          }}></div>
          <div style={{ fontWeight: '800', fontSize: '1rem', color: '#94a3b8' }}>
            DriveLine Motors
          </div>
        </div>

        <div className="signin-tabs">
          <button
            className={'signin-tab' + (tab === 'login' ? ' active' : '')}
            onClick={function () { switchTab('login'); }}
          >
            Log In
          </button>
          <button
            className={'signin-tab' + (tab === 'register' ? ' active' : '')}
            onClick={function () { switchTab('register'); }}
          >
            Register
          </button>
        </div>

        <h2 className="signin-title">
          {tab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="signin-subtitle">
          {tab === 'login'
            ? 'Sign in to access your account and saved vehicles.'
            : 'Join DriveLine to save favourites and get priority service.'}
        </p>

        {dbOnline === null && (
          <div className="status-banner checking">Checking server connection...</div>
        )}
        {dbOnline === false && (
          <div className="status-banner offline">
            <span>Backend offline - start server first.</span>
            <button className="retry-btn" onClick={checkHealth}>Retry</button>
          </div>
        )}
        {dbOnline === true && (
          <div className="status-banner online">Server & database connected</div>
        )}

        {msg.text && (
          <div className={'form-msg ' + msg.type} style={{ marginBottom: '18px' }}>
            {msg.text}
          </div>
        )}

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
              <button type="button"
                onClick={function () { setShowPw(function (p) { return !p; }); }}
                style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </label>
            <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
              onChange={handleChange} placeholder="Min. 6 characters" className="form-input"
              autoComplete={tab === 'register' ? 'new-password' : 'current-password'} required />
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading
              ? (tab === 'register' ? 'Creating account...' : 'Signing in...')
              : (tab === 'register' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="signin-switch">
          {tab === 'register' ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={function () { switchTab(tab === 'register' ? 'login' : 'register'); }}>
            {tab === 'register' ? 'Log In' : 'Register'}
          </button>
        </div>

      </div>
    </div>
  );
}
