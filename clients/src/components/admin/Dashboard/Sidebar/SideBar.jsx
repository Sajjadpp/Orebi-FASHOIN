import React, { useContext, useEffect, useState } from 'react';
import { Home, Package, ShoppingCart, Users, Settings, ChevronDown, Menu } from 'lucide-react';

import { SidebarContext } from '../../../../context/SideBarContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  // Use an object to track open/closed state of all submenus
  const [openMenus, setOpenMenus] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('/');
  const { isToogle, updateToogle } = useContext(SidebarContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(`/admin${activeMenuItem}`);
  }, [activeMenuItem]);

  

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/'
    },
    {
      title: 'Products',
      icon: <Package className="h-5 w-5" />,
      path: '/products',
      submenu: [
        { title: 'Add Product', path: '/products/add' },
        { title: 'Product List', path: '/products/list' }
      ]
    },
    {
      title: 'Category',
      icon: <Package className="h-5 w-5" />,
      path: '/category',
      
    },
    {
      title: 'Orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/orders'
    },
    {
      title: 'Customers',
      icon: <Users className="h-5 w-5" />,
      path: '/customers'
    },
    {
      title: 'Stock management',
      icon: <Settings className="h-5 w-5" />,
      path: '/StockManagement'
    }
  ];

  const toggleSubmenu = (path) => {
    setOpenMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <aside
      className={`bg-white min-h-screen fixed border-r transition-all ${
        isToogle ? 'w-64' : 'w-16'
      }`}
    >
      <nav className="p-4">
        {/* Toggle Button */}
        <button
          className="flex items-center justify-center p-2 rounded-lg bg-gray-200 hover:bg-gray-300 mb-4"
          onClick={() => updateToogle(!isToogle)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 ${
                  activeMenuItem === item.path ? 'bg-green-100 text-green-700' : ''
                } ${item.submenu ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.path);
                  } else {
                    setActiveMenuItem(item.path);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  {isToogle && <span>{item.title}</span>}
                </div>
                {item.submenu && isToogle && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMenus[item.path] ? 'transform rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.submenu && openMenus[item.path] && isToogle && (
                <div className="pl-11 space-y-1 mt-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      className={`block p-2 rounded-lg hover:bg-gray-100 ${
                        activeMenuItem === subItem.path ? 'bg-green-100 text-green-700' : 'text-gray-600'
                      }`}
                      onClick={() => setActiveMenuItem(subItem.path)}
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;