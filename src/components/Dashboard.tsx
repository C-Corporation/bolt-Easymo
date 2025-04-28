
import React from 'react';
import Sidebar from './Sidebar';
import TenantsTable from './TenantsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="h-screen bg-white relative">
      {/* Dark gray background for top 30% */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
      
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
