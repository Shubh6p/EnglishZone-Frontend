import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { UserCheck, Users, ShieldAlert, CheckCircle2, Save, Loader2 } from 'lucide-react';
import './TeacherClassAttendance.css';

const TeacherClassAttendance = () => {
  const { request, loading } = useApi();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [tempRoster, setTempRoster] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // Sync with global state when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [students, classList] = await Promise.all([
        request('/users', 'GET'),
        request('/academics/classes', 'GET')
      ]);

      // Filter only students for the roster
      const studentUsers = students.filter(u => u.role === 'STUDENT');
      
      const roster = studentUsers.map(student => ({
        id: student._id,
        rollNo: student._id.substring(student._id.length - 4).toUpperCase(), // Mock roll number
        name: student.fullName,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.fullName) + '&background=random',
        previousAttendanceRate: 85, // Mock previous rate
        attendance: 'Present' // Default
      }));
      
      setTempRoster(roster);
      setClasses(classList);
      if (classList.length > 0) setSelectedClassId(classList[0]._id);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId) return;

    try {
      const records = tempRoster.map(s => ({
        studentId: s.id,
        status: s.attendance
      }));

      await request('/attendance', 'POST', {
        classId: selectedClassId,
        date: new Date().toISOString(),
        records
      });

      setShowAlert(true);
      // Dismiss alert after 4 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to submit attendance', err);
    }
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
        <div className="alert-toast" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-color)', border: '1px solid var(--success-color)' }}>
          <CheckCircle2 size={20} />
          <span>Daily attendance roster updated! Automated SMS alerts dispatched to absent students' parents.</span>
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
            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Target Class:</label>
              <select 
                className="form-control" 
                style={{ padding: '4px 8px', width: '200px' }}
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>
          <span className="profile-pill-grade" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '700', padding: '6px 12px' }}>
            Term: 2026 Academic Session
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin text-primary" size={32} style={{ margin: '0 auto' }}/>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TeacherClassAttendance;
