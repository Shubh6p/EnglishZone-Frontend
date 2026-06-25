import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Landmark, LandmarkIcon, Plus, Save, Clock, HelpCircle, CheckCircle2, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import './AdminFinancialInvoicing.css';

const AdminFinancialInvoicing = () => {
  const { request, loading } = useApi();
  const [invoices, setInvoices] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Form states
  const [description, setDescription] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [hasTransport, setHasTransport] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fetchInvoices = async () => {
    try {
      const data = await request('/invoices', 'GET');
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await request('/academics/classes', 'GET');
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch classes', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !baseAmount || !dueDate) return;

    const transportFee = hasTransport ? 800 : 0;
    const finalAmount = parseFloat(baseAmount) + transportFee;

    try {
      await request('/invoices', 'POST', {
        classId: selectedClassId || undefined,
        amount: finalAmount,
        description: description + (hasTransport ? ' (+ Transport)' : ''),
        dueDate
      });

      // Reset Form
      setDescription('');
      setBaseAmount('');
      setHasTransport(false);
      setDueDate('');

      // Refresh list
      fetchInvoices();

      // Toast
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to create invoice', err);
    }
  };

  const markAsPaid = async (invoiceId) => {
    try {
      await request(`/invoices/${invoiceId}/pay`, 'PUT');
      fetchInvoices();
    } catch (err) {
      console.error('Failed to mark as paid', err);
    }
  };

  return (
    <div className="financial-invoicing-container fade-in">
      {/* Header */}
      <div>
        <h2 className="card-heading-title" style={{ fontSize: '1.75rem' }}>Financial Invoicing & Billing</h2>
        <p className="card-heading-sub">Construct student invoice fees, adjust transit add-ons, and audit payment receipts</p>
      </div>

      {showToast && (
        <div className="alert-toast">
          <CheckCircle2 size={20} />
          <span>New invoice generated and emails dispatched to parents!</span>
        </div>
      )}

      <div className="financial-split-grid">
        {/* Left: Invoice Generator Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
            <Landmark size={20} className="text-accent" />
            <h3 className="card-heading-title">Generate Fee Slip</h3>
          </div>

          <form onSubmit={handleSubmit} className="resource-upload-form">
            <div className="form-group">
              <label className="form-label" htmlFor="invDesc">Billing Description</label>
              <input
                id="invDesc"
                type="text"
                placeholder="e.g. July Tuition Fee"
                className="form-control"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="invTier">Recipient Class</label>
              <select
                id="invTier"
                className="form-control"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">-- Institutional (All) --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="invBase">Base Tuition Fee (₹)</label>
              <input
                id="invBase"
                type="number"
                placeholder="e.g. 2500"
                className="form-control"
                required
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
              />
            </div>

            <div className="invoice-checkbox-row">
              <input
                id="invTransport"
                type="checkbox"
                className="invoice-checkbox"
                checked={hasTransport}
                onChange={(e) => setHasTransport(e.target.checked)}
              />
              <label htmlFor="invTransport" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                Add Transport Service Fee (+ ₹800)
              </label>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="invDue">Payment Deadline Date</label>
              <input
                id="invDue"
                type="date"
                className="form-control"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Preview:</strong> Total invoice amount per student will be <strong>₹{((parseFloat(baseAmount) || 0) + (hasTransport ? 800 : 0)).toLocaleString()}</strong>.
            </div>

            <button type="submit" className="btn btn-accent auth-btn" style={{ marginTop: '8px' }} disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span>{loading ? 'Generating...' : 'Generate & Release Fee'}</span>
            </button>
          </form>
        </div>

        {/* Right: Invoices Log */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '20px' }}>
            <LandmarkIcon size={20} className="text-primary" />
            <h3 className="card-heading-title">Accounts Billing Log</h3>
          </div>

          <div className="attendance-table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Class/Student</th>
                  <th>Amount</th>
                  <th>Deadline</th>
                  <th>Badge Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const isPaid = inv.status === 'Paid';
                    const isOverdue = inv.status === 'Overdue';
                    return (
                      <tr key={inv._id}>
                        <td style={{ fontWeight: '700' }}>{inv.description}</td>
                        <td>
                          <span className="profile-pill-grade" style={{ fontSize: '0.68rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                            {inv.classId ? inv.classId.name : inv.studentId ? inv.studentId.fullName : 'Institutional'}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700' }}>₹{inv.amount.toLocaleString()}</td>
                        <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={
                            isPaid 
                              ? 'invoice-badge-paid' 
                              : isOverdue 
                                ? 'invoice-badge-overdue' 
                                : 'invoice-badge-pending'
                          }>
                            {inv.status}
                          </span>
                        </td>
                        <td>
                           {!isPaid && (
                             <button
                               onClick={() => markAsPaid(inv._id)}
                               className="btn"
                               style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success-color)' }}
                               title="Mark as Paid"
                             >
                               <CheckCircle size={14} />
                               <span>Pay</span>
                             </button>
                           )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialInvoicing;
