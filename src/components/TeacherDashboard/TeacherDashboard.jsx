import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Video, FileText, ChevronDown, CheckSquare, MessageCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import './TeacherDashboard.css';

const performanceData = [
  { name: 'Aug 1', score: 65, benchmark: 72 },
  { name: '5', score: 68, benchmark: 73 },
  { name: '9', score: 72, benchmark: 75 },
  { name: '9...', score: 78, benchmark: 78 }
];

const mockClasses = [
  "Grade 11 - Mathematics - Section P1",
  "Grade 11 - Mathematics - Section P2",
  "Grade 12 - Mathematics - Section A"
];

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState(mockClasses[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Stats
  const [videoCount, setVideoCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);
  const [totalStorageMB, setTotalStorageMB] = useState(0);

  // Load stats from kia_content on mount
  useEffect(() => {
    const saved = localStorage.getItem('kia_content');
    if (saved) {
      const content = JSON.parse(saved);
      let vCount = 0;
      let mCount = 0;
      let bytes = 0;
      
      content.forEach(item => {
        if (item.type === 'video') vCount++;
        if (item.type === 'material') mCount++;
        if (item.fileSize) bytes += item.fileSize;
      });
      
      setVideoCount(vCount);
      setMaterialCount(mCount);
      setTotalStorageMB((bytes / (1024 * 1024)).toFixed(2));
    }
  }, []);

  const handleClassChange = (c) => {
    setActiveClass(c);
    setIsDropdownOpen(false);
    // In a real app, this would trigger an API fetch to load new performanceData, pending submissions, etc.
  };

  const handleUploadVideo = () => navigate('/videos');
  const handleUploadMaterial = () => navigate('/materials');
  const handleCreateAssessment = () => navigate('/assessments');

  return (
    <div className="teacher-dashboard">
      
      {/* Top Bar */}
      <div className="td-top-bar">
        <div className="class-selector">
          Current Class: 
          <div className="class-dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{position: 'relative', cursor: 'pointer'}}>
            <Users size={16} className="text-warning" style={{ color: '#eab308' }} />
            {activeClass}
            <ChevronDown size={16} />
            
            {isDropdownOpen && (
              <div style={{position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                {mockClasses.map(c => (
                  <div key={c} style={{padding: '0.5rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} onClick={(e) => { e.stopPropagation(); handleClassChange(c); }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="td-actions">
          <button className="btn-td-primary" onClick={handleUploadVideo}>
            <Video size={16} /> Upload Video
          </button>
          <button className="btn-td-primary" onClick={handleUploadMaterial}>
            <FileText size={16} /> Upload Material
          </button>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="td-cards-top">
        {/* Pending Submissions */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="td-card-title">Pending Submissions to Mark</h3>
          <div className="pending-number">27</div>
          <div className="pending-desc">For all current assignments</div>
          <div className="badge-attention">Needs Attention</div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="td-card-title">Upcoming Assessment Deadlines</h3>
          <div className="td-list">
            <div className="td-list-item">
              <span className="td-list-item-left">Term 2 Mid-term (Math) - Aug 15</span>
              <span className="deadline-badge dl-urgent">(4 days)</span>
            </div>
            <div className="td-list-item">
              <span className="td-list-item-left">Grade 10 Algebra Quiz - Aug 18</span>
              <span className="deadline-badge dl-warning">2 days</span>
            </div>
            <div className="td-list-item">
              <span className="td-list-item-left">Term Project: Gr12 - Aug 25</span>
              <span className="deadline-badge dl-safe">3 days</span>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="td-card-title">Recent Student Questions/Messages</h3>
          <div className="td-list">
            <div className="td-list-item">
              <span className="td-list-item-left">S. Fernando (Gr11P1): "Trig question ...</span>
              <span className="td-list-item-right">| 10 mins ago</span>
            </div>
            <div className="td-list-item">
              <span className="td-list-item-left">N. de Silva (Gr10P2): "Material error?"</span>
              <span className="td-list-item-right">| 30 mins ago</span>
            </div>
            <div className="td-list-item">
              <span className="td-list-item-left">N. de Silva (Gr10P2): "Material error?"</span>
              <span className="td-list-item-right">| 30 mins ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards Row */}
      <div className="td-cards-bottom">
        {/* Content at a glance */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="td-card-title" style={{ marginBottom: '0.25rem' }}>Content at a glance</h3>
          <div className="content-subtitle">Content uploaded this term</div>
          
          <div className="term-title">Term Content (Term 2, 2026):</div>
          
          <div className="content-stats">
            <div className="content-stat-row">
              <span className="stat-val"><Video size={16} /> Videos: {videoCount}</span>
              <span className="stat-inc">+3 from Term 1</span>
            </div>
            <div className="content-stat-row">
              <span className="stat-val"><FileText size={16} /> Materials: {materialCount}</span>
              <span className="stat-inc">+8</span>
            </div>
          </div>
          
          <div className="storage-info">
            <div className="storage-labels">
              <span>Total Files: {totalStorageMB} MB Total</span>
            </div>
            <div className="storage-bar-bg">
              <div className="storage-bar-fill" style={{width: `${Math.min((totalStorageMB / 5000) * 100, 100)}%`}}></div>
            </div>
            <div className="storage-subtext">
              <span>{totalStorageMB} MB Used</span>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 'normal' }}>5000 MB (5GB) Total</span>
            </div>
          </div>
        </div>

        {/* Student Performance Chart */}
        <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="td-card-title" style={{ marginBottom: '0.25rem' }}>Student Performance mini-chart</h3>
          <div className="chart-subtitle">Class Average Score Trend: {activeClass.split(' - ')[0]}</div>
          
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  tickFormatter={(val) => `${val}%`}
                  domain={[60, 80]}
                  ticks={[60, 75, 78]}
                />
                <Tooltip />
                <Line 
                  type="linear" 
                  dataKey="score" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#eab308', strokeWidth: 0 }}
                  name="Score"
                />
                <Line 
                  type="linear" 
                  dataKey="benchmark" 
                  stroke="#1e293b" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#1e293b', strokeWidth: 0 }}
                  name="Average Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', margin: '0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e293b' }}></div>
              Average Score (%)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="td-bottom-actions">
        <button className="btn-td-large" onClick={handleUploadVideo}>
          <Video size={18} /> Upload Video
        </button>
        <button className="btn-td-large" onClick={handleCreateAssessment}>
          <CheckSquare size={18} /> Create Assessment
        </button>
        <button className="btn-td-large" onClick={handleUploadMaterial}>
          <FileText size={18} /> Upload Material
        </button>
      </div>

    </div>
  );
};
