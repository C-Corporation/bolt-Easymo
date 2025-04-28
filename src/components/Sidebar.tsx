
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
    <div className={cn("flex flex-col h-screen bg-sidebar w-56 text-white", className)}>
      <div className="p-4 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300"></div>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-4 py-3 text-sm font-medium",
                  item.active
                    ? "bg-primary text-white"
                    : "bg-accent hover:bg-accent/80"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-600">
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="text-sm font-medium">Propriétaire</div>
          <div className="text-sm mt-1">M. ZEKE Philippe</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
