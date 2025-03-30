
import React from 'react';
import { Utensils, Coffee } from 'lucide-react';

export const Loader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-cook">
            <Utensils className="h-10 w-10 text-turmeric-500" />
          </div>
          <div className="animate-bubble">
            <Coffee className="h-8 w-8 text-spice-500" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-medium">{text}</span>
          <div className="mt-2 flex space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="h-2 w-2 rounded-full bg-turmeric-500"
                style={{
                  animation: 'pulse 1.5s infinite',
                  animationDelay: `${dot * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
