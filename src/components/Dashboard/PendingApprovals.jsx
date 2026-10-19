import React from 'react';
import './PendingApprovals.css';

export const PendingApprovals = ({ users, updateUsers }) => {
  // Filter for pending students
  const pendingStudents = (users || []).filter(u => u.role === 'student' && u.status === 'pending');

  const handleApprove = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    );
    updateUsers(updatedUsers);
  };

  const handleReject = (userId) => {
    // Delete the user from the database entirely
    const updatedUsers = users.filter(user => user.id !== userId);
    updateUsers(updatedUsers);
  };

  return (
    <div className="card table-container">
      <h3 className="chart-title" style={{ marginBottom: '1rem' }}>Pending Approvals</h3>
      
      {pendingStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          No pending student registrations.
        </div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade</th>
              <th>Submitted Date</th>
              <th>Inline Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.grade ? `Grade ${item.grade}` : 'N/A'}</td>
                <td>{new Date(item.id).toLocaleDateString()}</td>
                <td>
                  <div className="action-btns">
                    <button 
                      className="btn-sm btn-success" 
                      onClick={() => handleApprove(item.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-sm btn-danger" 
                      onClick={() => handleReject(item.id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
