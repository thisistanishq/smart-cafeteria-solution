
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CookingAnimationProps {
  className?: string;
  type: 'dosa' | 'idli' | 'biryani' | 'poori' | 'friedrice';
}

export const CookingAnimation: React.FC<CookingAnimationProps> = ({ className, type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add multiple steam elements
  const renderSteam = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-10 bg-white rounded-full opacity-0 filter blur-md"
        style={{ 
          left: `${20 + i * 15}%`,
          animationDelay: `${i * 0.5}s` 
        }}
        animate={{
          y: [0, -30],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeOut",
          delay: i * 0.4
        }}
      />
    ));
  };
  
  const renderDosa = () => (
    <div className={`relative ${className}`}>
      <div className="relative w-60 h-14 mx-auto">
        {/* Tawa (flat pan) */}
        <motion.div 
          className="absolute w-full h-6 bg-gray-700 rounded-full bottom-0"
          animate={{ rotateZ: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Dosa */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-amber-200 rounded-full"
          initial={{ width: 5, opacity: 1 }}
          animate={{ width: 40, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
        
        {/* Spatula */}
        <motion.div 
          className="absolute bottom-7 right-0 w-20 h-2 bg-amber-800 rounded-sm"
          style={{ transformOrigin: "right center" }}
          animate={{ rotateZ: [0, -30, 0], x: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Steam */}
        {renderSteam()}
      </div>
      <p className="text-center font-medium mt-4 text-white">Making Crispy Dosa</p>
    </div>
  );
  
  const renderIdli = () => (
    <div className={`relative ${className}`}>
      <div className="relative w-60 h-40 mx-auto">
        {/* Idli steamer */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-gray-300 rounded-lg"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Idli plate */}
        <motion.div 
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-32 h-10 bg-gray-400 rounded-lg"
        />
        
        {/* Idlis */}
        <motion.div 
          className="absolute bottom-9 left-1/3 transform -translate-x-1/2 w-10 h-5 bg-white rounded-full"
          animate={{ 
            scale: [0.95, 1, 0.95],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute bottom-9 right-1/3 transform translate-x-1/2 w-10 h-5 bg-white rounded-full"
          animate={{ 
            scale: [1, 0.95, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Steam - more steam for idli as it's steamed */}
        {renderSteam()}
        {renderSteam()}
      </div>
      <p className="text-center font-medium mt-4 text-white">Steaming Soft Idlis</p>
    </div>
  );
  
  const renderBiryani = () => (
    <div className={`relative ${className}`}>
      <div className="relative w-60 h-40 mx-auto">
        {/* Pot */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-24 bg-gray-600 rounded-xl"
          animate={{ rotateZ: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Lid */}
        <motion.div 
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-40 h-4 bg-gray-700 rounded-t-xl"
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
        
        {/* Spoon */}
        <motion.div 
          className="absolute top-10 right-2 w-20 h-3 bg-amber-800 rounded-sm"
          style={{ transformOrigin: "right center" }}
          animate={{ rotateZ: [0, -10, 0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Steam - lots of steam for biryani */}
        {renderSteam()}
        {renderSteam()}
        {renderSteam()}
      </div>
      <p className="text-center font-medium mt-4 text-white">Preparing Flavorful Biryani</p>
    </div>
  );
  
  const renderPoori = () => (
    <div className={`relative ${className}`}>
      <div className="relative w-60 h-40 mx-auto">
        {/* Oil pot */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-16 bg-amber-800 rounded-b-xl overflow-hidden"
        >
          {/* Oil */}
          <div className="absolute inset-0 bg-amber-400" />
        </motion.div>
        
        {/* Poori dough */}
        <motion.circle
          className="absolute"
          cx="50%"
          cy="50%"
          r="15"
          fill="#E8C99B"
          initial={{ y: -30 }}
          animate={{ 
            y: [-30, 10, 10, -30],
            scale: [1, 1, 1.8, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Bubbles in oil */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-200 rounded-full"
            style={{ 
              left: `${10 + i * 10}%`,
              bottom: `${2 + Math.random() * 10}px`
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Spoon */}
        <motion.div 
          className="absolute top-8 right-0 w-24 h-3 bg-gray-700 rounded-sm"
          style={{ transformOrigin: "right center" }}
          animate={{ rotateZ: [20, 40, 20] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      <p className="text-center font-medium mt-4 text-white">Frying Puffy Pooris</p>
    </div>
  );
  
  const renderFriedRice = () => (
    <div className={`relative ${className}`}>
      <div className="relative w-60 h-40 mx-auto">
        {/* Wok */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-44 h-20 bg-gray-600 rounded-full overflow-hidden"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {/* Rice */}
          <div className="absolute inset-2 bottom-0 bg-amber-100 rounded-full" />
        </motion.div>
        
        {/* Vegetables */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full`}
            style={{ 
              backgroundColor: ['#FF6B6B', '#4CAF50', '#FFA500', '#FF5722'][i % 4],
              left: `${20 + (i * 6)}%`,
              bottom: `${10 + Math.random() * 6}px`
            }}
            animate={{
              y: [-2, 2, -2],
              x: [1, -1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.1
            }}
          />
        ))}
        
        {/* Spatula */}
        <motion.div 
          className="absolute left-1/3 top-2 w-4 h-20 bg-amber-800"
          style={{ transformOrigin: "bottom center" }}
          animate={{ 
            rotate: [-20, 5, 20, 5, -20],
            y: [0, -2, 0, -2, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-10 h-4 bg-amber-800 absolute -left-3 top-0 rounded-sm" />
        </motion.div>
        
        {/* Steam */}
        {renderSteam()}
      </div>
      <p className="text-center font-medium mt-4 text-white">Stir-Frying Delicious Fried Rice</p>
    </div>
  );
  
  const renderAnimation = () => {
    switch (type) {
      case 'dosa':
        return renderDosa();
      case 'idli':
        return renderIdli();
      case 'biryani':
        return renderBiryani();
      case 'poori':
        return renderPoori();
      case 'friedrice':
        return renderFriedRice();
      default:
        return renderDosa();
    }
  };
  
  return (
    <div ref={containerRef} className={className}>
      {renderAnimation()}
    </div>
  );
};
