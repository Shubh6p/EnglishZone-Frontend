import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Bus, MapPin, Wrench, CheckCircle, Users, Shield, UserCheck, Compass, Loader2 } from 'lucide-react';
import './AdminTransitMonitoring.css';

const AdminTransitMonitoring = () => {
  const { request, loading } = useApi();
  const [fleet, setFleet] = useState([]);

  const fetchFleet = async () => {
    try {
      const data = await request('/transit', 'GET');
      setFleet(data);
    } catch (err) {
      console.error('Failed to fetch fleet data', err);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleSeedFleet = async () => {
    try {
      const mockBuses = [
        { busNumber: 'MH-12-EQ-8004', driverName: 'Mr. Harpreet Singh', driverPhone: '+91 99887 76655', route: 'Route 1 - East End Sector', occupancy: 38, capacity: 40, status: 'Active' },
        { busNumber: 'DL-3C-AL-2026', driverName: 'Mr. Suresh Patel', driverPhone: '+91 99887 76656', route: 'Route 2 - West Sector', occupancy: 28, capacity: 40, status: 'Active' },
        { busNumber: 'MH-14-BT-1100', driverName: 'Mr. Devendra Sawant', driverPhone: '+91 99887 76659', route: 'Route 5 - South Hub', occupancy: 12, capacity: 30, status: 'Maintenance' }
      ];
      
      for (const bus of mockBuses) {
        await request('/transit', 'POST', bus);
      }
      
      fetchFleet();
    } catch (err) {
      console.error('Failed to seed fleet', err);
    }
  };

  const totalActive = fleet.filter(b => b.status === 'Active').length;
  const totalService = fleet.filter(b => b.status === 'Maintenance').length;
  const totalOccupancy = fleet.reduce((sum, b) => sum + b.occupancy, 0);
  const totalCapacity = fleet.reduce((sum, b) => sum + b.capacity, 0);

  return (
    <div className="transit-monitoring-container fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Transit Fleet & Route Monitoring</h2>
          <p className="card-heading-sub">Oversee school transportation schedules, vehicle status records, and driver compliance</p>
        </div>
        {fleet.length === 0 && !loading && (
          <button className="btn btn-primary" onClick={handleSeedFleet}>Seed Mock Fleet</button>
        )}
      </div>

      {/* Transit Stats Grid */}
      <div className="transit-stats-grid">
        <div className="card stat-card-flex">
          <Bus size={32} className="text-primary" />
          <div>
            <p className="stat-label">Total Fleet Vehicles</p>
            <h3 className="stat-value">{fleet.length} Buses</h3>
          </div>
        </div>

        <div className="card stat-card-flex">
          <CheckCircle size={32} style={{ color: 'var(--success-color)' }} />
          <div>
            <p className="stat-label">Active & En-Route</p>
            <h3 className="stat-value">{totalActive} Buses</h3>
          </div>
        </div>

        <div className="card stat-card-flex">
          <Wrench size={32} style={{ color: 'var(--warning-color)' }} />
          <div>
            <p className="stat-label">Maintenance Workshop</p>
            <h3 className="stat-value">{totalService} Buses</h3>
          </div>
        </div>

        <div className="card stat-card-flex">
          <Users size={32} className="text-accent" />
          <div>
            <p className="stat-label">Commuter Capacity</p>
            <h3 className="stat-value">{totalOccupancy} / {totalCapacity} Students</h3>
          </div>
        </div>
      </div>

      {/* Fleet Log Table */}
      <div className="card">
        <div className="table-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
          <h3 className="card-heading-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} className="text-accent" />
            <span>Active Transportation Roster</span>
          </h3>
          <span className="profile-pill-grade" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontWeight: '700' }}>
            Operational Status
          </span>
        </div>

        {loading && fleet.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin text-primary" size={32} style={{ margin: '0 auto' }}/>
          </div>
        ) : (
          <div className="attendance-table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Vehicle No</th>
                  <th>Assigned Driver</th>
                  <th>Assigned Route</th>
                  <th>Occupancy Load</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Emergency Actions</th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((bus) => {
                  const isActive = bus.status === 'Active';
                  const loadPercent = Math.min(100, Math.round((bus.occupancy / bus.capacity) * 100)) || 0;
                  
                  return (
                    <tr key={bus._id}>
                      <td style={{ fontWeight: '800', color: 'var(--text-secondary)' }}>{bus.busNumber}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700' }}>{bus.driverName}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{bus.driverPhone}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} className="text-accent" style={{ flexShrink: 0 }} />
                          <span>{bus.route}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700' }}>
                            <span>{bus.occupancy}/{bus.capacity} seats</span>
                            <span>{loadPercent}%</span>
                          </div>
                          <div className="occupancy-track-bg">
                            <div 
                              className="occupancy-fill-bar" 
                              style={{ 
                                width: `${loadPercent}%`,
                                backgroundColor: loadPercent > 90 ? 'var(--error-color)' : loadPercent > 70 ? 'var(--warning-color)' : 'var(--success-color)'
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={isActive ? 'status-badge-active' : 'status-badge-suspended'}>
                          {bus.status === 'Active' ? 'Active' : 'Maintenance'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.78rem',
                              borderColor: isActive ? 'var(--warning-color)' : 'var(--success-color)',
                              color: isActive ? 'var(--warning-color)' : 'var(--success-color)',
                              backgroundColor: 'transparent'
                            }}
                          >
                            {isActive ? <Wrench size={12} /> : <UserCheck size={12} />}
                            <span style={{ marginLeft: '4px' }}>
                              {isActive ? 'Send to Shop' : 'Dispatch'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransitMonitoring;
