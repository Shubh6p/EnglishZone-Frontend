import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Award, Calendar, FileText, Download, Eye, AlertCircle, Clock, BookOpen, Loader2 } from 'lucide-react';
import './Exam.css';

const Exam = () => {
  const { request, loading } = useApi();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  
  const [examSchedule, setExamSchedule] = useState([]);

  // Mocked for now (could be wired later if needed)
  const examResults = [];
  const admitCards = [
    { id: 1, examName: 'Unit Test II - Grade 10', releaseDate: '12 Nov 2024' }
  ];

  const fetchExams = async () => {
    try {
      const data = await request('/exams', 'GET');
      setExamSchedule(data);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDownloadAdmitCard = (examName) => {
    alert(`Downloading official PDF Admit Card for:\n${examName}\nFormat: PDF\nStatus: Signed`);
  };

  return (
    <div className="exam-wrapper fade-in">
      <div className="exam-header-title">
        <h2 className="workspace-heading">Exams & Results</h2>
        <p className="workspace-subheading">Review grades, examine upcoming test schedules, and fetch official admit cards</p>
      </div>

      {/* Tabs Row */}
      <div className="exam-tabs-row">
        <button 
          className={`exam-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <Award size={18} />
          <span>Previous Results</span>
        </button>
        <button 
          className={`exam-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <Calendar size={18} />
          <span>Upcoming Exams</span>
        </button>
        <button 
          className={`exam-tab-btn ${activeTab === 'admit' ? 'active' : ''}`}
          onClick={() => setActiveTab('admit')}
        >
          <FileText size={18} />
          <span>Admit Cards</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="exam-content-area">
        {activeTab === 'results' && (
          <div className="tab-pane scale-up">
            <div className="table-responsive-wrapper card">
              {examResults.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No previous results published yet.</p>
              ) : (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Subject Name</th>
                      <th>Marks Obtained</th>
                      <th>Grade</th>
                      <th>Faculty Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.map((result) => (
                      <tr key={result.id}>
                        <td className="subject-cell font-bold">{result.subject}</td>
                        <td className="marks-cell font-bold text-primary">{result.marks}</td>
                        <td>
                          <span className={`grade-chip ${result.grade.startsWith('A') ? 'grade-a' : 'grade-b'}`}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="remarks-cell text-muted">{result.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="tab-pane scale-up">
            <div className="exam-timeline">
              {loading && examSchedule.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Loader2 className="animate-spin text-primary" size={24} style={{ margin: '0 auto' }}/>
                </div>
              ) : examSchedule.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No upcoming exams scheduled.</p>
              ) : examSchedule.map((exam, idx) => (
                <div key={exam._id} className="exam-timeline-item">
                  <div className="timeline-date-side">
                    <Calendar size={16} className="text-accent" />
                    <span className="exam-date-str">{new Date(exam.date).toLocaleDateString()}</span>
                  </div>

                  <div className="timeline-connector-col">
                    <span className="timeline-bullet-circle"></span>
                    {idx < examSchedule.length - 1 && <span className="timeline-join-bar"></span>}
                  </div>

                  <div className="timeline-detail-card card">
                    <div className="exam-card-header">
                      <span className="exam-type-pill">{exam.title}</span>
                      <span className="exam-time-lbl"><Clock size={12} /> {new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <h3 className="exam-subject-heading">{exam.subject}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Marks: {exam.totalMarks}</p>
                    
                    <button 
                      className="btn btn-outline btn-sm exam-syllabus-btn"
                      style={{ marginTop: '12px' }}
                      onClick={() => setSelectedSyllabus(exam)}
                    >
                      <BookOpen size={14} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admit' && (
          <div className="tab-pane scale-up">
            <div className="admit-cards-grid">
              {admitCards.map((card) => (
                <div key={card.id} className="admit-card-item card">
                  <div className="admit-left-icon">
                    <FileText className="text-primary" size={32} />
                  </div>
                  <div className="admit-middle-content">
                    <h3 className="admit-exam-title">{card.examName}</h3>
                    <p className="admit-release-date">Released on: {card.releaseDate} &bull; <span className="text-success">Verified</span></p>
                  </div>
                  <div className="admit-right-action">
                    <button 
                      className="btn btn-accent btn-sm admit-dl-btn"
                      onClick={() => handleDownloadAdmitCard(card.examName)}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Syllabus Modal Dialog */}
      {selectedSyllabus && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up">
            <button className="modal-close" onClick={() => setSelectedSyllabus(null)}>&times;</button>
            <h3 className="modal-heading-text flex-align-center gap-8">
              <BookOpen className="text-accent" size={22} />
              <span>Syllabus: {selectedSyllabus.subject}</span>
            </h3>
            <p className="modal-subheading-text">Syllabus details for {selectedSyllabus.title} &bull; English Zone Academics</p>
            
            <div className="syllabus-topics-box">
              <h4 className="syllabus-topics-heading">Details</h4>
              <ul className="syllabus-topics-list">
                <li className="topic-bullet-item">
                  <span className="bullet-dot"></span>
                  <span>Date: {new Date(selectedSyllabus.date).toLocaleString()}</span>
                </li>
                <li className="topic-bullet-item">
                  <span className="bullet-dot"></span>
                  <span>Max Marks: {selectedSyllabus.totalMarks}</span>
                </li>
              </ul>
              
              <div className="syllabus-warning-box">
                <AlertCircle className="text-primary" size={18} />
                <p>Ensure to arrive 15 minutes before the exam starts.</p>
              </div>
            </div>

            <button 
              className="btn btn-primary w-full"
              style={{ marginTop: '20px' }}
              onClick={() => setSelectedSyllabus(null)}
            >
              Okay, Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
