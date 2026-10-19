import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, PauseCircle, Power, Key, Edit, X, Check, Trash2, ShieldAlert } from 'lucide-react';
import './AccessControl.css';

const defaultMockUsers = [
  { id: 1, name: 'S. Jayasinha', email: 's.jaya@kia.edu', role: 'admin', roleClass: 'role-admin', status: 'active', failedAttempts: 0, auditLog: [], img: 'https://ui-avatars.com/api/?name=S+J&background=random' },
  { id: 2, name: 'W. Perera', email: 'wn.perera@gmail.com', role: 'teacher', roleClass: 'role-teacher', status: 'active', failedAttempts: 0, auditLog: [], img: 'https://ui-avatars.com/api/?name=W+P&background=random' },
  { id: 3, name: 'K. Rodrigo', email: 'guest@kia.edu', role: 'guest', roleClass: 'role-guest', status: 'active', failedAttempts: 0, auditLog: [], img: 'https://ui-avatars.com/api/?name=K+R&background=random' },
];

const modules = ['Student Records', 'Payments', 'Content Upload', 'Assessments', 'Reports', 'Announcements'];
const roles = ['admin', 'teacher', 'student', 'guest'];
const permTypes = ['C', 'R', 'U', 'D', 'X']; // Create, Read, Update, Delete, Execute

// Helper to generate a default matrix
const generateDefaultMatrix = () => {
  const matrix = {};
  roles.forEach(role => {
    matrix[role] = {};
    modules.forEach(mod => {
      matrix[role][mod] = { C: false, R: false, U: false, D: false, X: false };
      
      // Setup some defaults
      if (role === 'admin') {
        matrix[role][mod] = { C: true, R: true, U: true, D: true, X: true };
      }
      if (role === 'teacher') {
        if (['Student Records', 'Content Upload', 'Assessments'].includes(mod)) {
          matrix[role][mod] = { C: true, R: true, U: true, D: false, X: false };
        } else {
          matrix[role][mod].R = true;
        }
      }
      if (role === 'student') {
        if (['Student Records', 'Assessments'].includes(mod)) {
          matrix[role][mod].R = true;
          if (mod === 'Assessments') matrix[role][mod].X = true;
        }
      }
      if (role === 'guest') {
        if (['Announcements'].includes(mod)) {
          matrix[role][mod].R = true;
        }
      }
    });
  });
  return matrix;
};

export const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [matrix, setMatrix] = useState({});
  const [notification, setNotification] = useState(null);
  const [approvals, setApprovals] = useState([]);

  const loadUsers = () => {
    const saved = localStorage.getItem('kia_users');
    const localUsers = saved ? JSON.parse(saved) : [];
    
    // Merge with defaults if local is empty for testing, or always include defaults
    const combined = [...defaultMockUsers];
    
    localUsers.forEach(lu => {
      if (!combined.find(c => c.email === lu.email)) {
        combined.push({
          ...lu,
          roleClass: `role-${lu.role}`,
          img: `https://ui-avatars.com/api/?name=${encodeURIComponent(lu.name)}&background=fff&color=0f172a`,
          status: lu.status || 'active',
          failedAttempts: lu.failedAttempts || 0,
          auditLog: lu.auditLog || []
        });
      }
    });
    setUsers(combined);
  };

  const loadApprovals = () => {
    const saved = localStorage.getItem('kia_approvals');
    if (saved) {
      setApprovals(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadUsers();
    loadApprovals();
    
    const savedMatrix = localStorage.getItem('kia_permissions');
    if (savedMatrix) {
      setMatrix(JSON.parse(savedMatrix));
    } else {
      setMatrix(generateDefaultMatrix());
    }
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUser = (userId, updates, logMsg) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const newLog = logMsg ? [...(u.auditLog || []), { time: new Date().toLocaleString(), action: logMsg }] : u.auditLog;
        return { ...u, ...updates, auditLog: newLog };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    // In a real app we'd only save the ones that belong in localStorage, but for this demo we'll save all
    localStorage.setItem('kia_users', JSON.stringify(updatedUsers.filter(u => !defaultMockUsers.find(d => d.id === u.id))));
  };

  // Approval Actions
  const handleApprove = (reqId, userId, newName) => {
    // Update user
    updateUser(userId, { name: newName }, `Name changed to ${newName} via Admin Approval`);
    
    // Update approval status
    const updatedApprovals = approvals.map(a => a.id === reqId ? { ...a, status: 'approved' } : a);
    setApprovals(updatedApprovals);
    localStorage.setItem('kia_approvals', JSON.stringify(updatedApprovals));
    
    showNotification('Change request approved.');
  };

  const handleReject = (reqId) => {
    const updatedApprovals = approvals.map(a => a.id === reqId ? { ...a, status: 'rejected' } : a);
    setApprovals(updatedApprovals);
    localStorage.setItem('kia_approvals', JSON.stringify(updatedApprovals));
    showNotification('Change request rejected.');
  };

  // User Actions
  const handleActivate = (id) => {
    updateUser(id, { status: 'active' }, 'Account Activated by Admin');
    showNotification('Account Activated');
  };

  const handleSuspend = (id) => {
    updateUser(id, { status: 'suspended' }, 'Account Suspended by Admin');
    showNotification('Account Suspended');
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this user?');
    if (confirmDelete) {
      const remaining = users.filter(u => u.id !== id);
      setUsers(remaining);
      localStorage.setItem('kia_users', JSON.stringify(remaining.filter(u => !defaultMockUsers.find(d => d.id === u.id))));
      if (selectedUserId === id) setSelectedUserId(null);
      showNotification('Account Deleted');
    }
  };

  const handleForceLogout = (id) => {
    updateUser(id, {}, 'Session force-terminated by Admin');
    showNotification('User forcefully logged out');
  };

  const handleResetPassword = (id) => {
    updateUser(id, { failedAttempts: 0 }, 'Password Reset link sent via Email');
    showNotification('Password Reset Link Dispatched');
  };

  // Matrix Actions
  const togglePermission = (role, mod, perm) => {
    const newMatrix = { ...matrix };
    newMatrix[role][mod][perm] = !newMatrix[role][mod][perm];
    setMatrix(newMatrix);
    localStorage.setItem('kia_permissions', JSON.stringify(newMatrix));
  };

  const resetMatrix = () => {
    const defaultM = generateDefaultMatrix();
    setMatrix(defaultM);
    localStorage.setItem('kia_permissions', JSON.stringify(defaultM));
    showNotification('Permissions reset to default template');
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.status && u.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="access-control-container">
      <h1 className="ac-title">User Access Control</h1>
      
      {notification && (
        <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      <div className={`ac-layout ${selectedUserId ? 'with-panel' : 'without-panel'}`}>
        <div className="ac-main">
          {/* User Management Card */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">User Management</h2>
              <div className="ac-search">
                <Search className="ac-search-icon" size={16} />
                <input 
                  type="text" 
                  className="ac-search-input" 
                  placeholder="Search users, roles, status..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="user-list">
              {filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`user-row ${selectedUserId === user.id ? 'selected' : ''}`}
                >
                  <div className="user-info">
                    <img src={user.img} alt={user.name} className="user-avatar" />
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span className="user-name">{user.name}</span>
                      <span style={{fontSize: '0.75rem', color: user.status === 'suspended' ? '#ef4444' : user.status === 'pending' ? '#eab308' : '#64748b'}}>
                        {user.status === 'suspended' ? 'Suspended' : user.status === 'pending' ? 'Pending Approval' : 'Active'}
                      </span>
                    </div>
                    <span className={`role-badge ${user.roleClass}`}>{user.role}</span>
                  </div>
                  
                  <div className="user-actions">
                    {user.status === 'suspended' || user.status === 'pending' ? (
                      <button className="action-btn btn-activate" onClick={() => handleActivate(user.id)}>
                        <CheckCircle2 size={16} /> {user.status === 'pending' ? 'Approve' : 'Activate'}
                      </button>
                    ) : (
                      <button className="action-btn btn-suspend" onClick={() => handleSuspend(user.id)}>
                        <PauseCircle size={16} /> Suspend
                      </button>
                    )}
                    
                    <button className="action-btn btn-logout" onClick={() => handleForceLogout(user.id)}>
                      <Power size={16} /> Logout
                    </button>
                    
                    <button className="action-btn" style={{color: '#ef4444'}} onClick={() => handleDelete(user.id)}>
                      <Trash2 size={16} /> Delete
                    </button>
                    
                    <button className="action-btn btn-edit" onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}>
                      <Edit size={14} /> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Profile Changes Card */}
          {approvals.filter(a => a.status === 'pending').length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
              <div className="section-header">
                <h2 className="section-title">Pending Profile Changes</h2>
              </div>
              <div className="user-list">
                {approvals.filter(a => a.status === 'pending').map(req => {
                  const requestingUser = users.find(u => u.id === req.userId);
                  return (
                    <div key={req.id} className="user-row" style={{backgroundColor: '#fffbeb'}}>
                      <div className="user-info">
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <span className="user-name">
                            <span style={{color: '#94a3b8', textDecoration: 'line-through', marginRight: '0.5rem'}}>{req.currentName}</span> 
                            ➜ <strong style={{color: '#0f172a', marginLeft: '0.5rem'}}>{req.requestedName}</strong>
                          </span>
                          <span style={{fontSize: '0.75rem', color: '#d97706'}}>
                            Requested on {new Date(req.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {requestingUser && <span className={`role-badge ${requestingUser.roleClass}`}>{requestingUser.role}</span>}
                      </div>
                      <div className="user-actions">
                        <button className="action-btn btn-activate" onClick={() => handleApprove(req.id, req.userId, req.requestedName)}>
                          <CheckCircle2 size={16} /> Approve
                        </button>
                        <button className="action-btn" style={{color: '#ef4444'}} onClick={() => handleReject(req.id)}>
                          <X size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Role Permission Matrix Card */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="section-title" style={{margin: 0}}>Role Permission Matrix</h2>
              <button className="btn-sm btn-dark" onClick={resetMatrix} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <ShieldAlert size={14} /> Apply Default Template
              </button>
            </div>
            
            {Object.keys(matrix).length > 0 && (
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Modules</th>
                    <th style={{textAlign: 'center'}}>Admin</th>
                    <th style={{textAlign: 'center'}}>Teacher</th>
                    <th style={{textAlign: 'center'}}>Student</th>
                    <th style={{textAlign: 'center'}}>Guest</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{mod}</td>
                      {roles.map(role => (
                        <td key={role} style={{textAlign: 'center'}}>
                          <div className="perm-group" style={{justifyContent: 'center'}}>
                            {permTypes.map(perm => (
                              <div key={perm} className="tooltip">
                                <button 
                                  className={`perm-btn ${matrix[role][mod][perm] ? 'active dark' : ''}`}
                                  onClick={() => togglePermission(role, mod, perm)}
                                  style={{padding: '4px 6px', fontSize: '11px'}}
                                >
                                  {perm === 'R' ? '✓' : perm}
                                </button>
                                <span className="tooltiptext">{
                                  perm==='C'?'Create':perm==='R'?'Read':perm==='U'?'Update':perm==='D'?'Delete':'Execute'
                                }</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side Panel */}
        {selectedUser && (
          <div className="side-panel">
            <div className="panel-header">
              <span className="panel-title">User Profile: {selectedUser.name}</span>
              <button className="close-btn" onClick={() => setSelectedUserId(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="profile-header">
              <img src={selectedUser.img} alt={selectedUser.name} className="profile-avatar" />
              <div>
                <div className="profile-name">{selectedUser.name}</div>
                <div className="profile-email">{selectedUser.email || 'No email provided'}</div>
              </div>
            </div>

            <div className="info-block">
              <div className="info-label">Account Status</div>
              <div className="status-indicator" style={{color: selectedUser.status === 'suspended' ? '#ef4444' : selectedUser.status === 'pending' ? '#eab308' : '#22c55e'}}>
                <span className="status-dot" style={{backgroundColor: selectedUser.status === 'suspended' ? '#ef4444' : selectedUser.status === 'pending' ? '#eab308' : '#22c55e'}}></span> 
                {selectedUser.status === 'suspended' ? 'Suspended' : selectedUser.status === 'pending' ? 'Pending Approval' : 'Active'}
              </div>
            </div>
            
            <div style={{marginTop: '1rem'}}>
               <button className="btn-sm btn-light" onClick={() => handleResetPassword(selectedUser.id)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center'}}>
                  <Key size={14} /> Send Password Reset Email
               </button>
            </div>

            <div className="info-block" style={{marginTop: '1.5rem'}}>
              <div className="info-label">Last Login</div>
              <div className="info-value">Today, 09:30 AM</div>
            </div>

            <div className="info-block">
              <div className="info-label">5-Attempt Lockout Status</div>
              <div className="info-value" style={{color: selectedUser.failedAttempts >= 5 ? '#ef4444' : '#64748b'}}>
                {selectedUser.failedAttempts >= 5 ? 'LOCKED OUT' : `Good: ${selectedUser.failedAttempts} failed attempts`}
              </div>
            </div>

            <div className="info-block" style={{ marginTop: '2rem' }}>
              <div className="info-label">Audit Trail Log</div>
              
              <div className="timeline">
                {selectedUser.auditLog && selectedUser.auditLog.length > 0 ? (
                  [...selectedUser.auditLog].reverse().map((log, i) => (
                    <div className="timeline-item" key={i}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-time">{log.time}</div>
                      <div className="timeline-content">{log.action}</div>
                    </div>
                  ))
                ) : (
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content" style={{color: '#94a3b8'}}>No recent activity.</div>
                  </div>
                )}
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-time">System</div>
                  <div className="timeline-content">Account Created</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
