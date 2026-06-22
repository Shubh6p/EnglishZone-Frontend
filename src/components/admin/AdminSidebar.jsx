import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, Landmark, Bus, ShieldCheck } from 'lucide-react';
import '../Sidebar.css'; // Reuse sidebar layout styles

const AdminSidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Overview', path: '/admin-dashboard', icon: <Home size={20} />, end: true },
    { name: 'User Management', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Academic Control', path: '/admin-dashboard/academics', icon: <BookOpen size={20} /> },
    { name: 'Financial Invoicing', path: '/admin-dashboard/finance', icon: <Landmark size={20} /> },
    { name: 'Transit Monitoring', path: '/admin-dashboard/transit', icon: <Bus size={20} /> }
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-menu-wrapper">
        <p className="sidebar-section-title">Admin Management</p>
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
        <ShieldCheck className="decor-icon text-accent" size={32} />
        <h4>EZ Security Guard</h4>
        <p>Master account is logged. Keep your auth keys and password codes protected.</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
