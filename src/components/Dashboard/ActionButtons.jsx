import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActionButtons.css';

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="card action-buttons">
      <button className="btn btn-dark" onClick={() => navigate('/register')}>Register Student</button>
      <button className="btn btn-primary">Post Announcement</button>
      <button className="btn btn-dark">Bulk Upload</button>
    </div>
  );
};
