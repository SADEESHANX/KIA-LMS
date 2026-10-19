import React, { useState } from 'react';
import { Download } from 'lucide-react';
import qrCodeImg from '../../assets/qr_code.jpg';
import './StudentPayments.css';

export const StudentPayments = () => {
  const [showModal, setShowModal] = useState(true); // Default to show modal based on screenshot

  const tableData = [
    { date: 'May 28, 2026', type: 'Tuition Fee', amount: 'LKR 15,000', status: 'Paid', ref: 'KIA-REC-2026-00123' },
    { date: 'April 15, 2026', type: 'Registration', amount: 'LKR 10,000', status: 'Paid', ref: 'KIA-REC-2026-00098' },
    { date: 'June 10, 2026', type: 'Exam Fee', amount: 'LKR 5,000', status: 'Pending', ref: 'KIA-REC-2026-00130' },
    { date: 'July 1, 2026', type: 'Library Fee', amount: 'LKR 2,500', status: 'Overdue', ref: 'KIA-REC-2026-00141' },
  ];

  return (
    <div className="sph-container">
      
      {/* Header */}
      <div className="sph-header">
        <h1 className="sph-title">Payment History</h1>
        <p className="sph-subtitle">Finish Term 2 Strong! Your potential is unlimited.</p>
      </div>

      {/* Summary Card */}
      <div className="sph-summary-card">
        <div className="sph-summary-section">
          <div className="sph-summary-label">Outstanding Balance</div>
          <div className="sph-summary-val red">LKR 5,000</div>
        </div>
        <div className="sph-summary-divider"></div>
        <div className="sph-summary-section">
          <div className="sph-summary-label">Paid-to-Date</div>
          <div className="sph-summary-val green">LKR 35,000</div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="sph-table-card">
        <h2 className="sph-card-title">Ledger Table</h2>
        
        <div className="sph-table-container">
          <table className="sph-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference No.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.type}</td>
                  <td className="fw-500">{row.amount}</td>
                  <td>
                    <span className={`sph-status-pill ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="text-muted">{row.ref}</td>
                  <td>
                    <button className="sph-btn-download" onClick={() => setShowModal(true)}>
                      <Download size={14} /> Download Voucher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="sph-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sph-modal" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="sph-modal-header">
              <div className="sph-modal-logo">
                <div className="sph-logo-shield">KIA</div>
              </div>
              <div className="sph-modal-title-text">PAYMENT VOUCHER</div>
            </div>

            {/* Modal Body */}
            <div className="sph-modal-body">
              
              {/* Left Side: Details */}
              <div className="sph-modal-details">
                <div className="sph-detail-row">
                  <span className="sph-strong">Name:</span> Wimal Dissanayake
                </div>
                <div className="sph-detail-row">
                  Receipt
                </div>
                
                <div className="sph-amount-block">
                  <span className="sph-strong">LKR Amount:</span> LKR 5,000
                </div>

                <div className="sph-detail-grid">
                  <div className="sph-strong">Date:</div>
                  <div>May 28, 2026</div>
                  
                  <div className="sph-strong">Type:</div>
                  <div>Tuition Fee</div>
                  
                  <div className="sph-strong">Status:</div>
                  <div>Pending</div>
                </div>
              </div>

              {/* Right Side: QR Code */}
              <div className="sph-modal-qr-section">
                <img src={qrCodeImg} alt="QR Code" className="sph-qr-img" />
                <div className="sph-qr-label">Verification QR Code</div>
                <div className="sph-qr-desc">Verification instructions<br/>with neema payment.</div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
