import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Activity, Database, Settings, ShieldAlert } from 'lucide-react';
import '../DashboardLayout.css';

const SuperadminDashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'SUPERADMIN') {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Unauthorized Access</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar fade-in" style={{ borderRight: '2px solid var(--accent-color)' }}>
        <div className="sidebar-header">
          <ShieldAlert size={28} className="text-accent" />
          <h2 className="brand-title" style={{ color: 'var(--accent-color)' }}>SYS_ADMIN</h2>
        </div>
        
        <div className="user-mini-profile">
          <div className="avatar-frame">
            <img src={user.avatar || 'https://ui-avatars.com/api/?name=Super+Admin&background=000&color=ff6b00'} alt="Profile" className="profile-photo" />
          </div>
          <div className="user-details">
            <span className="user-name">{user.fullName || 'Superadmin'}</span>
            <span className="user-grade text-accent">LEVEL 5 ACCESS</span>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/superadmin-dashboard" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Activity size={20} />
            <span>System Health</span>
          </NavLink>
          <NavLink to="/superadmin-dashboard/logs" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Database size={20} />
            <span>Audit Logs</span>
          </NavLink>
          <NavLink to="/superadmin-dashboard/config" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Settings size={20} />
            <span>Global Config</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar fade-in">
          <div className="topbar-left">
            <h1 className="page-title">Superadmin Command Center</h1>
            <span className="badge text-accent" style={{ background: 'var(--accent-light)' }}>Encrypted Connection</span>
          </div>
          <div className="topbar-right">
            <span className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="content-scroll-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperadminDashboardLayout;
