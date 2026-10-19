import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Eraser, Trash2, ZoomIn } from 'lucide-react';
import './MarkAssessment.css';

export const MarkAssessment = () => {
  return (
    <div className="mark-container">
      
      {/* Floating Header */}
      <div className="student-nav-header">
        <div className="student-nav-controls">
          <ChevronLeft size={16} className="nav-arrow" />
          Student 3 of 28
          <ChevronRight size={16} className="nav-arrow" />
        </div>
        <div className="student-name-ma">M. Silva - Grade 10</div>
        <div className="student-name-ma">History of Colombo H2</div>
        <div className="student-sub-ma">History of Colombo - Midterm Assessment</div>
      </div>

      {/* Top Action Bar */}
      <div className="mark-top-bar">
        <div className="mark-title-area">
          <h1 className="mark-title">Mark Assessment</h1>
          <div className="mark-saved">
            <CheckCircle2 size={12} /> Saved 12s ago
          </div>
        </div>
        <button className="btn-back-list">Back to Submissions List</button>
      </div>

      {/* Two-Column Layout */}
      <div className="mark-layout">
        
        {/* Left Column: Submission View */}
        <div className="mark-card">
          <div className="submission-header">
            <div className="submission-title">Submission - Essay Q1 - Early Colonization</div>
          </div>
          
          <div className="submission-toolbar">
            <div className="toolbar-item">
              Pen <div className="color-dot dot-yellow"></div>
            </div>
            <div className="toolbar-item">
              Highlighter <div className="color-dot dot-green"></div>
            </div>
            <div className="toolbar-item">
              <Eraser size={16} /> Eraser
            </div>
            <div className="toolbar-item">
              <Trash2 size={16} /> Clear
            </div>
            <div className="zoom-control">
              <ZoomIn size={16} /> Zoom (100%)
            </div>
          </div>

          <div className="submission-content">
            <div className="essay-text">
              <p>
                <strong>History of Colombo - Midterm on Early Colonization</strong><br/>
                experience at the ancient <span className="hl-yellow">ancient power; analysis content;</span> based about in colonizations rod on eke lipture have a immunity charactept anctions in the same to an edocated reshami eneunes, wish theomomuns of history. <span className="hl-yellow">Highfighterly source?</span> keeped writ about sin invenives and to early <span className="hl-yellow">Good points.</span>
              </p>
              
              <p>
                Colombo ancient Power powered up to colombo he attent to powersube the Colombo in 0 aril also actinel across directories bothionties and soganizatities of he;excited in the prime cornertarious time and home potmer af colonization. <span className="hl-yellow">Needs elaboration.</span> In sever af there ansues ancnmints because comacters means formatture and the culure to a consitincation of elvers.
              </p>

              <p>
                The Singhalesese Kingdom were eramofre, <span className="hl-yellow">Colombo Founder Power, Saresti</span> a were were tonnorally colors in the formation undonomotion and expansent, developmt ly recent of emity and thecology paner. <span className="hl-yellow">Included some praints to evenuralle:</span> of the moter and maionemmans to deverminn ainonactions as and soambned of iorestinures and romovehtbe trogitom.
              </p>

              <p>
                Colombo: Founder would has been a sinap countert in foure-univesrrity culture to the anmateamtas traaditsen to rerams and fouds on antorations that proveds people colomboa: child can premntsate some etholog-based colorotory and
              </p>
            </div>

            {/* Simulated right-side annotations */}
            <div className="annotation anno-1">Good point!</div>
            <div className="annotation anno-2">Source?</div>
            <div className="annotation anno-3">Needs<br/>elaboration.</div>
            <div className="annotation anno-4">Check<br/>formatting.</div>
          </div>
        </div>

        {/* Right Column: Rubric Panel */}
        <div className="mark-card">
          <div className="rubric-header">
            <div className="rubric-title">Rubric Marking Panel</div>
            <div className="rubric-total">Total Score: 32 / 50 Pts</div>
          </div>

          <table className="rubric-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th style={{ textAlign: 'center' }}>Points<br/>Possible</th>
                <th style={{ textAlign: 'center' }}>Points<br/>Awarded</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="crit-name">Manual Essay Question Content & Analysis</div></td>
                <td className="td-center">20</td>
                <td className="td-center"><input type="number" className="pts-input" defaultValue="15" /></td>
                <td><textarea className="crit-comment" defaultValue="Strong points, needs better flow."></textarea></td>
              </tr>
              <tr>
                <td><div className="crit-name">Structure & Organization</div></td>
                <td className="td-center">10</td>
                <td className="td-center"><input type="number" className="pts-input" defaultValue="8" /></td>
                <td><textarea className="crit-comment" defaultValue="Logical but lacks topic sentences."></textarea></td>
              </tr>
              <tr>
                <td><div className="crit-name">Auto-graded MCQ<br/>Colombo Ancient Power</div></td>
                <td className="td-center">5</td>
                <td className="td-center">
                  <div className="pts-text">
                    5 <CheckCircle2 size={16} className="pts-icon-correct" fill="#22c55e" color="white" />
                  </div>
                </td>
                <td><div className="crit-comment-plain">Correct answer.</div></td>
              </tr>
              <tr>
                <td><div className="crit-name">Manual Short Answer<br/>Colombo Founder</div></td>
                <td className="td-center">5</td>
                <td className="td-center"><input type="number" className="pts-input" /></td>
                <td><textarea className="crit-comment" placeholder="Comment"></textarea></td>
              </tr>
            </tbody>
          </table>

          <div className="general-comments-section">
            <div className="general-comments-title">Comments</div>
            <textarea className="general-comments-textarea" placeholder="TextArea..."></textarea>
            
            <div className="final-score-row">
              Final Score: 32 / 50 Pts
            </div>

            <button className="btn-save-next">Save & Next Student</button>
          </div>
        </div>

      </div>
    </div>
  );
};
