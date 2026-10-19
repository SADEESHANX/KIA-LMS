import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Folder, 
  ClipboardList, 
  CreditCard, 
  Megaphone, 
  ShieldCheck, 
  FileBarChart, 
  Settings,
  User,
  Home,
  PlayCircle,
  List,
  LayoutDashboard,
  CheckSquare,
  Bell,
  Video,
  FileText,
  Book,
  Search,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = ({ role, currentUser, onLogout }) => {
  const adminNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Register Student', path: '/register' },
    { icon: <CheckSquare size={20} />, label: 'Access Control', path: '/access-control' },
    { icon: <CreditCard size={20} />, label: 'Payment Verification', path: '/payments' },
    { icon: <Bell size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const teacherNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BookOpen size={20} />, label: 'Materials', path: '/materials' },
    { icon: <Video size={20} />, label: 'Videos', path: '/videos' },
    { icon: <FileText size={20} />, label: 'Assessments', path: '/assessments' },
    { icon: <CheckSquare size={20} />, label: 'Mark Assessment', path: '/mark-assessment' },
    { icon: <Users size={20} />, label: 'Class Roster', path: '/classes' },
    { icon: <FileBarChart size={20} />, label: 'Student Progress', path: '/students' },
  ];

  const studentNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BookOpen size={20} />, label: 'My Courses', path: '/my-courses' },
    { icon: <PlayCircle size={20} />, label: 'Videos', path: '/student-videos' },
    { icon: <CheckSquare size={20} />, label: 'Assessments', path: '/student-assessments' },
    { icon: <FileText size={20} />, label: 'Grades', path: '/student-grades' },
    { icon: <CreditCard size={20} />, label: 'Payments', path: '/student-payments' },
    { icon: <Search size={20} />, label: 'Search', path: '/student-search' },
    { icon: <User size={20} />, label: 'Profile & Settings', path: '/student-profile' },
  ];

  const navItems = role === 'admin' ? adminNavItems : role === 'teacher' ? teacherNavItems : studentNavItems;

  const getRoleDisplay = () => {
    if (role === 'student') return 'Student';
    if (role === 'teacher') return 'Teacher';
    if (role === 'admin') return 'Administrator';
    return '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-shield">KIA</div>
        <div className="logo-text-stack">
          <span>Kingsford</span>
          <span>International</span>
          <span>Academy</span>
        </div>
      </div>
      
      {role && (
        <div className="sidebar-user-info">
          <div className="user-avatar-small">
             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=fff&color=0f172a`} alt="User" />
          </div>
          <div className="user-details-small">
            <div className="user-name-small">{currentUser?.name || 'Guest'}</div>
            <div className="user-grade-small">{getRoleDisplay()}</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};
