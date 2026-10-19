import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, Volume2, Maximize, ChevronDown, ChevronUp, 
  Video, FileText, CheckCircle2, Circle
} from 'lucide-react';
import mathThumb from '../../assets/math_thumb.jpg';
import './StudentVideoPlayer.css';

export const StudentVideoPlayer = () => {
  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalDuration = 1510; // 25:10

  // Notes State
  const [notes, setNotes] = useState([
    { id: 1, time: 320, text: "Review formula for coefficients." },
    { id: 2, time: 755, text: "Important condition for quadratic formula." }
  ]);
  const [newNote, setNewNote] = useState('');

  // Simulation timer
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < totalDuration) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + speed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentTime, totalDuration]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddNote = (e) => {
    if (e.key === 'Enter' && newNote.trim()) {
      e.preventDefault();
      setNotes([...notes, {
        id: Date.now(),
        time: currentTime,
        text: newNote.trim()
      }].sort((a, b) => a.time - b.time));
      setNewNote('');
    }
  };

  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="svp-container">
      
      {/* Main Left Column */}
      <div className="svp-main-col">
        
        {/* Video Player */}
        <div className="svp-player-wrapper" onClick={() => setIsPlaying(!isPlaying)}>
          <img src={mathThumb} alt="Video Thumbnail" className="svp-video-img" />
          
          <div className="svp-controls-overlay" onClick={e => e.stopPropagation()}>
            
            <div className="svp-progress-bar-container">
              <div className="svp-progress-fill" style={{width: `${progressPercent}%`}}>
                <div className="svp-progress-handle">
                  <div className="svp-tooltip">{formatTime(currentTime)}</div>
                </div>
              </div>
            </div>

            <div className="svp-controls-row">
              <div className="svp-controls-left">
                <button className="svp-ctrl-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                </button>
                <button className="svp-ctrl-btn"><SkipForward size={20} fill="white" /></button>
                <button className="svp-ctrl-btn"><Volume2 size={20} /></button>
                <span className="svp-time">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
              </div>
              
              <div className="svp-controls-right">
                <button className="svp-speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                  {speed}x <ChevronDown size={16} />
                  
                  {showSpeedMenu && (
                    <div className="svp-speed-menu">
                      {[0.5, 1.0, 1.25, 1.5, 1.75, 2.0].map(val => (
                        <div 
                          key={val} 
                          className={`svp-speed-item ${speed === val ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSpeed(val); setShowSpeedMenu(false); }}
                        >
                          {val.toFixed(1)}x
                        </div>
                      ))}
                    </div>
                  )}
                </button>
                
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>1080p <ChevronDown size={16} style={{ verticalAlign: 'middle' }}/></span>
                
                <button className="svp-ctrl-btn"><Maximize size={20} /></button>
              </div>
            </div>

          </div>
        </div>

        {/* Video Metadata */}
        <div className="svp-meta-card">
          <div className="svp-meta-header">
            <h1 className="svp-video-title">Grade 10 Math - Quadratic Equations</h1>
            <button 
              className="svp-btn-complete" 
              onClick={() => setIsCompleted(!isCompleted)}
              style={{backgroundColor: isCompleted ? '#22c55e' : '#0f172a'}}
            >
              {isCompleted ? <><CheckCircle2 size={16} style={{marginRight: '6px'}} /> Completed</> : 'Mark as Complete'}
            </button>
          </div>
          <div className="svp-teacher">
            Teacher: <span className="svp-teacher-name">Niran Dissanayake</span>
          </div>
          <p className="svp-desc">
            Description: Learn to graph and solve quadratic equations, explore function transformations, and understand the quadratic formula in real-world applications.
          </p>
        </div>
      </div>

      {/* Right Sidebar Panels */}
      <div className="svp-side-col">
        
        {/* Timestamped Notes */}
        <div className="svp-side-panel">
          <div className="svp-panel-title">Timestamped Notes</div>
          
          <div className="svp-notes-list">
            {notes.length === 0 ? (
              <div style={{color: 'var(--color-text-muted)', fontSize: '0.875rem', padding: '1rem'}}>No notes yet. Type below to add one!</div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="svp-note-item">
                  <span className="svp-note-time">[{formatTime(note.time)}]</span> {note.text}
                </div>
              ))
            )}
          </div>
          
          <div className="svp-notes-input-area">
            <input 
              type="text" 
              className="svp-notes-input" 
              placeholder="Add note at current time..." 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleAddNote}
            />
          </div>
        </div>

        {/* Course Content List */}
        <div className="svp-side-panel">
          <div className="svp-panel-title">Course Content List</div>
          
          <div className="svp-section-header">
            Section 2: Equations <ChevronUp size={16} />
          </div>
          
          <div className="svp-content-list">
            
            <div className="svp-content-item">
              <div className="svp-ci-icon green"><Video size={16} /></div>
              <div className="svp-ci-title">Grade 10 Math - Factoring Methods</div>
              <div className="svp-ci-status"><CheckCircle2 size={16} className="svp-status-icon green" fill="#22c55e" color="white" /></div>
            </div>

            <div className="svp-content-item" style={isCompleted ? {backgroundColor: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: '4px'} : {}}>
              <div className="svp-ci-icon green"><Video size={16} /></div>
              <div className="svp-ci-title" style={{fontWeight: isCompleted ? 600 : 400}}>Grade 10 Math - Quadratic Equations</div>
              <div className="svp-ci-status">
                {isCompleted ? <CheckCircle2 size={16} className="svp-status-icon green" fill="#22c55e" color="white" /> : <Circle size={16} className="svp-status-icon grey" fill="#cbd5e1" color="transparent" />}
              </div>
            </div>

            <div className="svp-content-item">
              <div className="svp-ci-icon gold"><FileText size={16} /></div>
              <div className="svp-ci-title">Section 2 Worksheet</div>
              <div className="svp-ci-status"><CheckCircle2 size={16} className="svp-status-icon green" fill="#22c55e" color="white" /></div>
            </div>

            <div className="svp-content-item">
              <div className="svp-ci-icon grey"><FileText size={16} /></div>
              <div className="svp-ci-title">Notes on Chemical Eqs</div>
              <div className="svp-ci-status"><Circle size={16} className="svp-status-icon grey" fill="#cbd5e1" color="transparent" /></div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
