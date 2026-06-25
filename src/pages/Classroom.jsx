import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Video, Download, Eye, FileText, Play, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import './Classroom.css';

const Classroom = () => {
  const { request, loading } = useApi();
  const [lectures, setLectures] = useState([]);
  const [activeLectureVideo, setActiveLectureVideo] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);

  // Mocked NCERT resources for now since they are static
  const ncertResources = [
    { id: 1, title: 'First Flight - Prose', subject: 'English Lit', size: '2.4 MB' },
    { id: 2, title: 'Footprints Without Feet', subject: 'English Suppl.', size: '1.8 MB' },
    { id: 3, title: 'Words and Expressions II', subject: 'Grammar', size: '3.1 MB' }
  ];

  const fetchAssignments = async () => {
    try {
      // Assuming the student's classId is implicitly handled or we just fetch all available for their class
      const data = await request('/assignments', 'GET');
      setLectures(data);
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDownloadNotes = (notesName) => {
    alert(`Downloading lecture notes: ${notesName}\nFormat: PDF\nSize: 1.4 MB`);
  };

  const handleDownloadPdf = (pdfName) => {
    alert(`Downloading NCERT textbook: ${pdfName}\nSaving for offline use.`);
  };

  const handleOpenLecture = (lecture) => {
    if (lecture.type === 'Video') {
      setActiveLectureVideo(lecture);
    } else {
      setViewingPdf({ title: lecture.title, link: lecture.link });
    }
  };

  return (
    <div className="classroom-wrapper fade-in">
      <div className="classroom-header-title">
        <h2 className="workspace-heading">Classroom Section</h2>
        <p className="workspace-subheading">Access today's study material, recorded lectures, and textbooks</p>
      </div>

      <div className="classroom-grid">
        {/* Today's Lectures Card */}
        <section className="dash-card lectures-card">
          <h3 className="card-heading-title flex-align-center gap-8">
            <Video className="text-primary" size={22} />
            <span>Today's Completed & Live Lectures</span>
          </h3>
          
          <div className="lectures-list">
            {loading && lectures.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Loader2 className="animate-spin text-primary" size={24} style={{ margin: '0 auto' }}/>
              </div>
            ) : lectures.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No lectures available yet.</p>
            ) : lectures.map((lecture) => (
              <div key={lecture._id} className="lecture-card-item">
                <div className="lecture-status-indicator">
                  <span className="badge-recorded">{lecture.type.toUpperCase()}</span>
                  <span className="lecture-time-txt">{new Date(lecture.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="lecture-body-info">
                  <h4 className="lecture-title-name">{lecture.title}</h4>
                  <p className="lecture-meta-sub">Faculty: <strong>{lecture.teacherId?.fullName || 'Unknown'}</strong></p>
                </div>

                <div className="lecture-actions-row">
                  <button 
                    className="btn btn-primary btn-sm play-lecture-btn"
                    onClick={() => handleOpenLecture(lecture)}
                  >
                    {lecture.type === 'Video' ? <Play size={14} fill="white" /> : <FileText size={14} />}
                    <span>{lecture.type === 'Video' ? 'Watch Class' : 'View Notes'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NCERT Digital Resources Card */}
        <section className="dash-card resources-card">
          <h3 className="card-heading-title flex-align-center gap-8">
            <BookOpen className="text-accent" size={22} />
            <span>NCERT Digital Library</span>
          </h3>
          <p className="card-heading-desc">Select Grade 10 textbook PDFs to view or download for offline learning.</p>

          <div className="ncert-list">
            {ncertResources.map((pdf) => (
              <div key={pdf.id} className="ncert-card-item">
                <div className="ncert-icon-title">
                  <FileText className="text-accent" size={24} />
                  <div>
                    <h4 className="ncert-pdf-title">{pdf.title}</h4>
                    <p className="ncert-pdf-sub">{pdf.subject} &bull; Size: {pdf.size}</p>
                  </div>
                </div>

                <div className="ncert-actions">
                  <button 
                    className="icon-action-btn view-btn"
                    onClick={() => setViewingPdf(pdf)}
                    title="View PDF Online"
                    aria-label={`View PDF for ${pdf.title}`}
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className="icon-action-btn download-btn"
                    onClick={() => handleDownloadPdf(pdf.title)}
                    title="Download PDF"
                    aria-label={`Download PDF for ${pdf.title}`}
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Video Lecture Player Modal Simulation */}
      {activeLectureVideo && (
        <div className="modal-overlay fade-in">
          <div className="modal-content video-modal-width scale-up">
            <button className="modal-close" onClick={() => setActiveLectureVideo(null)}>&times;</button>
            <h3 className="modal-heading-text">{activeLectureVideo.title}</h3>
            <p className="modal-subheading-text">Faculty: {activeLectureVideo.teacherId?.fullName} &bull; Link: {activeLectureVideo.link}</p>
            
            <div className="video-player-container-mock">
              <div className="video-overlay-inner-icon">
                <Play size={48} className="player-icon text-accent animate-pulse-slow" />
                <p>Streaming Lecture In Progress...</p>
              </div>
            </div>

            <div className="video-notes-row">
              <span className="live-viewers-count">104 students watching online</span>
            </div>
          </div>
        </div>
      )}

      {/* PDF View Modal Simulation */}
      {viewingPdf && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up pdf-modal-width">
            <button className="modal-close" onClick={() => setViewingPdf(null)}>&times;</button>
            <h3 className="modal-heading-text flex-align-center gap-8">
              <FileText className="text-accent" size={22} />
              <span>{viewingPdf.title}</span>
            </h3>
            <p className="modal-subheading-text">Simulated Digital PDF Viewer &bull; {viewingPdf.link ? `Link: ${viewingPdf.link}` : 'English Zone Resource Center'}</p>
            
            <div className="pdf-viewer-container-mock">
              <div className="pdf-viewer-content">
                <BookOpen size={40} className="text-muted" />
                <h4>NCERT Digital Reader Content</h4>
                <p>Loading document content...</p>
                <div className="pdf-page-indicator">Page 1</div>
              </div>
            </div>

            <div className="video-notes-row">
              <button className="btn btn-outline btn-sm" onClick={() => setViewingPdf(null)}>Close Reader</button>
              <button 
                className="btn btn-accent btn-sm" 
                onClick={() => { handleDownloadPdf(viewingPdf.title); setViewingPdf(null); }}
              >
                <Download size={14} />
                <span>Download PDF File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
