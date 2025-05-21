
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Table, User } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  label: string;
  path: string;
  active: boolean;
  subMenu?: boolean;
  icon?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { label: 'Vue globale', path: '/', active: false },
    { label: 'Locataires', path: '/locataires', active: true, subMenu: false },
    { label: 'Immobiliers', path: '/immobiliers', active: false },
    { label: 'Finances', path: '/finances', active: false },
    { label: 'Documents', path: '/documents', active: false },
    { label: 'Paramètres', path: '/parametres', active: false },
    { label: 'Déconnexion', path: '/logout', active: false },
  ]);

  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
    
    // Update menu items state to reflect the collapsed state
    setMenuItems(prev => prev.map(item => 
      item.label === 'Locataires' 
        ? { ...item, subMenu: !item.subMenu } 
        : item
    ));
  };

  // Sub menu items for tenants
  const tenantSubMenuItems = [
    { label: 'Profils', path: '/locataires/profils', icon: <User className="w-5 h-5" /> },
    { label: 'Tableau', path: '/locataires/tableau', icon: <Table className="w-5 h-5" /> }
  ];

  return (
    <div className={cn("flex flex-col h-[calc(100vh-40px)] bg-[#5D6169] w-56 text-white rounded-lg shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100", className)}>
      {/* Logo Section - Hauteur réduite */}
      <div className="p-3 flex items-center justify-center">
        <div className="w-32 h-16 flex-shrink-0 overflow-hidden">
          <img src="/lovable-uploads/11042e08-27b3-49e5-bbb7-e66c8b1d59d0.png" alt="Easymo Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col py-2">
        <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 px-3 flex-1">
          {menuItems.map((item, index) => {
            // Special handling for Locataires menu item
            if (item.label === 'Locataires') {
              return (
                <li key={index} className="relative">
                  <button
                    onClick={toggleSubMenu}
                    className={cn(
                      "flex items-center justify-center rounded-lg px-4 py-2 sm:py-2.5 md:py-3 text-sm font-medium transition-colors w-full min-h-[36px] md:min-h-[44px]",
                      showSubMenu
                        ? "bg-[#E84A33] text-white justify-start"
                        : "bg-[#E84A33] text-white hover:bg-[#E84A33]/80 justify-center"
                    )}
                  >
                    {showSubMenu ? (
                      <>
                        {item.label}
                      </>
                    ) : (
                      item.label
                    )}
                  </button>
                  
                  {showSubMenu && (
                    <div className="mt-2 ml-4 space-y-2">
                      {tenantSubMenuItems.map((subItem, subIndex) => (
                        <Link
                          key={`sub-${subIndex}`}
                          to={subItem.path}
                          className="flex items-center gap-2 bg-[#9CA3AF] text-white hover:bg-[#9CA3AF]/80 rounded-lg px-3 py-2 text-sm font-medium"
                        >
                          <span className="flex-shrink-0">
                            {subItem.icon}
                          </span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            }
            
            // Regular menu items
            return (
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
            );
          })}
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
