import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, Bold, Italic, Link, List, AlignLeft,
  Upload, PenTool, Eraser, TriangleAlert, FileText, CheckCircle2
} from 'lucide-react';
import './TakeAssessment.css';

const mockQuestions = [
  {
    id: 1,
    type: 'mcq',
    text: 'Which of the following formulas correctly represents the roots of a quadratic equation ax² + bx + c = 0?',
    points: 5,
    options: [
      { id: 'a', text: 'x = (-b ± √(b² - 4ac)) / 2a' },
      { id: 'b', text: 'x = (b ± √(b² + 4ac)) / 2a' },
      { id: 'c', text: 'x = (-b ± √(b² + 4ac)) / 2' },
      { id: 'd', text: 'x = (-b ± √(b - 4ac)) / 2a' }
    ]
  },
  {
    id: 2,
    type: 'essay',
    text: 'Explain the geometric meaning of the discriminant (b² - 4ac) being greater than zero, equal to zero, and less than zero.',
    points: 15
  },
  {
    id: 3,
    type: 'file',
    text: 'Solve the equation 2x² - 5x + 3 = 0 using the completing the square method. Show all your working steps clearly. Upload a scanned PDF or image of your hand-written answer.',
    points: 20
  },
  {
    id: 4,
    type: 'canvas',
    text: 'Draw the parabola representing the equation y = x² - 4. Clearly mark the vertex and the x-intercepts.',
    points: 10
  }
];

export const TakeAssessment = () => {
  const navigate = useNavigate();
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutes in seconds
  const [lastSaved, setLastSaved] = useState('Not saved yet');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const fileInputRef = useRef(null);

  const currentQ = mockQuestions[currentQIndex];
  const unansweredCount = mockQuestions.length - Object.keys(answers).filter(k => {
    const ans = answers[k];
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'string') return ans.trim() !== '';
    if (typeof ans === 'boolean') return ans;
    return !!ans;
  }).length;

  // Timer Effect
  useEffect(() => {
    if (isSubmitted || !hasStarted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, hasStarted]);

  // Auto-save Effect
  useEffect(() => {
    if (Object.keys(answers).length > 0 && !isSubmitted && hasStarted) {
      const timeout = setTimeout(() => {
        localStorage.setItem('kia_draft_assessment', JSON.stringify(answers));
        const now = new Date();
        setLastSaved(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
      }, 1000); // Save 1 second after last edit
      return () => clearTimeout(timeout);
    }
  }, [answers, isSubmitted]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Simulate file upload by storing names
      const existing = answers[currentQ.id] || [];
      const newFiles = files.map(f => f.name);
      handleAnswerChange([...existing, ...newFiles].slice(0, 5)); // Max 5
    }
  };

  const handleCanvasSimulate = () => {
    // Simulate drawing by just marking it answered
    handleAnswerChange(true);
  };

  const attemptSubmit = () => {
    if (unansweredCount > 0) {
      setShowModal(true);
    } else {
      handleSubmit(false);
    }
  };

  const handleSubmit = (forced = false) => {
    setShowModal(false);
    setIsSubmitted(true);
    
    // Save to completed submissions
    const submission = {
      id: Date.now(),
      assessmentId: 'term2-math',
      answers,
      submittedAt: new Date().toISOString(),
      timeRemaining: timeLeft
    };
    
    const existing = JSON.parse(localStorage.getItem('kia_submissions') || '[]');
    localStorage.setItem('kia_submissions', JSON.stringify([...existing, submission]));
    localStorage.removeItem('kia_draft_assessment'); // Clear draft
    
    setTimeout(() => {
      navigate('/student-grades'); // Redirect to results/grades after 2s
    }, 2000);
  };

  if (!hasStarted) {
    return (
      <div className="ta-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center'}}>
        <div style={{backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', maxWidth: '600px', width: '100%'}}>
          <h1 style={{fontSize: '2rem', marginBottom: '1rem', color: '#1e293b'}}>Term 2 Math Mid-term</h1>
          <p style={{color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem'}}>
            This assessment contains 4 questions. You will have 2 hours to complete it. The timer will begin as soon as you click start.
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: '1.5rem', fontWeight: 600}}>4</div>
              <div style={{fontSize: '0.875rem', color: '#64748b'}}>Questions</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: '1.5rem', fontWeight: 600}}>50</div>
              <div style={{fontSize: '0.875rem', color: '#64748b'}}>Total Points</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: '1.5rem', fontWeight: 600}}>120</div>
              <div style={{fontSize: '0.875rem', color: '#64748b'}}>Minutes</div>
            </div>
          </div>
          <button 
            className="ta-btn-submit-main" 
            style={{width: '100%', fontSize: '1.1rem', padding: '1rem'}} 
            onClick={() => setHasStarted(true)}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="ta-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center'}}>
        <CheckCircle2 size={64} color="#22c55e" style={{marginBottom: '1rem'}} />
        <h1 style={{fontSize: '2rem', marginBottom: '1rem'}}>Assessment Submitted!</h1>
        <p style={{color: 'var(--color-text-muted)', fontSize: '1.25rem'}}>Your answers have been saved successfully.</p>
        <p style={{color: 'var(--color-text-muted)'}}>Redirecting to results...</p>
      </div>
    );
  }

  return (
    <div className="ta-container">
      
      {/* Header */}
      <div className="ta-header-area">
        <h1 className="ta-title">Take Assessment: Term 2 Math Mid-term</h1>
        <div className="ta-timer" style={{ color: timeLeft < 300 ? '#ef4444' : '#d97706' }}>
          <Clock size={20} /> {formatTime(timeLeft)} remaining
        </div>
      </div>

      {/* Nav Controls */}
      <div className="ta-nav-controls">
        <div className="ta-view-toggle">
          <button className="ta-toggle-btn">View All</button>
          <button className="ta-toggle-btn active">One at a Time</button>
        </div>
        
        <div className="ta-pagination">
          {mockQuestions.map((q, idx) => {
            const isAnswered = answers[q.id] && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : answers[q.id] !== '');
            const isCurrent = idx === currentQIndex;
            let className = 'ta-page-dot remaining';
            if (isCurrent) className = 'ta-page-dot current';
            else if (isAnswered) className = 'ta-page-dot completed';
            
            return (
              <div 
                key={q.id} 
                className={className}
                onClick={() => setCurrentQIndex(idx)}
                style={{cursor: 'pointer'}}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <div className="ta-layout">
        
        {/* Left Column: Question Area */}
        <div className="card">
          <div className="ta-question-content">
            <h2 className="ta-q-header">
              Question {currentQIndex + 1} of {mockQuestions.length} <span className="ta-q-pts">({currentQ.points} Points)</span>
            </h2>
            
            <p className="ta-q-text">
              {currentQ.text}
            </p>

            {/* Answer Inputs based on type */}
            <div style={{ marginTop: '2rem' }}>
              
              {currentQ.type === 'mcq' && (
                <div className="ta-mcq-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {currentQ.options.map(opt => (
                    <div 
                      key={opt.id} 
                      className="ta-mcq-option" 
                      onClick={() => handleAnswerChange(opt.id)}
                      style={{ 
                        border: answers[currentQ.id] === opt.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: answers[currentQ.id] === opt.id ? '#fef3c7' : 'transparent',
                        padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem'
                      }}
                    >
                      <div className={`ta-radio ${answers[currentQ.id] === opt.id ? 'selected' : ''}`}>
                        <div className="ta-radio-inner"></div>
                      </div>
                      ({opt.id.toUpperCase()}) {opt.text}
                    </div>
                  ))}
                </div>
              )}

              {currentQ.type === 'essay' && (
                <div className="ta-rte-container">
                  <div className="ta-rte-toolbar">
                    <button className="ta-rte-btn"><Bold size={16} /></button>
                    <button className="ta-rte-btn"><Italic size={16} /></button>
                    <button className="ta-rte-btn"><Link size={16} /></button>
                    <button className="ta-rte-btn"><List size={16} /></button>
                    <button className="ta-rte-btn"><AlignLeft size={16} /></button>
                  </div>
                  <textarea 
                    className="ta-rte-textarea" 
                    placeholder="Type your detailed answer here..."
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  ></textarea>
                </div>
              )}

              {currentQ.type === 'file' && (
                <div>
                  <input type="file" multiple ref={fileInputRef} style={{display: 'none'}} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.jpg,.png" />
                  <div className="ta-upload-zone" onClick={() => fileInputRef.current.click()} style={{cursor: 'pointer'}}>
                    <Upload size={32} color="#94a3b8" style={{marginBottom: '0.5rem'}} />
                    <div className="ta-upload-text" style={{fontSize: '1.1rem'}}>Drag-and-drop or click to browse</div>
                    <div className="ta-upload-sub">PDF, Word, JPG, PNG accepted (Max 5 files, 50MB each)</div>
                  </div>
                  
                  {answers[currentQ.id] && answers[currentQ.id].length > 0 && (
                    <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      {answers[currentQ.id].map((fname, i) => (
                        <div key={i} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '4px'}}>
                          <FileText size={16} color="#64748b" /> 
                          <span style={{fontSize: '0.875rem'}}>{fname}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentQ.type === 'canvas' && (
                <div className="ta-canvas-area" style={{height: '400px', display: 'flex', flexDirection: 'column'}}>
                  <div className="ta-canvas-toolbar" style={{borderBottom: '1px solid #e2e8f0', padding: '0.5rem', display: 'flex', justifyContent: 'space-between'}}>
                    <div className="ta-canvas-tools" style={{display: 'flex', gap: '0.5rem'}}>
                      <button className="ta-rte-btn" style={{background: '#e2e8f0'}}><PenTool size={16} /></button>
                      <button className="ta-rte-btn"><Eraser size={16} /></button>
                    </div>
                    <div className="ta-canvas-colors" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <div className="ta-color-dot" style={{backgroundColor: '#000', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #ccc'}}></div>
                      <div className="ta-color-dot" style={{backgroundColor: '#ef4444', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer'}}></div>
                      <div className="ta-color-dot" style={{backgroundColor: '#3b82f6', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer'}}></div>
                    </div>
                  </div>
                  <div 
                    className="ta-canvas-body" 
                    onClick={handleCanvasSimulate}
                    style={{flex: 1, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', position: 'relative'}}
                  >
                    {answers[currentQ.id] ? (
                      <svg width="200" height="200" viewBox="0 0 100 100" style={{stroke: 'black', strokeWidth: 2, fill: 'none'}}>
                        <path d="M 10 10 Q 50 150 90 10" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="#ccc" strokeWidth="1" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#ccc" strokeWidth="1" />
                        <circle cx="50" cy="80" r="3" fill="red" stroke="none" />
                      </svg>
                    ) : (
                      <span style={{color: '#94a3b8', fontSize: '1rem'}}>(Click anywhere to simulate drawing answer)</span>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="ta-bottom-bar">
            <div className="ta-bar-left">
              <div className="ta-save-status">
                <Clock size={14} /> Auto-saved: {lastSaved}
              </div>
            </div>
            <div className="ta-bar-right">
              <button 
                className="ta-btn-outline-gold" 
                disabled={currentQIndex === 0}
                style={{opacity: currentQIndex === 0 ? 0.5 : 1}}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
              >
                Previous
              </button>
              {currentQIndex < mockQuestions.length - 1 ? (
                <button className="ta-btn-solid-dark" onClick={() => setCurrentQIndex(prev => prev + 1)}>Next Question</button>
              ) : (
                <button className="ta-btn-submit-main" style={{margin: 0, padding: '0.75rem 1.5rem'}} onClick={attemptSubmit}>Review & Submit</button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Reference / Sidebar Panel */}
        <div className="ta-sidebar" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          
          <div className="card" style={{display: 'flex', flexDirection: 'column', height: 'fit-content'}}>
            <h3 className="ta-sidebar-title">Assessment Info</h3>
            <div style={{fontSize: '0.875rem', marginBottom: '1rem'}}>
              <strong>Total Questions:</strong> {mockQuestions.length}<br/>
              <strong>Total Points:</strong> {mockQuestions.reduce((sum, q) => sum + q.points, 0)}
            </div>

            <h3 className="ta-sidebar-title">Status Overview</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Answered:</span>
                <span style={{fontWeight: 600, color: '#22c55e'}}>{mockQuestions.length - unansweredCount}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Unanswered:</span>
                <span style={{fontWeight: 600, color: unansweredCount > 0 ? '#ef4444' : '#64748b'}}>{unansweredCount}</span>
              </div>
            </div>
          </div>

          <button className="ta-btn-submit-main" onClick={attemptSubmit} style={{marginTop: 'auto'}}>
            Submit Assessment
          </button>
        </div>

      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="ta-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ta-modal" onClick={e => e.stopPropagation()}>
            <TriangleAlert size={48} className="ta-modal-icon" color="#ef4444" />
            <h2 className="ta-modal-title">Are you sure you want to submit?</h2>
            <p className="ta-modal-text">
              You have <strong style={{color: '#ef4444'}}>{unansweredCount}</strong> unanswered questions.<br/>
              Submitting will lock your answers and end the assessment.
            </p>
            <div className="ta-modal-actions">
              <button className="ta-btn-outline-gold" onClick={() => setShowModal(false)}>Continue Taking</button>
              <button className="ta-btn-solid-dark" onClick={() => handleSubmit(true)} style={{backgroundColor: '#ef4444'}}>Submit Anyway</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
