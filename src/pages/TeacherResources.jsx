import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { BookOpen, Video, FileText, Upload, Plus, Download, ExternalLink, Sparkles, GraduationCap, Loader2 } from 'lucide-react';
import './TeacherResources.css';

const TeacherResources = () => {
  const { request, loading } = useApi();
  const [teacherResources, setTeacherResources] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Mocked NCERT resources for now since they are static
  const ncertResources = [
    { id: 1, title: 'First Flight - Prose', subject: 'English Lit', size: '2.4 MB' },
    { id: 2, title: 'Footprints Without Feet', subject: 'English Suppl.', size: '1.8 MB' },
    { id: 3, title: 'Words and Expressions II', subject: 'Grammar', size: '3.1 MB' }
  ];

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Video');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fetchData = async () => {
    try {
      const [resData, classData] = await Promise.all([
        request('/assignments', 'GET'),
        request('/academics/classes', 'GET')
      ]);
      setTeacherResources(resData);
      setClasses(classData);
      if (classData.length > 0) setTargetClassId(classData[0]._id);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !targetClassId) return;
    if (type === 'Video' && !link) return;
    if (type === 'PDF Notes' && !file) return;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('classId', targetClassId);
      
      if (type === 'Video') {
        formData.append('link', link);
      } else if (type === 'PDF Notes' && file) {
        formData.append('file', file);
      }

      await request('/assignments', 'POST', formData, true); // true for isFormData

      // Refresh list
      fetchData();

      // Reset Form
      setTitle('');
      setLink('');
      setFile(null);
      
      // Toast notification
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to upload resource', err);
    }
  };

  const handleOpenLink = (item) => {
    alert(`Simulating opening digital asset:\n[${item.type}] ${item.title}\nSource: ${item.link}`);
  };

  const handleDownloadNcert = (book) => {
    alert(`Starting download for NCERT Textbook:\n"${book.title}"\nFile Size: ${book.size}`);
  };

  return (
    <div className="resources-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Digital Classroom & Resources</h2>
        <p className="card-heading-sub">Upload digital class content and access official educational material</p>
      </div>

      {showToast && (
        <div className="alert-toast" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'rgba(255, 107, 0, 0.2)', color: 'var(--accent-color)' }}>
          <Sparkles size={20} />
          <span>New digital resource uploaded and visible in the students classroom feed!</span>
        </div>
      )}

      {/* Upload Row */}
      <div className="resources-split-row">
        {/* Upload Form Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
            <Upload size={20} className="text-accent" />
            <h3 className="card-heading-title">Upload Resource</h3>
          </div>

          <form onSubmit={handleSubmit} className="resource-upload-form">
            <div className="form-group">
              <label className="form-label" htmlFor="resTitle">Resource / Lecture Title</label>
              <input
                id="resTitle"
                type="text"
                placeholder="e.g. English Grammar: Prepositions Part 1"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resType">Resource Type</label>
              <select
                id="resType"
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Video">Video Lecture URL</option>
                <option value="PDF Notes">PDF Lesson Notes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resLink">
                {type === 'Video' ? 'Video Youtube / Drive Link' : 'Upload PDF Document'}
              </label>
              {type === 'Video' ? (
                <input
                  id="resLink"
                  type="text"
                  placeholder="https://youtube.com/watch?..."
                  className="form-control"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              ) : (
                <input
                  id="resFile"
                  type="file"
                  accept="application/pdf"
                  className="form-control"
                  style={{ padding: '8px' }}
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resClass">Target Class Section</label>
              <select
                id="resClass"
                className="form-control"
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-accent auth-btn" style={{ marginTop: '8px' }} disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span>{loading ? 'Publishing...' : 'Publish Resource'}</span>
            </button>
          </form>
        </div>

        {/* Uploaded List Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
            <BookOpen size={20} className="text-primary" />
            <h3 className="card-heading-title">Completed Lectures Feed</h3>
          </div>

          <div className="uploaded-resources-list">
            {teacherResources.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No resources uploaded yet.</p>
            ) : teacherResources.map((item) => (
              <div key={item._id} className="resource-item-card">
                <div className="resource-details">
                  <span className={`resource-badge-tag ${item.type === 'Video' ? 'tag-video' : 'tag-pdf'}`}>
                    {item.type}
                  </span>
                  <h4 className="resource-title" style={{ marginTop: '4px' }}>{item.title}</h4>
                  <div className="resource-meta">
                    <span>Target: <strong>{item.classId?.name || 'Unknown Class'}</strong></span>
                    <span>&bull;</span>
                    <span>Uploaded: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ padding: '8px 12px', border: '1.5px solid var(--primary-color)' }}
                  onClick={() => handleOpenLink(item)}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NCERT Portal Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <GraduationCap size={24} className="text-primary" />
          <h3 className="card-heading-title" style={{ fontSize: '1.4rem' }}>NCERT Digital Curriculum Library</h3>
        </div>

        <div className="ncert-portal-grid">
          {ncertResources.map((book) => (
            <div key={book.id} className="card ncert-book-card">
              <div style={{ marginBottom: '16px' }}>
                <span className="profile-pill-grade" style={{ fontSize: '0.68rem', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {book.subject}
                </span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', marginTop: '8px', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                  {book.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>
                  File Size: {book.size}
                </p>
              </div>

              <button 
                type="button" 
                className="btn btn-accent w-full"
                onClick={() => handleDownloadNcert(book)}
                style={{ padding: '10px' }}
              >
                <Download size={14} />
                <span>Download Book</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherResources;
