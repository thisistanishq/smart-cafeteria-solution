
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send, Zap, Bot } from 'lucide-react';
import { aiService } from '@/services/supabase';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Smart Cafeteria assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Format chat history for the AI service
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const { data, error } = await aiService.processChatMessage(message, chatHistory);
      
      if (error) throw new Error(error.message);
      
      // Simulate type writer effect
      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, botMessage]);
      }, 1500);
      
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.2 
      }
    }
  };
  
  const staggerContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <>
      {/* Floating chat button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.5
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          className="w-14 h-14 rounded-full bg-[#15187C] hover:bg-[#0e105a] shadow-lg border-2 border-white"
          onClick={() => setIsOpen(true)}
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
        </Button>
      </motion.div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-[#15187C] text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 0, 5, -5, 0], 
                    y: [0, 0, -2, 2, 0],
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 4 
                    } 
                  }}
                >
                  <Bot className="h-5 w-5" />
                </motion.div>
                <h3 className="font-semibold">Smart Cafeteria Assistant</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-[#0e105a] rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
              <motion.div 
                className="space-y-3"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
              >
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    variants={bubbleVariants}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-[#15187C] text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
                
                {isTyping && (
                  <motion.div 
                    className="flex justify-start"
                    variants={bubbleVariants}
                  >
                    <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-[#15187C] animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#15187C] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#15187C] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Input area */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-center space-x-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[40px] resize-none focus:border-[#15187C] focus:ring-[#15187C]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    className="h-10 w-10 p-0 rounded-full bg-[#15187C] hover:bg-[#0e105a] shadow transition-all duration-200"
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                  >
                    {isLoading ? (
                      <Zap className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
