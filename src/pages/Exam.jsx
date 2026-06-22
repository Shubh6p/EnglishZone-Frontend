import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Award, Calendar, FileText, Download, Eye, AlertCircle, Clock, BookOpen } from 'lucide-react';
import './Exam.css';

const Exam = () => {
  const { examResults, examSchedule, admitCards } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('results');
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);

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
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="tab-pane scale-up">
            <div className="exam-timeline">
              {examSchedule.map((exam, idx) => (
                <div key={exam.id} className="exam-timeline-item">
                  <div className="timeline-date-side">
                    <Calendar size={16} className="text-accent" />
                    <span className="exam-date-str">{exam.date}</span>
                    <span className="exam-day-str">{exam.day}</span>
                  </div>

                  <div className="timeline-connector-col">
                    <span className="timeline-bullet-circle"></span>
                    {idx < examSchedule.length - 1 && <span className="timeline-join-bar"></span>}
                  </div>

                  <div className="timeline-detail-card card">
                    <div className="exam-card-header">
                      <span className="exam-type-pill">{exam.type}</span>
                      <span className="exam-time-lbl"><Clock size={12} /> {exam.time}</span>
                    </div>
                    
                    <h3 className="exam-subject-heading">{exam.subject}</h3>
                    
                    <button 
                      className="btn btn-outline btn-sm exam-syllabus-btn"
                      onClick={() => setSelectedSyllabus(exam)}
                    >
                      <BookOpen size={14} />
                      <span>View Syllabus Outline</span>
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
            <p className="modal-subheading-text">Syllabus details for {selectedSyllabus.type} &bull; English Zone Academics</p>
            
            <div className="syllabus-topics-box">
              <h4 className="syllabus-topics-heading">Prescribed Units & Topics</h4>
              <ul className="syllabus-topics-list">
                {selectedSyllabus.syllabus.split(', ').map((topic, index) => (
                  <li key={index} className="topic-bullet-item">
                    <span className="bullet-dot"></span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              
              <div className="syllabus-warning-box">
                <AlertCircle className="text-primary" size={18} />
                <p>Ensure to solve NCERT back exercises for these chapters. 40% weighting applies to practicals.</p>
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
