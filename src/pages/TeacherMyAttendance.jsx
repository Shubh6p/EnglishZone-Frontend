import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar, Check, X, ShieldAlert, Award } from 'lucide-react';
import './TeacherMyAttendance.css';

const TeacherMyAttendance = () => {
  const { teacherAttendance } = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState('June');

  const monthData = teacherAttendance[selectedMonth];
  const attendanceVal = monthData ? monthData.rate : 0;

  // Radial Circle calculations
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendanceVal / 100) * circumference;

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Offset padding for the grid starting weekday:
  // April 2026 starts on Wednesday (offset = 2)
  // May 2026 starts on Friday (offset = 4)
  // June 2026 starts on Monday (offset = 0)
  const getStartOffset = (month) => {
    if (month === 'April') return 2;
    if (month === 'May') return 4;
    return 0; // June starts on Mon
  };

  const offset = getStartOffset(selectedMonth);
  const emptyDays = Array(offset).fill(null);

  // Count attendance statuses for legend breakdown
  const counts = monthData.calendar.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { Present: 0, Absent: 0, Leave: 0, Weekend: 0, Pending: 0 });

  return (
    <div className="my-attendance-container fade-in">
      {/* Header */}
      <div className="calendar-header-row">
        <div>
          <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>My Attendance Tracker</h2>
          <p className="card-heading-sub">Track your monthly faculty attendance log and payouts compliance</p>
        </div>

        <div className="month-picker-wrapper">
          <label htmlFor="monthPicker" className="select-label-hide">Select Month</label>
          <select
            id="monthPicker"
            className="month-select-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="June">June 2026 (Current)</option>
            <option value="May">May 2026</option>
            <option value="April">April 2026</option>
          </select>
        </div>
      </div>

      <div className="attendance-grid-layout">
        {/* Left Side: Calendar Card */}
        <div className="card calendar-card">
          <div className="calendar-grid-wrapper">
            {/* Weekdays Row */}
            <div className="calendar-weekdays-grid">
              {weekdays.map((day, idx) => (
                <div key={idx} className="calendar-weekday-header">{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="calendar-days-grid">
              {/* Padding offsets */}
              {emptyDays.map((_, idx) => (
                <div key={`empty-${idx}`} className="calendar-day-node day-empty"></div>
              ))}

              {/* Real calendar entries */}
              {monthData.calendar.map((item) => {
                let statusClass = 'day-pending';
                if (item.status === 'Present') statusClass = 'day-present';
                else if (item.status === 'Absent') statusClass = 'day-absent';
                else if (item.status === 'Leave') statusClass = 'day-leave';
                else if (item.status === 'Weekend') statusClass = 'day-weekend';

                return (
                  <div key={item.date} className={`calendar-day-node ${statusClass}`}>
                    <span>{item.date}</span>
                    <span className="day-status-indicator">
                      {item.status === 'Present' && 'P'}
                      {item.status === 'Absent' && 'A'}
                      {item.status === 'Leave' && 'L'}
                      {item.status === 'Weekend' && 'W'}
                      {item.status === 'Pending' && '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Percentage Meter and Legend */}
        <div className="card my-attendance-meter-card">
          <h3 className="card-heading-title" style={{ textAlign: 'center', width: '100%' }}>Attendance Rate</h3>
          
          {/* Radial progress meter */}
          <div className="radial-progress-svg-wrapper">
            <svg className="radial-svg" width="140" height="140">
              <circle
                className="radial-bg-circle"
                cx="70"
                cy="70"
                r={radius}
                strokeWidth={strokeWidth}
              />
              <circle
                className="radial-progress-circle"
                cx="70"
                cy="70"
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ stroke: 'var(--accent-color)' }}
              />
            </svg>
            <div className="radial-percentage-overlay">
              <span className="radial-percentage-text" style={{ color: 'var(--accent-color)' }}>{attendanceVal}%</span>
              <span className="radial-sub-label">Verified</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: attendanceVal >= 90 ? 'var(--success-color)' : 'var(--warning-color)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Award size={18} />
              <span>{attendanceVal >= 95 ? 'Elite Faculty Status' : 'Standard Status'}</span>
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
              Salary release is compliant with a minimum attendance requirement of 90%.
            </p>
          </div>

          {/* Legend breakdown */}
          <div className="calendar-legend-box">
            <p className="dropdown-section-title" style={{ padding: '0 0 8px 0', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
              Days Summary
            </p>
            <div className="legend-color-row">
              <div className="legend-left">
                <span className="legend-indicator-circle day-present"></span>
                <span className="legend-status-text">Present</span>
              </div>
              <span className="legend-count">{counts.Present} days</span>
            </div>

            <div className="legend-color-row">
              <div className="legend-left">
                <span className="legend-indicator-circle day-leave"></span>
                <span className="legend-status-text">On Approved Leave</span>
              </div>
              <span className="legend-count">{counts.Leave} days</span>
            </div>

            <div className="legend-color-row">
              <div className="legend-left">
                <span className="legend-indicator-circle day-absent"></span>
                <span className="legend-status-text">Unexcused Absent</span>
              </div>
              <span className="legend-count" style={{ color: 'var(--error-color)' }}>{counts.Absent} days</span>
            </div>

            <div className="legend-color-row">
              <div className="legend-left">
                <span className="legend-indicator-circle day-weekend"></span>
                <span className="legend-status-text">Weekends / Holidays</span>
              </div>
              <span className="legend-count">{counts.Weekend} days</span>
            </div>

            <div className="legend-color-row">
              <div className="legend-left">
                <span className="legend-indicator-circle day-pending"></span>
                <span className="legend-status-text">Pending Log</span>
              </div>
              <span className="legend-count">{counts.Pending || 0} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMyAttendance;
