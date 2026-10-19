import React, { useState, useEffect } from 'react';
import { Table, Columns, Info, Calendar, Maximize, CheckCircle2, XCircle, Check, X, Expand, ShieldCheck, AlertTriangle } from 'lucide-react';
import './PaymentVerification.css';

// Mock receipt image for UI representation
const receiptUrl = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80";

const defaultPayments = [
  {
    id: 1,
    ref: 'KIA-REC-2026-001',
    studentName: 'Saman Perera',
    studentId: 'KIA-STU-001',
    amount: '15,000',
    type: 'Tuition',
    bank: 'XYZ Bank',
    date: '12/05/26',
    branch: '123',
    ocrBankValid: true,
    ocrDateValid: true,
    ocrBranchValid: false,
    submittedDate: '12/05/26',
    status: 'Pending',
    statusType: 'pending',
    reviewer: 'admin_jayasinha',
    estimatedSla: '4hrs'
  },
  {
    id: 2,
    ref: 'KIA-REC-2026-002',
    studentName: 'Nimal de Silva',
    studentId: 'KIA-STU-002',
    amount: '5,000',
    type: 'Exam',
    bank: 'LMN Bank',
    date: '13/05/26',
    branch: '456',
    ocrBankValid: true,
    ocrDateValid: true,
    ocrBranchValid: true,
    submittedDate: '13/05/26',
    status: 'Verified',
    statusType: 'verified',
    reviewer: 'admin_ilan'
  },
  {
    id: 3,
    ref: 'KIA-REC-2026-003',
    studentName: 'Priya Fernando',
    studentId: 'KIA-STU-003',
    amount: '2,500',
    type: 'Activity',
    bank: 'PQR Bank',
    date: '11/05/26',
    branch: '789',
    ocrBankValid: true,
    ocrDateValid: true,
    ocrBranchValid: false,
    submittedDate: '11/05/26',
    status: 'Rejected',
    statusType: 'rejected',
    reviewer: 'admin_jayasinha',
    rejectReason: 'Receipt blurry and branch unreadable.'
  }
];

export const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [view, setView] = useState('table');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [ocrBank, setOcrBank] = useState('');
  const [ocrDate, setOcrDate] = useState('');
  const [ocrBranch, setOcrBranch] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [notification, setNotification] = useState(null);
  
  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kia_payments');
    if (saved) {
      setPayments(JSON.parse(saved));
    } else {
      setPayments(defaultPayments);
      localStorage.setItem('kia_payments', JSON.stringify(defaultPayments));
    }
  }, []);

  const selectedPayment = payments.find(p => p.id === selectedPaymentId);

  // Sync state when selecting a new payment
  useEffect(() => {
    if (selectedPayment) {
      setOcrBank(selectedPayment.bank || '');
      setOcrDate(selectedPayment.date || '');
      setOcrBranch(selectedPayment.branch || '');
      setRejectReason(selectedPayment.rejectReason || '');
      setRejectError('');
    }
  }, [selectedPayment]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = () => {
    const updated = payments.map(p => {
      if (p.id === selectedPaymentId) {
        return {
          ...p,
          status: 'Verified',
          statusType: 'verified',
          bank: ocrBank,
          date: ocrDate,
          branch: ocrBranch,
          reviewer: 'You (Admin)'
        };
      }
      return p;
    });
    setPayments(updated);
    localStorage.setItem('kia_payments', JSON.stringify(updated));
    showNotification(`Payment Verified. Receipt generated and sent to ${selectedPayment.studentName}.`);
    setSelectedPaymentId(null);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setRejectError('A rejection reason is strictly required.');
      return;
    }
    
    const updated = payments.map(p => {
      if (p.id === selectedPaymentId) {
        return {
          ...p,
          status: 'Rejected',
          statusType: 'rejected',
          rejectReason: rejectReason,
          reviewer: 'You (Admin)'
        };
      }
      return p;
    });
    setPayments(updated);
    localStorage.setItem('kia_payments', JSON.stringify(updated));
    showNotification(`Payment Rejected. Notification sent to ${selectedPayment.studentName}.`);
    setSelectedPaymentId(null);
  };

  const filteredPayments = payments.filter(p => {
    const matchStatus = filterStatus === 'All' || p.statusType === filterStatus.toLowerCase();
    const matchType = filterType === 'All' || p.type.toLowerCase() === filterType.toLowerCase();
    const matchSearch = p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || p.studentId.toLowerCase().includes(searchQuery.toLowerCase()) || p.ref.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  return (
    <div className="payments-container">
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <img src={receiptUrl} alt="Receipt Full" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
          <button style={{position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer'}} onClick={() => setLightboxOpen(false)}>
            <X size={32} />
          </button>
        </div>
      )}

      <h1 className="payments-title">Payment Verification Queue</h1>
      
      {notification && (
        <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', marginBottom: '1.5rem'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <div className="filter-item">
          <label className="filter-label">Status</label>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Verified</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Payment Type</label>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option>All</option>
            <option>Tuition</option>
            <option>Exam</option>
            <option>Activity</option>
          </select>
        </div>

        <div className="filter-item" style={{ flex: 1, minWidth: '200px' }}>
          <label className="filter-label">Search Student Name or ID</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="filter-input" 
              style={{ flex: 1 }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Saman or KIA-STU-001"
            />
          </div>
        </div>
      </div>

      <div className={`payments-layout ${selectedPaymentId ? 'with-panel' : 'without-panel'}`}>
        <div className="table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Reference</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status / SLA</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>No payments match your filters.</td>
                </tr>
              ) : filteredPayments.map(payment => (
                <tr 
                  key={payment.id} 
                  className={`payment-row ${selectedPaymentId === payment.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentId(payment.id)}
                >
                  <td>
                    <div className="thumbnail-container">
                      <img src={receiptUrl} alt="Receipt" className="receipt-img" />
                      <button className="fullscreen-btn" onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}>
                        <Maximize size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="cell-data">
                      <span className="primary-text" style={{ whiteSpace: 'nowrap' }}>{payment.ref}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-data">
                      <span className="primary-text">{payment.studentName}</span>
                      <span className="secondary-text">{payment.studentId}</span>
                    </div>
                  </td>
                  <td>
                    <span className="primary-text">{payment.amount}</span>
                  </td>
                  <td>
                    <span className="primary-text">{payment.type}</span>
                  </td>
                  <td>
                    <div className="cell-data">
                      <span className={`status-badge status-${payment.statusType}`}>
                        {payment.status} {payment.statusType === 'pending' && `(Est: ${payment.estimatedSla})`}
                      </span>
                      <span className="reviewer-text">{payment.statusType === 'pending' ? 'Reviewer: ' : 'By: '}{payment.reviewer}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedPayment && (
          <div className="verification-panel">
            <div className="vp-header">
              <span className="vp-title">Verify: {selectedPayment.ref}</span>
              <button className="vp-close" onClick={() => setSelectedPaymentId(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="vp-receipt-preview" onClick={() => setLightboxOpen(true)} style={{cursor: 'pointer'}}>
              <img src={receiptUrl} alt="Receipt preview" className="vp-receipt-img" />
              <button className="vp-expand">
                <Expand size={16} />
              </button>
            </div>

            <div className="vp-student-info">
              <div className="vp-student-name">{selectedPayment.studentName}</div>
              <div className="vp-student-id">{selectedPayment.studentId}</div>
              <div style={{fontWeight: 600, color: '#0f172a', marginTop: '0.5rem', fontSize: '1.25rem'}}>
                LKR {selectedPayment.amount}
              </div>
            </div>

            {selectedPayment.statusType === 'pending' ? (
              <>
                <div className="vp-form-group">
                  <label className="vp-label">Bank Name (OCR Correctable)</label>
                  <div className="vp-input-row">
                    <input type="text" className="vp-input" value={ocrBank} onChange={(e) => setOcrBank(e.target.value)} />
                    {selectedPayment.ocrBankValid ? <Check size={16} className="ocr-valid" /> : <X size={16} className="ocr-invalid" />}
                  </div>
                </div>

                <div className="vp-form-group">
                  <label className="vp-label">Transaction Date (OCR Correctable)</label>
                  <div className="vp-input-row">
                    <input type="text" className="vp-input" value={ocrDate} onChange={(e) => setOcrDate(e.target.value)} />
                    {selectedPayment.ocrDateValid ? <Check size={16} className="ocr-valid" /> : <X size={16} className="ocr-invalid" />}
                  </div>
                </div>

                <div className="vp-form-group">
                  <label className="vp-label">Branch (OCR Correctable)</label>
                  <div className="vp-input-row">
                    <input type="text" className="vp-input" value={ocrBranch} onChange={(e) => setOcrBranch(e.target.value)} />
                    {selectedPayment.ocrBranchValid ? <Check size={16} className="ocr-valid" /> : <X size={16} className="ocr-invalid" />}
                  </div>
                </div>

                <div className="vp-actions">
                  <button className="btn-approve" onClick={handleApprove}><ShieldCheck size={16} /> Approve</button>
                  <button className="btn-reject" onClick={handleReject}><XCircle size={16} /> Reject</button>
                </div>

                <div className="vp-form-group" style={{marginTop: '1rem'}}>
                  <label className="vp-label">Rejection Reason (Required for rejection)</label>
                  <textarea 
                    className={`vp-textarea ${rejectError ? 'error-border' : ''}`} 
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      if (e.target.value.trim()) setRejectError('');
                    }}
                    placeholder="Enter reason if rejecting..."
                  ></textarea>
                  {rejectError && <div style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px'}}><AlertTriangle size={12} /> {rejectError}</div>}
                </div>
              </>
            ) : (
              <div style={{marginTop: '2rem', padding: '1.5rem', backgroundColor: selectedPayment.statusType === 'verified' ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', border: `1px solid ${selectedPayment.statusType === 'verified' ? '#bbf7d0' : '#fecaca'}`}}>
                <h4 style={{margin: '0 0 1rem 0', color: selectedPayment.statusType === 'verified' ? '#166534' : '#991b1b'}}>
                  This payment was {selectedPayment.status.toUpperCase()}
                </h4>
                <p style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem'}}><strong>Bank:</strong> {selectedPayment.bank}</p>
                <p style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem'}}><strong>Date:</strong> {selectedPayment.date}</p>
                <p style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem'}}><strong>Branch:</strong> {selectedPayment.branch}</p>
                {selectedPayment.statusType === 'rejected' && (
                  <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fecaca'}}>
                    <strong style={{fontSize: '0.875rem', color: '#991b1b'}}>Rejection Reason:</strong>
                    <p style={{margin: '0.25rem 0 0 0', fontSize: '0.875rem'}}>{selectedPayment.rejectReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
