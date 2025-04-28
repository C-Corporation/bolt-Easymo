
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
    { label: 'Rapports', path: '/rapports', active: false },
    { label: 'Paramètres', path: '/parametres', active: false },
    { label: 'Aide & Support', path: '/aide', active: false },
    { label: 'Déconnexion', path: '/logout', active: false },
  ];

  return (
    <div className={cn("flex flex-col h-[calc(100vh-80px)] bg-[#5D6169] w-60 text-white rounded-lg shadow-lg", className)}>
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300"></div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-3 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium",
                  item.active
                    ? "bg-[#E84A33] text-white" // Orange/red background for active item
                    : "bg-[#9CA3AF] text-white hover:bg-[#9CA3AF]/80" // Gray background for inactive items
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Owner Section */}
      <div className="p-4 border-t border-gray-600">
        <div className="bg-[#63686F] rounded-lg p-3 text-center">
          <div className="text-sm font-medium text-white">Propriétaire</div>
          <div className="text-sm mt-1 text-white">M. ZEKE Philippe</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
