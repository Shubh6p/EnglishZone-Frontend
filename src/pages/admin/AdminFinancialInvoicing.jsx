import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Landmark, LandmarkIcon, Plus, Save, Clock, HelpCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import './AdminFinancialInvoicing.css';

const AdminFinancialInvoicing = () => {
  const { invoices, generateInvoice } = useContext(AppContext);
  
  // Form states
  const [description, setDescription] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [hasTransport, setHasTransport] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [selectedTier, setSelectedTier] = useState('Grade 10-A');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !baseAmount || !dueDate) return;

    const transportFee = hasTransport ? 800 : 0;
    generateInvoice(selectedTier, baseAmount, transportFee, dueDate, description);

    // Reset Form
    setDescription('');
    setBaseAmount('');
    setHasTransport(false);
    setDueDate('');
    setSelectedTier('Grade 10-A');

    // Toast
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
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
          <span>New invoice generated and distributed dynamically to <strong>{selectedTier}</strong> parents!</span>
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
              <label className="form-label" htmlFor="invTier">Recipient Class Tier</label>
              <select
                id="invTier"
                className="form-control"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
              >
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 10-B">Grade 10-B</option>
                <option value="Grade 9-A">Grade 9-A</option>
                <option value="Grade 9-B">Grade 9-B</option>
                <option value="All Students">All Students (Institutional)</option>
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

            <button type="submit" className="btn btn-accent auth-btn" style={{ marginTop: '8px' }}>
              <Plus size={16} />
              <span>Generate & Release Fee</span>
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
                  <th>Invoice ID</th>
                  <th>Description</th>
                  <th>Tier</th>
                  <th>Amount</th>
                  <th>Deadline</th>
                  <th>Badge Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const total = inv.amount + (inv.transportFee || 0);
                  const isPaid = inv.status === 'Paid';
                  const isOverdue = inv.status === 'Overdue';
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{inv.id}</td>
                      <td style={{ fontWeight: '700' }}>{inv.description}</td>
                      <td>
                        <span className="profile-pill-grade" style={{ fontSize: '0.68rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                          {inv.tier || 'Grade 10-A'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>₹{total.toLocaleString()}</td>
                      <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{inv.dueDate}</td>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancialInvoicing;
