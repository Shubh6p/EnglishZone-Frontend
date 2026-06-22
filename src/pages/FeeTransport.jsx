import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Landmark, Bus, Plus, Send, ShieldCheck, DollarSign, Calendar, IndianRupee, FileText, X } from 'lucide-react';
import './FeeTransport.css';

const FeeTransport = ({ defaultView = 'fees' }) => {
  const { invoices, addInvoice, updateInvoiceStatus } = useContext(AppContext);
  const [viewTab, setViewTab] = useState(defaultView); // 'fees' or 'transport'
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  
  // Invoice form state
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [transFee, setTransFee] = useState('800');
  const [invStatus, setInvStatus] = useState('Pending');
  
  // Simulated invoice review
  const [activeReceipt, setActiveReceipt] = useState(null);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!desc || !amt) {
      alert('Please fill in Description and Tuition Amount');
      return;
    }
    
    addInvoice(desc, amt, transFee, invStatus);
    
    // Clear state
    setDesc('');
    setAmt('');
    setTransFee('800');
    setInvStatus('Pending');
    setShowInvoiceGenerator(false);
    alert('Administrative Invoice Generated Successfully!\nIt has been posted to the Student Portal.');
  };

  const calculateTotals = () => {
    let pending = 0;
    let overdue = 0;
    let paid = 0;
    
    invoices.forEach(inv => {
      const total = inv.amount + inv.transportFee;
      if (inv.status === 'Pending') pending += total;
      else if (inv.status === 'Overdue') overdue += total;
      else if (inv.status === 'Paid') paid += total;
    });

    return { pending, overdue, paid };
  };

  const totals = calculateTotals();

  const handlePayInvoiceSimulate = (id) => {
    updateInvoiceStatus(id, 'Paid');
    alert(`Payment Simulation Successful!\nInvoice ${id} has been marked as PAID.\nReceipt generated.`);
  };

  return (
    <div className="billing-wrapper fade-in">
      <div className="billing-header-row">
        <div>
          <h2 className="workspace-heading">Administrative Fees & Transport</h2>
          <p className="workspace-subheading">Track bills, check transport integrations, and manage school invoices</p>
        </div>

        <div className="billing-quick-actions">
          <button 
            className="btn btn-accent btn-sm admin-console-btn"
            onClick={() => setShowInvoiceGenerator(true)}
          >
            <Plus size={16} />
            <span>Admin Console: Post Invoice</span>
          </button>
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="billing-mode-tabs">
        <button 
          className={`mode-tab-btn ${viewTab === 'fees' ? 'active' : ''}`}
          onClick={() => setViewTab('fees')}
        >
          <Landmark size={18} />
          <span>Tuition & billing Invoices</span>
        </button>
        <button 
          className={`mode-tab-btn ${viewTab === 'transport' ? 'active' : ''}`}
          onClick={() => setViewTab('transport')}
        >
          <Bus size={18} />
          <span>School Transport Integration</span>
        </button>
      </div>

      {viewTab === 'fees' ? (
        <div className="billing-fees-view scale-up">
          {/* Quick Balance Cards */}
          <div className="balance-grid">
            <div className="balance-card pending-card">
              <span className="bal-lbl">Pending Balance</span>
              <h3 className="bal-amt text-warning">&#8377; {totals.pending}</h3>
              <p className="bal-desc">Clear before due date</p>
            </div>
            <div className="balance-card overdue-card">
              <span className="bal-lbl">Overdue Balance</span>
              <h3 className="bal-amt text-error">&#8377; {totals.overdue}</h3>
              <p className="bal-desc">Subject to late fee bounds</p>
            </div>
            <div className="balance-card paid-card">
              <span className="bal-lbl">Cleared This Term</span>
              <h3 className="bal-amt text-success">&#8377; {totals.paid}</h3>
              <p className="bal-desc">Receipts available</p>
            </div>
          </div>

          {/* Invoices List Card */}
          <div className="dash-card invoices-table-card">
            <h3 className="card-heading-title">Recent Student Invoices</h3>
            <div className="table-responsive-wrapper" style={{ marginTop: '16px' }}>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Billing Month</th>
                    <th>Description</th>
                    <th>Tuition Fee</th>
                    <th>Transport Fee</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th className="actions-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const total = inv.amount + inv.transportFee;
                    return (
                      <tr key={inv.id}>
                        <td className="font-bold">{inv.id}</td>
                        <td className="text-muted">{inv.dueDate.split('-').slice(0,2).join('/')}</td>
                        <td>
                          <div className="inv-desc-col font-bold">
                            <span>{inv.description}</span>
                            <span className="inv-type-pill-sub">{inv.type}</span>
                          </div>
                        </td>
                        <td className="numeric-col">&#8377; {inv.amount}</td>
                        <td className="numeric-col text-accent">&#8377; {inv.transportFee}</td>
                        <td className="numeric-col font-bold text-primary">&#8377; {total}</td>
                        <td>
                          <StatusBadge status={inv.status} />
                        </td>
                        <td>
                          <div className="billing-action-buttons">
                            <button 
                              className="btn-link view-receipt-btn" 
                              onClick={() => setActiveReceipt(inv)}
                              title="View Invoice Receipt"
                            >
                              <FileText size={16} />
                            </button>
                            {inv.status !== 'Paid' && (
                              <button 
                                className="btn btn-accent btn-sm pay-invoice-btn"
                                onClick={() => handlePayInvoiceSimulate(inv.id)}
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="billing-transport-view scale-up">
          <div className="transport-layout-split">
            {/* Bus details card */}
            <div className="dash-card bus-details-card">
              <h3 className="card-heading-title flex-align-center gap-8">
                <Bus size={22} className="text-accent" />
                <span>Active School Transit Service</span>
              </h3>
              
              <div className="transit-profile-details">
                <div className="transit-grid-info">
                  <div className="transit-info-item">
                    <span className="tr-lbl">Route Designation</span>
                    <span className="tr-val">Route 14 (Bengaluru South)</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Bus Reg Number</span>
                    <span className="tr-val">KA-51-EZ-8824</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Driver Name</span>
                    <span className="tr-val">Mr. Anthony D'Souza</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Driver Phone</span>
                    <span className="tr-val text-primary">+91 99887 76655</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Morning Pick-Up</span>
                    <span className="tr-val">08:15 AM (Sector 15 Main Corner)</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Evening Drop-Off</span>
                    <span className="tr-val">04:20 PM (Sector 15 Main Corner)</span>
                  </div>
                </div>

                <div className="transit-fees-breakdown-box">
                  <h4 className="breakdown-title">Integrated Billing Breakdown</h4>
                  <p className="breakdown-para">
                    Your transport services are linked to the student portal. The monthly flat charge is:
                  </p>
                  <div className="breakdown-fee-row">
                    <span className="fee-label-txt">Transport Fee / Month:</span>
                    <span className="fee-value-num">&#8377; 800.00</span>
                  </div>
                  <p className="breakdown-footer-txt text-muted">
                    This charge is itemized automatically alongside the general tuition fee in the invoice.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Live Route Map Card */}
            <div className="dash-card transit-route-map-card">
              <h3 className="card-heading-title">Live Route Tracking</h3>
              <p className="card-heading-desc">Real-time GPS tracking for Bus KA-51-EZ-8824</p>
              
              <div className="live-route-mock-map">
                <div className="map-route-line"></div>
                <div className="map-stop start-campus">
                  <span className="stop-marker"></span>
                  <span className="stop-name">Campus</span>
                </div>
                <div className="map-stop active-bus-position">
                  <Bus size={18} className="bus-gps-icon animate-pulse-slow" />
                  <span className="stop-name">Bus 24 (In Transit)</span>
                </div>
                <div className="map-stop end-stop">
                  <span className="stop-marker"></span>
                  <span className="stop-name">HSR Layout</span>
                </div>
              </div>
              
              <div className="gps-status-bar">
                <span className="gps-indicator-glow"></span>
                <span>GPS Active &bull; Speed: 32 km/h &bull; ETA to stop: 8 mins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Invoice Poster Modal */}
      {showInvoiceGenerator && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up">
            <button className="modal-close" onClick={() => setShowInvoiceGenerator(false)}>&times;</button>
            <h3 className="modal-heading-text flex-align-center gap-8">
              <Landmark className="text-accent" size={22} />
              <span>Admin Console: Post New Invoice</span>
            </h3>
            <p className="modal-subheading-text">Simulated administrative tool to create student fee invoices.</p>

            <form onSubmit={handleCreateInvoice} className="apply-form">
              <div className="form-group">
                <label className="form-label" htmlFor="descriptionInput">Invoice Description</label>
                <input 
                  id="descriptionInput"
                  type="text" 
                  className="form-control" 
                  required 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. July Tuition Fee, Term I Library Fee" 
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="tuitionAmountInput">Tuition Fee (&#8377;)</label>
                  <input 
                    id="tuitionAmountInput"
                    type="number" 
                    className="form-control" 
                    required 
                    min="0"
                    value={amt}
                    onChange={(e) => setAmt(e.target.value)}
                    placeholder="2500" 
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="transportFeeInput">Transport Fee (&#8377;)</label>
                  <input 
                    id="transportFeeInput"
                    type="number" 
                    className="form-control" 
                    required 
                    min="0"
                    value={transFee}
                    onChange={(e) => setTransFee(e.target.value)}
                    placeholder="800" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="invoiceStatusSelect">Initial Invoice Status</label>
                <select 
                  id="invoiceStatusSelect"
                  className="form-control"
                  value={invStatus}
                  onChange={(e) => setInvStatus(e.target.value)}
                >
                  <option value="Pending">Pending (Unpaid)</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue (Delayed)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-full apply-submit-btn" style={{ marginTop: '8px' }}>
                <Send size={16} />
                <span>Post Invoice to Portal</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Preview Modal */}
      {activeReceipt && (
        <div className="modal-overlay fade-in">
          <div className="modal-content scale-up receipt-modal-width">
            <button className="modal-close" onClick={() => setActiveReceipt(null)}>&times;</button>
            
            <div className="receipt-paper">
              <div className="receipt-header">
                <Landmark className="receipt-icon" size={32} />
                <h3>ENGLISH ZONE ACADEMICS</h3>
                <p>Fee Payment Statement & Invoice Receipt</p>
              </div>

              <div className="receipt-meta-grid">
                <div>
                  <span className="lbl">Invoice Number</span>
                  <span className="val">{activeReceipt.id}</span>
                </div>
                <div>
                  <span className="lbl">Date of Generation</span>
                  <span className="val">{activeReceipt.date}</span>
                </div>
                <div>
                  <span className="lbl">Payment Due Date</span>
                  <span className="val">{activeReceipt.dueDate}</span>
                </div>
                <div>
                  <span className="lbl">Invoice Status</span>
                  <span className="val" style={{fontWeight: 800}}>{activeReceipt.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-items-table">
                <div className="r-item-header">
                  <span>Itemized Fee Description</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="r-item-row">
                  <span>Tuition & Lecture Facilities ({activeReceipt.description})</span>
                  <span>&#8377; {activeReceipt.amount}.00</span>
                </div>
                <div className="r-item-row">
                  <span>School Transport Services (Route 14 Bus)</span>
                  <span>&#8377; {activeReceipt.transportFee}.00</span>
                </div>
                <div className="receipt-divider"></div>
                <div className="r-total-row">
                  <span>Total Amount Due</span>
                  <span>&#8377; {activeReceipt.amount + activeReceipt.transportFee}.00</span>
                </div>
              </div>

              <div className="receipt-footer-seal">
                <ShieldCheck className="text-success" size={24} />
                <span>English Zone Board of Accounts Verified</span>
              </div>
            </div>

            <div className="video-notes-row">
              <button className="btn btn-outline w-full" onClick={() => setActiveReceipt(null)}>Close Statement</button>
              {activeReceipt.status !== 'Paid' && (
                <button 
                  className="btn btn-accent w-full"
                  onClick={() => { handlePayInvoiceSimulate(activeReceipt.id); setActiveReceipt(null); }}
                >
                  Pay Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTransport;
