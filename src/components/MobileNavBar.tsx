
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, MessageSquare, Bell, User } from 'lucide-react';

export const MobileNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Orders', icon: ShoppingBag, path: '/orders' },
    { name: 'Chats', icon: MessageSquare, path: '/chats' },
    { name: 'Notification', icon: Bell, path: '/notifications' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50">
      <div className="grid grid-cols-5">
        {navItems.map((item) => (
          <button
            key={item.name}
            className="flex flex-col items-center justify-center p-2"
            onClick={() => navigate(item.path)}
          >
            <item.icon 
              className={`h-6 w-6 ${
                isActive(item.path) ? 'text-amber-500' : 'text-gray-400'
              }`} 
            />
            <span 
              className={`text-xs mt-1 ${
                isActive(item.path) ? 'text-amber-500 font-medium' : 'text-gray-500'
              }`}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
