import React, { useState, useEffect } from 'react';
import { Edit2, EyeOff, Phone, Mail, MailX, BellRing, Sun, Moon, CheckCircle2, MessageSquare } from 'lucide-react';
import profilePhoto from '../../assets/profile_photo.jpg';
import './StudentProfile.css';

export const StudentProfile = ({ currentUser }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ label: 'Weak', class: 'weak', score: 0 });
  const [notification, setNotification] = useState('');
  
  const studentName = currentUser?.name || 'W. Fernando';

  // State
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [email, setEmail] = useState(currentUser?.email || 'w.fernando.student@gmail.com');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  // Approval State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedName, setRequestedName] = useState('');
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    const isDark = document.body.classList.contains('dark-theme');
    setIsDarkTheme(isDark);
    
    // Load existing settings if any
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('kia_users') || '[]');
      const me = users.find(u => u.id === currentUser.id);
      if (me) {
        if (me.phone) setPhone(me.phone);
        if (me.email) setEmail(me.email);
        if (me.preferences) {
          setEmailNotifs(me.preferences.email);
          setInAppNotifs(me.preferences.inApp);
          setSmsNotifs(me.preferences.sms);
        }
      }
      
      // Check for pending approvals
      const approvals = JSON.parse(localStorage.getItem('kia_approvals') || '[]');
      const myPending = approvals.find(a => a.userId === currentUser.id && a.status === 'pending');
      if (myPending) {
        setHasPendingRequest(true);
      }
    }
  }, [currentUser]);

  const toggleTheme = () => {
    if (isDarkTheme) {
      document.body.classList.remove('dark-theme');
      setIsDarkTheme(false);
    } else {
      document.body.classList.add('dark-theme');
      setIsDarkTheme(true);
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    
    let score = 0;
    if (val.length > 6) score++;
    if (val.length > 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (score < 2) setStrength({ label: 'Weak', class: 'weak', score });
    else if (score < 4) setStrength({ label: 'Medium', class: 'medium', score });
    else setStrength({ label: 'Strong', class: 'strong', score });
  };

  const handleUpdatePassword = () => {
    if (!password || strength.score < 2) {
      setNotification('Please enter a stronger password.');
      setTimeout(() => setNotification(''), 4000);
      return;
    }
    
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('kia_users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) return { ...u, password };
        return u;
      });
      localStorage.setItem('kia_users', JSON.stringify(updatedUsers));
      setNotification('Password updated securely.');
      setPassword('');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const submitChangeRequest = () => {
    if (!requestedName.trim()) return;
    
    const request = {
      id: Date.now(),
      userId: currentUser.id,
      currentName: studentName,
      requestedName: requestedName,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    const approvals = JSON.parse(localStorage.getItem('kia_approvals') || '[]');
    localStorage.setItem('kia_approvals', JSON.stringify([...approvals, request]));
    
    setShowRequestModal(false);
    setHasPendingRequest(true);
    setRequestedName('');
    setNotification('Change request sent to Admin for approval.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleSaveContact = () => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('kia_users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) return { ...u, phone, email };
        return u;
      });
      localStorage.setItem('kia_users', JSON.stringify(updatedUsers));
      setNotification('Contact information updated successfully.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleSavePreferences = () => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('kia_users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) return { 
          ...u, 
          preferences: { email: emailNotifs, inApp: inAppNotifs, sms: smsNotifs }
        };
        return u;
      });
      localStorage.setItem('kia_users', JSON.stringify(updatedUsers));
      setNotification('Notification preferences saved.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  return (
    <div className="sprof-container">
      
      {/* Header */}
      <div className="sprof-header">
        <h1 className="sprof-title">Profile & Settings</h1>
        <p className="sprof-subtitle">Manage your account details and preferences.</p>
      </div>

      {notification && (
        <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      <div className="sprof-grid">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile Information */}
          <div className="card">
            <h2 className="sprof-card-title">Profile Information</h2>
            
            <div className="sprof-profile-layout">
              <div className="sprof-photo-col">
                <div className="sprof-photo-wrap">
                  <img src={profilePhoto} alt={studentName} className="sprof-photo" />
                  <div className="sprof-edit-badge"><Edit2 size={12} /></div>
                </div>
                <div className="sprof-change-photo-link">Change Photo</div>
                <div className="sprof-photo-desc">
                  Supported formats: JPG, PNG. Max size: 2MB.
                </div>
              </div>
              
              <div className="sprof-details-col">
                <div className="sprof-form-group">
                  <label className="sprof-label">Name</label>
                  <input type="text" className="sprof-input-disabled" value={studentName} disabled />
                  <div className="sprof-form-desc">
                    Read-only. Requires Admin approval to change.
                  </div>
                </div>
                
                <div className="sprof-form-group">
                  <label className="sprof-label">Grade</label>
                  <div className="sprof-grade-val">Grade 10</div>
                </div>
                
                {hasPendingRequest ? (
                  <button className="sprof-btn-gradient" disabled style={{opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#94a3b8', backgroundImage: 'none'}}>
                    Pending Admin Approval...
                  </button>
                ) : (
                  <button className="sprof-btn-gradient" onClick={() => setShowRequestModal(true)}>
                    Request Name Change
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h2 className="sprof-card-title">Security</h2>
            
            <div className="sprof-details-col">
              <div className="sprof-form-group" style={{flexDirection: 'row', alignItems: 'center'}}>
                <label className="sprof-label" style={{width: '140px'}}>Current Password</label>
                <div className="sprof-input-icon-wrap" style={{flex: 1}}>
                  <input type="password" placeholder="••••••••" className="sprof-input" />
                  <EyeOff size={16} className="sprof-input-icon" />
                </div>
              </div>

              <div className="sprof-form-group" style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <label className="sprof-label" style={{width: '140px', marginTop: '0.6rem'}}>New Password</label>
                <div style={{flex: 1}}>
                  <div className="sprof-input-icon-wrap">
                    <input type="password" placeholder="New password" className="sprof-input" value={password} onChange={handlePasswordChange} />
                    <EyeOff size={16} className="sprof-input-icon" />
                  </div>
                  {password.length > 0 && (
                    <div className="sprof-strength-meter">
                      <span className="sprof-label" style={{fontSize: '0.75rem'}}>Strength: <span className="sprof-strength-text" style={{color: strength.class === 'weak' ? '#ef4444' : strength.class === 'medium' ? '#eab308' : '#22c55e'}}>{strength.label}</span></span>
                      <div className="sprof-strength-bar">
                        <div className="sprof-strength-dots" style={{display: 'flex', gap: '4px', marginTop: '4px'}}>
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="sprof-dot" style={{width: '20px', height: '6px', borderRadius: '3px', backgroundColor: i <= strength.score ? (strength.class === 'weak' ? '#ef4444' : strength.class === 'medium' ? '#eab308' : '#22c55e') : '#e2e8f0'}}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sprof-form-group" style={{flexDirection: 'row', alignItems: 'center'}}>
                <label className="sprof-label" style={{width: '140px'}}>Confirm New Password</label>
                <div className="sprof-input-icon-wrap" style={{flex: 1}}>
                  <input type="password" placeholder="Confirm password" className="sprof-input" />
                  <EyeOff size={16} className="sprof-input-icon" />
                </div>
              </div>
              
              <button className="sprof-btn-gradient" onClick={handleUpdatePassword}>Update Password</button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Contact Details */}
          <div className="card">
            <h2 className="sprof-card-title">Contact Details</h2>
            
            <div className="sprof-details-col">
              <div className="sprof-form-group">
                <label className="sprof-label">Contact Number</label>
                <div className="sprof-input-icon-wrap">
                  <Phone size={16} className="sprof-contact-icon" />
                  <input type="text" className="sprof-input sprof-input-left-icon" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              
              <div className="sprof-form-group">
                <label className="sprof-label">Email</label>
                <div className="sprof-input-icon-wrap">
                  <Mail size={16} className="sprof-contact-icon" />
                  <input type="email" className="sprof-input sprof-input-left-icon" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="sprof-contact-actions">
                <button className="sprof-btn-navy" onClick={handleSaveContact}>Save Contact Info</button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="card">
            <h2 className="sprof-card-title" style={{marginBottom: '0.25rem'}}>Notification Preferences</h2>
            <p className="sprof-notif-desc">Manage how you receive alerts and updates.</p>
            
            <div className="sprof-toggles-grid" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem'}}>
              
              <div>
                <div className="sprof-toggle-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="sprof-toggle-label-group" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div className="sprof-toggle-icon" style={{color: '#94a3b8'}}><MailX size={16} /></div>
                    <span className="sprof-toggle-title" style={{fontWeight: 500}}>Email Notifications</span>
                  </div>
                  <div 
                    className={`sprof-switch ${!emailNotifs ? 'off' : ''}`} 
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    style={{width: '40px', height: '22px', backgroundColor: emailNotifs ? '#3b82f6' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.2s'}}
                  >
                    <div className="sprof-switch-knob" style={{width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: emailNotifs ? '20px' : '2px', transition: '0.2s'}}></div>
                  </div>
                </div>
                <div className="sprof-toggle-desc" style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem'}}>Receive emails for announcements and grades.</div>
              </div>

              <div>
                <div className="sprof-toggle-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="sprof-toggle-label-group" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div className="sprof-toggle-icon" style={{color: '#94a3b8'}}><BellRing size={16} /></div>
                    <span className="sprof-toggle-title" style={{fontWeight: 500}}>In-App Notifications</span>
                  </div>
                  <div 
                    className={`sprof-switch ${!inAppNotifs ? 'off' : ''}`} 
                    onClick={() => setInAppNotifs(!inAppNotifs)}
                    style={{width: '40px', height: '22px', backgroundColor: inAppNotifs ? '#3b82f6' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.2s'}}
                  >
                    <div className="sprof-switch-knob" style={{width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: inAppNotifs ? '20px' : '2px', transition: '0.2s'}}></div>
                  </div>
                </div>
                <div className="sprof-toggle-desc" style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem'}}>Show toast alerts while you are logged in.</div>
              </div>

              <div>
                <div className="sprof-toggle-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="sprof-toggle-label-group" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div className="sprof-toggle-icon" style={{color: '#94a3b8'}}><MessageSquare size={16} /></div>
                    <span className="sprof-toggle-title" style={{fontWeight: 500}}>SMS Notifications</span>
                  </div>
                  <div 
                    className={`sprof-switch ${!smsNotifs ? 'off' : ''}`} 
                    onClick={() => setSmsNotifs(!smsNotifs)}
                    style={{width: '40px', height: '22px', backgroundColor: smsNotifs ? '#3b82f6' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.2s'}}
                  >
                    <div className="sprof-switch-knob" style={{width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: smsNotifs ? '20px' : '2px', transition: '0.2s'}}></div>
                  </div>
                </div>
                <div className="sprof-toggle-desc" style={{fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem'}}>Get text messages for critical alerts only.</div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                 <button className="sprof-btn-navy" onClick={handleSavePreferences}>Save Preferences</button>
              </div>

            </div>
          </div>

          {/* Account & Appearance */}
          <div className="card">
            <h2 className="sprof-card-title" style={{marginBottom: '1rem'}}>Account & Appearance</h2>
            
            <div className="sprof-theme-row">
              <div>
                <div className="sprof-label">Theme Engine</div>
                <div className="sprof-theme-desc">Toggle the global application theme (MR-03).</div>
              </div>
              
              <div className="sprof-theme-toggle" onClick={toggleTheme} style={{cursor: 'pointer'}}>
                <div className={`sprof-theme-switch-wrap ${isDarkTheme ? 'dark-active' : ''}`} style={{display: 'flex', alignItems: 'center', backgroundColor: isDarkTheme ? '#1e293b' : '#e2e8f0', borderRadius: '20px', padding: '4px 8px', position: 'relative', width: '60px', height: '30px', justifyContent: 'space-between', transition: '0.3s'}}>
                  <Moon size={14} color={isDarkTheme ? '#fcd34d' : '#94a3b8'} style={{zIndex: 1}} />
                  <Sun size={14} color={!isDarkTheme ? '#f59e0b' : '#94a3b8'} style={{zIndex: 1}} />
                  <div className="sprof-theme-switch-knob" style={{position: 'absolute', width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%', top: '4px', left: isDarkTheme ? '4px' : '34px', transition: '0.3s'}}></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>

      {/* Change Request Modal */}
      {showRequestModal && (
        <div className="sprof-modal-overlay" onClick={() => setShowRequestModal(false)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="sprof-modal" onClick={e => e.stopPropagation()} style={{backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <h2 style={{marginTop: 0, marginBottom: '1rem', color: '#0f172a'}}>Request Name Change</h2>
            <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
              Your request will be sent to the school administration for approval. This may take up to 24 hours.
            </p>
            <div className="sprof-form-group" style={{marginBottom: '1.5rem'}}>
              <label className="sprof-label">Requested New Name</label>
              <input 
                type="text" 
                className="sprof-input" 
                placeholder="Enter your full legal name" 
                value={requestedName}
                onChange={e => setRequestedName(e.target.value)}
              />
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button 
                className="sprof-btn-outline" 
                onClick={() => setShowRequestModal(false)}
                style={{padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'transparent', cursor: 'pointer'}}
              >
                Cancel
              </button>
              <button 
                className="sprof-btn-gradient" 
                onClick={submitChangeRequest}
                style={{padding: '0.5rem 1rem', margin: 0}}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
