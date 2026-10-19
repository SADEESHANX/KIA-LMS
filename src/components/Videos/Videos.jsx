import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, CheckCircle2, Loader, Play, Check, 
  Lock, EyeOff, PlayCircle, Volume2, Settings, Maximize, AlertTriangle
} from 'lucide-react';
import './Videos.css';

import videoThumb from '../../assets/video_thumbnail.jpg';

export const Videos = () => {
  // Upload & Process State
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscoding, setIsTranscoding] = useState(false);
  
  // Transcode Steps
  const [res480, setRes480] = useState('pending'); // pending, processing, done
  const [res720, setRes720] = useState('pending');
  const [res1080, setRes1080] = useState('pending');

  // Metadata State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [section, setSection] = useState('P');
  const [subject, setSubject] = useState('P1');
  const [grade, setGrade] = useState('Grade 10-12');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [thumbnail, setThumbnail] = useState(1);
  const [captionFile, setCaptionFile] = useState(null);

  // Access State
  const [visibility, setVisibility] = useState('public');
  const [pinCode, setPinCode] = useState('');
  const [validity, setValidity] = useState('Unlimited');

  // UI State
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);
  const captionInputRef = useRef(null);

  const SUPPORTED_EXTS = ['mp4', 'mov', 'avi'];
  const MAX_SIZE_MB = 2000; // 2GB

  // Simulation Effect
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            startTranscoding();
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const startTranscoding = () => {
    setIsTranscoding(true);
    setRes480('processing');
    
    setTimeout(() => {
      setRes480('done');
      setRes720('processing');
    }, 2000);

    setTimeout(() => {
      setRes720('done');
      setRes1080('processing');
    }, 4000);

    setTimeout(() => {
      setRes1080('done');
      setIsTranscoding(false);
    }, 6000);
  };

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
      setFileError(`File too large (${sizeMB.toFixed(1)}MB). Max size is ${MAX_SIZE_MB}MB (2GB).`);
      return;
    }

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(`.${ext}`, ''));
    }
    setUploadProgress(0);
    setIsUploading(true);
    
    // Reset transcoding state
    setRes480('pending');
    setRes720('pending');
    setRes1080('pending');
    setIsTranscoding(false);
  };

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleVisibilityChange = (vis) => {
    setVisibility(vis);
    if (vis === 'pin') {
      setPinCode(Math.floor(100000 + Math.random() * 900000).toString());
    } else {
      setPinCode('');
    }
  };

  const handlePublish = () => {
    if (!file) {
      setFileError('You must upload a video before publishing.');
      return;
    }
    if (isUploading || isTranscoding) {
      setFileError('Please wait for uploading and processing to finish.');
      return;
    }
    if (!title.trim()) {
      setFileError('Video Title is required.');
      return;
    }

    const newContent = {
      id: Date.now(),
      type: 'video',
      title,
      description,
      fileName: file.name,
      fileSize: file.size,
      section,
      subject,
      grade,
      difficulty,
      visibility,
      pinCode,
      validity,
      thumbnailIdx: thumbnail,
      uploadDate: new Date().toISOString()
    };

    const saved = localStorage.getItem('kia_content');
    const content = saved ? JSON.parse(saved) : [];
    content.push(newContent);
    localStorage.setItem('kia_content', JSON.stringify(content));

    setNotification(`Video "${title}" successfully published!`);
    
    // Reset Form
    setTimeout(() => {
      setNotification('');
      setFile(null);
      setTitle('');
      setDescription('');
      setPinCode('');
      setVisibility('public');
      setUploadProgress(0);
    }, 4000);
  };

  return (
    <div className="videos-container">
      <h1 className="videos-title">Upload Video Lesson</h1>

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

      <div className="videos-card">
        {/* Left Column */}
        <div className="col-left">
          
          <div>
            <h3 className="section-heading">Uploading & Video Processing</h3>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              onChange={(e) => handleFile(e.target.files[0])} 
              accept=".mp4,.mov,.avi"
            />

            {!file ? (
              <div 
                className="upload-drag-zone"
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{cursor: 'pointer'}}
              >
                <Upload size={24} className="upload-icon-video" />
                <div className="upload-text-video">Drag & Drop Video Lesson (Max 2GB)</div>
                <div className="upload-subtext-video">(Supported formats: MP4, MOV, AVI. Max file size: 2GB).</div>
              </div>
            ) : (
              <div className="progress-container">
                <div className="progress-header">
                  <span className="progress-filename" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>
                    {file.name} ({(file.size / (1024*1024)).toFixed(0)}MB)
                  </span>
                  <span className="progress-percent">
                    {isUploading ? `~${uploadProgress}%` : (isTranscoding ? 'Processing...' : 'Complete')}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${isUploading ? uploadProgress : 100}%`, backgroundColor: (isUploading || isTranscoding) ? '#0ea5e9' : '#22c55e' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div style={{ opacity: file && !isUploading ? 1 : 0.5, pointerEvents: file && !isUploading ? 'auto' : 'none' }}>
            <div className="status-title">Transcoding Status (after upload)</div>
            <div className="transcode-list">
              <div className="transcode-item">
                <span className="tc-res">480p</span>
                <span className="tc-status">{res480 === 'done' ? 'Transcoded' : res480 === 'processing' ? 'Transcoding...' : 'Pending...'}</span>
                {res480 === 'done' && <CheckCircle2 size={16} className="tc-icon-success" />}
                {res480 === 'processing' && <Loader size={16} className="tc-icon-loading" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>
              <div className="transcode-item">
                <span className="tc-res">720p</span>
                <span className="tc-status">{res720 === 'done' ? 'Transcoded' : res720 === 'processing' ? 'Transcoding...' : 'Pending...'}</span>
                {res720 === 'done' && <CheckCircle2 size={16} className="tc-icon-success" />}
                {res720 === 'processing' && <Loader size={16} className="tc-icon-loading" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>
              <div className="transcode-item">
                <span className="tc-res">1080p</span>
                <span className="tc-status">{res1080 === 'done' ? 'Transcoded' : res1080 === 'processing' ? 'Transcoding...' : 'Pending...'}</span>
                {res1080 === 'done' && <CheckCircle2 size={16} className="tc-icon-success" />}
                {res1080 === 'processing' && <Loader size={16} className="tc-icon-loading" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>
            </div>

            <div className="status-title" style={{marginTop: '1.5rem'}}>Select Thumbnail</div>
            <div className="thumbnails-container">
              {[1, 2].map((idx) => (
                <div key={idx} className="thumb-small-wrapper" onClick={() => setThumbnail(idx)} style={{cursor: 'pointer'}}>
                  <div className={`thumb-small ${thumbnail === idx ? 'selected' : ''}`}>
                    <img src={videoThumb} alt={`thumb${idx}`} className="thumb-img" />
                    <div className="play-overlay"><Play size={10} fill="currentColor" /></div>
                  </div>
                  {thumbnail === idx && <div className="checkbox-custom"><Check size={12} strokeWidth={3} /></div>}
                </div>
              ))}
              
              <div className="thumb-large" style={{flex: 1}}>
                <img src={videoThumb} alt="player preview" className="thumb-img" />
                <div className="play-overlay play-overlay-large" style={{ backgroundColor: 'transparent' }}>
                   <div style={{
                     width: 40, height: 45, backgroundColor: '#eab308', 
                     clipPath: 'polygon(50% 100%, 100% 75%, 100% 0, 0 0, 0 75%)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                     <Play size={20} fill="black" style={{ marginTop: '-4px' }} />
                   </div>
                </div>
                <div className="player-controls">
                  <PlayCircle size={12} />
                  <div className="player-progress">
                    <div className="player-progress-fill"></div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Volume2 size={12} />
                    <Settings size={12} />
                    <Maximize size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-right">
          <h3 className="section-heading">Metadata & Visibility</h3>
          
          <div className="form-group-vid">
            <label className="label-vid">Title *</label>
            <input type="text" className="input-vid" value={title} onChange={e => setTitle(e.target.value)} placeholder="Video Title" />
          </div>

          <div className="form-group-vid">
            <label className="label-vid">Description</label>
            <textarea 
              className="input-vid" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a description for the video lesson"
              style={{minHeight: '80px', resize: 'vertical'}}
            ></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="label-vid">Section (DR-02)</span>
            <select className="select-vid" value={section} onChange={e => setSection(e.target.value)} style={{width: 'auto'}}>
              <option value="P">P</option>
              <option value="P1">P1</option>
              <option value="MP1">MP1</option>
              <option value="Activities">Activities</option>
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group-vid">
              <label className="label-vid">Subject</label>
              <select className="select-vid" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="History">History</option>
              </select>
            </div>
            
            <div className="form-group-vid">
              <label className="label-vid">Grade</label>
              <select className="select-vid" value={grade} onChange={e => setGrade(e.target.value)}>
                <option value="Grade 10-12">Grade 10-12</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 8">Grade 8</option>
              </select>
            </div>
          </div>

          <div className="form-group-vid">
            <label className="label-vid">Difficulty</label>
            <select className="select-vid" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group-vid">
            <label className="label-vid">Optional SRT/VTT Caption File</label>
            <div className="browse-input-wrapper">
              <input type="file" ref={captionInputRef} style={{display: 'none'}} accept=".srt,.vtt" onChange={e => setCaptionFile(e.target.files[0])} />
              <div className="browse-input-fake" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 8px'}}>
                {captionFile ? captionFile.name : 'No file selected...'}
              </div>
              <button className="browse-btn" onClick={() => captionInputRef.current.click()}>Browse...</button>
            </div>
          </div>

          <div>
            <div className="label-vid" style={{ marginTop: '0.5rem' }}>Visibility and Access</div>
            
            <div className="radio-group-vid">
              <label className="radio-label-vid">
                <input type="radio" name="vis" checked={visibility === 'public'} onChange={() => handleVisibilityChange('public')} />
                Public
              </label>
              <label className="radio-label-vid">
                <input type="radio" name="vis" checked={visibility === 'class'} onChange={() => handleVisibilityChange('class')} />
                Class-only
              </label>
              <label className="radio-label-vid">
                <input type="radio" name="vis" checked={visibility === 'pin'} onChange={() => handleVisibilityChange('pin')} />
                PIN-protected
              </label>
            </div>

            {visibility === 'pin' && (
              <div className="grid-2" style={{marginTop: '1rem'}}>
                <div className="form-group-vid">
                  <label className="label-vid">6-digit Access PIN</label>
                  <div className="input-with-icon-vid">
                    <input type="text" value={pinCode} readOnly className="input-vid" style={{backgroundColor: '#f8fafc', fontWeight: 'bold', letterSpacing: '2px'}} />
                    <div className="input-icon-vid">
                      <Lock size={14} />
                    </div>
                  </div>
                </div>
                
                <div className="form-group-vid">
                  <label className="label-vid">Validity Period</label>
                  <select className="select-vid" value={validity} onChange={e => setValidity(e.target.value)}>
                    <option value="Unlimited">Unlimited</option>
                    <option value="7 days">7 days</option>
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
            <button style={{padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white', cursor: 'pointer'}} onClick={() => {setFile(null); setTitle('');}}>Cancel</button>
            <button style={{padding: '0.5rem 1.5rem', border: 'none', borderRadius: '4px', background: '#0f172a', color: 'white', cursor: 'pointer', fontWeight: 500, opacity: (isUploading || isTranscoding || !file) ? 0.5 : 1}} onClick={handlePublish}>Publish Video</button>
          </div>

        </div>
      </div>
    </div>
  );
};
