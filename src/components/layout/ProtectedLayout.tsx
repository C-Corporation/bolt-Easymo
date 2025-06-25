import { Outlet } from 'react-router-dom';
import { OwnerProvider } from '@/contexts/OwnerContext';
import Sidebar from '../Sidebar';

const ProtectedLayout = () => (
  <OwnerProvider>
    <div className="h-screen bg-white relative">
      <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
      <div className="relative h-full">
        <Sidebar className="absolute top-4 left-5" />
        <main className="ml-[244px] p-6 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </OwnerProvider>
);

export default ProtectedLayout;