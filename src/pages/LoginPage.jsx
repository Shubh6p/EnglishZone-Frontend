import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { GraduationCap, Mail, Lock, LogIn, ArrowRight, User, Users, ShieldCheck, Loader2 } from 'lucide-react';
import './Auth.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const { request, loading, error: apiError } = useApi();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('STUDENT'); // 'STUDENT', 'TEACHER', 'ADMIN', or 'SUPERADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const error = validationError || apiError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }
    
    try {
      const result = await request('/auth/login', 'POST', {
        email,
        password,
        role: activeTab
      });

      if (result.token && result.user) {
        login(result.user, result.token);
        
        if (result.user.role === 'SUPERADMIN') {
          navigate('/superadmin-dashboard');
        } else if (result.user.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (result.user.role === 'TEACHER') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Error is handled by useApi and displayed via apiError
    }
  };

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const handleQuickLogin = () => {
    // This is only for development/demo
    setEmail(
      activeTab === 'STUDENT' ? 'student@englishzone.com' :
      activeTab === 'TEACHER' ? 'teacher@englishzone.com' :
      activeTab === 'SUPERADMIN' ? 'superadmin@englishzone.com' : 'admin@englishzone.com'
    );
    setPassword('password123');
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <GraduationCap className="logo-icon animate-pulse-slow" size={40} />
            <span className="brand-name">English Zone</span>
          </Link>
          <h2 className="auth-title">
            {activeTab === 'STUDENT' && 'Student Login'}
            {activeTab === 'TEACHER' && 'Teacher Portal Login'}
            {activeTab === 'ADMIN' && 'Admin Command Center'}
            {activeTab === 'SUPERADMIN' && 'Superadmin Interface'}
          </h2>
          <p className="auth-subtitle">
            {activeTab === 'STUDENT' && 'Log in to access your dashboard, lectures, and fees'}
            {activeTab === 'TEACHER' && 'Log in to access your schedule, class gradebook, and payroll'}
            {activeTab === 'ADMIN' && 'Log in with Master ID to manage institutions, users, and billing'}
            {activeTab === 'SUPERADMIN' && 'Log in to manage system configurations and audit logs'}
          </p>
        </div>

        {/* Role tabs */}
        <div className="role-tabs">
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'STUDENT' ? 'active' : ''}`}
            onClick={() => { setActiveTab('STUDENT'); setEmail(''); setPassword(''); setValidationError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <User size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Student
          </button>
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'TEACHER' ? 'active' : ''}`}
            onClick={() => { setActiveTab('TEACHER'); setEmail(''); setPassword(''); setValidationError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <Users size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Teacher
          </button>
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'ADMIN' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ADMIN'); setEmail(''); setPassword(''); setValidationError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <ShieldCheck size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Admin
          </button>
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'SUPERADMIN' ? 'active' : ''}`}
            onClick={() => { setActiveTab('SUPERADMIN'); setEmail(''); setPassword(''); setValidationError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <ShieldCheck size={12} style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--accent-color)' }} />
            Superadmin
          </button>
        </div>

        {error && <div className="auth-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail className="input-field-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder={
                  activeTab === 'STUDENT' 
                    ? 'student@englishzone.com' 
                    : activeTab === 'TEACHER' 
                      ? 'teacher@englishzone.com' 
                      : activeTab === 'SUPERADMIN'
                        ? 'superadmin@englishzone.com'
                        : 'admin@englishzone.com'
                }
                className="form-control auth-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-field-icon" size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="form-control auth-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-forgot-password" style={{ textAlign: 'right', marginBottom: '15px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-accent w-full auth-btn" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            <span>{loading ? 'Logging in...' : 'Login Portal'}</span>
          </button>
        </form>

        {isDemoMode && (
          <div className="demo-credentials-box">
            <p className="demo-title">Quick Demo Login</p>
            <p className="demo-info">
              Use the button below to auto-fill mock {activeTab} credentials.
            </p>
            <button 
              type="button" 
              className="btn btn-outline w-full demo-login-btn"
              onClick={handleQuickLogin}
            >
              <span>Autofill Credentials</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
