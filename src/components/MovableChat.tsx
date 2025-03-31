
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatBot } from './ChatBot';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MovableChat: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const constraintsRef = useRef(null);

  // Set initial position at bottom right
  useEffect(() => {
    setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  }, []);

  // Update constraints on window resize
  useEffect(() => {
    const handleResize = () => {
      if (constraintsRef.current) {
        const rect = constraintsRef.current.getBoundingClientRect();
        if (position.x > window.innerWidth - 100) {
          setPosition(prev => ({ ...prev, x: window.innerWidth - 100 }));
        }
        if (position.y > window.innerHeight - 100) {
          setPosition(prev => ({ ...prev, y: window.innerHeight - 100 }));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50" ref={constraintsRef}>
      <motion.div
        className="absolute pointer-events-auto"
        style={{ top: position.y, left: position.x }}
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          // Update position after drag
          const element = document.getElementById('chat-button');
          if (element) {
            const rect = element.getBoundingClientRect();
            setPosition({ x: rect.left, y: rect.top });
          }
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <div className="relative">
            <Button
              className="absolute -right-2 -top-2 z-50 h-7 w-7 rounded-full bg-[#121b3b] hover:bg-[#1e2e64] p-0 text-white"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
            <div className="w-80 sm:w-96 h-[500px] bg-[#1a1f33] rounded-lg shadow-xl overflow-hidden border border-[#384374]">
              <ChatBot onClose={() => setIsOpen(false)} />
            </div>
          </div>
        ) : (
          <motion.button
            id="chat-button"
            className="w-14 h-14 rounded-full bg-[#212a4e] hover:bg-[#1e2e64] shadow-lg border-2 border-[#384374] flex items-center justify-center text-white"
            onClick={() => !isDragging && setIsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0], 
                transition: { 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 5 
                } 
              }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
