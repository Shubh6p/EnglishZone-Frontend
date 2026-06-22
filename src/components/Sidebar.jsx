import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Video, Users, FileSignature, Landmark, Bus, Award } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: <Home size={20} />, end: true },
    { name: 'Classroom', path: '/dashboard/classroom', icon: <Video size={20} /> },
    { name: 'Teachers Room', path: '/dashboard/teachers', icon: <Users size={20} /> },
    { name: 'Exams', path: '/dashboard/exams', icon: <FileSignature size={20} /> },
    { name: 'Fees & Invoices', path: '/dashboard/fees', icon: <Landmark size={20} /> },
    { name: 'Transport Details', path: '/dashboard/transport', icon: <Bus size={20} /> }
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-menu-wrapper">
        <p className="sidebar-section-title">Student Portal</p>
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
        <h4>EZ Elite Student</h4>
        <p>Keep up the good attendance to earn your next badge!</p>
      </div>
    </aside>
  );
};

export default Sidebar;
