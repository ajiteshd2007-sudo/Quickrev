import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => (location.pathname === path ? 'active' : '');
  const close = () => setNavOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="QuickRev Logo" style={{ height: '34px', width: '34px', borderRadius: '8px' }} />
          <span>Quick</span>Rev
        </Link>
        <button
          type="button"
          className={`nav-toggle ${navOpen ? 'is-active' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
        <nav className={`main-nav ${navOpen ? 'nav-open' : ''}`}>
          <Link to="/#features" onClick={close}>Features</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={close}>Dashboard</Link>
              <Link to="/topics" className={isActive('/topics')} onClick={close}>My Topics</Link>
              <Link to="/friends" className={isActive('/friends')} onClick={close}>Friends</Link>
              <a
                href="#"
                className="btn btn-outline"
                onClick={(e) => { e.preventDefault(); logout(); close(); navigate('/'); }}
              >
                Log Out
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')} onClick={close}>Log In</Link>
              <Link to="/register" className="btn btn-primary" onClick={close}>Sign Up Free</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
