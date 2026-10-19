import React from 'react';
import { 
  Users, UserPlus, Search, Info, MessageSquare, 
  MinusCircle, XCircle 
} from 'lucide-react';
import './ClassRoster.css';

export const ClassRoster = () => {
  return (
    <div className="roster-container">
      <h1 className="roster-title">Class Roster</h1>

      {/* Main Roster Card */}
      <div className="roster-card">
        <div className="roster-header">
          <div className="roster-class-info">
            <Users size={20} color="#d97706" />
            Grade 11 - Mathematics - Section P1
          </div>
          <div className="roster-enroll-info">
            <Users size={16} className="text-muted" />
            28/30 enrolled
            <div className="enroll-bar-bg">
              <div className="enroll-bar-fill"></div>
            </div>
          </div>
        </div>

        <div className="roster-toolbar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon-rs" />
            <input type="text" placeholder="Search" />
          </div>

          <div className="action-segmented">
            <button className="btn-seg primary">
              <UserPlus size={16} /> Add Student
            </button>
            <button className="btn-seg outline-gold">
              Add Individual Student
            </button>
            <button className="btn-seg">
              Bulk Enroll via CSV
            </button>
          </div>
        </div>

        <table className="roster-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Attendance %</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Row Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="student-name-col">
                  <div className="avatar-rs">DF</div>
                  Dilshan Fernando
                </div>
              </td>
              <td>KIA-STU-12345</td>
              <td>
                <div className="att-col">
                  <div className="dot-rs green"></div> 96%
                </div>
              </td>
              <td>2 days ago</td>
              <td><span className="status-pill active">Active</span></td>
              <td>
                <div className="row-actions-rs">
                  <div className="btn-action-rs solid"><MinusCircle size={14} /></div>
                  <div className="btn-action-rs outline-gold"><UserPlus size={14} /></div>
                  <div className="btn-action-rs outline-gold"><MessageSquare size={14} /></div>
                  <div className="btn-action-rs ghost"><MinusCircle size={16} /></div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="student-name-col">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Anushka" className="avatar-rs" />
                  Anushka Perera
                </div>
              </td>
              <td>KIA-STU-12346</td>
              <td>
                <div className="att-col">
                  <div className="dot-rs green"></div> 98%
                </div>
              </td>
              <td>5 hrs ago</td>
              <td><span className="status-pill active">Active</span></td>
              <td>
                <div className="row-actions-rs">
                  <div className="btn-action-rs solid"><MinusCircle size={14} /></div>
                  <div className="btn-action-rs outline-gold"><UserPlus size={14} /></div>
                  <div className="btn-action-rs outline-gold"><MessageSquare size={14} /></div>
                  <div className="btn-action-rs ghost"><MinusCircle size={16} /></div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="student-name-col">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Kumara" className="avatar-rs" />
                  Kumara Rodrigo
                </div>
              </td>
              <td>KIA-STU-12347</td>
              <td>
                <div className="att-col">
                  <div className="dot-rs orange"></div> 85%
                </div>
              </td>
              <td>1 week ago</td>
              <td><span className="status-pill at-risk">At Risk</span></td>
              <td>
                <div className="row-actions-rs">
                  <div className="btn-action-rs solid"><MinusCircle size={14} /></div>
                  <div className="btn-action-rs outline-gold"><UserPlus size={14} /></div>
                  <div className="btn-action-rs outline-gold"><MessageSquare size={14} /></div>
                  <div className="btn-action-rs ghost"><XCircle size={16} /></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Waitlist Card */}
      <div className="roster-card">
        <div className="waitlist-title-area">
          <div className="waitlist-title">
            <span>Waitlist</span>
            <span style={{ color: 'var(--color-text-main)', fontSize: '1rem', fontWeight: 500 }}>(4 Students Queued)</span>
          </div>
          <div className="waitlist-info-banner">
            <Info size={18} />
            Students are automatically promoted from the waitlist when a seat in the main roster becomes available.
          </div>
        </div>

        <table className="roster-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Position</th>
              <th>Name</th>
              <th>ID</th>
              <th>Queue Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>e.g. Ruwani De Silva</td>
              <td>KIA-STU-23456</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
