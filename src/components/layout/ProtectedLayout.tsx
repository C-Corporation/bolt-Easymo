import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';

const ProtectedLayout = () => (
  <div className="h-screen bg-white relative">
    <div className="absolute top-0 left-0 w-full h-[30%] bg-[#2A2F36]" />
    <div className="relative h-full">
      <Sidebar className="absolute top-4 left-5" />
      <main className="ml-[244px] p-6 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default ProtectedLayout;