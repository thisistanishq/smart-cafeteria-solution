
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send, Zap, Bot, ShoppingCart, Wallet } from 'lucide-react';
import { aiService } from '@/services/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface ChatBotProps {
  onClose?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Smart Cafeteria assistant. I can help with menu recommendations, dietary suggestions, and placing orders. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { menuItems, addToCart, user } = useApp();
  const navigate = useNavigate();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Process food intents from user message
  const processMenuIntent = (userMsg: string): { action: string, item?: string, success: boolean } => {
    const lowerMsg = userMsg.toLowerCase();
    
    // Handle ordering intent
    if (lowerMsg.includes('order') || lowerMsg.includes('add to cart')) {
      const itemNames = menuItems.map(item => item.name.toLowerCase());
      
      // Find which menu item was mentioned
      for (const item of menuItems) {
        if (lowerMsg.includes(item.name.toLowerCase())) {
          // Add to cart and return success
          addToCart(item, 1, '');
          return { action: 'order', item: item.name, success: true };
        }
      }
      
      // No specific item found in message
      return { action: 'order', success: false };
    }
    
    // Handle diet-specific recommendations
    if (lowerMsg.includes('diabetes') || lowerMsg.includes('diabetic')) {
      return { action: 'diet', success: true };
    }
    
    // Handle recommendation request
    if (lowerMsg.includes('recommend') || lowerMsg.includes('suggestion')) {
      return { action: 'recommend', success: true };
    }
    
    // Handle wallet inquiry
    if (lowerMsg.includes('wallet') || lowerMsg.includes('balance')) {
      return { action: 'wallet', success: true };
    }
    
    // No specific intent found
    return { action: 'none', success: false };
  };
  
  const generateResponse = (userMessage: string, intent: { action: string, item?: string, success: boolean }): string => {
    // Handle specific intents with custom responses
    if (intent.action === 'order' && intent.success) {
      return `I've added ${intent.item} to your cart! Would you like to proceed to checkout or add more items?`;
    }
    
    if (intent.action === 'order' && !intent.success) {
      return "I'd be happy to add something to your cart, but I couldn't identify which menu item you wanted. Could you specify the dish name?";
    }
    
    if (intent.action === 'diet' && intent.success) {
      // Filter for diabetic-friendly options
      const diabeticOptions = menuItems
        .filter(item => 
          item.tags?.includes('low-sugar') || 
          item.tags?.includes('diabetic-friendly') ||
          (item.category !== 'dessert' && item.category !== 'sweet')
        )
        .slice(0, 3);
      
      if (diabeticOptions.length > 0) {
        return `For someone with diabetes, I'd recommend these lower-sugar options: ${diabeticOptions.map(item => item.name).join(', ')}. These items are designed to be gentler on blood sugar levels.`;
      } else {
        return "I recommend choosing items that are low in sugar and refined carbohydrates. Perhaps try some of our protein-rich dishes with vegetables.";
      }
    }
    
    if (intent.action === 'recommend') {
      // Get top-rated items
      const topRated = menuItems
        .filter(item => item.status === 'available')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      
      return `Based on customer favorites, I'd recommend: ${topRated.map(item => item.name).join(', ')}. Would you like to know more about any of these dishes?`;
    }
    
    if (intent.action === 'wallet') {
      if (user && user.walletBalance !== undefined) {
        return `Your current wallet balance is ₹${user.walletBalance}. You can add more funds in the Wallet section.`;
      } else {
        return "You can check your wallet balance in the Wallet section. Would you like me to take you there?";
      }
    }
    
    // General responses for menu, hours, etc.
    if (userMessage.toLowerCase().includes('menu')) {
      return "Our menu features a variety of delicious South Indian options! We have dosas, idlis, vadas, biryani, and more. You can check the full menu in the Menu section. Would you like me to recommend something?";
    }
    
    if (userMessage.toLowerCase().includes('hours') || userMessage.toLowerCase().includes('open')) {
      return "We're open Monday through Friday from 7:30 AM to 8:00 PM, and weekends from 9:00 AM to 6:00 PM.";
    }
    
    if (userMessage.toLowerCase().includes('payment') || userMessage.toLowerCase().includes('pay')) {
      return "We accept all major credit cards, digital wallets like UPI, as well as payments through our app wallet system!";
    }
    
    // Default response
    return "I'm here to help with menu recommendations, dietary questions, and placing orders. You can ask me about our menu, make special requests, or tell me about dietary preferences for personalized suggestions!";
  };
  
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
    
    // Process the message to determine intent
    const intent = processMenuIntent(message);
    
    // If ordering intent was successful, navigate to cart after delay
    const shouldNavigateToCart = intent.action === 'order' && intent.success;
    const shouldNavigateToWallet = intent.action === 'wallet' && !user?.walletBalance;
    
    try {
      // Generate response based on intent
      const responseText = generateResponse(message, intent);
      
      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage: Message = {
          role: 'assistant',
          content: responseText,
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, botMessage]);
        
        // If we detected an order intent and successfully added to cart, navigate after a delay
        if (shouldNavigateToCart) {
          setTimeout(() => {
            navigate('/cart');
            if (onClose) onClose();
          }, 1500);
        }
        
        // If we detected a wallet intent and user needs to see wallet, navigate after delay
        if (shouldNavigateToWallet) {
          setTimeout(() => {
            navigate('/wallet');
            if (onClose) onClose();
          }, 1500);
        }
      }, 1000 + Math.random() * 500); // Random delay between 1-1.5s for more natural feel
      
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#192244] text-white p-3 flex justify-between items-center">
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
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/wallet')}
            className="text-white hover:bg-[#2d375f] rounded-full h-8 w-8 p-0"
          >
            <Wallet className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-[#2d375f] rounded-full h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-3 overflow-y-auto bg-[#131b38]">
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
                  ? 'bg-[#2d375f] text-white'
                  : 'bg-[#192244] border border-[#384374] text-gray-100'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              className="flex justify-start"
              variants={bubbleVariants}
            >
              <div className="max-w-[80%] rounded-lg p-3 bg-[#192244] border border-[#384374]">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </motion.div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-[#384374] p-3 bg-[#192244]">
        <div className="flex items-center space-x-2">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] resize-none bg-[#131b38] border-[#384374] text-white focus:border-[#4a5680] focus-visible:ring-[#4a5680]"
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
              className="h-10 w-10 p-0 rounded-full bg-[#2d375f] hover:bg-[#394470] shadow transition-all duration-200"
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
    </div>
  );
};
