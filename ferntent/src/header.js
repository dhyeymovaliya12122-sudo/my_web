import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen]   = useState(false);
  const dropRef           = useRef(null);
  const navigate          = useNavigate();

  // Close dropdown when clicking anywhere outside it
  useEffect(() => {
    function onClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  // Build initials from user's name (e.g. "Dhyey Movaliya" → "DM")
  const initials = user
    ? user.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  // Format join date
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'Member';

  return (
    <header className="header">
      <div className="brand">DriveLine Motors</div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {user ? (
          /* ── Logged-in: show avatar + dropdown ── */
          <div className="acct-wrap" ref={dropRef}>
            <button
              className="acct-avatar-btn"
              onClick={() => setOpen(prev => !prev)}
              title={`Signed in as ${user.name}`}
              aria-label="Account menu"
            >
              {initials}
            </button>

            {open && (
              <div className="acct-dropdown" role="menu">
                {/* User info header */}
                <div className="acct-info">
                  <div className="acct-avatar-lg">{initials}</div>
                  <div className="acct-text">
                    <span className="acct-name">{user.name}</span>
                    <span className="acct-email">{user.email}</span>
                  </div>
                </div>

                <div className="acct-divider" />

                {/* Details */}
                <div className="acct-detail-row">
                  <span className="acct-detail-label">Joined</span>
                  <span className="acct-detail-val">{joinDate}</span>
                </div>
                <div className="acct-detail-row">
                  <span className="acct-detail-label">Email</span>
                  <span className="acct-detail-val">{user.email}</span>
                </div>

                <div className="acct-divider" />

                <button className="acct-signout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Logged-out: show Sign In link ── */
          <Link to="/signin" className="signin-nav-link">Customer Sign In</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
