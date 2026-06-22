import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { GraduationCap, ArrowLeft, ShieldCheck } from 'lucide-react';
import './Auth.css';

const OTPPage = () => {
  const { signupForm, loginUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    // Basic countdown timer for OTP
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    // Only accept numeric values
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4) {
      setError('Please enter all 4 digits.');
      return;
    }
    
    // For demo purposes, any 4-digit code (or 1234) works.
    // If signupForm exists, we log them in with signup data.
    const loginTarget = signupForm ? signupForm.email : 'student@englishzone.com';
    const result = loginUser(loginTarget, 'password123');
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'OTP verification failed.');
    }
  };

  const handleResend = () => {
    setTimer(59);
    setOtp(['', '', '', '']);
    setError('');
    inputRefs[0].current.focus();
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card otp-card-width">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <GraduationCap className="logo-icon animate-pulse-slow" size={40} />
            <span className="brand-name">English Zone</span>
          </Link>
          <h2 className="auth-title">Verify OTP</h2>
          <p className="auth-subtitle">
            We have sent a verification code to your {signupForm ? 'registered contact' : 'phone number / email'}
            {signupForm && <strong className="block-contact">{signupForm.phone || signupForm.email}</strong>}
          </p>
        </div>

        {error && <div className="auth-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-input-group">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength="1"
                className="otp-box"
                value={digit}
                required
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-accent w-full auth-btn otp-submit">
            <ShieldCheck size={18} />
            <span>Verify & Continue</span>
          </button>
        </form>

        <div className="otp-timer-row">
          {timer > 0 ? (
            <p className="otp-timer-text">Resend code in <span>0:{timer < 10 ? `0${timer}` : timer}</span></p>
          ) : (
            <button className="otp-resend-btn" onClick={handleResend}>Resend OTP Code</button>
          )}
        </div>

        <div className="auth-footer">
          <Link to="/signup" className="auth-link-back">
            <ArrowLeft size={16} />
            <span>Back to Registration</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
