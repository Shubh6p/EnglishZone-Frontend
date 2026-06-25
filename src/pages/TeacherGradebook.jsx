import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Award, GraduationCap, Percent, BookOpen, Loader2, Save, CheckCircle2 } from 'lucide-react';
import './TeacherGradebook.css';

const TeacherGradebook = () => {
  const { request, loading } = useApi();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('English Literature');
  const [selectedExam, setSelectedExam] = useState('Unit Test II');
  
  const [classRoster, setClassRoster] = useState([]);
  const [examGrades, setExamGrades] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const fetchClassesAndRoster = async () => {
    try {
      const [classList, students] = await Promise.all([
        request('/academics/classes', 'GET'),
        request('/users', 'GET')
      ]);
      setClasses(classList);
      if (classList.length > 0) {
        setSelectedClassId(classList[0]._id);
      }
      
      const studentUsers = students.filter(u => u.role === 'STUDENT').map(student => ({
        id: student._id,
        rollNo: student._id.substring(student._id.length - 4).toUpperCase(),
        name: student.fullName,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.fullName) + '&background=random'
      }));
      setClassRoster(studentUsers);
    } catch (err) {
      console.error('Failed to fetch initial data', err);
    }
  };

  const fetchGrades = async () => {
    if (!selectedClassId) return;
    try {
      const grades = await request(`/grades?classId=${selectedClassId}&subject=${encodeURIComponent(selectedSubject)}&examName=${encodeURIComponent(selectedExam)}`, 'GET');
      const gradesMap = {};
      grades.forEach(g => {
        gradesMap[g.studentId._id] = g.score;
      });
      setExamGrades(gradesMap);
    } catch (err) {
      console.error('Failed to fetch grades', err);
    }
  };

  useEffect(() => {
    fetchClassesAndRoster();
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [selectedClassId, selectedSubject, selectedExam]);

  // Handle grade text input changes
  const handleGradeChange = (studentId, val) => {
    const numericVal = val === '' ? '' : parseInt(val, 10);
    if (val === '' || (!isNaN(numericVal) && numericVal >= 0 && numericVal <= 100)) {
      setExamGrades(prev => ({ ...prev, [studentId]: numericVal }));
    }
  };

  const handleSubmitGrades = async () => {
    try {
      const gradesArray = Object.keys(examGrades)
        .filter(studentId => examGrades[studentId] !== '')
        .map(studentId => ({
          studentId,
          score: examGrades[studentId]
        }));

      await request('/grades/bulk', 'POST', {
        classId: selectedClassId,
        subject: selectedSubject,
        examName: selectedExam,
        grades: gradesArray
      });

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error('Failed to save grades', err);
    }
  };

  // Real-time calculations
  const numericGrades = Object.values(examGrades).filter(val => val !== '');
  const totalStudents = classRoster.length;
  
  const classSum = numericGrades.reduce((sum, score) => sum + score, 0);
  const classAverage = numericGrades.length > 0 ? (classSum / numericGrades.length).toFixed(1) : '0.0';
  
  const highestScore = numericGrades.length > 0 ? Math.max(...numericGrades) : 0;
  
  const passingStudents = numericGrades.filter(score => score >= 50).length;
  const passingRate = numericGrades.length > 0 ? ((passingStudents / numericGrades.length) * 100).toFixed(0) : '0';

  return (
    <div className="gradebook-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Class Gradebook & Analytics</h2>
        <p className="card-heading-sub">Log student marks and evaluate instant performance metrics</p>
      </div>

      {showAlert && (
        <div className="alert-toast" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-color)', border: '1px solid var(--success-color)' }}>
          <CheckCircle2 size={20} />
          <span>Grades securely saved to the database!</span>
        </div>
      )}

      {/* Selectors card */}
      <div className="gradebook-selectors-row">
        <div className="selector-item">
          <label className="form-label" style={{ fontWeight: '700' }}>Class Section</label>
          <select
            className="gradebook-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className="selector-item">
          <label className="form-label" style={{ fontWeight: '700' }}>Subject Specialization</label>
          <select
            className="gradebook-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="English Literature">English Literature</option>
            <option value="English Grammar">English Grammar</option>
            <option value="Creative Writing">Creative Writing</option>
          </select>
        </div>

        <div className="selector-item">
          <label className="form-label" style={{ fontWeight: '700' }}>Exam / Test Cycle</label>
          <select
            className="gradebook-select"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="Unit Test I">Unit Test I</option>
            <option value="Unit Test II">Unit Test II</option>
            <option value="First Term">First Term (Board-Pattern)</option>
          </select>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="analytics-stats-grid">
        <div className="stat-card-premium primary-highlight">
          <span className="stat-premium-label">Class Average Grade</span>
          <span className="stat-premium-val" style={{ color: 'var(--primary-color)' }}>{classAverage} / 100</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Current class average score
          </span>
        </div>

        <div className="stat-card-premium accent-highlight">
          <span className="stat-premium-label">Highest Score Recorded</span>
          <span className="stat-premium-val" style={{ color: 'var(--accent-color)' }}>{highestScore} / 100</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Top student result in this cycle
          </span>
        </div>

        <div className="stat-card-premium success-highlight">
          <span className="stat-premium-label">Class Passing Rate</span>
          <span className="stat-premium-val" style={{ color: 'var(--success-color)' }}>{passingRate}%</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Students scoring &ge; 50% marks
          </span>
        </div>
      </div>

      {/* Input Matrix Card */}
      <div className="card attendance-table-card">
        <div className="attendance-table-header">
          <div>
            <h3 className="card-heading-title">Grades Input Grid</h3>
            <p className="card-heading-sub" style={{ marginTop: '2px' }}>Input marks directly into the grid</p>
          </div>
          <button 
            className="btn btn-accent auth-btn" 
            style={{ width: 'auto', margin: 0 }}
            onClick={handleSubmitGrades}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save to Database</span>
          </button>
        </div>

        <div className="attendance-table-responsive">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Subject Roster</th>
                <th style={{ textAlign: 'center' }}>Numerical Grade (0-100)</th>
              </tr>
            </thead>
            <tbody>
              {classRoster.map((student) => {
                const score = examGrades[student.id] !== undefined ? examGrades[student.id] : '';
                return (
                  <tr key={student.id}>
                    <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{student.rollNo}</td>
                    <td>
                      <div className="student-row-info">
                        <img src={student.avatar} alt={student.name} className="student-avatar" />
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        {selectedSubject}
                      </span>
                    </td>
                    <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="grade-input-field"
                        value={score}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        placeholder="--"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherGradebook;
