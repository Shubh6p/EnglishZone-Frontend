import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Activity, Database, Server, Loader2, RefreshCw } from 'lucide-react';
import '../DashboardHome.css';

const SuperadminDashboardHome = () => {
  const { request, loading } = useApi();
  const [stats, setStats] = useState({ totalLogs: 0, configCount: 0, systemStatus: 'UNKNOWN' });

  const fetchStats = async () => {
    try {
      const data = await request('/superadmin/stats', 'GET');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dash-home-grid fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="workspace-heading">System Overview</h2>
        <button className="btn btn-outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>SYSTEM STATUS</span>
            <Server size={20} className="text-accent" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.systemStatus}</span>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>TOTAL AUDIT LOGS</span>
            <Database size={20} className="text-primary" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalLogs}</span>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--success-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>CONFIG KEYS</span>
            <Activity size={20} className="text-success" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.configCount}</span>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboardHome;
