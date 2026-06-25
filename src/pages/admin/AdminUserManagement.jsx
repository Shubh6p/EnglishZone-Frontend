import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldAlert, CheckCircle, Search, Trash2, Edit2, X, Plus, Loader2 } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
  const { request, loading } = useApi();
  const [usersDirectory, setUsersDirectory] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'STUDENT', 'TEACHER', 'PARENT'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Modal form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('STUDENT');

  const fetchUsers = async () => {
    try {
      const data = await request('/users', 'GET');
      setUsersDirectory(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await request(`/users/${userId}/status`, 'PUT', { isActive: !currentStatus });
      // Refresh user list
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Handle new user additions
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    
    try {
      await request('/auth/signup', 'POST', {
        fullName: newName,
        email: newEmail,
        role: newRole,
        password: 'password123' // default password for admin created accounts
      });

      // Refresh list & Close Modal
      fetchUsers();
      setNewName('');
      setNewEmail('');
      setNewRole('STUDENT');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  // Filter lists based on role and search query
  const filteredUsers = usersDirectory.filter(u => {
    const matchesFilter = activeFilter === 'All' || u.role === activeFilter;
    const nameMatch = u.fullName ? u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return matchesFilter && (nameMatch || emailMatch);
  });

  return (
    <div className="admin-user-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>User Management & Controls</h2>
        <p className="card-heading-sub">Inspect user directories, edit details, adjust settings, and authorize credentials</p>
      </div>

      {/* Toolbar / Filters Row */}
      <div className="filters-row">
        <div className="filter-tabs">
          {['All', 'STUDENT', 'TEACHER', 'PARENT', 'ADMIN'].map((role) => (
            <button
              key={role}
              type="button"
              className={`filter-tab-btn ${activeFilter === role ? 'active' : ''}`}
              onClick={() => setActiveFilter(role)}
            >
              {role === 'All' ? 'All Users' : role}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="userSearch" className="select-label-hide">Search Users</label>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              id="userSearch"
              type="text"
              placeholder="Search directory..."
              className="form-control"
              style={{ paddingLeft: '36px', height: '40px', borderRadius: 'var(--radius-sm)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            className="btn btn-accent" 
            style={{ padding: '8px 16px', height: '40px', fontSize: '0.85rem' }}
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="card attendance-table-card">
        <div className="attendance-table-header">
          <h3 className="card-heading-title">Institutional User Directory</h3>
          <span className="profile-pill-grade" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '700' }}>
            Count: {filteredUsers.length} Users
          </span>
        </div>

        <div className="attendance-table-responsive">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>User Role</th>
                <th>Access Status</th>
                <th style={{ textAlign: 'center' }}>Actions / Toggles</th>
              </tr>
            </thead>
            <tbody>
              {loading && usersDirectory.length === 0 ? (
                 <tr>
                   <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                     <Loader2 className="animate-spin text-primary" size={24} style={{ margin: '0 auto' }}/>
                   </td>
                 </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No users match your query or filter tags.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isActive = item.isActive;
                  return (
                    <tr key={item._id}>
                      <td style={{ fontWeight: '700' }}>{item.fullName}</td>
                      <td>{item.email}</td>
                      <td>
                        <span className="profile-pill-grade" style={{ 
                          backgroundColor: item.role === 'TEACHER' ? 'var(--primary-light)' : item.role === 'STUDENT' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                          color: item.role === 'TEACHER' ? 'var(--primary-color)' : item.role === 'STUDENT' ? 'var(--accent-color)' : 'var(--text-secondary)'
                        }}>
                          {item.role}
                        </span>
                      </td>
                      <td>
                        <span className={isActive ? 'status-badge-active' : 'status-badge-suspended'}>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn"
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.8rem', 
                              backgroundColor: isActive ? 'var(--error-bg)' : 'var(--success-bg)',
                              color: isActive ? 'var(--error-color)' : 'var(--success-color)'
                            }}
                            onClick={() => toggleUserStatus(item._id, isActive)}
                            title={isActive ? 'Suspend User Access' : 'Activate User Access'}
                          >
                            {isActive ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                            <span style={{ marginLeft: '4px' }}>{isActive ? 'Suspend' : 'Activate'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop fade-in" onClick={() => setShowAddModal(false)}>
          <div className="add-user-modal scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="card-heading-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus className="text-accent" size={20} />
                <span>Create User Profile</span>
              </h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)} style={{ position: 'static' }}>&times;</button>
            </div>

            <form onSubmit={handleAddSubmit} className="resource-upload-form">
              <div className="form-group">
                <label className="form-label" htmlFor="newUserName">Full Name</label>
                <input
                  id="newUserName"
                  type="text"
                  placeholder="e.g. Alex Carter"
                  className="form-control"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newUserEmail">Email Address</label>
                <input
                  id="newUserEmail"
                  type="email"
                  placeholder="e.g. alex.carter@englishzone.edu"
                  className="form-control"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newUserRole">User Role Tiers</label>
                <select
                  id="newUserRole"
                  className="form-control"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="PARENT">Parent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-accent auth-btn" style={{ marginTop: '8px' }} disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>{loading ? 'Publishing...' : 'Publish Profile'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
