import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, UserCheck, Award, Landmark, BookOpen } from 'lucide-react';
import './Sidebar.css';

const TeacherSidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Home', path: '/teacher-dashboard', icon: <Home size={20} />, end: true },
    { name: 'My Attendance', path: '/teacher-dashboard/my-attendance', icon: <Calendar size={20} /> },
    { name: 'Class Attendance', path: '/teacher-dashboard/class-attendance', icon: <UserCheck size={20} /> },
    { name: 'Class Gradebook', path: '/teacher-dashboard/gradebook', icon: <Award size={20} /> },
    { name: 'Salary & Payroll', path: '/teacher-dashboard/payroll', icon: <Landmark size={20} /> },
    { name: 'Resources', path: '/teacher-dashboard/resources', icon: <BookOpen size={20} /> }
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-menu-wrapper">
        <p className="sidebar-section-title">Teacher Portal</p>
        <nav className="sidebar-nav-list">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon-box">{item.icon}</span>
              <span className="sidebar-link-text">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-decor-card">
        <Award className="decor-icon text-accent" size={32} />
        <h4>EZ Elite Faculty</h4>
        <p>Your digital classroom is fully synced. Have a great teaching session today!</p>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
