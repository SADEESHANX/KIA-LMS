import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { ActionButtons } from './ActionButtons';
import { ActiveUsersChart } from './ActiveUsersChart';
import { PendingApprovals } from './PendingApprovals';
import { RecentActivity } from './RecentActivity';
import { PaymentQueue } from './PaymentQueue';

export const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('kia_users');
    if (saved) {
      setUsers(JSON.parse(saved));
    }
  }, []);

  const updateUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('kia_users', JSON.stringify(newUsers));
  };

  const totalStudents = users.filter(u => u.role === 'student' && u.status !== 'pending').length;
  const pendingRegistrations = users.filter(u => u.role === 'student' && u.status === 'pending').length;
  const activeTeachers = users.filter(u => u.role === 'teacher').length;

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <StatCard 
          title="Total Students" 
          value={totalStudents.toString()} 
          subtitle="Active enrolled students"
          trend="+1"
          trendLabel="new enrollments"
          trendUp={true}
        />
        <StatCard 
          title="Pending Registrations" 
          value={pendingRegistrations.toString()} 
          subtitle="New student sign-ups"
        />
        <StatCard 
          title="Pending Payment Verifications" 
          value="41" 
          subtitle="Requires to review"
        />
        <StatCard 
          title="Active Teachers" 
          value={activeTeachers.toString()} 
          subtitle="Currently using the system"
        />
      </div>

      <div className="layout-grid-1-300" style={{ marginTop: '1.5rem' }}>
        <div className="left-column">
          <div className="dashboard-row">
            <ActiveUsersChart />
            <PendingApprovals users={users} updateUsers={updateUsers} />
          </div>
          <PaymentQueue />
        </div>
        
        <div className="right-column">
          <ActionButtons />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};
