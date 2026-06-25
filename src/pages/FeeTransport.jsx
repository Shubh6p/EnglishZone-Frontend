import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import { Landmark, Bus, Plus, Send, ShieldCheck, DollarSign, Calendar, IndianRupee, FileText, X, Loader2 } from 'lucide-react';
import './FeeTransport.css';

const FeeTransport = ({ defaultView = 'fees' }) => {
  const { request, loading } = useApi();
  const [invoices, setInvoices] = useState([]);
  const [viewTab, setViewTab] = useState(defaultView); // 'fees' or 'transport'
  
  // Simulated invoice review
  const [activeReceipt, setActiveReceipt] = useState(null);
  
  // Simulated payment gateway state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [transitBus, setTransitBus] = useState(null);

  const fetchInvoices = async () => {
    try {
      const data = await request('/invoices', 'GET');
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  };

  const fetchTransit = async () => {
    try {
      const transitData = await request('/transit', 'GET');
      if (transitData && transitData.length > 0) {
        setTransitBus(transitData[0]);
      }
    } catch (err) {
      console.error('Failed to fetch transit info', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchTransit();
  }, []);

  const calculateTotals = () => {
    let pending = 0;
    let overdue = 0;
    let paid = 0;
    
    invoices.forEach(inv => {
      const total = inv.amount;
      if (inv.status === 'Pending') pending += total;
      else if (inv.status === 'Overdue') overdue += total;
      else if (inv.status === 'Paid') paid += total;
    });

    return { pending, overdue, paid };
  };

  const totals = calculateTotals();

  const handlePayInvoice = async (id) => {
    setIsProcessingPayment(true);
    // Simulate secure payment gateway redirect and processing time
    setTimeout(async () => {
      try {
        await request(`/invoices/${id}/pay`, 'PUT');
        fetchInvoices();
        setIsProcessingPayment(false);
        alert(`Payment Successful!\nInvoice ${id} has been securely processed and marked as PAID.\nReceipt generated.`);
        setActiveReceipt(null);
      } catch (err) {
        console.error('Failed to mark as paid', err);
        setIsProcessingPayment(false);
      }
    }, 2500);
  };

  return (
    <div className="billing-wrapper fade-in">
      <div className="billing-header-row">
        <div>
          <h2 className="workspace-heading">Fees & Transport</h2>
          <p className="workspace-subheading">Track bills, check transport integrations, and manage school invoices</p>
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="billing-mode-tabs">
        <button 
          className={`mode-tab-btn ${viewTab === 'fees' ? 'active' : ''}`}
          onClick={() => setViewTab('fees')}
        >
          <Landmark size={18} />
          <span>Tuition & Billing Invoices</span>
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
              <h3 className="bal-amt text-warning">&#8377; {totals.pending.toLocaleString()}</h3>
              <p className="bal-desc">Clear before due date</p>
            </div>
            <div className="balance-card overdue-card">
              <span className="bal-lbl">Overdue Balance</span>
              <h3 className="bal-amt text-error">&#8377; {totals.overdue.toLocaleString()}</h3>
              <p className="bal-desc">Subject to late fee bounds</p>
            </div>
            <div className="balance-card paid-card">
              <span className="bal-lbl">Cleared This Term</span>
              <h3 className="bal-amt text-success">&#8377; {totals.paid.toLocaleString()}</h3>
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
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th className="actions-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && invoices.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                        <Loader2 className="animate-spin text-primary" size={24} style={{ margin: '0 auto' }}/>
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                        You have no invoices.
                      </td>
                    </tr>
                  ) : invoices.map((inv) => {
                    const total = inv.amount;
                    return (
                      <tr key={inv._id}>
                        <td>
                          <div className="inv-desc-col font-bold">
                            <span>{inv.description}</span>
                          </div>
                        </td>
                        <td className="text-muted">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="numeric-col font-bold text-primary">&#8377; {total.toLocaleString()}</td>
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
                                onClick={() => handlePayInvoice(inv._id)}
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
                    <span className="tr-val">{transitBus ? transitBus.route : 'Route 14 (Bengaluru South)'}</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Bus Reg Number</span>
                    <span className="tr-val">{transitBus ? transitBus.busNumber : 'KA-51-EZ-8824'}</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Driver Name</span>
                    <span className="tr-val">{transitBus ? transitBus.driverName : "Mr. Anthony D'Souza"}</span>
                  </div>
                  <div className="transit-info-item">
                    <span className="tr-lbl">Driver Phone</span>
                    <span className="tr-val text-primary">{transitBus ? transitBus.driverPhone : '+91 99887 76655'}</span>
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
              <p className="card-heading-desc">Real-time GPS tracking for Bus {transitBus ? transitBus.busNumber : 'KA-51-EZ-8824'}</p>
              
              <div className="live-route-mock-map">
                <div className="map-route-line"></div>
                <div className="map-stop start-campus">
                  <span className="stop-marker"></span>
                  <span className="stop-name">Campus</span>
                </div>
                <div className="map-stop active-bus-position">
                  <Bus size={18} className="bus-gps-icon animate-pulse-slow" />
                  <span className="stop-name">{transitBus ? transitBus.route : 'Bus 24 (In Transit)'}</span>
                </div>
                <div className="map-stop end-stop">
                  <span className="stop-marker"></span>
                  <span className="stop-name">End Terminal</span>
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

      {/* Payment Gateway Processing Overlay */}
      {isProcessingPayment && (
        <div className="modal-overlay fade-in" style={{ zIndex: 9999 }}>
          <div className="modal-content scale-up" style={{ maxWidth: '400px', textAlign: 'center', padding: '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div className="avatar-frame-large" style={{ margin: '0 auto', borderColor: 'var(--success-color)', padding: '10px' }}>
                <Landmark size={40} className="text-success animate-pulse-slow" />
              </div>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Secure Payment Gateway</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Redirecting to banking partner and processing your transaction securely. Please do not refresh or close this window.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
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
                  <span className="val">{activeReceipt._id}</span>
                </div>
                <div>
                  <span className="lbl">Date of Generation</span>
                  <span className="val">{new Date(activeReceipt.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="lbl">Payment Due Date</span>
                  <span className="val">{new Date(activeReceipt.dueDate).toLocaleDateString()}</span>
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
                  <span>{activeReceipt.description}</span>
                  <span>&#8377; {activeReceipt.amount.toLocaleString()}</span>
                </div>
                <div className="receipt-divider"></div>
                <div className="r-total-row">
                  <span>Total Amount Due</span>
                  <span>&#8377; {activeReceipt.amount.toLocaleString()}</span>
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
                  onClick={() => handlePayInvoice(activeReceipt._id)}
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
