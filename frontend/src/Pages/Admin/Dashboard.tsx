import React from 'react';
import UserManagement from '../../Components/Admin/UserManagement'; 
import './Dashboard.css'
import AdminHeader from '../../Components/Admin/AdminHeader/AdminHeader';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <AdminHeader />
      <main className="dashboard-main">
        <UserManagement />
      </main>
    </div>
  );
}

export default Dashboard;