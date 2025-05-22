
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home, Settings, Table, User, PieChart, BarChart2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const location = useLocation();
  const [showSubMenu, setShowSubMenu] = useState(false);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { 
      label: 'Vue globale', 
      path: '/', 
      active: location.pathname === '/', 
      subMenu: false,
      icon: <Home className="w-5 h-5" />
    },
    { 
      label: 'Locataires', 
      path: '/locataires', 
      active: location.pathname.startsWith('/locataires'), 
      subMenu: location.pathname.startsWith('/locataires'),
      icon: <User className="w-5 h-5" />
    },
    { 
      label: 'Immobiliers', 
      path: '/immobiliers', 
      active: location.pathname === '/immobiliers', 
      subMenu: false,
      icon: <Home className="w-5 h-5" />
    },
    { 
      label: 'Finances', 
      path: '/finances', 
      active: location.pathname === '/finances', 
      subMenu: false,
      icon: <BarChart2 className="w-5 h-5" />
    },
    { 
      label: 'Documents', 
      path: '/documents', 
      active: location.pathname === '/documents', 
      subMenu: false,
      icon: <FileText className="w-5 h-5" />
    },
    { 
      label: 'Paramètres', 
      path: '/parametres', 
      active: location.pathname === '/parametres', 
      subMenu: false,
      icon: <Settings className="w-5 h-5" />
    },
    { 
      label: 'Déconnexion', 
      path: '/logout', 
      active: false, 
      subMenu: false,
      icon: <LogOut className="w-5 h-5" />
    },
  ]);

  // Mettre à jour l'état actif des éléments du menu
  useEffect(() => {
    setMenuItems(prev => prev.map(item => ({
      ...item,
      active: item.path === '/' 
        ? location.pathname === '/' 
        : item.path === '/locataires' 
          ? location.pathname.startsWith('/locataires')
          : location.pathname === item.path,
      subMenu: item.label === 'Locataires' 
        ? location.pathname.startsWith('/locataires')
        : item.subMenu
    })));
    
    setShowSubMenu(location.pathname.startsWith('/locataires'));
  }, [location.pathname]);

  const toggleSubMenu = () => {
    const newState = !showSubMenu;
    setShowSubMenu(newState);
    
    // Update menu items state to reflect the collapsed state
    setMenuItems(prev => prev.map(item => 
      item.label === 'Locataires' 
        ? { ...item, subMenu: newState } 
        : item
    ));
  };

  // Sous-menu pour les locataires
  const tenantSubMenuItems = [
    { 
      label: 'Profils', 
      path: '/locataires/profils', 
      icon: <User className="w-5 h-5" />,
      isActive: location.pathname === '/locataires/profils'
    },
    { 
      label: 'Tableau', 
      path: '/locataires/tableau', 
      icon: <Table className="w-5 h-5" />,
      isActive: location.pathname === '/locataires/tableau'
    }
  ];

  return (
    <div className={cn("flex flex-col h-[calc(100vh-40px)] bg-[#5D6169] w-56 text-white rounded-lg shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100", className)}>
      {/* Logo Section - Hauteur ajustée */}
      <div className="p-3 flex items-center justify-center">
        <div className="w-32 h-20 flex-shrink-0 overflow-hidden">
          <img 
            src="/images/Logo Sidemenu Easymo Complet TR v1.3 x1.png" 
            alt="Easymo Logo" 
            className="w-full h-full object-contain transition-all duration-300 hover:scale-105" 
          />
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
                  <div className="flex gap-1 overflow-hidden">
                    <motion.button
                      onClick={toggleSubMenu}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-2 sm:py-2.5 md:py-3 text-sm font-medium min-h-[36px] md:min-h-[44px] transition-colors w-full",
                        item.active
                          ? "bg-[#E84A33] text-white"
                          : "bg-[#9CA3AF] text-white hover:bg-[#9095A1]"
                      )}
                      animate={{
                        width: showSubMenu ? 'calc(100% - 96px)' : '100%',
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {showSubMenu && (
                        <motion.div 
                          className="flex gap-1"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {tenantSubMenuItems.map((subItem, subIndex) => (
                            <motion.div
                              key={`sub-${subIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: subIndex * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <Link
                                to={subItem.path}
                                className={`flex flex-col items-center justify-center rounded-lg p-2 min-h-[44px] min-w-[44px] transition-colors ${
                                  subItem.isActive 
                                    ? 'bg-[#E84A33] text-white hover:bg-[#E84A33]' 
                                    : 'bg-[#9CA3AF] text-white hover:bg-[#E84A33] hover:text-white'
                                }`}
                                title={subItem.label}
                              >
                                <span className="flex-shrink-0">
                                  {subItem.icon}
                                </span>
                                <span className="text-[10px] mt-1">{subItem.label}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            }
            
            // Regular menu items
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-lg px-4 py-2 sm:py-2.5 md:py-3 text-sm font-medium transition-colors w-full min-h-[36px] md:min-h-[44px]",
                    item.active
                      ? "bg-[#E84A33] text-white"
                      : "bg-[#9CA3AF] text-white hover:bg-[#9CA3AF]/80"
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
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
