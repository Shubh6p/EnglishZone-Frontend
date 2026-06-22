import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Mail, Star, Award, MessageSquare } from 'lucide-react';
import './TeachersRoom.css';

const TeachersRoom = () => {
  const { teachers } = useContext(AppContext);

  return (
    <div className="teachers-room-wrapper fade-in">
      <div className="teachers-header-title">
        <h2 className="workspace-heading">Teachers Room Section</h2>
        <p className="workspace-subheading">Connect with English Zone faculty members for guidance and academic support</p>
      </div>

      <div className="teachers-grid">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-header-img-wrapper">
              <img src={teacher.photo} alt={teacher.name} className="teacher-photo" />
            </div>
            
            <div className="teacher-body">
              <h3 className="teacher-name">{teacher.name}</h3>
              <span className="teacher-subject-tag">{teacher.subject}</span>
              
              <div className="teacher-stats">
                <div className="t-stat">
                  <Award size={16} className="text-accent" />
                  <span>{teacher.experience} Exp</span>
                </div>
                <div className="t-stat">
                  <Star size={16} className="star-filled" />
                  <span>{teacher.rating} / 5</span>
                </div>
              </div>

              <p className="teacher-description">
                Available for doubts clearance, assignment evaluations, and specialized board exam preparation sessions.
              </p>
            </div>

            <div className="teacher-footer-action">
              <a 
                href={`mailto:${teacher.email}?subject=Student Query - English Zone Portal`}
                className="btn btn-primary w-full teacher-contact-btn"
              >
                <Mail size={16} />
                <span>Contact via Email</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersRoom;
