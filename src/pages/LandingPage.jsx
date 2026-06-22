import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import { Calendar, User, Phone, Mail, Award, BookOpen, Trophy, Sparkles, Send, CheckCircle, MapPin } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const { registerDemoClass } = useContext(AppContext);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', grade: 'Grade 10', date: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    registerDemoClass(demoForm);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowDemoModal(false);
      setDemoForm({ name: '', email: '', phone: '', grade: 'Grade 10', date: '' });
    }, 2200);
  };

  const achievements = [
    {
      id: 1,
      title: 'State Science Olympiad - 1st Rank',
      student: 'Arya Sen',
      class: 'Class 10',
      badge: 'Academic Gold',
      category: 'academic',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop',
      detail: 'Scored a perfect 100/100 in the State Science & Physics Olympiad 2025.'
    },
    {
      id: 2,
      title: 'Under-16 Football Champions',
      student: 'EZ Hurricanes',
      class: 'Sports Team',
      badge: 'Sports Gold',
      category: 'sports',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=150&auto=format&fit=crop',
      detail: 'Won the Inter-School Football Championship, defeating Elite Academics 3-1.'
    },
    {
      id: 3,
      title: 'National Spelling Bee - 2nd Runner Up',
      student: 'Kabir Mehta',
      class: 'Class 8',
      badge: 'Linguistic Pride',
      category: 'academic',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
      detail: 'Successfully competed against 400 contestants in the National Linguistic Championship.'
    },
    {
      id: 4,
      title: 'Inter-School Chess Championship',
      student: 'Ananya Rao',
      class: 'Class 9',
      badge: 'Chess Master',
      category: 'sports',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      detail: 'Undefeated in 7 rounds to secure the gold cup in the Inter-District chess pool.'
    }
  ];

  return (
    <div className="landing-page-wrapper">
      <Header />
      
      {/* Hero Split Section */}
      <section className="hero-section" id="about">
        <div className="hero-container-split">
          <div className="hero-left-box animate-slide-in">
            <span className="hero-pill"><Sparkles size={16} /> Best School Portal 2026</span>
            <h1 className="hero-main-title">Step into the World of Fluency & Logic</h1>
            <p className="hero-description-text">
              At <strong>English Zone</strong>, we believe education goes beyond textbooks. We craft an immersive, interactive environment where communication is natural, scientific curiosity is sparked, and young students grow into confident global citizens. Join our community of high achievers.
            </p>
            <div className="hero-features-list">
              <div className="hero-feat-item">
                <BookOpen className="feat-icon" size={18} />
                <span>Expert British & Indian Native Faculty</span>
              </div>
              <div className="hero-feat-item">
                <Trophy className="feat-icon" size={18} />
                <span>Excellent Athletic & Sports Curriculums</span>
              </div>
            </div>
          </div>
          
          <div className="hero-right-slider">
            <HeroSlider />
          </div>
        </div>

        {/* Dynamic CTA Row */}
        <div className="cta-action-row">
          <button 
            className="btn btn-accent cta-booking-btn scale-up"
            onClick={() => setShowDemoModal(true)}
          >
            <Calendar size={20} />
            <span>Book / Register for Demo Class</span>
          </button>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section" id="achievements">
        <div className="section-header">
          <span className="section-subtitle">Stellar Records</span>
          <h2 className="section-title">Proud Achievements & Hall of Fame</h2>
          <div className="title-divider"></div>
        </div>
        
        <div className="achievements-grid">
          {achievements.map((ach) => (
            <div key={ach.id} className="achievement-card">
              <div className="ach-badge-overlay">
                <span className={`badge ${ach.category === 'academic' ? 'badge-paid' : 'badge-overdue'}`}>
                  {ach.badge}
                </span>
              </div>
              <img src={ach.image} alt={ach.student} className="ach-student-img" />
              <div className="ach-card-body">
                <div className="ach-student-info">
                  <h4 className="ach-student-name">{ach.student}</h4>
                  <span className="ach-student-class">{ach.class}</span>
                </div>
                <h3 className="ach-title-text">{ach.title}</h3>
                <p className="ach-detail-text">{ach.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Demo Booking Modal */}
      {showDemoModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up">
            <button className="modal-close" onClick={() => setShowDemoModal(false)}>
              &times;
            </button>
            <h3 className="modal-heading-text">Book a Free Demo Class</h3>
            <p className="modal-subheading-text">Reserve a slot for your child to experience English Zone's interactive lectures.</p>

            {submitted ? (
              <div className="apply-success">
                <CheckCircle size={48} className="success-icon text-success" />
                <h4>Demo Seat Booked!</h4>
                <p>We've sent the session details and video link to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="apply-form">
                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <div className="input-with-icon">
                    <User className="input-field-icon" size={18} />
                    <input 
                      type="text" 
                      className="form-control auth-input" 
                      required 
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      placeholder="e.g. Kabir Sen" 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Parent Email</label>
                    <div className="input-with-icon">
                      <Mail className="input-field-icon" size={18} />
                      <input 
                        type="email" 
                        className="form-control auth-input" 
                        required 
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        placeholder="parent@example.com" 
                      />
                    </div>
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Phone Number</label>
                    <div className="input-with-icon">
                      <Phone className="input-field-icon" size={18} />
                      <input 
                        type="tel" 
                        className="form-control auth-input" 
                        required 
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        placeholder="+91 98765 43210" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Target Class / Grade</label>
                    <select 
                      className="form-control"
                      value={demoForm.grade}
                      onChange={(e) => setDemoForm({ ...demoForm, grade: e.target.value })}
                      required
                    >
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Preferred Demo Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      required
                      value={demoForm.date}
                      onChange={(e) => setDemoForm({ ...demoForm, date: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-accent w-full apply-submit-btn">
                  <Send size={16} />
                  <span>Reserve Demo Seat</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
