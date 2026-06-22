import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, Calendar, BookOpen, Clock, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = () => {
  const { user, weekdaySchedules, selectedDay, setSelectedDay } = useContext(AppContext);

  // Radial Circle calculations
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const attendanceVal = user ? user.attendance : 0;
  const strokeDashoffset = circumference - (attendanceVal / 100) * circumference;

  const currentSchedule = weekdaySchedules[selectedDay] || [];

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="dash-home-grid fade-in">
      {/* Top Card: Student Profile Frame */}
      <section className="dash-card profile-summary-card">
        <div className="profile-summary-flex">
          <div className="avatar-frame-large">
            <img src={user.avatar} alt={user.name} className="profile-photo-large" />
            <div className="avatar-badge"><UserCheck size={14} /></div>
          </div>
          
          <div className="profile-text-summary">
            <span className="profile-pill-grade">{user.grade}</span>
            <h2 className="student-name-heading">{user.name}</h2>
            <p className="student-meta-item"><strong>Roll Number:</strong> {user.rollNo}</p>
            <p className="student-meta-item"><strong>Email:</strong> {user.email}</p>
            <p className="student-meta-item"><strong>Admitted On:</strong> Aug 12, 2024</p>
          </div>
        </div>
        
        <div className="profile-quick-stats">
          <div className="q-stat-item">
            <span className="q-stat-label">Academic Status</span>
            <span className="q-stat-val text-primary">Active</span>
          </div>
          <div className="q-stat-item border-l">
            <span className="q-stat-label">Term Syllabus</span>
            <span className="q-stat-val">82% Clear</span>
          </div>
          <div className="q-stat-item border-l">
            <span className="q-stat-label">Pending Dues</span>
            <span className="q-stat-val text-accent">INV-2026-001</span>
          </div>
        </div>
      </section>

      {/* Middle Card: Visual Attendance Meter */}
      <section className="dash-card attendance-meter-card">
        <h3 className="card-heading-title">Attendance Tracker</h3>
        
        <div className="attendance-flex-container">
          <div className="radial-progress-svg-wrapper">
            <svg className="radial-svg" width="140" height="140">
              {/* Background Circle */}
              <circle
                className="radial-bg-circle"
                cx="70"
                cy="70"
                r={radius}
                strokeWidth={strokeWidth}
              />
              {/* Progress Circle */}
              <circle
                className="radial-progress-circle"
                cx="70"
                cy="70"
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="radial-percentage-overlay">
              <span className="radial-percentage-text">{attendanceVal}%</span>
              <span className="radial-sub-label">Present</span>
            </div>
          </div>

          <div className="attendance-details-text">
            <h4 className="attendance-status-heading">
              {attendanceVal >= 75 ? (
                <span className="text-success flex-align-center gap-6"><ShieldCheck size={18} /> Attendance Compliant</span>
              ) : (
                <span className="text-error">Attention Required</span>
              )}
            </h4>
            <p className="attendance-summary-para">
              Your overall attendance is currently at <strong>{attendanceVal}%</strong>. The minimum required attendance to sit for board-pattern examinations is <strong>75.0%</strong>.
            </p>
            <div className="attendance-bar-legend">
              <div className="legend-item"><span className="legend-dot bg-primary"></span> Present days: 105</div>
              <div className="legend-item"><span className="legend-dot bg-muted"></span> Total working days: 120</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Card: Dynamic Lecture Schedule */}
      <section className="dash-card schedule-calendar-card">
        <div className="schedule-header-row">
          <div>
            <h3 className="card-heading-title">Lectures & Schedule</h3>
            <p className="card-heading-sub">Displaying calendar day classes</p>
          </div>
          
          <div className="schedule-select-wrapper">
            <label htmlFor="daySelect" className="select-label-hide">Select Day</label>
            <select
              id="daySelect"
              className="form-control schedule-day-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {daysList.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        {currentSchedule.length === 0 ? (
          <div className="no-lectures-scheduled">
            <Calendar className="text-muted" size={40} />
            <p>No lectures scheduled for {selectedDay}. Rest day!</p>
          </div>
        ) : (
          <div className="schedule-timeline-list">
            {currentSchedule.map((lecture, idx) => (
              <div key={lecture.id} className="timeline-schedule-item">
                <div className="timeline-hour-badge">
                  <Clock size={14} className="text-muted" />
                  <span>{lecture.time.split(' - ')[0]}</span>
                </div>
                
                <div className="timeline-indicator-line">
                  <span className="timeline-dot-accent"></span>
                  {idx < currentSchedule.length - 1 && <span className="timeline-connector-bar"></span>}
                </div>

                <div className="timeline-card-content">
                  <div className="schedule-item-info">
                    <h4 className="schedule-subject-name">{lecture.subject}</h4>
                    <span className="schedule-room-no">{lecture.room}</span>
                  </div>
                  <p className="schedule-teacher-name">Faculty: <strong>{lecture.teacher}</strong></p>
                  <p className="schedule-duration-txt">Session Duration: {lecture.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardHome;
