import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { BookOpen, Plus, FileText, Calendar, Clock, User, GraduationCap, ExternalLink, Layers } from 'lucide-react';
import './AdminAcademicControl.css';

const AdminAcademicControl = () => {
  const { ncertResources } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'curriculum', 'schedule'
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Static mock classroom details
  const classesList = [
    { id: 1, name: 'Grade 10-A', teacher: 'Mrs. Anjali Sen', room: 'Room 101', count: 35, subjects: ['English', 'Mathematics', 'Physics'] },
    { id: 2, name: 'Grade 10-B', teacher: 'Mr. Rajesh Kumar', room: 'Room 102', count: 32, subjects: ['English', 'Mathematics', 'Chemistry'] },
    { id: 3, name: 'Grade 9-A', teacher: 'Ms. Priya Sharma', room: 'Room 103', count: 30, subjects: ['English', 'Mathematics', 'Biology'] },
    { id: 4, name: 'Grade 9-B', teacher: 'Dr. S. K. Singh', room: 'Room 104', count: 28, subjects: ['English', 'Mathematics', 'Physics'] }
  ];

  // Syllabus mapping / NCERT links
  const ncertLinks = [
    { id: 1, name: 'NCERT Class X English - First Flight Book PDF', url: 'https://ncert.nic.in/textbook.php?jeec1=0-11', class: 'Grade 10' },
    { id: 2, name: 'NCERT Class X English - Footprints Without Feet PDF', url: 'https://ncert.nic.in/textbook.php?fesh1=0-9', class: 'Grade 10' },
    { id: 3, name: 'NCERT Class X Mathematics Textbook PDF', url: 'https://ncert.nic.in/textbook.php?jemh1=0-15', class: 'Grade 10' },
    { id: 4, name: 'NCERT Class X Science Textbook PDF', url: 'https://ncert.nic.in/textbook.php?jesc1=0-16', class: 'Grade 10' },
    { id: 5, name: 'NCERT Class IX English Literature PDF', url: 'https://ncert.nic.in/textbook.php?iebe1=0-11', class: 'Grade 9' }
  ];

  // Sample schedule items mapper
  const classSchedules = {
    'Grade 10-A': {
      Monday: [
        { time: '09:30 AM - 10:15 AM', subject: 'English Literature', teacher: 'Mrs. Anjali Sen', room: 'Room 101' },
        { time: '11:00 AM - 11:50 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 204' },
        { time: '01:30 PM - 02:10 PM', subject: 'Physics', teacher: 'Dr. S. K. Singh', room: 'Lab 2' }
      ],
      Tuesday: [
        { time: '09:30 AM - 10:15 AM', subject: 'English Grammar', teacher: 'Mrs. Anjali Sen', room: 'Room 101' },
        { time: '11:00 AM - 11:50 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 204' },
        { time: '01:30 PM - 02:10 PM', subject: 'Social Science', teacher: 'Dr. S. K. Singh', room: 'Room 103' }
      ]
    },
    'Grade 10-B': {
      Monday: [
        { time: '09:30 AM - 10:15 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Kumar', room: 'Room 204' },
        { time: '11:00 AM - 11:45 AM', subject: 'English Literature', teacher: 'Mrs. Anjali Sen', room: 'Room 103' },
        { time: '01:30 PM - 02:15 PM', subject: 'Chemistry', teacher: 'Ms. Priya Sharma', room: 'Lab 1' }
      ],
      Tuesday: [
        { time: '09:30 AM - 10:15 AM', subject: 'Science Practical', teacher: 'Ms. Priya Sharma', room: 'Lab 1' },
        { time: '11:00 AM - 11:45 AM', subject: 'English Grammar', teacher: 'Mrs. Anjali Sen', room: 'Room 103' }
      ]
    }
  };

  const getSchedulesForSelection = () => {
    const classSched = classSchedules[selectedClass];
    if (!classSched) return [];
    return classSched[selectedDay] || [];
  };

  return (
    <div className="academic-control-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Academic Control & Curriculum</h2>
        <p className="card-heading-sub">Audit institutional class timetables, syllabus alignment, and NCERT materials mappings</p>
      </div>

      {/* Tabs */}
      <div className="academic-tabs">
        <button 
          className={`academic-tab ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          <Layers size={16} />
          <span>Active Classrooms</span>
        </button>
        <button 
          className={`academic-tab ${activeTab === 'curriculum' ? 'active' : ''}`}
          onClick={() => setActiveTab('curriculum')}
        >
          <FileText size={16} />
          <span>NCERT Curriculum Books</span>
        </button>
        <button 
          className={`academic-tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={16} />
          <span>Master Time-Tables</span>
        </button>
      </div>

      {/* Tab: Classes */}
      {activeTab === 'classes' && (
        <div className="card">
          <div className="table-header">
            <h3 className="card-heading-title">Active Class List Directory</h3>
            <span className="profile-pill-grade" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '700' }}>
              4 Active Batches
            </span>
          </div>

          <div className="attendance-table-responsive" style={{ marginTop: '16px' }}>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Class / Section</th>
                  <th>Assigned Class Teacher</th>
                  <th>Room Designation</th>
                  <th>Total Roster Count</th>
                  <th>Core Curriculum Subjects</th>
                </tr>
              </thead>
              <tbody>
                {classesList.map((cls) => (
                  <tr key={cls.id}>
                    <td style={{ fontWeight: '700' }}>{cls.name}</td>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={14} className="text-muted" />
                        <span>{cls.teacher}</span>
                      </div>
                    </td>
                    <td>{cls.room}</td>
                    <td style={{ fontWeight: '700' }}>{cls.count} Students</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {cls.subjects.map((sub, idx) => (
                          <span key={idx} className="profile-pill-grade" style={{ fontSize: '0.7rem', margin: 0, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Curriculum */}
      {activeTab === 'curriculum' && (
        <div className="curriculum-grid">
          {/* NCERT Official Links */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
              <GraduationCap size={20} className="text-accent" />
              <h3 className="card-heading-title">NCERT Official Books Registry</h3>
            </div>

            <div className="links-list">
              {ncertLinks.map((link) => (
                <div key={link.id} className="link-item">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="profile-pill-grade" style={{ width: 'fit-content', fontSize: '0.65rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)' }}>
                      {link.class}
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{link.name}</span>
                  </div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    <ExternalLink size={12} />
                    <span>Download NCERT</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Shared Study Materials */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
              <BookOpen size={20} className="text-primary" />
              <h3 className="card-heading-title">Institutional Materials Library</h3>
            </div>

            <div className="links-list">
              {ncertResources.map((res) => (
                <div key={res.id} className="link-item">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="profile-pill-grade" style={{ width: 'fit-content', fontSize: '0.65rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                      {res.subject}
                    </span>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{res.title}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    Size: {res.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Schedules */}
      {activeTab === 'schedule' && (
        <div className="card">
          <div className="filters-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <label className="form-label" htmlFor="class-select" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Class Section</label>
                <select 
                  id="class-select" 
                  className="form-control" 
                  style={{ width: '150px', height: '36px', padding: '4px 8px', minWidth: 'auto' }}
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="day-select" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Week Day</label>
                <select 
                  id="day-select" 
                  className="form-control" 
                  style={{ width: '150px', height: '36px', padding: '4px 8px', minWidth: 'auto' }}
                  value={selectedDay} 
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Timetable Schedule for <strong>{selectedClass} ({selectedDay})</strong>
            </div>
          </div>

          <div className="attendance-table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th><Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Time Slot</th>
                  <th>Subject</th>
                  <th>Assigned Teacher</th>
                  <th>Designated Room</th>
                </tr>
              </thead>
              <tbody>
                {getSchedulesForSelection().length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No lectures scheduled for this slot. Add academic records to verify.
                    </td>
                  </tr>
                ) : (
                  getSchedulesForSelection().map((sched, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{sched.time}</td>
                      <td style={{ fontWeight: '700' }}>{sched.subject}</td>
                      <td>{sched.teacher}</td>
                      <td>
                        <span className="profile-pill-grade" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontWeight: '700' }}>
                          {sched.room}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAcademicControl;
