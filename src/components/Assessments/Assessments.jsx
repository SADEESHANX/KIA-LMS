import React from 'react';
import { Calendar, GripVertical, Plus, Eye } from 'lucide-react';
import './Assessments.css';

export const Assessments = () => {
  return (
    <div className="assessments-container">
      <h1 className="assessments-title">Assessment Builder: Create Mid-term Exam</h1>

      {/* Top Settings Card */}
      <div className="assessments-card">
        <div className="top-settings-grid">
          <div className="form-group-ast">
            <label className="label-ast">Assessment Title</label>
            <input type="text" className="input-ast" defaultValue="History of Colombo - Midterm" />
          </div>
          
          <div className="form-group-ast">
            <label className="label-ast">Current Class</label>
            <select className="input-ast" defaultValue="Grade 10 - History - Section H2">
              <option>Grade 10 - History - Section H2</option>
            </select>
            <span className="label-hint-ast">History class context</span>
          </div>

          <div className="form-group-ast">
            <label className="label-ast">Scheduled Release</label>
            <div className="input-with-icon-ast">
              <input type="text" className="input-ast" defaultValue="Aug 20, 2026, 09:00 AM" />
              <Calendar size={16} className="icon-ast" />
            </div>
          </div>
        </div>

        <div className="top-settings-row-2">
          <div className="row-2-left">
            <div className="time-limit-group">
              <div className="form-group-ast">
                <label className="label-ast">Time Limit</label>
                <input type="text" className="input-ast" style={{ width: '120px' }} defaultValue="60 Minutes" />
              </div>
              <div className="form-group-ast">
                <label className="label-ast">Attempt Limit</label>
                <select className="input-ast" style={{ width: '80px' }} defaultValue="1">
                  <option>1</option>
                  <option>2</option>
                  <option>Unlimited</option>
                </select>
              </div>
            </div>

            <div className="randomize-group">
              <span>Randomize Question Order</span>
              <div className="ast-toggle">
                <span className="ast-toggle-text">ON</span>
                <div className="ast-toggle-knob"></div>
              </div>
            </div>
          </div>

          <div className="total-points-box">
            <span className="total-points-val">Total Points: 50 Pts</span>
            <span className="total-points-hint">(auto-calculated)</span>
          </div>
        </div>
      </div>

      {/* Bottom Layout */}
      <div className="ast-bottom-layout">
        
        {/* Left Column (Question List) */}
        <div className="question-list">
          <div className="q-item active">
            <GripVertical size={16} className="q-item-icon" />
            Q1: MCQ (5 pts)
          </div>
          <div className="q-item">
            <GripVertical size={16} className="q-item-icon" />
            Q2: Essay (20 pts)
          </div>
          <div className="q-item">
            <GripVertical size={16} className="q-item-icon" />
            Q3: Matching (10 pts)
          </div>
          <div className="q-item">
            <GripVertical size={16} className="q-item-icon" />
            Q4: Short Answer (10 pts)
          </div>
          <div className="q-item">
            <GripVertical size={16} className="q-item-icon" />
            Q5: File Upload (5 pts)
          </div>

          <button className="btn-add-q">
            <Plus size={16} /> Add Question
          </button>
        </div>

        {/* Right Column (Question Editor) */}
        <div className="assessments-card" style={{ padding: '1.25rem' }}>
          <h2 className="editor-title">Question Editor: Q1 - MCQ</h2>
          
          <div className="q-type-segmented">
            <button className="q-type-btn active">MCQ</button>
            <button className="q-type-btn">T/F</button>
            <button className="q-type-btn">Short Answer</button>
            <button className="q-type-btn">Essay</button>
            <button className="q-type-btn">File Upload</button>
            <button className="q-type-btn">Matching</button>
          </div>

          <div className="form-group-ast" style={{ marginBottom: '1.5rem' }}>
            <label className="label-ast">Question Prompt</label>
            <textarea 
              className="input-ast" 
              defaultValue="Q1. Which ancient power did Colombo first fall under?"
            ></textarea>
          </div>

          <div className="options-section">
            <div className="options-left">
              <label className="label-ast">Answer Options</label>
              
              <div className="option-row">
                <input type="radio" name="q1_ans" className="opt-radio" />
                <input type="text" className="input-ast" style={{ flex: 1 }} defaultValue="a) The Sinhalese Kingdom" />
              </div>
              <div className="option-row">
                <input type="radio" name="q1_ans" className="opt-radio" />
                <input type="text" className="input-ast" style={{ flex: 1 }} defaultValue="b) The Pandyan Dynasty" />
              </div>
              <div className="option-row">
                <input type="radio" name="q1_ans" className="opt-radio" defaultChecked />
                <input type="text" className="input-ast" style={{ flex: 1 }} defaultValue="c) The Chola Empire" />
              </div>
              <div className="option-row">
                <input type="radio" name="q1_ans" className="opt-radio" />
                <input type="text" className="input-ast" style={{ flex: 1 }} defaultValue="d) The Kotte Kingdom" />
              </div>

              <button className="btn-add-opt">Add Option</button>
            </div>
            
            <div className="options-right">
              <div className="form-group-ast">
                <label className="label-ast">Points Value</label>
                <input type="text" className="input-ast" defaultValue="5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="ast-footer">
        <button className="btn-ast-outline">Save Draft</button>
        <button className="btn-ast-preview">
          <Eye size={16} /> Preview
        </button>
        <button className="btn-ast-publish">Publish</button>
      </div>

    </div>
  );
};
