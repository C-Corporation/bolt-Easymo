
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const menuItems = [
    { label: 'Vue globale', path: '/', active: false },
    { label: 'Locataires', path: '/locataires', active: true },
    { label: 'Immobiliers', path: '/immobiliers', active: false },
    { label: 'Finances', path: '/finances', active: false },
    { label: 'Intervention', path: '/intervention', active: false },
    { label: 'Documents', path: '/documents', active: false },
    { label: 'Paramètres', path: '/parametres', active: false },
    { label: 'Déconnexion', path: '/logout', active: false },
  ];

  return (
    <div className={cn("flex flex-col h-[calc(100vh-40px)] bg-[#5D6169] w-56 text-white rounded-lg shadow-lg overflow-hidden", className)}>
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300"></div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col py-2">
        <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 px-3 flex-1 flex flex-col justify-center">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center justify-center rounded-lg px-4 py-2 sm:py-2.5 md:py-3 text-sm font-medium transition-colors w-full min-h-[36px] md:min-h-[44px]",
                  item.active
                    ? "bg-[#E84A33] text-white"
                    : "bg-[#9CA3AF] text-white hover:bg-[#9CA3AF]/80"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Owner Section */}
      <div className="p-3 bg-[#4A4F55] mt-auto">
        <div className="bg-[#63686F] rounded-lg p-3 text-center">
          <div className="text-xs font-medium text-gray-300">Propriétaire</div>
          <div className="text-sm font-medium text-white mt-0.5">M. ZEKE Philippe</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
