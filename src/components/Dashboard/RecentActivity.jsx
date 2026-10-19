import React from 'react';
import './RecentActivity.css';

const activities = [
  { id: 1, user: 'User Name', action: 'Registered a new student', time: '5 mins ago' },
  { id: 2, user: 'Sarah Name', action: 'Posted an announcement', time: '15 mins ago' },
  { id: 3, user: 'Sarah Name', action: 'Verified a payment', time: '1 hour ago' },
  { id: 4, user: 'Sarah Name', action: 'Posted an announcement', time: '1 hour ago' },
  { id: 5, user: 'Sarah Name', action: 'Posted an announcement', time: '1 hour ago' },
];

export const RecentActivity = () => {
  return (
    <div className="card">
      <h3 className="chart-title">Recent Activity/Audit Log</h3>
      <p className="chart-subtitle">Last 10 actions by users</p>
      
      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <img 
              src={`https://ui-avatars.com/api/?name=${activity.user}&background=random`} 
              alt={activity.user} 
              className="activity-avatar" 
            />
            <div className="activity-details">
              <div>
                <span className="activity-user">{activity.user}</span> <br/>
                <span className="activity-action">{activity.action}</span>
              </div>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
