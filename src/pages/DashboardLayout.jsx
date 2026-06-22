import React, { useState, useContext, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { GraduationCap, ChevronDown, LogOut, Menu, X, MoreVertical, Bell, Settings, User } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logoutUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const profileRef = useRef(null);
  const kebabRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Click outside listener for dropdowns
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

  if (!user) return null;

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
          
          <Link to="/dashboard" className="dash-logo">
            <GraduationCap className="dash-logo-icon" size={28} />
            <span className="dash-brand-name">English Zone</span>
          </Link>
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
                <p className="dropdown-section-title">Quick Settings</p>
                <button className="dropdown-item-btn" onClick={() => { setKebabOpen(false); alert("Notification preferences updated."); }}>
                  <Bell size={16} />
                  <span>Notification Settings</span>
                </button>
                <button className="dropdown-item-btn" onClick={() => { setKebabOpen(false); alert("Dashboard preferences saved."); }}>
                  <Settings size={16} />
                  <span>Display Preferences</span>
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
              <img src={user.avatar} alt={user.name} className="avatar-header-img" />
              <span className="avatar-user-name">{user.name.split(' ')[0]}</span>
              <ChevronDown size={14} className={`chevron-trans ${profileOpen ? 'rotate' : ''}`} />
            </button>

            {profileOpen && (
              <div className="dropdown-menu profile-dropdown scale-up">
                <div className="profile-drop-header">
                  <img src={user.avatar} alt={user.name} className="profile-drop-avatar" />
                  <div>
                    <h4 className="profile-drop-name">{user.name}</h4>
                    <p className="profile-drop-sub">{user.rollNo} &bull; {user.grade}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="profile-drop-details">
                  <p className="profile-detail-line"><strong>Email:</strong> {user.email}</p>
                  <p className="profile-detail-line"><strong>Phone:</strong> {user.phone}</p>
                  <p className="profile-detail-line"><strong>DOB:</strong> {user.dob}</p>
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
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
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
              <span>Portal Notifications</span>
            </h3>
            <p className="modal-subheading-text">Latest announcements and updates from English Zone administration.</p>
            
            <div className="notifications-list">
              <div className="notification-card-item unread">
                <span className="notif-badge bg-primary">Academic</span>
                <div className="notif-text-content">
                  <h4>Admit Card Released</h4>
                  <p>Admit Cards for Unit Test II (starting July 10) are now live in the Exam panel. Download them now.</p>
                  <span className="notif-time">2 hours ago</span>
                </div>
              </div>
              <div className="notification-card-item unread">
                <span className="notif-badge bg-accent">Billing</span>
                <div className="notif-text-content">
                  <h4>June Fees Invoice Generated</h4>
                  <p>Your billing invoice for June Tuition & Transport Fee is generated. Please clear it by June 20 to avoid late fees.</p>
                  <span className="notif-time">1 day ago</span>
                </div>
              </div>
              <div className="notification-card-item">
                <span className="notif-badge bg-success">Activity</span>
                <div className="notif-text-content">
                  <h4>State Chess Tournament Winners</h4>
                  <p>Congratulations to Ananya Rao for bagging the Chess Championship Trophy! View details on the homepage.</p>
                  <span className="notif-time">3 days ago</span>
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

export default DashboardLayout;
