import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { GraduationCap, Mail, Lock, LogIn, ArrowRight, User, Users, ShieldCheck } from 'lucide-react';
import './Auth.css';

const LoginPage = () => {
  const { loginUser, mockCredentials, mockTeacherCredentials, mockAdminCredentials } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('student'); // 'student', 'teacher', or 'admin'
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    const result = loginUser(emailOrPhone, password);
    if (result.success) {
      const savedUser = localStorage.getItem('ez_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      if (parsedUser && parsedUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (parsedUser && parsedUser.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const handleQuickLogin = () => {
    let creds = mockCredentials;
    if (activeTab === 'teacher') creds = mockTeacherCredentials;
    if (activeTab === 'admin') creds = mockAdminCredentials;
    
    setEmailOrPhone(creds.email);
    setPassword(creds.password);
    setError('');
    
    // Slight timeout for visual feedback of typing, then log in
    setTimeout(() => {
      const result = loginUser(creds.email, creds.password);
      if (result.success) {
        if (activeTab === 'admin') {
          navigate('/admin-dashboard');
        } else if (activeTab === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    }, 450);
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
            {activeTab === 'student' && 'Student Login'}
            {activeTab === 'teacher' && 'Teacher Portal Login'}
            {activeTab === 'admin' && 'Admin Command Center'}
          </h2>
          <p className="auth-subtitle">
            {activeTab === 'student' && 'Log in to access your dashboard, lectures, and fees'}
            {activeTab === 'teacher' && 'Log in to access your schedule, class gradebook, and payroll'}
            {activeTab === 'admin' && 'Log in with Master ID to manage institutions, users, and billing'}
          </p>
        </div>

        {/* Role tabs */}
        <div className="role-tabs">
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => { setActiveTab('student'); setEmailOrPhone(''); setPassword(''); setError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <User size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Student
          </button>
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => { setActiveTab('teacher'); setEmailOrPhone(''); setPassword(''); setError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <Users size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Teacher
          </button>
          <button 
            type="button" 
            className={`role-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('admin'); setEmailOrPhone(''); setPassword(''); setError(''); }}
            style={{ fontSize: '0.8rem', padding: '8px' }}
          >
            <ShieldCheck size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Admin
          </button>
        </div>

        {error && <div className="auth-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="emailOrPhone">Email or Master ID</label>
            <div className="input-with-icon">
              <Mail className="input-field-icon" size={18} />
              <input
                id="emailOrPhone"
                type="text"
                placeholder={
                  activeTab === 'student' 
                    ? 'student@englishzone.com' 
                    : activeTab === 'teacher' 
                      ? 'teacher@englishzone.com' 
                      : 'admin@englishzone.com'
                }
                className="form-control auth-input"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
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

          <button type="submit" className="btn btn-accent w-full auth-btn">
            <LogIn size={18} />
            <span>Login Portal</span>
          </button>
        </form>

        <div className="demo-credentials-box">
          <p className="demo-title">Quick Demo Login</p>
          <p className="demo-info">
            Use the button below to auto-fill mock {activeTab} credentials and log in instantly.
          </p>
          <button 
            type="button" 
            className="btn btn-outline w-full demo-login-btn"
            onClick={handleQuickLogin}
          >
            <span>Autofill & Login</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
