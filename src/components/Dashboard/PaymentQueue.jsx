import React from 'react';
import './PaymentQueue.css';
import './PendingApprovals.css'; // Reusing table styles

const payments = [
  { id: 1, name: 'Student Name', amount: '$150.00', status: 'Pending — assigned to Sarah J.', date: '07/29/2023' },
  { id: 2, name: 'Student Name', amount: '$100.00', status: 'Pending — assigned to Sarah J.', date: '07/29/2023' },
];

export const PaymentQueue = () => {
  return (
    <div className="card payment-queue">
      <div className="chart-header">
        <h3 className="chart-title">Payment verification queue preview</h3>
        <p className="chart-subtitle">Payments needing queue to review</p>
      </div>
      
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Receipt Thumbnail</th>
              <th>Student Name</th>
              <th>Amount</th>
              <th>Status Badge</th>
              <th>Submitted Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item) => (
              <tr key={item.id}>
                <td><div className="thumbnail-placeholder"></div></td>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>
                  <span className="status-badge">{item.status}</span>
                </td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
