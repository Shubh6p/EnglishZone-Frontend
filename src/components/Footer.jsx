import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Briefcase, GraduationCap, X, FileText } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', subject: '', exp: '', cover: '' });
  const [applied, setApplied] = useState(false);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setShowApplyModal(false);
      setApplyForm({ name: '', email: '', subject: '', exp: '', cover: '' });
    }, 2000);
  };

  return (
    <footer className="public-footer" id="contact">
      <div className="footer-container">
        {/* Column 1: Founder Info */}
        <div className="footer-column founder-info">
          <h3 className="footer-title">Founder's Message</h3>
          <div className="founder-card">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" 
              alt="Dr. Evelyn Parker" 
              className="founder-img" 
            />
            <div>
              <h4 className="founder-name">Dr. Evelyn Parker</h4>
              <p className="founder-title-text">Ph.D. in Linguistics, Founder</p>
            </div>
          </div>
          <p className="founder-bio">
            "English Zone was founded with a singular vision: to empower young minds with fluent English communication, critical thinking, and character to lead globally."
          </p>
        </div>

        {/* Column 2: Contact Info & Map Link */}
        <div className="footer-column contact-info">
          <h3 className="footer-title">Contact & Location</h3>
          <ul className="contact-list">
            <li className="contact-item">
              <MapPin className="contact-icon text-accent" size={18} />
              <span>102, Royal Plaza, Sector 15, HSR Layout, Bengaluru, Karnataka - 560102</span>
            </li>
            <li className="contact-item">
              <Phone className="contact-icon text-accent" size={18} />
              <span>+91 98765 43210 / +91 80 4567 8900</span>
            </li>
            <li className="contact-item">
              <Mail className="contact-icon text-accent" size={18} />
              <span>admissions@englishzone.edu</span>
            </li>
          </ul>
          
          <div className="map-link-container">
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="map-iframe-mock"
            >
              <div className="map-placeholder">
                <MapPin className="map-pin-pulse" size={24} />
                <span>View Google Map Location</span>
              </div>
            </a>
          </div>
        </div>

        {/* Column 3: Work With Us */}
        <div className="footer-column work-portal">
          <h3 className="footer-title">Join Our Team</h3>
          <p className="work-desc">
            We are always looking for passionate, certified educators who want to shape the future of learning.
          </p>
          <button 
            className="btn btn-accent work-btn"
            onClick={() => setShowApplyModal(true)}
          >
            <Briefcase size={16} />
            <span>Work With Us (Teacher Portal)</span>
          </button>
          <div className="footer-logo-row">
            <GraduationCap className="footer-logo-cap" size={24} />
            <span className="footer-logo-text">English Zone &copy; 2026</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Designed for Academic Excellence. All Rights Reserved.</p>
      </div>

      {/* Teacher Application Modal */}
      {showApplyModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up">
            <button className="modal-close" onClick={() => setShowApplyModal(false)}>
              <X size={24} />
            </button>
            <h3 className="modal-heading-text">Teacher Application Portal</h3>
            <p className="modal-subheading-text">Submit your details to join English Zone faculty.</p>
            
            {applied ? (
              <div className="apply-success">
                <GraduationCap size={48} className="success-icon text-success animate-pulse-slow" />
                <h4>Application Submitted!</h4>
                <p>Thank you for applying. Our HR team will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="apply-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    placeholder="e.g. Sarah Connor" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    required 
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    placeholder="sarah.connor@example.com" 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Subject of Expertise</label>
                    <select 
                      className="form-control"
                      value={applyForm.subject}
                      onChange={(e) => setApplyForm({ ...applyForm, subject: e.target.value })}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="English Literature">English Literature</option>
                      <option value="English Grammar">English Grammar</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry & Biology">Chemistry & Biology</option>
                    </select>
                  </div>
                  <div className="form-group width-35">
                    <label className="form-label">Experience (Years)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      min="0"
                      value={applyForm.exp}
                      onChange={(e) => setApplyForm({ ...applyForm, exp: e.target.value })}
                      placeholder="e.g. 5" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Note / Bio Summary</label>
                  <textarea 
                    className="form-control text-area-resize" 
                    rows="3" 
                    value={applyForm.cover}
                    onChange={(e) => setApplyForm({ ...applyForm, cover: e.target.value })}
                    placeholder="Tell us briefly about your teaching philosophy..."
                  ></textarea>
                </div>
                
                <div className="resume-upload-mock">
                  <FileText className="text-muted" size={24} />
                  <div>
                    <p className="resume-heading">Upload CV/Resume</p>
                    <p className="resume-sub">PDF, DOCX formats (Max 5MB)</p>
                  </div>
                  <input type="file" className="file-input-hidden" id="resume" disabled />
                  <label htmlFor="resume" className="btn btn-outline cv-btn-mock">Browse</label>
                </div>

                <button type="submit" className="btn btn-accent w-full apply-submit-btn">
                  <Send size={16} />
                  <span>Submit Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
