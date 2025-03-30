
import React from 'react';

interface CategoryIconProps {
  name: string;
  iconSrc: string;
  onClick: () => void;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, iconSrc, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer" 
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-amber-500 rounded-lg flex items-center justify-center mb-1">
        <img 
          src={iconSrc} 
          alt={name} 
          className="w-8 h-8 object-contain"
        />
      </div>
      <span className="text-xs font-medium">{name}</span>
    </div>
  );
};
