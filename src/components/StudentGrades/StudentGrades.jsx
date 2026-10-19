import React from 'react';
import { ArrowLeft, Share2, Clock, Check, X, PenTool } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import './StudentGrades.css';

export const StudentGrades = () => {
  const performanceData = [
    { name: 'Quiz 1', score: 85, fill: '#e2e8f0' },
    { name: 'Quiz 2', score: 88, fill: '#e2e8f0' },
    { name: 'Project 1', score: 92, fill: '#e2e8f0' },
    { name: 'Mid-term\n(current)', score: 90, fill: '#d97706' },
  ];

  return (
    <div className="sg-container">
      
      {/* Header */}
      <div className="sg-header-area">
        <div className="sg-title-wrap">
          <h1 className="sg-title">Assessment Results: Term 2 Math Mid-term</h1>
          <a href="#" className="sg-back-link"><ArrowLeft size={16} /> Back to Grades</a>
        </div>
        <button className="sg-btn-download">
          Download as PDF <Share2 size={16} />
        </button>
      </div>

      {/* Top Cards */}
      <div className="sg-top-grid">
        
        {/* Summary Card */}
        <div className="sg-card">
          <div className="sg-summary-flex">
            <div className="sg-grade-circle">A</div>
            <div className="sg-summary-info">
              <div className="sg-score">18/20 — 90%</div>
              <p className="sg-feedback-text">
                Great Job, Wimal! Keep it up. Review your answers below to learn more.
              </p>
              <div className="sg-meta-pills">
                <div className="sg-pill">
                  <Clock size={20} color="#d97706" />
                  <span>
                    <span className="sg-pill-label">Total Time Taken:</span>
                    45:12
                  </span>
                </div>
                <div className="sg-pill">
                  <span>
                    <span className="sg-pill-label">Submitted:</span>
                    May 28, 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="sg-card">
          <h3 className="sg-chart-title">Math Term 2 Performance</h3>
          <div style={{ width: '100%', height: 140 }}>
            <ResponsiveContainer>
              <ComposedChart data={performanceData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="score" barSize={30} radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="score" stroke="#d97706" strokeWidth={2} dot={{r: 4, fill: '#d97706', strokeWidth: 2, stroke: 'white'}}>
                  <LabelList dataKey="score" position="top" formatter={(val) => `${val}%`} fontSize={10} fill="#475569" />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Per-question Breakdown */}
      <div>
        <h2 className="sg-section-title">Per-question Breakdown List</h2>
        
        <div className="sg-q-grid">
          
          {/* Left Column */}
          <div className="sg-q-col">
            
            {/* Card 1: Objective Correct */}
            <div className="sg-q-card">
              <div className="sg-q-header">
                <div className="sg-q-type-wrap">
                  <div className="sg-q-icon green"><Check size={16} /></div>
                  <div>
                    <div className="sg-q-type">Objective Correct</div>
                    <div className="sg-q-meta">Question 1, MCQ</div>
                  </div>
                </div>
                <div className="sg-pts-pill green">Points 5/5</div>
              </div>
              <div className="sg-q-label">Question</div>
              <div className="sg-ans-row">
                Student Answer: <span className="sg-ans-val pill-green">Option B</span>
              </div>
              <div className="sg-ans-row">
                Correct Answer: <span className="sg-ans-val pill-green">Option B</span>
              </div>
            </div>

            {/* Card 2: Objective Incorrect */}
            <div className="sg-q-card">
              <div className="sg-q-header">
                <div className="sg-q-type-wrap">
                  <div className="sg-q-icon red"><X size={16} /></div>
                  <div>
                    <div className="sg-q-type">Objective Incorrect</div>
                    <div className="sg-q-meta">Question 3, Short Answer</div>
                  </div>
                </div>
                <div className="sg-pts-pill red">Points 0/5</div>
              </div>
              <div className="sg-q-label">Question</div>
              <div className="sg-ans-row">
                Student Answer: <span className="sg-ans-val">x=2, x=5</span>
              </div>
              <div className="sg-ans-row">
                Correct Answer: <span className="sg-ans-val">x=1, x=6</span>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="sg-q-col">
            
            {/* Card 3: Objective Incorrect with Tip */}
            <div className="sg-q-card">
              <div className="sg-q-header">
                <div className="sg-q-type-wrap">
                  <div className="sg-q-icon red"><X size={16} /></div>
                  <div>
                    <div className="sg-q-type">Objective Incorrect</div>
                    <div className="sg-q-meta">Question 2, Short Answer</div>
                  </div>
                </div>
                <div className="sg-pts-pill red">Points 0/5</div>
              </div>
              <div className="sg-q-label">Question</div>
              <div className="sg-ans-row">
                Student Answer: <span className="sg-ans-val">x=2, x=5</span>
              </div>
              <div className="sg-ans-row">
                Correct Answer: <span className="sg-ans-val">x=1, x=6</span>
              </div>
              <div className="sg-tips-text">Tips or tips color</div>
            </div>

            {/* Card 4: Essay Question */}
            <div className="sg-q-card">
              <div className="sg-q-header">
                <div className="sg-q-type-wrap">
                  <div className="sg-q-icon navy"><PenTool size={16} /></div>
                  <div>
                    <div className="sg-q-type">Essay Question</div>
                    <div className="sg-q-meta">Question 10, Essay</div>
                  </div>
                </div>
                <div className="sg-pts-pill navy">Points 9/10</div>
              </div>
              <div className="sg-q-label">Question</div>
              <p className="sg-essay-text">
                Student's detailed answer: Statistics to manicin collect to elaborate further on real-world examples on tnt.
              </p>
              
              <div className="sg-feedback-label">
                Instructor Feedback <span className="sg-feedback-teacher">(Teacher: Niran Dissanayake)</span>
              </div>
              
              <div className="sg-feedback-container">
                <div className="sg-feedback-content">
                  <span className="sg-highlight-yellow">Good argument, Wimal. Remember to digital circles.</span><br/><br/>
                  Digital circles in highlighter on the iilft comment boxe. ◯<br/><br/>
                  Then supporive proper. Notes and lose giver
                </div>
                <div className="sg-feedback-sidebar">
                  <div className="sg-margin-note">Remember to elaborate further on real-world examples.</div>
                  <div className="sg-margin-note" style={{marginTop: 'auto'}}>Feedback, amonor text notes.</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
