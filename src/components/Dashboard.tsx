
import React from 'react';
import Sidebar from './Sidebar';
import TenantsTable from './TenantsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <TenantsTable />
      </main>
    </div>
  );
};

export default Dashboard;
