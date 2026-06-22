import React, { useState, useContext, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { GraduationCap, ChevronDown, LogOut, Menu, X, MoreVertical, Bell, Settings, Shield } from 'lucide-react';
import '../DashboardLayout.css'; // Reuse portal shell structural rules

const AdminDashboardLayout = () => {
  const { user, logoutUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const profileRef = useRef(null);
  const kebabRef = useRef(null);

  // Auth gate for Admins
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard'); // Send students to student dashboard
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (kebabRef.current && !kebabRef.current.contains(e.target)) {
        setKebabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="dashboard-layout-wrapper">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="dash-header-left">
          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation Sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/admin-dashboard" className="dash-logo">
            <GraduationCap className="dash-logo-icon" size={28} />
            <span className="dash-brand-name">English Zone</span>
          </Link>
          <span className="profile-pill-grade" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-white)', fontWeight: '800', marginLeft: '12px', textTransform: 'uppercase', fontSize: '0.65rem', padding: '2px 8px' }}>
            Admin Portal
          </span>
        </div>

        <div className="dash-header-right">
          {/* Notifications shortcut */}
          <button 
            className="header-icon-badge-btn" 
            onClick={() => setShowNotificationModal(true)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="badge-dot animate-pulse-slow"></span>
          </button>

          {/* Kebab Options Dropdown */}
          <div className="dropdown-container" ref={kebabRef}>
            <button 
              className="kebab-menu-btn" 
              onClick={() => setKebabOpen(!kebabOpen)}
              aria-label="Settings Menu"
            >
              <MoreVertical size={20} />
            </button>
            
            {kebabOpen && (
              <div className="dropdown-menu kebab-dropdown scale-up">
                <p className="dropdown-section-title">Master Settings</p>
                <button className="dropdown-item-btn" onClick={() => { setKebabOpen(false); alert("Database snapshot downloaded."); }}>
                  <Settings size={16} />
                  <span>System Config</span>
                </button>
                <button className="dropdown-item-btn" onClick={() => { setKebabOpen(false); alert("Access security logs synched."); }}>
                  <Shield size={16} />
                  <span>Security Logs</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item-btn item-logout text-error" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Log Out Session</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="dropdown-container" ref={profileRef}>
            <button 
              className="avatar-profile-btn" 
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <img src={user.avatar} alt={user.name} className="avatar-header-img" style={{ borderColor: 'var(--accent-color)' }} />
              <span className="avatar-user-name">{user.name.split(' ')[1]}</span>
              <ChevronDown size={14} className={`chevron-trans ${profileOpen ? 'rotate' : ''}`} />
            </button>

            {profileOpen && (
              <div className="dropdown-menu profile-dropdown scale-up">
                <div className="profile-drop-header">
                  <img src={user.avatar} alt={user.name} className="profile-drop-avatar" />
                  <div>
                    <h4 className="profile-drop-name">{user.name}</h4>
                    <p className="profile-drop-sub">{user.employeeId}</p>
                    <p className="profile-drop-sub" style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: '600' }}>
                      {user.designation}
                    </p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="profile-drop-details">
                  <p className="profile-detail-line"><strong>Access:</strong> Master Admin</p>
                  <p className="profile-detail-line"><strong>Email:</strong> {user.email}</p>
                  <p className="profile-detail-line"><strong>Phone:</strong> {user.phone}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item-btn item-logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Log Out Portal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <div className="dashboard-main-container">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Mobile sidebar overlay background */}
        {sidebarOpen && <div className="sidebar-overlay-bg" onClick={() => setSidebarOpen(false)}></div>}

        {/* Content Workspace */}
        <main className="dashboard-content-workspace">
          <Outlet />
        </main>
      </div>

      {/* Notifications Modal simulation */}
      {showNotificationModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up">
            <button className="modal-close" onClick={() => setShowNotificationModal(false)}>&times;</button>
            <h3 className="modal-heading-text flex-align-center gap-8">
              <Bell className="text-accent" size={22} />
              <span>Admin Notifications</span>
            </h3>
            <p className="modal-subheading-text">System alerts and administrative highlights.</p>
            
            <div className="notifications-list">
              <div className="notification-card-item unread">
                <span className="notif-badge bg-primary">System</span>
                <div className="notif-text-content">
                  <h4>Vite Client Environment Synced</h4>
                  <p>Institutes master database compiled correctly. HMR and router states verified.</p>
                  <span className="notif-time">20 mins ago</span>
                </div>
              </div>
              <div className="notification-card-item unread">
                <span className="notif-badge bg-accent">Billing</span>
                <div className="notif-text-content">
                  <h4>Fee Payment Threshold</h4>
                  <p>12 Parent billing invoice deadlines approach tomorrow. Automated SMS alerts pending trigger.</p>
                  <span className="notif-time">1 hour ago</span>
                </div>
              </div>
              <div className="notification-card-item">
                <span className="notif-badge bg-success">Transit</span>
                <div className="notif-text-content">
                  <h4>Transit Route 4 Maintenance</h4>
                  <p>Bus vehicle 4 is scheduled for periodic maintenance. Substitution routing completed.</p>
                  <span className="notif-time">3 hours ago</span>
                </div>
              </div>
            </div>
            
            <button 
              className="btn btn-outline w-full"
              style={{ marginTop: '20px' }}
              onClick={() => setShowNotificationModal(false)}
            >
              Close Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardLayout;
