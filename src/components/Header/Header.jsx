import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import './Header.css';

export const Header = ({ role, currentUser }) => {
  const getProfile = () => {
    switch (role) {
      case 'student':
        return { name: currentUser?.name || 'Student User', roleName: 'Student' };
      case 'teacher':
        return { name: currentUser?.name || 'Teacher User', roleName: 'Teacher' };
      case 'admin':
        return { name: currentUser?.name || 'Admin User', roleName: 'Administrator' };
      default:
        return { name: currentUser?.name || 'User', roleName: 'Role' };
    }
  };

  const profile = getProfile();

  return (
    <header className="header">
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input type="text" className="search-input" placeholder="Search for courses or materials" />
      </div>
      
      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">1</span>
        </button>
        
        {role === 'student' && (
          <div className="theme-toggle" style={{display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '16px', padding: '2px'}}>
            <div className="theme-btn active" style={{padding: '4px 8px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}><Sun size={14} /></div>
            <div className="theme-btn" style={{padding: '4px 8px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'}}><Moon size={14} /></div>
          </div>
        )}

        <div className="user-profile">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="avatar"
          />
          <div className="user-name">
            {profile.name}
          </div>
        </div>
      </div>
    </header>
  );
};
