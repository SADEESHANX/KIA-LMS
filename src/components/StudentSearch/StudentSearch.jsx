import React, { useState } from 'react';
import { 
  Search, Calendar, FolderOpen, PlaySquare, User, Star, FileText, Play, FileCheck
} from 'lucide-react';
import mathThumb from '../../assets/math_thumb.jpg';
import './StudentSearch.css';

export const StudentSearch = () => {
  const [showAutocomplete, setShowAutocomplete] = useState(true);

  return (
    <div className="ss-container">
      
      {/* Top Search Area */}
      <div className="ss-top-search-wrap">
        <Search size={18} className="ss-search-icon" />
        <input 
          type="text" 
          className="ss-main-search-input" 
          value="quad" 
          onChange={() => {}} 
          onFocus={() => setShowAutocomplete(true)}
          onBlur={() => setShowAutocomplete(false)}
        />
        <div className="ss-search-date">Aug 10, 2026</div>

        {/* Autocomplete Dropdown Mockup */}
        {showAutocomplete && (
          <div className="ss-autocomplete-dropdown">
            <div className="ss-ac-item">Grade 10 Mathematics - <strong>Quadratic Equations</strong></div>
            <div className="ss-ac-item">Grade 10 Science - <strong>Chemical Bonding Notes</strong></div>
            <div className="ss-ac-item">past papers grade 10 <strong>math 2024</strong></div>
            <div className="ss-ac-item">Teacher: <strong>Niran Dissanayake</strong> lessons</div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="ss-header">
        <h1 className="ss-title">Search</h1>
        <p className="ss-subtitle">Finish Term 2 Strong! Your potential is unlimited.</p>
      </div>

      {/* Filters Row */}
      <div className="ss-filters-row">
        <div className="ss-filter-pill active">
          <FolderOpen size={16} /> Category: Math
        </div>
        <div className="ss-filter-pill">
          <Calendar size={16} /> Date
        </div>
        <div className="ss-filter-pill active">
          <PlaySquare size={16} /> Content Type: Video
        </div>
        <div className="ss-filter-pill">
          <User size={16} /> Teacher
        </div>
        <div className="ss-filter-pill active">
          <Star size={16} /> Difficulty
        </div>
        <div className="ss-filter-pill">
          <FileText size={16} /> Section: P/P1/MP1/Activities
        </div>
      </div>

      {/* Controls Row */}
      <div className="ss-controls-row">
        <div className="ss-view-toggle">
          <button className="ss-vt-btn active">All Results</button>
          <button className="ss-vt-btn">Past Papers</button>
        </div>
        
        <div className="ss-dropdowns">
          <div className="ss-dropdown-group">
            Subject
            <select className="ss-select">
              <option>Colombo Board</option>
            </select>
          </div>
          <div className="ss-dropdown-group">
            Year
            <select className="ss-select">
              <option>2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="ss-grid">
        
        {/* Card 1: Video */}
        <div className="ss-card">
          <div className="ss-card-header">
            <PlaySquare size={18} className="ss-card-icon" />
            <div className="ss-card-title">Grade 10 Math - Solving<br/>Quadratic Formula</div>
          </div>
          <div className="ss-card-body-video">
            <div className="ss-video-thumb-wrap">
              <img src={mathThumb} alt="Video" className="ss-video-img" />
              <div className="ss-play-overlay"><Play size={24} fill="white" color="white" /></div>
            </div>
            <div className="ss-video-meta">
              <span>Tutor Niran</span>
              <span>Aug 5, 2026</span>
            </div>
          </div>
        </div>

        {/* Card 2: Document Notes */}
        <div className="ss-card">
          <div className="ss-card-header">
            <FileText size={18} className="ss-card-icon" />
            <div className="ss-card-title">Grade 10 Science -<br/>Chemical Reactions No...</div>
          </div>
          <div className="ss-card-body-doc">
            <div className="ss-doc-thumb">
              <div className="ss-doc-thumb-title">Grade 10 Science - Chemical Reactions</div>
              <div className="ss-doc-thumb-line"></div>
              <div className="ss-doc-thumb-line"></div>
              <div className="ss-doc-thumb-line"></div>
              <div className="ss-doc-thumb-line" style={{width: '60%'}}></div>
            </div>
            <div className="ss-doc-info">
              <div><span className="ss-doc-strong">5 pages:</span></div>
              <div>Teacher:<br/>Tutor Niran</div>
              <div>July 28, 2026</div>
            </div>
          </div>
        </div>

        {/* Card 3: Past Paper */}
        <div className="ss-card">
          <div className="ss-card-header">
            <FileCheck size={18} className="ss-card-icon" />
            <div className="ss-card-title">Grade 10 Math -<br/>2024 O-Level Past Paper</div>
          </div>
          <div className="ss-card-body-paper">
            <div className="ss-paper-thumb">
              <div style={{border: '1px solid #ccc', height: '100%', padding: '2px', display: 'flex', flexDirection: 'column'}}>
                 <div style={{height: '2px', background: '#ccc', marginBottom: '2px'}}></div>
                 <div style={{height: '2px', background: '#ccc', marginBottom: '2px'}}></div>
              </div>
            </div>
            <div className="ss-doc-info">
              <div className="ss-doc-strong">2024</div>
              <div>Subject Board</div>
              <div>Section:<br/>MP1</div>
            </div>
          </div>
        </div>

        {/* Card 4: Past Paper (Duplicate) */}
        <div className="ss-card">
          <div className="ss-card-header">
            <FileCheck size={18} className="ss-card-icon" />
            <div className="ss-card-title">Grade 10 Math -<br/>2024 O-Level Past Paper</div>
          </div>
          <div className="ss-card-body-paper">
            <div className="ss-paper-thumb">
              <div style={{border: '1px solid #ccc', height: '100%', padding: '2px'}}></div>
            </div>
            <div className="ss-doc-info">
              <div className="ss-doc-strong">2024</div>
              <div>Math</div>
              <div>Section:<br/>MP1</div>
            </div>
          </div>
        </div>

        {/* Card 5: Exam Board Colombo */}
        <div className="ss-card">
          <div className="ss-card-header">
            <FileCheck size={18} className="ss-card-icon" />
            <div className="ss-card-title">Correct Exam Board<br/>Colombo Board</div>
          </div>
          <div className="ss-card-body-paper">
            <div className="ss-paper-thumb">
               <div style={{border: '1px solid #ccc', height: '100%', padding: '2px'}}></div>
            </div>
            <div className="ss-doc-info">
              <div className="ss-doc-strong">2025</div>
              <div>Colombo</div>
              <div>Subject:</div>
              <div>Section:</div>
            </div>
          </div>
          <div className="ss-card-footer-board">
            Grade 10 Math - Sri<br/>Year
          </div>
        </div>

        {/* Card 6: Exam Board Sri Lanka */}
        <div className="ss-card">
          <div className="ss-card-header">
            <FileCheck size={18} className="ss-card-icon" />
            <div className="ss-card-title">Local Exam Board<br/>Sri Lanka</div>
          </div>
          <div className="ss-card-body-paper" style={{gap: '0.5rem', justifyContent: 'center'}}>
            <div className="ss-board-thumb">
              <div className="ss-doc-strong" style={{fontSize:'0.6rem'}}>LOCAL EXAM</div>
              <div className="ss-doc-strong" style={{fontSize:'0.8rem'}}>2025</div>
              <div className="ss-board-banner">MP1</div>
            </div>
            <div style={{display:'flex', alignItems:'center', color:'#cbd5e1'}}>&gt;</div>
            <div className="ss-board-thumb">
              <div className="ss-doc-strong" style={{fontSize:'0.6rem'}}>LOCAL EXAM</div>
              <div className="ss-doc-strong" style={{fontSize:'0.8rem'}}>2024</div>
              <div className="ss-board-banner purple">SYDNEY</div>
            </div>
          </div>
          <div className="ss-card-footer-board">
            Grade 10 Mathematic - 2024<br/>Year
          </div>
        </div>

        {/* Card 7: Exam Board Sri Lanka 2 */}
        <div className="ss-card">
          <div className="ss-card-header">
            <FileCheck size={18} className="ss-card-icon" />
            <div className="ss-card-title">Local Exam Board<br/>Sri Lanka</div>
          </div>
          <div className="ss-card-body-paper" style={{gap: '0.5rem', justifyContent: 'center'}}>
            <div className="ss-board-thumb">
              <div className="ss-doc-strong" style={{fontSize:'0.6rem'}}>LOCAL EXAM</div>
              <div className="ss-doc-strong" style={{fontSize:'0.8rem'}}>2023</div>
              <div className="ss-board-banner">MATH</div>
            </div>
            <div style={{display:'flex', alignItems:'center', color:'#cbd5e1'}}>&gt;</div>
            <div className="ss-board-thumb">
              <div className="ss-doc-strong" style={{fontSize:'0.6rem'}}>LOCAL EXAM</div>
              <div className="ss-doc-strong" style={{fontSize:'0.8rem'}}>2023</div>
              <div className="ss-board-banner">MP1</div>
            </div>
          </div>
          <div className="ss-card-footer-board">
            Grade 10 Math - 2023<br/>2023
          </div>
        </div>

      </div>
    </div>
  );
};
