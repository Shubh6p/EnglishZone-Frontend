import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { User, Calendar, Phone, Mail, ArrowRight, GraduationCap } from 'lucide-react';
import './Auth.css';

const SignUpPage = () => {
  const { signupUser } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    email: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dob || !formData.phone || !formData.email) {
      setError('Please fill in all fields.');
      return;
    }
    signupUser(formData);
    navigate('/otp');
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <GraduationCap className="logo-icon animate-pulse-slow" size={40} />
            <span className="brand-name">English Zone</span>
          </Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Register for the Student Portal and start learning</p>
        </div>
        
        {error && <div className="auth-error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div className="input-with-icon">
              <User className="input-field-icon" size={18} />
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Rohan Sharma"
                className="form-control auth-input"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="dob">Date of Birth</label>
            <div className="input-with-icon">
              <Calendar className="input-field-icon" size={18} />
              <input
                id="dob"
                name="dob"
                type="date"
                className="form-control auth-input"
                required
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <div className="input-with-icon">
              <Phone className="input-field-icon" size={18} />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="form-control auth-input"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-field-icon" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="student@englishzone.com"
                className="form-control auth-input"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-accent w-full auth-btn">
            <span>Proceed to OTP</span>
            <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
