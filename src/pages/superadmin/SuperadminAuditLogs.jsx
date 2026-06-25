import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Database, Loader2 } from 'lucide-react';
import '../admin/AdminUserManagement.css'; // Reuse table styles

const SuperadminAuditLogs = () => {
  const { request, loading } = useApi();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await request('/superadmin/logs', 'GET');
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '20px' }}>
        <h2 className="workspace-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={24} className="text-accent" />
          Audit Logs
        </h2>
        <p className="workspace-subheading">Immutable ledger of critical system actions.</p>
      </div>

      <div className="dash-card">
        <div className="table-responsive-wrapper">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Description</th>
                <th>Target ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                    <Loader2 className="animate-spin text-primary" size={24} style={{ margin: '0 auto' }}/>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log._id}>
                  <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span className="profile-pill-grade" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <strong>{log.performedBy?.fullName || 'Unknown'}</strong><br/>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.performedBy?.email}</span>
                  </td>
                  <td>{log.description}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {log.target || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperadminAuditLogs;
