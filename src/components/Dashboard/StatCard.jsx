import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './StatCard.css';

export const StatCard = ({ title, value, subtitle, trend, trendLabel, trendUp }) => {
  return (
    <div className="card stat-card">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">{value}</div>
      <p className="stat-subtitle">{subtitle}</p>
      
      {trend && (
        <div className={`stat-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trend} {trendLabel}</span>
        </div>
      )}
    </div>
  );
};
