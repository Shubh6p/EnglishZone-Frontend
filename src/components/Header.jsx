import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { GraduationCap, LogIn, LayoutDashboard } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <header className="public-header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          <GraduationCap className="logo-icon animate-pulse-slow" size={32} />
          <span className="brand-name">English Zone</span>
        </Link>
        
        <nav className="public-nav">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#achievements" className="nav-link">Achievements</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <div className="auth-btn-wrapper">
          {user ? (
            <button 
              className="btn btn-accent header-btn"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <button 
              className="btn btn-accent header-btn"
              onClick={() => navigate('/login')}
            >
              <LogIn size={18} />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
