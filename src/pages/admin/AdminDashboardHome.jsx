import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { GraduationCap, Users, Bus, Landmark, Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import '../DashboardHome.css'; // Reuse portal dashboard home grid styling

const AdminDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const { request } = useApi();
  const [metrics, setMetrics] = useState({ 
    students: 0, 
    faculty: 0, 
    fleet: 0,
    collections: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [users, transit, invoices] = await Promise.all([
          request('/users', 'GET'),
          request('/transit', 'GET'),
          request('/invoices', 'GET')
        ]);
        
        const students = users.filter(u => u.role === 'STUDENT').length;
        const faculty = users.filter(u => u.role === 'TEACHER').length;
        const fleet = transit.length;
        
        let collected = 0;
        let total = 0;
        invoices.forEach(inv => {
          total += inv.amount;
          if (inv.status === 'Paid') {
            collected += inv.amount;
          }
        });
        
        const collectionPercent = total > 0 ? Math.round((collected / total) * 100) : 0;

        setMetrics({ students, faculty, fleet, collections: collectionPercent });
      } catch (err) {
        console.error('Failed to load metrics', err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="dash-home-grid fade-in">
      {/* Top Banner Row */}
      <section className="dash-card profile-summary-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="avatar-frame-large" style={{ borderColor: 'var(--accent-color)', width: '80px', height: '80px', padding: '2px' }}>
            <img src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=random'} alt={user?.fullName} className="profile-photo-large" />
          </div>
          <div>
            <span className="profile-pill-grade" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', fontWeight: '700' }}>
              {user?.role || 'ADMIN'}
            </span>
            <h2 className="student-name-heading" style={{ fontSize: '1.5rem', marginTop: '4px' }}>Welcome, {user?.fullName || 'Admin'}</h2>
            <p className="student-meta-item">Master Account: <strong>{user?.email}</strong></p>
          </div>
        </div>
      </section>

      {/* Metric Blocks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        {/* Metric 1 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Enrollments</span>
            <GraduationCap size={20} className="text-primary" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.students}</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--success-color)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} />
            <span>+12% vs last term</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty Members</span>
            <Users size={20} className="text-accent" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.faculty}</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Active across 3 branches
          </p>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '4px solid var(--success-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Transport Fleet</span>
            <Bus size={20} style={{ color: 'var(--success-color)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.fleet}</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--success-color)', fontWeight: '700' }}>
            Live fleet tracking available
          </p>
        </div>

        {/* Metric 4 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '4px solid var(--warning-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fee Collections</span>
            <Landmark size={20} style={{ color: 'var(--warning-color)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.collections}%</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Invoices paid to date
          </p>
        </div>
      </div>

      {/* Overview Analytics Details */}
      <section className="dash-card">
        <h3 className="card-heading-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
          <Sparkles size={18} className="text-accent" />
          <span>Institutional Briefing</span>
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Welcome back to the English Zone Institutional Command Center. All modules are now fully synchronized with MongoDB. 
          Use the User Management tab to suspend or add student and faculty records, generate custom class invoices under the Invoicing tab, or audit routing compliance in Transit.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
          <AlertCircle size={18} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>System Notification:</strong> Automatic payment reminders will trigger on <strong>June 20, 2026</strong> for all overdue student fee invoices. Ensure tiers are correctly set before sync.
          </span>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardHome;
