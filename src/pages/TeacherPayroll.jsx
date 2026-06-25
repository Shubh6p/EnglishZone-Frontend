import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Landmark, ArrowDownToLine, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import './TeacherPayroll.css';

const TeacherPayroll = () => {
  const { request, loading } = useApi();
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [payrolls, setPayrolls] = useState([]);
  
  const fetchPayrolls = async () => {
    try {
      const data = await request('/payroll', 'GET');
      setPayrolls(data);
    } catch (err) {
      console.error('Failed to fetch payrolls', err);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const getActivePayroll = () => {
    const currentYear = new Date().getFullYear();
    const found = payrolls.find(p => p.month === selectedMonth && p.year === currentYear);
    if (found) {
      return {
        gross: found.baseSalary,
        deductions: { leaves: found.leaveDeductions, tax: 0, providentFund: 0 },
        netPayout: found.netSalary,
        status: found.status
      };
    }
    // Default empty state if no payroll found
    return {
      gross: 0,
      deductions: { leaves: 0, tax: 0, providentFund: 0 },
      netPayout: 0,
      status: 'Processing'
    };
  };

  const payroll = getActivePayroll();
  const totalDeductions = payroll.deductions.leaves + payroll.deductions.tax + payroll.deductions.providentFund;

  const handleDownload = () => {
    alert(`PDF Payslip for ${selectedMonth} ${new Date().getFullYear()} has been generated and downloaded successfully.`);
  };

  return (
    <div className="payroll-container fade-in">
      {/* Header */}
      <div className="calendar-header-row">
        <div>
          <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Salary & Payroll</h2>
          <p className="card-heading-sub">View and download your monthly earnings breakdown and slips</p>
        </div>

        <div className="month-picker-wrapper">
          <label htmlFor="payrollMonth" className="select-label-hide">Select Payroll Month</label>
          <select
            id="payrollMonth"
            className="month-select-dropdown"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="June">June 2026</option>
            <option value="May">May 2026</option>
            <option value="April">April 2026</option>
          </select>
        </div>
      </div>

      <div className="payroll-grid">
        {/* Left Card: Detailed Breakdown */}
        <div className="card payroll-breakdown-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
            <Landmark size={20} className="text-primary" />
            <h3 className="card-heading-title">Earnings Summary - {selectedMonth} 2026</h3>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Loader2 className="animate-spin text-primary" size={32} style={{ margin: '0 auto' }}/>
            </div>
          ) : (
            <div className="salary-breakdown-list">
              <div className="salary-row-item">
                <span className="salary-label">Base Pay (Gross Salary)</span>
                <span className="salary-val">₹{payroll.gross.toLocaleString()}</span>
              </div>

              <div className="salary-row-item" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed' }}>
                <span className="salary-label" style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Total Gross Earnings</span>
                <span className="salary-val" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>₹{payroll.gross.toLocaleString()}</span>
              </div>

              <p className="dropdown-section-title" style={{ padding: '16px 0 4px 0' }}>Deductions & Cuts</p>
              
              <div className="salary-row-item">
                <span className="salary-label">Unpaid Leaves Cut</span>
                <span className="deduction-val">- ₹{payroll.deductions.leaves.toLocaleString()}</span>
              </div>

              <div className="salary-row-item">
                <span className="salary-label">Professional & Income Tax</span>
                <span className="deduction-val">- ₹{payroll.deductions.tax.toLocaleString()}</span>
              </div>

              <div className="salary-row-item">
                <span className="salary-label">Provident Fund (PF)</span>
                <span className="deduction-val">- ₹{payroll.deductions.providentFund.toLocaleString()}</span>
              </div>

              <div className="salary-row-item" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                <span className="salary-label" style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Total Deductions</span>
                <span className="deduction-val" style={{ fontSize: '1.05rem' }}>- ₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Net Payout Highlight and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card net-payout-highlight-card">
            <span className="net-payout-title">Net Salary Payout</span>
            <span className="net-payout-amount">₹{payroll.netPayout.toLocaleString()}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Credited directly to Bank Account ending in *8920
            </span>
            
            <div style={{ marginTop: '8px' }}>
              {payroll.status === 'Paid' ? (
                <span className="payout-status-badge status-paid">
                  <CheckCircle2 size={14} />
                  <span>Paid / Credited</span>
                </span>
              ) : (
                <span className="payout-status-badge status-processing">
                  <AlertCircle size={14} />
                  <span>Processing Payout</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 className="card-heading-title" style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} className="text-accent" />
              <span>Actions & Downloads</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Export this salary slip to a digital PDF copy for official submission or personal records.
            </p>
            
            <button 
              type="button" 
              className="btn btn-outline download-slip-row" 
              onClick={handleDownload}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ArrowDownToLine size={16} />
              <span>Download PDF Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPayroll;
