import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Coffee } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      // Redirect based on user role
      if (isAuthenticated && user) {
        if (user.role === 'cafeteria_staff') {
          navigate('/staff/billing'); // Redirect cafeteria staff directly to billing
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard'); // Redirect admin to dashboard
        }
        // Other roles go to home page (default)
      }
    }, 2000); // Reduced splash screen time
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-turmeric-500 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="animate-cook">
          <Utensils className="h-20 w-20 text-white" />
        </div>
        <div className="absolute -top-4 -right-4 animate-bubble">
          <Coffee className="h-10 w-10 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white mt-6 mb-2">Smart Cafeteria</h1>
      <p className="text-white text-lg">Your digital dining solution</p>
      
      <div className="mt-8 flex space-x-2">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className="h-3 w-3 rounded-full bg-white"
            style={{
              animation: 'pulse 1.5s infinite',
              animationDelay: `${dot * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
