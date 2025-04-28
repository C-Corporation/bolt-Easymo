
import React from 'react';
import Sidebar from './Sidebar';
import TenantsTable from './TenantsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="h-screen bg-[#2A2F36]">
      <div className="relative h-full">
        <Sidebar className="absolute top-10 left-5" />
        <main className="ml-[276px] p-6 overflow-auto h-full">
          <TenantsTable />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
