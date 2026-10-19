import React from 'react';
import { 
  ChevronDown, FileSpreadsheet, FileText, ArrowUpDown, 
  Smile, Frown, TrendingUp, TrendingDown, Flag, X, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import './StudentProgress.css';

const areaData = [
  { name: 'Week 7', score: 12 },
  { name: 'Week 11', score: 50 },
  { name: 'Week 16', score: 40 },
  { name: 'Week 21', score: 68 },
  { name: 'Week 23', score: 85 },
  { name: 'Week 28', score: 75 },
  { name: 'Week 30', score: 92 },
];

const barData = [
  { name: 'Quiz 1', score: 71 },
  { name: 'Project 1', score: 83 },
  { name: 'Mid-term', score: 94 },
  { name: 'Quiz 2', score: 65 },
  { name: 'Week 8 Test', score: 73 },
];

export const StudentProgress = () => {
  return (
    <div className="progress-container">
      
      {/* Header Area */}
      <div className="progress-header-area">
        <div className="progress-title-section">
          <h1 className="progress-title">Student Progress</h1>
          <div className="progress-subtitle">
            Grade 11 Mathematics | Term 3 | 2026 <ChevronDown size={14} />
          </div>
        </div>
        
        <div className="export-group">
          <button className="btn-export-main">
            Export to <ChevronDown size={16} />
          </button>
          <div className="export-options">
            <div className="export-opt">
              <FileSpreadsheet size={14} className="icon-excel" /> Excel
            </div>
            <div className="export-opt">
              <FileText size={14} className="icon-pdf" /> PDF
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="progress-layout">
        
        {/* Left Column */}
        <div className="progress-col-left">
          
          {/* Chart Card */}
          <div className="progress-card">
            <h2 className="card-title-sp">Class Performance Overview</h2>
            <div className="chart-header-sp">
              <div className="chart-subtitle-sp">Term 3 Average Score Trend</div>
              <div className="chart-legend-sp">
                <div className="legend-dot-sp"></div> Primary Navy
              </div>
            </div>
            
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e293b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#1e293b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    dot={{ r: 4, fill: '#f8fafc', stroke: '#1e293b', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student List Table */}
          <div className="progress-card" style={{ padding: '1.5rem 1rem' }}>
            <div className="sp-table-header" style={{ padding: '0 0.5rem' }}>
              <h2 className="card-title-sp" style={{ margin: 0 }}>Student List</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ border: '1px solid var(--color-border)', background: 'transparent', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                  <ArrowUpDown size={14} color="#64748b" />
                </button>
                <button style={{ border: '1px solid var(--color-border)', background: 'transparent', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>☰</span>
                </button>
              </div>
            </div>

            <table className="sp-table">
              <thead>
                <tr>
                  <th><div className="th-sortable">Name <ArrowUpDown size={10} className="sort-icon"/></div></th>
                  <th><div className="th-sortable">Avg Score <ArrowUpDown size={10} className="sort-icon"/></div></th>
                  <th><div className="th-sortable">Attendance % <ArrowUpDown size={10} className="sort-icon"/></div></th>
                  <th>Assignments<br/>Completed</th>
                  <th><div className="th-sortable">Trend <ArrowUpDown size={10} className="sort-icon"/></div></th>
                  <th><div className="th-sortable">At Risk <ArrowUpDown size={10} className="sort-icon"/></div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="name-cell-sp">
                      <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Dilshan" className="avatar-sp" />
                      Dilshan Fernando
                    </div>
                  </td>
                  <td>
                    <div className="score-cell-sp">
                      <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '75%' }}></div></div> 75%
                    </div>
                  </td>
                  <td>
                    <div className="att-cell-sp">
                      <Smile size={18} color="#64748b" />
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '4px', height: '4px', backgroundColor: '#64748b', borderRadius: '50%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>14/16</td>
                  <td><ArrowDownRight size={18} className="trend-down" /></td>
                  <td><div className="risk-flag"><Flag size={14} /></div></td>
                </tr>
                
                <tr className="sp-row-active">
                  <td>
                    <div className="name-cell-sp">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Anushka" className="avatar-sp" />
                      Anushka Perera
                    </div>
                  </td>
                  <td>
                    <div className="score-cell-sp">
                      <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '75%' }}></div></div> 75%
                    </div>
                  </td>
                  <td>
                    <div className="att-cell-sp">
                      <Smile size={18} color="#64748b" />
                    </div>
                  </td>
                  <td>13/16</td>
                  <td><ArrowUpRight size={18} className="trend-up" /></td>
                  <td><div className="risk-flag"><Flag size={14} /></div></td>
                </tr>

                <tr>
                  <td>
                    <div className="name-cell-sp">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Kumara" className="avatar-sp" />
                      Kumara Rodrigo
                    </div>
                  </td>
                  <td>
                    <div className="score-cell-sp">
                      <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '70%' }}></div></div> 70%
                    </div>
                  </td>
                  <td>
                    <div className="att-cell-sp">
                      <Frown size={18} color="#64748b" />
                    </div>
                  </td>
                  <td>12/16</td>
                  <td><ArrowDownRight size={18} className="trend-down" /></td>
                  <td><div className="risk-flag"><Flag size={14} /></div></td>
                </tr>

                <tr>
                  <td>
                    <div className="name-cell-sp">
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Ruwani" className="avatar-sp" />
                      Ruwani De Silva
                    </div>
                  </td>
                  <td>
                    <div className="score-cell-sp">
                      <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '65%' }}></div></div> 65%
                    </div>
                  </td>
                  <td>
                    <div className="att-cell-sp">
                      <Smile size={18} color="#64748b" />
                    </div>
                  </td>
                  <td>10/16</td>
                  <td><ArrowUpRight size={18} className="trend-up" /></td>
                  <td><div className="risk-flag"><Flag size={14} /></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Profile Detail */}
        <div className="profile-panel-sp">
          <div className="panel-header-sp">
            <div className="panel-title-sp">Student Profile Detail</div>
            <X size={18} className="btn-close-sp" />
          </div>
          
          <div className="history-title-sp">Assessment History</div>
          
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickMargin={8}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Bar 
                  dataKey="score" 
                  fill="#1e293b" 
                  radius={[2, 2, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
