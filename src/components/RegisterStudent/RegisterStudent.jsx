import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, AlertTriangle, Plus, Lock, CheckCircle, Download,
  CheckCircle2, XCircle, Mail
} from 'lucide-react';
import './RegisterStudent.css';

export const RegisterStudent = () => {
  const [activeTab, setActiveTab] = useState('single'); 
  
  // ============================
  // SINGLE ENTRY STATE
  // ============================
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('2010-01-01');
  const [grade, setGrade] = useState('10');
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null); // holds the duplicated user object
  const [emailSent, setEmailSent] = useState(false);

  const studentId = `KIA-STU-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const validateAndCheckDuplicate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setEmailSent(false);
    setDuplicateWarning(null);

    if (!fullName || !email) {
      setError('Full Name and Email are required.');
      return;
    }

    const savedUsers = localStorage.getItem('kia_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Duplicate detection
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setDuplicateWarning(existingUser);
      return;
    }

    // No duplicate, proceed
    saveStudent(false);
  };

  const saveStudent = (isMerge) => {
    setIsSubmitting(true);
    setDuplicateWarning(null);

    const savedUsers = localStorage.getItem('kia_users');
    let users = savedUsers ? JSON.parse(savedUsers) : [];

    const newUserData = {
      name: fullName,
      email,
      password: 'password123',
      role: 'student',
      status: 'pending',
      grade,
      dob,
      guardianName,
      guardianContact,
      emergencyContact,
      address
    };

    if (isMerge && duplicateWarning) {
      // Merge into existing user
      users = users.map(u => 
        u.id === duplicateWarning.id 
          ? { ...u, ...newUserData, id: u.id, studentId: u.studentId } 
          : u
      );
    } else {
      // Create new
      users.push({ ...newUserData, id: Date.now(), studentId });
    }

    localStorage.setItem('kia_users', JSON.stringify(users));
    
    setTimeout(() => {
      setSuccess(true);
      setEmailSent(true);
      setIsSubmitting(false);
      handleClear(true);
    }, 800);
  };

  const handleClear = (keepSuccess = false) => {
    setFullName('');
    setEmail('');
    setGuardianName('');
    setGuardianContact('');
    setEmergencyContact('');
    setAddress('');
    setError('');
    setDuplicateWarning(null);
    if (!keepSuccess) {
      setSuccess(false);
      setEmailSent(false);
    }
  };

  // ============================
  // BULK UPLOAD STATE
  // ============================
  const fileInputRef = useRef(null);
  const [csvData, setCsvData] = useState([]);
  const [bulkFilter, setBulkFilter] = useState('all'); // all, valid, warning, error
  const [bulkSuccess, setBulkSuccess] = useState(false);

  const validateRow = (row, allUsers) => {
    // Basic validation
    if (!row.name || !row.email) {
      return { status: 'error', message: 'Name and Email required' };
    }
    // Duplicate check
    if (allUsers.find(u => u.email === row.email) || csvData.filter(r => r.email === row.email).length > 1) {
      return { status: 'warning', message: 'Possible duplicate email' };
    }
    return { status: 'success', message: '' };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkSuccess(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').filter(r => r.trim().length > 0);
      
      const savedUsers = localStorage.getItem('kia_users');
      const allUsers = savedUsers ? JSON.parse(savedUsers) : [];

      const parsedData = rows.slice(1).map((row, index) => { // Skip header row 0
        const cols = row.split(',').map(c => c.trim());
        const dataRow = {
          id: `row-${index}`,
          name: cols[0] || '',
          email: cols[1] || '',
          dob: cols[2] || '',
          grade: cols[3] || '',
          guardianName: cols[4] || '',
          guardianContact: cols[5] || ''
        };
        const validation = validateRow(dataRow, allUsers);
        return { ...dataRow, status: validation.status, errorMessage: validation.message };
      });
      
      setCsvData(parsedData);
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  const handleRowChange = (id, field, value) => {
    setCsvData(prevData => {
      const savedUsers = localStorage.getItem('kia_users');
      const allUsers = savedUsers ? JSON.parse(savedUsers) : [];

      return prevData.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          const validation = validateRow(updatedRow, allUsers);
          return { ...updatedRow, status: validation.status, errorMessage: validation.message };
        }
        return row;
      });
    });
  };

  const handleBulkCommit = () => {
    if (csvData.filter(r => r.status === 'error').length > 0) return; // Prevent if errors exist

    const savedUsers = localStorage.getItem('kia_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const newUsers = csvData.map(row => ({
      id: Date.now() + Math.random(),
      studentId: `KIA-STU-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      name: row.name,
      email: row.email,
      password: 'password123',
      role: 'student',
      status: 'pending',
      grade: row.grade,
      dob: row.dob,
      guardianName: row.guardianName,
      guardianContact: row.guardianContact,
      emergencyContact: '',
      address: ''
    }));

    localStorage.setItem('kia_users', JSON.stringify([...users, ...newUsers]));
    setCsvData([]); // Clear table
    setBulkSuccess(true);
  };

  // Bulk Summary Stats
  const validCount = csvData.filter(r => r.status === 'success').length;
  const warningCount = csvData.filter(r => r.status === 'warning').length;
  const errorCount = csvData.filter(r => r.status === 'error').length;
  const filteredCsvData = csvData.filter(r => bulkFilter === 'all' || r.status === bulkFilter);

  return (
    <div className={`register-container ${activeTab === 'single' ? 'grid-layout' : 'single-layout'}`}>
      <div className="card form-card">
        {/* Header Area */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'single' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('single')}
            >
              <FileText size={18} />
              Single Entry
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bulk' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('bulk')}
            >
              <Upload size={18} />
              Bulk CSV Upload
            </button>
          </div>
          
          {activeTab === 'bulk' && (
            <a href="#" className="download-link" onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8,Name,Email,DOB,Grade,Guardian Name,Guardian Contact\nJohn Doe,john@example.com,2010-05-12,8,Jane Doe,+941234567\n";
              window.open(encodeURI(csvContent));
            }}>
              <Download size={16} />
              Download CSV Template
            </a>
          )}
        </div>

        {activeTab === 'single' ? (
          /* ========================================= */
          /* SINGLE ENTRY CONTENT                      */
          /* ========================================= */
          <form onSubmit={validateAndCheckDuplicate}>
            
            {duplicateWarning && (
              <div className="alert-warning" style={{backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={18} />
                  <span><strong>Duplicate Detected:</strong> An account with the email <strong>{email}</strong> already exists ({duplicateWarning.name}).</span>
                </div>
                <div className="alert-actions" style={{display: 'flex', gap: '0.5rem'}}>
                  <button type="button" className="btn-sm btn-dark" onClick={() => saveStudent(true)}>Merge Details</button>
                  <button type="button" className="btn-sm btn-primary" onClick={() => saveStudent(false)}>Create Anyway</button>
                  <button type="button" className="btn-sm btn-light" style={{border: '1px solid #d1d5db'}} onClick={() => setDuplicateWarning(null)}>Cancel</button>
                </div>
              </div>
            )}

            {error && (
              <div className="alert-warning" style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} />
                  <span>Student account successfully registered and saved!</span>
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className={`form-input ${error && !fullName ? 'error' : ''}`} 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className={`form-input ${error && !email ? 'error' : ''}`} 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="form-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                  {[...Array(13)].map((_, i) => (
                    <option key={i+1} value={i+1}>Grade {i+1}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Guardian Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Guardian Name" 
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Guardian Contact</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="(303) 4556889" 
                  value={guardianContact}
                  onChange={(e) => setGuardianContact(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Emergency Contact" 
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Address</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="live-preview" style={{marginTop: '1.5rem'}}>
              <div className="live-preview-title">LIVE PREVIEW: GENERATED ID (READ-ONLY) per DR-01</div>
              <div className="id-display">
                Student ID: 
                <span className="id-badge">
                  <Lock size={16} />
                  {studentId}
                </span>
              </div>
              <p className="id-help">Per Data Rule DR-01, this ID is non-editable.</p>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-dark" style={{ width: 'auto' }} onClick={() => handleClear(false)}>Clear Form</button>
              <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={isSubmitting || duplicateWarning}>
                {isSubmitting ? 'Registering...' : 'Register Student'}
              </button>
            </div>
          </form>
        ) : (
          /* ========================================= */
          /* BULK UPLOAD CONTENT                       */
          /* ========================================= */
          <>
            {bulkSuccess && (
              <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', marginBottom: '1.5rem'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} />
                  <span>Bulk creation successful! Welcome emails have been dispatched to all imported users.</span>
                </div>
              </div>
            )}

            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
            
            {csvData.length === 0 ? (
              <div 
                className="upload-zone" 
                onClick={() => fileInputRef.current.click()} 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFileUpload({ target: { files: [e.dataTransfer.files[0]] } });
                  }
                }}
                style={{cursor: 'pointer'}}
              >
                <Upload size={32} className="upload-icon" />
                <div className="upload-title">Click to Browse or Drag & Drop</div>
                <div className="upload-subtitle">Supported file format (CSV, max 500 records)</div>
                <div style={{fontSize: '0.75rem', marginTop: '1rem', color: '#94a3b8'}}>Format: Name, Email, DOB, Grade, GuardianName, GuardianContact</div>
              </div>
            ) : (
              <>
                <div className="table-header">
                  <div className="status-summary">
                    <div className="status-item text-success">
                      <CheckCircle2 size={18} /> {validCount} valid
                    </div>
                    <div className="status-item text-warning">
                      <AlertTriangle size={18} /> {warningCount} warnings
                    </div>
                    <div className="status-item text-danger">
                      <XCircle size={18} /> {errorCount} errors
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <span className="filter-label">Filter</span>
                    <button className={`filter-pill ${bulkFilter === 'all' ? 'active' : ''}`} onClick={() => setBulkFilter('all')}>All</button>
                    <button className={`filter-pill ${bulkFilter === 'success' ? 'active' : ''}`} onClick={() => setBulkFilter('success')}><CheckCircle2 size={14} className="text-success" /> Valid</button>
                    <button className={`filter-pill ${bulkFilter === 'warning' ? 'active' : ''}`} onClick={() => setBulkFilter('warning')}><AlertTriangle size={14} className="text-warning" /> Warnings</button>
                    <button className={`filter-pill ${bulkFilter === 'error' ? 'active' : ''}`} onClick={() => setBulkFilter('error')}><XCircle size={14} className="text-danger" /> Errors</button>
                  </div>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>DOB</th>
                        <th>Grade</th>
                        <th>Guardian</th>
                        <th>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCsvData.map(row => (
                        <tr key={row.id} className={`row-${row.status === 'success' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'}`}>
                          <td className="status-cell">
                            {row.status === 'success' && <CheckCircle2 size={20} className="text-success" />}
                            {row.status === 'warning' && (
                              <div className="tooltip">
                                <AlertTriangle size={20} className="text-warning" />
                                <span className="tooltiptext">{row.errorMessage}</span>
                              </div>
                            )}
                            {row.status === 'error' && (
                              <div className="tooltip">
                                <XCircle size={20} className="text-danger" />
                                <span className="tooltiptext">{row.errorMessage}</span>
                              </div>
                            )}
                          </td>
                          <td><input className={`form-input ${!row.name ? 'error' : ''}`} value={row.name} onChange={(e) => handleRowChange(row.id, 'name', e.target.value)} /></td>
                          <td><input className={`form-input ${!row.email ? 'error' : ''}`} value={row.email} onChange={(e) => handleRowChange(row.id, 'email', e.target.value)} /></td>
                          <td><input className="form-input" value={row.dob} onChange={(e) => handleRowChange(row.id, 'dob', e.target.value)} /></td>
                          <td><input className="form-input" value={row.grade} onChange={(e) => handleRowChange(row.id, 'grade', e.target.value)} /></td>
                          <td><input className="form-input" value={row.guardianName} onChange={(e) => handleRowChange(row.id, 'guardianName', e.target.value)} /></td>
                          <td><input className="form-input" value={row.guardianContact} onChange={(e) => handleRowChange(row.id, 'guardianContact', e.target.value)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="form-actions" style={{ position: 'relative', marginTop: '1.5rem' }}>
                  {errorCount > 0 ? (
                    <div className="tooltip" style={{ width: 'auto' }}>
                      <button className="btn btn-disabled" disabled style={{ width: 'auto', padding: '0.75rem 1.25rem', border: 'none', borderRadius: '4px' }}>
                        Create {validCount + warningCount} Accounts
                      </button>
                      <span className="tooltiptext" style={{ bottom: '100%', top: 'auto', marginBottom: '10px' }}>Errors must be resolved before creation</span>
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={handleBulkCommit} style={{ width: 'auto', padding: '0.75rem 1.25rem', borderRadius: '4px' }}>
                      Create {validCount + warningCount} Accounts
                    </button>
                  )}
                  <button className="btn btn-light" onClick={() => setCsvData([])} style={{ width: 'auto', padding: '0.75rem 1.25rem', borderRadius: '4px' }}>Cancel Upload</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Info Panel only shows on single tab */}
      {activeTab === 'single' && (
        <div className="card info-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <div className="badge-success" style={{marginBottom: '0.5rem'}}>
              <CheckCircle size={14} />
              On Submit
            </div>
            <h3 className="info-title">Account Created — Pending Approval</h3>
            <p className="info-text">
              The student account will be saved to your local database and the student will be granted the 'student' role.
            </p>
            <div className="badge-outline">
              Role Granted: Student
            </div>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', opacity: emailSent ? 1 : 0.4, transition: 'opacity 0.3s' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 600, marginBottom: '0.5rem'}}>
              <Mail size={16} />
              Welcome Email Status
            </div>
            {emailSent ? (
              <p className="info-text" style={{color: '#166534', margin: 0}}>
                An automated email containing the temporary password <strong>password123</strong> has been dispatched to {email}.
              </p>
            ) : (
              <p className="info-text" style={{color: '#166534', margin: 0}}>
                Awelcome email will be sent automatically once the account is registered.
              </p>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};
