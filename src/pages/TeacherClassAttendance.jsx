import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { UserCheck, Users, ShieldAlert, CheckCircle2, Save } from 'lucide-react';
import './TeacherClassAttendance.css';

const TeacherClassAttendance = () => {
  const { classRoster, submitClassAttendance } = useContext(AppContext);
  const [tempRoster, setTempRoster] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // Sync with global state when component mounts
  useEffect(() => {
    setTempRoster([...classRoster]);
  }, [classRoster]);

  const handleToggle = (id) => {
    setTempRoster(prev => prev.map(student => {
      if (student.id === id) {
        return {
          ...student,
          attendance: student.attendance === 'Present' ? 'Absent' : 'Present'
        };
      }
      return student;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitClassAttendance(tempRoster);
    setShowAlert(true);
    // Dismiss alert after 4 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const totalStudents = tempRoster.length;
  const presentCount = tempRoster.filter(s => s.attendance === 'Present').length;
  const absentCount = tempRoster.filter(s => s.attendance === 'Absent').length;

  return (
    <div className="attendance-manager-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Class Attendance Manager</h2>
        <p className="card-heading-sub">Mark daily attendance for your assigned class Section</p>
      </div>

      {showAlert && (
        <div className="alert-toast">
          <CheckCircle2 size={20} />
          <span>Daily attendance roster for <strong>Grade 10-A</strong> has been successfully updated and locked in global state!</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="attendance-stats-row">
        <div className="card attendance-stat-card">
          <div className="stat-icon-circle bg-primary-light">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <h5>Total Roster</h5>
            <p>{totalStudents} Students</p>
          </div>
        </div>

        <div className="card attendance-stat-card">
          <div className="stat-icon-circle bg-success-light">
            <UserCheck size={22} />
          </div>
          <div className="stat-info">
            <h5>Present Today</h5>
            <p style={{ color: 'var(--success-color)' }}>{presentCount}</p>
          </div>
        </div>

        <div className="card attendance-stat-card">
          <div className="stat-icon-circle bg-error-light">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-info">
            <h5>Absent Today</h5>
            <p style={{ color: 'var(--error-color)' }}>{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="card attendance-table-card">
        <div className="attendance-table-header">
          <div>
            <h3 className="card-heading-title">Student Attendance Roster</h3>
            <p className="card-heading-sub" style={{ marginTop: '2px' }}>Grade 10-A Class Teacher: Mrs. Anjali Sen</p>
          </div>
          <span className="profile-pill-grade" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '700', padding: '6px 12px' }}>
            Term: 2026 Academic Session
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="attendance-table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Last Month Avg</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {tempRoster.map((student) => {
                  const isPresent = student.attendance === 'Present';
                  return (
                    <tr key={student.id}>
                      <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{student.rollNo}</td>
                      <td>
                        <div className="student-row-info">
                          <img src={student.avatar} alt={student.name} className="student-avatar" />
                          <span className="student-name">{student.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        <span style={{ color: student.previousAttendanceRate >= 75 ? 'var(--text-secondary)' : 'var(--error-color)' }}>
                          {student.previousAttendanceRate}%
                        </span>
                      </td>
                      <td>
                        <div className="toggle-switch-wrapper">
                          <span className={`switch-label ${isPresent ? 'present' : 'absent'}`}>
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                          
                          <div 
                            className={`switch-slider-track ${isPresent ? 'active' : ''}`}
                            onClick={() => handleToggle(student.id)}
                            aria-label={`Toggle attendance for ${student.name}`}
                          >
                            <div className="switch-slider-thumb"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="action-row">
            <button type="submit" className="btn btn-accent auth-btn" style={{ marginTop: 0, padding: '12px 30px' }}>
              <Save size={18} />
              <span>Submit Attendance Sheet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherClassAttendance;
