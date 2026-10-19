import React, { useState, useRef } from 'react';
import { Upload, EyeOff, Calendar, Paperclip, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import './Materials.css';

export const Materials = () => {
  // Form State
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('P');
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState('Grade 10-12');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // Access State
  const [visibility, setVisibility] = useState('public');
  const [pinCode, setPinCode] = useState('');
  const [validity, setValidity] = useState('Unlimited');
  const [releaseMode, setReleaseMode] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  
  // UI State
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);

  const SUPPORTED_EXTS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'];
  const MAX_SIZE_MB = 50;

  const handleFile = (selectedFile) => {
    setFileError('');
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_EXTS.includes(ext)) {
      setFileError(`Invalid format. Supported formats: ${SUPPORTED_EXTS.join(', ').toUpperCase()}`);
      return;
    }

    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setFileError(`File too large (${sizeMB.toFixed(1)}MB). Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);
    if (!title) {
      // Auto-fill title from filename without extension
      setTitle(selectedFile.name.replace(`.${ext}`, ''));
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleTagKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleVisibilityChange = (vis) => {
    setVisibility(vis);
    if (vis === 'pin') {
      // Auto-generate 6-digit PIN
      setPinCode(Math.floor(100000 + Math.random() * 900000).toString());
    } else {
      setPinCode('');
    }
  };

  const handlePublish = () => {
    if (!file) {
      setFileError('You must upload a file before publishing.');
      return;
    }
    if (!title.trim()) {
      setFileError('Material Title is required.');
      return;
    }

    const newContent = {
      id: Date.now(),
      type: 'material',
      title,
      fileName: file.name,
      fileSize: file.size,
      section,
      subject,
      grade,
      tags,
      visibility,
      pinCode,
      validity,
      releaseMode,
      scheduleDate,
      uploadDate: new Date().toISOString()
    };

    const saved = localStorage.getItem('kia_content');
    const content = saved ? JSON.parse(saved) : [];
    content.push(newContent);
    localStorage.setItem('kia_content', JSON.stringify(content));

    setNotification(`Material "${title}" successfully ${releaseMode === 'now' ? 'published' : 'scheduled'}!`);
    
    // Reset Form
    setTimeout(() => {
      setNotification('');
      setFile(null);
      setTitle('');
      setTags([]);
      setPinCode('');
      setVisibility('public');
    }, 4000);
  };

  return (
    <div className="materials-container">
      <h1 className="materials-title">Upload New Educational Material</h1>

      {notification && (
        <div className="alert-warning" style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22c55e', marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {fileError && (
        <div className="alert-warning" style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} />
            <span>{fileError}</span>
          </div>
        </div>
      )}

      <div className="materials-card">
        {/* Left Column */}
        <div className="column-left">
          
          <div className="upload-zone-wrapper">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              onChange={(e) => handleFile(e.target.files[0])} 
            />
            
            {!file ? (
              <div 
                className="drag-drop-zone" 
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{cursor: 'pointer'}}
              >
                <Upload size={24} className="upload-icon" />
                <div className="upload-text">Drag & drop files to upload, or Browse</div>
                <div className="upload-subtext">(Supported formats: PDF, DOC, PPT, JPG, PNG. Max file size: 50MB).</div>
              </div>
            ) : (
              <div className="selected-file-box">
                <div className="file-info">
                  <div className="file-icon-wrapper">
                    <Paperclip size={20} style={{ transform: 'rotate(-45deg)' }} />
                  </div>
                  <div className="file-name" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span className="file-badge" style={{textTransform: 'uppercase'}}>{file.name.split('.').pop()}</span>
                    <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'}}>{file.name}</span>
                    <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>({(file.size / (1024*1024)).toFixed(2)} MB)</span>
                  </div>
                </div>
                <button className="btn-change-file" onClick={() => {setFile(null); fileInputRef.current.value = null;}}>Remove</button>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 className="section-title">Material Metadata</h3>
            
            <div className="two-col-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="label-text">Section (DR-02)</label>
                <select className="mat-select" value={section} onChange={e => setSection(e.target.value)}>
                  <option value="P">P</option>
                  <option value="P1">P1</option>
                  <option value="MP1">MP1</option>
                  <option value="Activities">Activities</option>
                </select>
              </div>
              
              <div className="form-group">
                <div className="label-row">
                  <label className="label-text">Grade</label>
                </div>
                <select className="mat-select" value={grade} onChange={e => setGrade(e.target.value)}>
                  <option value="Grade 10-12">Grade 10-12</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label-text">Tags</label>
              <div className="tags-input-container">
                {tags.map(t => (
                  <span key={t} className="tag-pill">
                    {t}
                    <X size={12} style={{cursor: 'pointer', marginLeft: '4px'}} onClick={() => removeTag(t)} />
                  </span>
                ))}
                {tags.length > 0 && <span style={{ color: '#cbd5e1', marginRight: '8px' }}>|</span>}
                <input 
                  type="text" 
                  className="tag-input-field" 
                  placeholder="Type tag & hit Enter" 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="column-right">
          
          <div>
            <h3 className="section-title">Material Details</h3>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <div className="label-row">
                <label className="label-text">Material Title *</label>
              </div>
              <input 
                type="text" 
                className="mat-input" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Title of the material" 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="label-text">Subject</label>
              <select className="mat-select" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="section-title" style={{ marginTop: '0.5rem' }}>Visibility and Access</h3>
            
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="visibility" 
                  className="radio-input"
                  checked={visibility === 'public'}
                  onChange={() => handleVisibilityChange('public')}
                />
                Public
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="visibility" 
                  className="radio-input"
                  checked={visibility === 'class'}
                  onChange={() => handleVisibilityChange('class')}
                />
                Class-only
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="visibility" 
                  className="radio-input"
                  checked={visibility === 'pin'}
                  onChange={() => handleVisibilityChange('pin')}
                />
                PIN-protected
              </label>
            </div>

            {visibility === 'pin' && (
              <div className="two-col-grid" style={{marginTop: '1rem'}}>
                <div className="form-group">
                  <label className="label-text">6-digit Access PIN</label>
                  <div className="input-with-icon">
                    <input type="text" value={pinCode} readOnly className="mat-input" style={{backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 'bold', letterSpacing: '2px'}} />
                    <EyeOff size={16} className="input-icon-right" />
                  </div>
                  <span style={{fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block'}}>Auto-generated securely</span>
                </div>
                
                <div className="form-group">
                  <label className="label-text">Validity Period</label>
                  <select className="mat-select" value={validity} onChange={e => setValidity(e.target.value)}>
                    <option value="Unlimited">Unlimited</option>
                    <option value="7 days">7 days</option>
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="section-title" style={{ marginTop: '1.5rem' }}>Release Schedule</h3>
            
            <div className="toggle-group">
              <button 
                className={`toggle-btn ${releaseMode === 'now' ? 'active' : ''}`}
                onClick={() => setReleaseMode('now')}
              >
                Publish now
              </button>
              <button 
                className={`toggle-btn ${releaseMode === 'schedule' ? 'active' : ''}`}
                onClick={() => setReleaseMode('schedule')}
              >
                Schedule release
              </button>
            </div>

            {releaseMode === 'schedule' && (
              <div className="input-with-icon input-with-icon-left" style={{marginTop: '1rem'}}>
                <Calendar size={16} className="input-icon-left" />
                <input type="datetime-local" className="mat-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
              </div>
            )}

            <div className="mat-actions">
              <button className="btn-mat-cancel" onClick={() => {setFile(null); setTitle('');}}>Cancel</button>
              <button className="btn-mat-submit" onClick={handlePublish}>
                {releaseMode === 'now' ? 'Publish Material' : 'Schedule Release'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
