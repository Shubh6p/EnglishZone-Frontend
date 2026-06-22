import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, Calendar, BookOpen, Clock, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
import './DashboardHome.css'; // Reuse DashboardHome styles for styling fidelity

const TeacherDashboardHome = () => {
  const { user, teacherSchedules, selectedDay, setSelectedDay } = useContext(AppContext);

  const currentSchedule = teacherSchedules[selectedDay] || [];
  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="dash-home-grid fade-in">
      {/* Top Row: Teacher Profile Card */}
      <section className="dash-card profile-summary-card">
        <div className="profile-summary-flex">
          <div className="avatar-frame-large" style={{ borderColor: 'var(--primary-color)' }}>
            <img src={user.avatar} alt={user.name} className="profile-photo-large" />
            <div className="avatar-badge" style={{ backgroundColor: 'var(--primary-color)' }}><Briefcase size={14} /></div>
          </div>
          
          <div className="profile-text-summary">
            <span className="profile-pill-grade" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
              {user.designation}
            </span>
            <h2 className="student-name-heading">{user.name}</h2>
            <p className="student-meta-item"><strong>Employee ID:</strong> {user.employeeId}</p>
            <p className="student-meta-item"><strong>Subject Specialization:</strong> {user.subject}</p>
            <p className="student-meta-item"><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
        
        <div className="profile-quick-stats">
          <div className="q-stat-item">
            <span className="q-stat-label">Employment Status</span>
            <span className="q-stat-val text-primary">Active</span>
          </div>
          <div className="q-stat-item border-l">
            <span className="q-stat-label">Class Attendance</span>
            <span className="q-stat-val text-success">Submitted</span>
          </div>
          <div className="q-stat-item border-l">
            <span className="q-stat-label">June Payroll</span>
            <span className="q-stat-val text-accent">Processing</span>
          </div>
        </div>
      </section>

      {/* Middle Row: Dynamic My Schedule */}
      <section className="dash-card schedule-calendar-card">
        <div className="schedule-header-row">
          <div>
            <h3 className="card-heading-title">My Schedule</h3>
            <p className="card-heading-sub">Displaying teaching slots for the selected day</p>
          </div>
          
          <div className="schedule-select-wrapper">
            <label htmlFor="teacherDaySelect" className="select-label-hide">Select Day</label>
            <select
              id="teacherDaySelect"
              className="form-control schedule-day-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
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
            <p>No teaching slots scheduled for {selectedDay}. Planning day!</p>
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
                  <span className="timeline-dot-accent" style={{ backgroundColor: 'var(--accent-color)' }}></span>
                  {idx < currentSchedule.length - 1 && <span className="timeline-connector-bar"></span>}
                </div>

                <div className="timeline-card-content">
                  <div className="schedule-item-info">
                    <h4 className="schedule-subject-name" style={{ color: 'var(--primary-color)' }}>{lecture.subject}</h4>
                    <span className="schedule-room-no" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                      {lecture.room}
                    </span>
                  </div>
                  <p className="schedule-teacher-name">Target: <strong>{lecture.classSection}</strong></p>
                  <p className="schedule-duration-txt">Lecture Slot: {lecture.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboardHome;
