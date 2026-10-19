import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import './ActiveUsersChart.css';

const data = [
  { name: '00:00', students: 40, teachers: 24 },
  { name: '04:00', students: 30, teachers: 13 },
  { name: '08:00', students: 60, teachers: 48 },
  { name: '12:00', students: 110, teachers: 38 },
  { name: '16:00', students: 90, teachers: 43 },
  { name: '20:00', students: 130, teachers: 55 },
  { name: '24:00', students: 80, teachers: 30 },
];

export const ActiveUsersChart = () => {
  return (
    <div className="card chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Active Users Now</h3>
        <p className="chart-subtitle">Live concurrent users</p>
      </div>
      
      <div className="chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#19273a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#19273a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e6b94c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#e6b94c" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="students" stroke="#19273a" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
            <Area type="monotone" dataKey="teachers" stroke="#e6b94c" strokeWidth={2} fillOpacity={1} fill="url(#colorTeachers)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-footer">
        <strong>112</strong> Students Online, <strong>15</strong> Teachers Online
      </div>
    </div>
  );
};
