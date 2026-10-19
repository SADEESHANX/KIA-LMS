import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard/StudentDashboard';
import { RegisterStudent } from './components/RegisterStudent/RegisterStudent';
import { AccessControl } from './components/AccessControl/AccessControl';
import { PaymentVerification } from './components/PaymentVerification/PaymentVerification';
import { Announcements } from './components/Announcements/Announcements';
import { Materials } from './components/Materials/Materials';
import { Videos } from './components/Videos/Videos';
import { Assessments } from './components/Assessments/Assessments';
import { MarkAssessment } from './components/MarkAssessment/MarkAssessment';
import { ClassRoster } from './components/ClassRoster/ClassRoster';
import { StudentProgress } from './components/StudentProgress/StudentProgress';
import { StudentVideoPlayer } from './components/StudentVideoPlayer/StudentVideoPlayer';
import { TakeAssessment } from './components/TakeAssessment/TakeAssessment';
import { StudentGrades } from './components/StudentGrades/StudentGrades';
import { StudentPayments } from './components/StudentPayments/StudentPayments';
import { StudentSearch } from './components/StudentSearch/StudentSearch';
import { StudentProfile } from './components/StudentProfile/StudentProfile';
import { Login } from './components/Login/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const role = currentUser?.role || 'student';

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar role={role} currentUser={currentUser} onLogout={handleLogout} />
      <div className="main-content">
        <Header role={role} currentUser={currentUser} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={
              role === 'admin' ? <Dashboard /> : 
              role === 'teacher' ? <TeacherDashboard /> : 
              <StudentDashboard currentUser={currentUser} />
            } />
            <Route path="/register" element={<RegisterStudent />} />
            <Route path="/access-control" element={<AccessControl />} />
            <Route path="/payments" element={<PaymentVerification />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/mark-assessment" element={<MarkAssessment />} />
            <Route path="/classes" element={<ClassRoster />} />
            <Route path="/students" element={<StudentProgress />} />
            <Route path="/student-videos" element={<StudentVideoPlayer />} />
            <Route path="/student-assessments" element={<TakeAssessment />} />
            <Route path="/student-grades" element={<StudentGrades />} />
            <Route path="/student-payments" element={<StudentPayments />} />
            <Route path="/student-search" element={<StudentSearch />} />
            <Route path="/student-profile" element={<StudentProfile currentUser={currentUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
