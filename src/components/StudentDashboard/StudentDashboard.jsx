import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, FileText, Beaker, FileSpreadsheet, TrendingUp, ChevronRight } from 'lucide-react';
import mathThumb from '../../assets/math_thumb.jpg';
import scienceThumb from '../../assets/science_thumb.jpg';
import historyThumb from '../../assets/history_thumb.jpg';
import './StudentDashboard.css';

export const StudentDashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Load announcements
    const savedAnn = localStorage.getItem('kia_announcements');
    if (savedAnn) {
      const parsed = JSON.parse(savedAnn);
      const now = new Date();
      const active = parsed.filter(a => {
        const start = new Date(`${a.startDate}T${a.startTime}`);
        const end = new Date(`${a.endDate}T${a.endTime}`);
        return now >= start && now <= end;
      });
      setAnnouncements(active.slice(0, 3));
    }

    // Load recent videos from kia_content
    const savedContent = localStorage.getItem('kia_content');
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent);
      const videoContent = parsedContent.filter(c => c.type === 'video').slice(0, 3);
      setVideos(videoContent);
    }
  }, []);

  const handlePlayVideo = () => {
    navigate('/student-videos');
  };

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  return (
    <div className="sd-container">
      
      {/* Welcome Section */}
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div className="sd-welcome-text">
          <h1>Welcome Back, {firstName}!</h1>
          <p>Finish Term 2 Strong! Your potential is unlimited.</p>
        </div>
        <div className="sd-progress-widget">
          <div className="sd-progress-circle-wrap">
            <div className="sd-progress-circle">
              <div className="sd-progress-inner">
                <div className="sd-progress-val">75%</div>
                <div className="sd-progress-label">COMPLETE</div>
              </div>
            </div>
          </div>
          <div className="sd-progress-info">
            <h3>TERM 2</h3>
            <p>TERM 2 OVERALL PROGRESS</p>
            <span>Keep Going, {firstName}!</span>
          </div>
        </div>
      </div>

      {/* Continue Watching Section */}
      <div>
        <h2 className="sd-section-title">Continue Watching</h2>
        <div className="sd-continue-grid">
          
          {videos.length === 0 ? (
            <div style={{color: 'var(--color-text-muted)'}}>No videos found. Start learning to see your progress here!</div>
          ) : (
            videos.map(v => (
              <div key={v.id} className="card" style={{display: 'flex', alignItems: 'flex-start', gap: '1rem', position: 'relative'}}>
                <img src={mathThumb} alt={v.subject} className="sd-video-thumb" />
                <div className="sd-video-info">
                  <div className="sd-video-title">{v.grade} {v.subject} -<br/>{v.title}</div>
                  <div style={{ width: '100%' }}>
                    <div className="sd-video-resume">Resume progress</div>
                    <div className="sd-video-bar-bg">
                      <div className="sd-video-bar-fill" style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}></div>
                    </div>
                  </div>
                </div>
                <PlayCircle size={24} className="sd-btn-play" onClick={handlePlayVideo} style={{cursor: 'pointer'}} />
              </div>
            ))
          )}

        </div>
      </div>

      {/* Bottom Grid */}
      <div className="sd-bottom-grid">
        
        {/* Upcoming Assessments */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="sd-card-title">Upcoming Assessments</h3>
          <div className="sd-assessments-list">
            
            <div className="sd-assessment-item">
              <div className="sd-ass-icon red"><FileText size={20} /></div>
              <div className="sd-ass-info">
                <div className="sd-ass-title">Grade 10 Math Quiz 2 - Patterns</div>
                <div className="sd-ass-meta">Tuesday, Due in 2 days <span className="sd-ass-tag red">Red</span></div>
              </div>
              <button className="sd-btn-ass red" onClick={() => navigate('/student-assessments')}>Start Now</button>
            </div>

            <div className="sd-assessment-item">
              <div className="sd-ass-icon amber"><Beaker size={20} /></div>
              <div className="sd-ass-info">
                <div className="sd-ass-title">Grade 10 Science Lab Report</div>
                <div className="sd-ass-meta">Thursday, Due in 4 days <span className="sd-ass-tag amber">Amber</span></div>
              </div>
              <button className="sd-btn-ass amber" onClick={() => navigate('/student-assessments')}>Start Now</button>
            </div>

            <div className="sd-assessment-item">
              <div className="sd-ass-icon amber"><FileSpreadsheet size={20} /></div>
              <div className="sd-ass-info">
                <div className="sd-ass-title">Grade 9 English Presentation</div>
                <div className="sd-ass-meta">Friday, Due in 5 days <span className="sd-ass-tag amber">Amber</span></div>
              </div>
              <button className="sd-btn-ass amber">Submit</button>
            </div>

          </div>
        </div>

        {/* Recent Grades */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="sd-card-title">Recent Grades</h3>
          <div className="sd-grades-list">
            
            <div className="sd-grade-item">
              <div className="sd-grade-badge">A</div>
              <div className="sd-grade-title">Gr10 Math Quiz 1 -</div>
              <div className="sd-grade-letter">A</div>
            </div>

            <div className="sd-grade-item">
              <div className="sd-grade-badge">92%</div>
              <div className="sd-grade-title">Gr10 Science Test 1 - 92%</div>
              <div className="sd-grade-letter">G</div>
            </div>

            <div className="sd-grade-item">
              <div className="sd-grade-badge">88%</div>
              <div className="sd-grade-title">Gr9 English Essay - 88%</div>
              <div className="sd-grade-letter">G</div>
            </div>
            
            <div className="sd-link-footer" style={{ marginTop: 'auto', paddingTop: '1rem', cursor: 'pointer' }} onClick={() => navigate('/student-grades')}>
              <TrendingUp size={16} color="#22c55e" style={{ marginRight: 'auto' }} />
              Grades Overview <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="sd-card-title">Live Announcements</h3>
          <div className="sd-announcements-list">
            
            {announcements.length === 0 ? (
              <div style={{textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)'}}>No active announcements.</div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="sd-ann-item">
                  <div className="sd-ann-header">
                    <div className="sd-ann-title" style={{textTransform: 'uppercase'}}>{a.title}</div>
                    <div className="sd-ann-date">{a.startDate}</div>
                  </div>
                  <div className="sd-ann-sub">
                    {a.content.length > 50 ? a.content.substring(0, 50) + '...' : a.content}
                  </div>
                </div>
              ))
            )}

            <div className="sd-link-footer" style={{ marginTop: 'auto', paddingTop: '1rem', justifyContent: 'center' }}>
              View All Announcements
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
