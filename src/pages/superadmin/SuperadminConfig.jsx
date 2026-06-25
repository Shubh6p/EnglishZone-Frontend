import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Settings, Save, Loader2, AlertTriangle } from 'lucide-react';
import '../Auth.css';

const SuperadminConfig = () => {
  const { request, loading } = useApi();
  const [configs, setConfigs] = useState([]);
  
  // Local state for editing
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const fetchConfigs = async () => {
    try {
      const data = await request('/superadmin/configs', 'GET');
      setConfigs(data);
      
      const maintenance = data.find(c => c.key === 'MAINTENANCE_MODE');
      if (maintenance) setMaintenanceMode(maintenance.value === 'true' || maintenance.value === true);
      
      const year = data.find(c => c.key === 'ACADEMIC_YEAR');
      if (year) setAcademicYear(year.value);
    } catch (err) {
      console.error('Failed to fetch configs', err);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async (key, value, description) => {
    try {
      await request('/superadmin/configs', 'PUT', {
        key,
        value,
        description
      });
      alert(`Configuration ${key} saved successfully.`);
      fetchConfigs();
    } catch (err) {
      alert(`Failed to save ${key}`);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '20px' }}>
        <h2 className="workspace-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={24} className="text-accent" />
          Global Configuration
        </h2>
        <p className="workspace-subheading">Manage environment variables and system-wide overrides.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        {/* Maintenance Mode Toggle */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <AlertTriangle size={24} className="text-warning" />
            <div>
              <h3 className="card-heading-title">Maintenance Mode</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Blocks non-Superadmin logins and shows a maintenance banner.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: '600' }}>Enable Maintenance Lock</span>
            </label>
            <button 
              className="btn btn-outline"
              onClick={() => handleSave('MAINTENANCE_MODE', maintenanceMode, 'Toggles application-wide maintenance lock')}
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
          </div>
        </div>

        {/* Academic Year Config */}
        <div className="dash-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Settings size={24} className="text-primary" />
            <div>
              <h3 className="card-heading-title">Active Academic Year</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Sets the default term for invoices and grades globally.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="text" 
              className="form-control"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-2027"
              style={{ flex: 1 }}
            />
            <button 
              className="btn btn-accent"
              onClick={() => handleSave('ACADEMIC_YEAR', academicYear, 'Defines the global academic term')}
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminConfig;
