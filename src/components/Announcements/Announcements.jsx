import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, 
  Calendar, Clock, Edit, Trash2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import './Announcements.css';

const defaultAnnouncements = [
  {
    id: 1,
    title: 'Term 2 Exam results',
    content: 'The Term 2 Exam results are now available.',
    audience: 'specific-grade',
    targetValue: 'Grades 10, 11, 12',
    startDate: '2026-08-15',
    startTime: '09:00',
    endDate: '2026-08-20',
    endTime: '17:00',
    pushEnabled: true,
    reach: '—'
  },
  {
    id: 2,
    title: 'LMS Maintenance Notice',
    content: 'The LMS will undergo maintenance this weekend.',
    audience: 'all',
    targetValue: '',
    startDate: '2026-08-01',
    startTime: '00:00',
    endDate: '2026-12-31',
    endTime: '23:59',
    pushEnabled: true,
    reach: '1450'
  },
  {
    id: 3,
    title: 'Field Trip Grade 7A Info',
    content: 'Please remember to bring signed consent forms.',
    audience: 'specific-class',
    targetValue: 'Class 7A',
    startDate: '2026-08-05',
    startTime: '08:00',
    endDate: '2026-08-10',
    endTime: '15:00', // Expired based on current date (assume it's Aug 10 17:00 now)
    pushEnabled: false,
    reach: '28'
  }
];

export const Announcements = () => {
  // Database State
  const [announcements, setAnnouncements] = useState([]);
  
  // Composer State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [targetValue, setTargetValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  
  // UI State
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    // Set default dates for new composer
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    setStartDate(now.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().substring(0, 5));
    
    setEndDate(future.toISOString().split('T')[0]);
    setEndTime(future.toTimeString().substring(0, 5));

    // Load Data
    const saved = localStorage.getItem('kia_announcements');
    if (saved) {
      setAnnouncements(JSON.parse(saved));
    } else {
      setAnnouncements(defaultAnnouncements);
      localStorage.setItem('kia_announcements', JSON.stringify(defaultAnnouncements));
    }
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFormat = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    setContent(newText);
    
    // Maintain focus (timeout needed for React state update to flush)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      return;
    }
    
    if ((audience === 'specific-grade' || audience === 'specific-class') && !targetValue.trim()) {
      setError('Please specify the target Grade or Class.');
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      setError('Start and End Date/Time are required.');
      return;
    }

    const startDt = new Date(`${startDate}T${startTime}`);
    const endDt = new Date(`${endDate}T${endTime}`);

    if (endDt <= startDt) {
      setError('End Date/Time must be after Start Date/Time.');
      return;
    }

    const payload = {
      id: editingId || Date.now(),
      title,
      content,
      audience,
      targetValue,
      startDate,
      startTime,
      endDate,
      endTime,
      pushEnabled,
      reach: editingId ? (announcements.find(a => a.id === editingId)?.reach || '—') : '—'
    };

    let updated;
    if (editingId) {
      updated = announcements.map(a => a.id === editingId ? payload : a);
    } else {
      updated = [payload, ...announcements];
    }

    setAnnouncements(updated);
    localStorage.setItem('kia_announcements', JSON.stringify(updated));
    
    let notifMsg = editingId ? 'Announcement Updated.' : 'Announcement Created.';
    if (pushEnabled) notifMsg += ' Push Notification Dispatched.';
    showNotification(notifMsg);

    handleClear();
  };

  const handleClear = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setAudience('all');
    setTargetValue('');
    setPushEnabled(false);
    
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    setStartDate(now.toISOString().split('T')[0]);
    setStartTime(now.toTimeString().substring(0, 5));
    setEndDate(future.toISOString().split('T')[0]);
    setEndTime(future.toTimeString().substring(0, 5));
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setAudience(announcement.audience);
    setTargetValue(announcement.targetValue);
    setStartDate(announcement.startDate);
    setStartTime(announcement.startTime);
    setEndDate(announcement.endDate);
    setEndTime(announcement.endTime);
    setPushEnabled(announcement.pushEnabled);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this announcement?");
    if (confirm) {
      const updated = announcements.filter(a => a.id !== id);
      setAnnouncements(updated);
      localStorage.setItem('kia_announcements', JSON.stringify(updated));
      showNotification('Announcement Deleted.');
      if (editingId === id) handleClear();
    }
  };

  // Helper to determine status dynamically
  const getStatus = (a) => {
    const now = new Date();
    const start = new Date(`${a.startDate}T${a.startTime}`);
    const end = new Date(`${a.endDate}T${a.endTime}`);

    if (now < start) {
      return { text: 'Scheduled', class: 'badge-amber' };
    } else if (now >= start && now <= end) {
      return { text: 'Published', class: 'badge-green' };
    } else {
      return { text: 'Expired', class: 'badge-red' };
    }
  };

  return (
    <div className="announcements-container">
      {notification && (
        <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Composer Card */}
      <div className="composer-card">
        <h2 className="composer-title">{editingId ? 'Edit Announcement' : 'New Announcement Composer'}</h2>
        
        {error && (
          <div className="alert-warning" style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Announcement Title *</label>
          <input 
            type="text" 
            className="text-input" 
            placeholder="e.g., Term 2 Exam Results Release" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <div className="editor-container">
            <div className="editor-toolbar">
              <button className="toolbar-btn" onClick={() => handleFormat('**', '**')} title="Bold"><Bold size={16} /></button>
              <button className="toolbar-btn" onClick={() => handleFormat('*', '*')} title="Italic"><Italic size={16} /></button>
              <button className="toolbar-btn" onClick={() => handleFormat('<u>', '</u>')} title="Underline"><Underline size={16} /></button>
              <div style={{width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 4px'}}></div>
              <button className="toolbar-btn" onClick={() => handleFormat('- ')} title="Bullet List"><List size={16} /></button>
              <button className="toolbar-btn" onClick={() => handleFormat('1. ')} title="Numbered List"><ListOrdered size={16} /></button>
              <div style={{width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 4px'}}></div>
              <button className="toolbar-btn" onClick={() => handleFormat('[', '](url)')} title="Link"><Link size={16} /></button>
            </div>
            <textarea 
              ref={textareaRef}
              className="editor-textarea" 
              placeholder="Compose your announcement here... Use formatting tools to insert markdown."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="target-audience-row">
          <label className="input-label" style={{ marginBottom: 0 }}>Target Audience *</label>
          <div className="segmented-control">
            <button 
              className={`segment-btn ${audience === 'all' ? 'active' : ''}`}
              onClick={() => { setAudience('all'); setTargetValue(''); }}
            >
              All Users
            </button>
            <button 
              className={`segment-btn ${audience === 'specific-grade' ? 'active' : ''}`}
              onClick={() => { setAudience('specific-grade'); setTargetValue('Grades 10, 11, 12'); }}
            >
              Specific Grade
            </button>
            <button 
              className={`segment-btn ${audience === 'specific-class' ? 'active' : ''}`}
              onClick={() => { setAudience('specific-class'); setTargetValue('Class 7A'); }}
            >
              Specific Class
            </button>
          </div>
          
          {audience === 'specific-grade' && (
            <select className="grade-select" value={targetValue} onChange={(e) => setTargetValue(e.target.value)}>
              <option value="Grades 10, 11, 12">Grades 10, 11, 12</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          )}

          {audience === 'specific-class' && (
            <select className="grade-select" value={targetValue} onChange={(e) => setTargetValue(e.target.value)}>
              <option value="Class 7A">Class 7A</option>
              <option value="Class 7B">Class 7B</option>
              <option value="Class 8A">Class 8A</option>
            </select>
          )}
        </div>

        <div className="schedule-row">
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Scheduled Start Date-Time *</label>
            <div className="date-time-group">
              <div className="date-time-input">
                <Calendar size={16} className="dt-icon" />
                <input type="date" className="dt-field" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="date-time-input">
                <Clock size={16} className="dt-icon" />
                <input type="time" className="dt-field" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </div>
          </div>
          
          <span style={{ fontSize: '0.875rem', marginTop: '1.5rem', fontWeight: 600 }}>TO</span>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Scheduled End Date-Time *</label>
            <div className="date-time-group">
              <div className="date-time-input">
                <Calendar size={16} className="dt-icon" />
                <input type="date" className="dt-field" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="date-time-input">
                <Clock size={16} className="dt-icon" />
                <input type="time" className="dt-field" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="composer-footer">
          <div className="push-toggle-group">
            <label className="input-label" style={{ marginBottom: 0 }}>Send push notification</label>
            <div className="push-toggle-row" onClick={() => setPushEnabled(!pushEnabled)} style={{cursor: 'pointer'}}>
              <div className={`toggle-switch ${pushEnabled ? 'active' : ''}`} style={{backgroundColor: pushEnabled ? '#0ea5e9' : '#cbd5e1', position: 'relative', width: '40px', height: '20px', borderRadius: '10px', transition: '0.3s'}}>
                <div className="toggle-slider" style={{position: 'absolute', top: '2px', left: pushEnabled ? '22px' : '2px', width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s'}}></div>
              </div>
              <span className="toggle-label" style={{userSelect: 'none'}}>Send push notification to target audience</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn-outline" onClick={handleClear}>Clear / Cancel</button>
            <button className="btn-solid" onClick={handlePublish}>
              {editingId ? 'Update Announcement' : 'Publish / Schedule'}
            </button>
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="history-card">
        <h2 className="composer-title">Announcement History</h2>
        
        <div style={{overflowX: 'auto'}}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Visibility</th>
                <th>Scheduled Window</th>
                <th>Status</th>
                <th>Reach</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#64748b'}}>No announcements found.</td>
                </tr>
              ) : announcements.map((item) => {
                const status = getStatus(item);
                const visibilityLabel = item.audience === 'all' ? 'All Users' : item.targetValue;
                const windowLabel = `${item.startDate} to ${item.endDate}`;
                
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                      {item.pushEnabled && <div style={{fontSize: '0.7rem', color: '#0ea5e9', marginTop: '2px'}}>Push Enabled</div>}
                    </td>
                    <td>{visibilityLabel}</td>
                    <td style={{fontSize: '0.875rem'}}>{windowLabel}</td>
                    <td>
                      <span className={`badge ${status.class}`}>{status.text}</span>
                    </td>
                    <td>{item.reach}</td>
                    <td>
                      <div className="action-icons">
                        <button style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'}} onClick={() => handleEdit(item)} title="Edit">
                          <Edit size={16} className="action-icon" />
                        </button>
                        <button style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'}} onClick={() => handleDelete(item.id)} title="Delete">
                          <Trash2 size={16} className="action-icon" />
                        </button>
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
  );
};
