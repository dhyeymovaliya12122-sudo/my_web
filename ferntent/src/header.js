import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function Header() {
  var auth = useAuth();
  var user = auth.user;
  var logout = auth.logout;

  var openState = useState(false);
  var open = openState[0];
  var setOpen = openState[1];

  var scrolledState = useState(false);
  var scrolled = scrolledState[0];
  var setScrolled = scrolledState[1];

  var dropRef = useRef(null);
  var navigate = useNavigate();

  useEffect(function() {
    function onScroll() {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener('scroll', onScroll);
    return function() {
      window.removeEventListener('scroll', onScroll);
    };
  }, [setScrolled]);

  useEffect(function() {
    function onClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return function() {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [setOpen]);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  var initials = '';
  if (user) {
    var words = user.name.trim().split(' ');
    for (var i = 0; i < words.length; i++) {
      initials += words[i][0];
    }
    initials = initials.toUpperCase().slice(0, 2);
  }

  var joinDate = 'Member';
  if (user && user.createdAt) {
    joinDate = new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
  }

  return (
    <div className="header" style={{ boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none' }}>
      <Link to="/" className="header-brand">
        <div className="brand-icon"></div>
        <span className="brand-name">DriveLine Motors</span>
      </Link>

      <div className="header-nav">
        <NavLink to="/" end className={function(p) { return p.isActive ? 'active' : ''; }}>Home</NavLink>
        <NavLink to="/inventory" className={function(p) { return p.isActive ? 'active' : ''; }}>Inventory</NavLink>
        <NavLink to="/about" className={function(p) { return p.isActive ? 'active' : ''; }}>About</NavLink>
        <NavLink to="/contact" className={function(p) { return p.isActive ? 'active' : ''; }}>Contact</NavLink>

        {user ? (
          <div className="acct-wrap" ref={dropRef}>
            <button
              className="acct-avatar-btn"
              onClick={function() { setOpen(function(p) { return !p; }); }}
              title={'Signed in as ' + user.name}
              aria-label="Account menu"
            >
              {initials}
            </button>

            {open && (
              <div className="acct-dropdown" role="menu">
                <div className="acct-info">
                  <div className="acct-avatar-lg">{initials}</div>
                  <div>
                    <div className="acct-name">{user.name}</div>
                    <div className="acct-email">{user.email}</div>
                  </div>
                </div>

                <div className="acct-divider"></div>

                <div className="acct-detail-row">
                  <span className="acct-detail-label">Joined</span>
                  <span className="acct-detail-val">{joinDate}</span>
                </div>
                <div className="acct-detail-row">
                  <span className="acct-detail-label">Email</span>
                  <span className="acct-detail-val" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                </div>

                <div className="acct-divider"></div>

                <Link
                  to="/inventory"
                  onClick={function() { setOpen(false); }}
                  style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}
                >
                  Browse Inventory
                </Link>

                <button className="acct-signout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="nav-signin">Sign In</Link>
        )}
      </div>
    </div>
  );
}
