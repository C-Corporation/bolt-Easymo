
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
    { label: 'Documents', path: '/documents', active: false },
    { label: 'Paramètres', path: '/parametres', active: false },
    { label: 'Déconnexion', path: '/logout', active: false },
  ];

  return (
    <div className={cn("flex flex-col h-[calc(100vh-40px)] bg-[#5D6169] w-56 text-white rounded-lg shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100", className)}>
      {/* Logo Section - Hauteur réduite */}
      <div className="p-3 flex items-center justify-center">
        <div className="w-24 h-12 flex-shrink-0 overflow-hidden">
          <img src="/lovable-uploads/11042e08-27b3-49e5-bbb7-e66c8b1d59d0.png" alt="Easymo Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col py-2">
        <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 px-3 flex-1">
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
