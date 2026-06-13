import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const initials = user
    ? user.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'Member';

  return (
    <header className="header" style={{ boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none' }}>
      {/* Brand */}
      <Link to="/" className="header-brand">
        <div className="brand-icon"></div>
        <span className="brand-name">DriveLine Motors</span>
      </Link>

      {/* Nav */}
      <nav className="header-nav">
        <NavLink to="/"          end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/inventory"     className={({ isActive }) => isActive ? 'active' : ''}>Inventory</NavLink>
        <NavLink to="/about"         className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        <NavLink to="/contact"       className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>

        {user ? (
          <div className="acct-wrap" ref={dropRef}>
            <button
              className="acct-avatar-btn"
              onClick={() => setOpen(p => !p)}
              title={`Signed in as ${user.name}`}
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

                <div className="acct-divider" />

                <div className="acct-detail-row">
                  <span className="acct-detail-label">Joined</span>
                  <span className="acct-detail-val">{joinDate}</span>
                </div>
                <div className="acct-detail-row">
                  <span className="acct-detail-label">Email</span>
                  <span className="acct-detail-val" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                </div>

                <div className="acct-divider" />

                <Link
                  to="/inventory"
                  onClick={() => setOpen(false)}
                  style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '10px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}
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
      </nav>
    </header>
  );
}
