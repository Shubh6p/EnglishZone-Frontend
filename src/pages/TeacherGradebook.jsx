import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, GraduationCap, Percent, BookOpen } from 'lucide-react';
import './TeacherGradebook.css';

const TeacherGradebook = () => {
  const { classRoster, gradebook, updateStudentGrade } = useContext(AppContext);
  const [selectedSubject, setSelectedSubject] = useState('English Literature');
  const [selectedExam, setSelectedExam] = useState('Unit Test II');

  const subjectGrades = gradebook[selectedSubject] || {};
  const examGrades = subjectGrades[selectedExam] || {};

  // Handle grade text input changes
  const handleGradeChange = (rollNo, val) => {
    // Only accept empty string or integers between 0 and 100
    if (val === '') {
      updateStudentGrade(selectedSubject, selectedExam, rollNo, 0);
      return;
    }
    const numericVal = parseInt(val, 10);
    if (!isNaN(numericVal) && numericVal >= 0 && numericVal <= 100) {
      updateStudentGrade(selectedSubject, selectedExam, rollNo, numericVal);
    }
  };

  // Real-time calculations
  const gradesArray = classRoster.map(student => examGrades[student.rollNo] || 0);
  const totalStudents = classRoster.length;
  
  const classSum = gradesArray.reduce((sum, score) => sum + score, 0);
  const classAverage = totalStudents > 0 ? (classSum / totalStudents).toFixed(1) : '0.0';
  
  const highestScore = gradesArray.length > 0 ? Math.max(...gradesArray) : 0;
  
  const passingStudents = gradesArray.filter(score => score >= 50).length;
  const passingRate = totalStudents > 0 ? ((passingStudents / totalStudents) * 100).toFixed(0) : '0';

  return (
    <div className="gradebook-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Class Gradebook & Analytics</h2>
        <p className="card-heading-sub">Log student marks and evaluate instant performance metrics</p>
      </div>

      {/* Selectors card */}
      <div className="gradebook-selectors-row">
        <div className="selector-item">
          <label className="form-label" htmlFor="subjectSelect" style={{ fontWeight: '700' }}>Subject Specialization</label>
          <select
            id="subjectSelect"
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
          <label className="form-label" htmlFor="examSelect" style={{ fontWeight: '700' }}>Exam / Test Cycle</label>
          <select
            id="examSelect"
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
            <p className="card-heading-sub" style={{ marginTop: '2px' }}>Assigned Class: Grade 10-A</p>
          </div>
          <span className="profile-pill-grade" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', fontWeight: '700', padding: '6px 12px' }}>
            Active: Input mode enabled
          </span>
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
                const score = examGrades[student.rollNo] !== undefined ? examGrades[student.rollNo] : '';
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
                      <label htmlFor={`grade-input-${student.rollNo}`} className="select-label-hide">Grade for {student.name}</label>
                      <input
                        id={`grade-input-${student.rollNo}`}
                        type="number"
                        min="0"
                        max="100"
                        className="grade-input-field"
                        value={score}
                        onChange={(e) => handleGradeChange(student.rollNo, e.target.value)}
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
