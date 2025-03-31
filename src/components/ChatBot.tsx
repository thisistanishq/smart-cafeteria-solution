import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/types';

interface ChatMessage {
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const MovableChat: React.FC = () => {
  const { toast } = useToast();
  const { menuItems, addToCart, user, walletBalance } = useApp();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      content: "Hello! I'm your cafeteria assistant. I can help you with menu recommendations, dietary advice, and placing orders. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Ensure the chat bubble stays within the viewport
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (chatRef.current) {
      const rect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 0);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  const findMatchingMenuItems = (query: string): MenuItem[] => {
    const keywords = query.toLowerCase().split(' ');
    return menuItems.filter(item => {
      const nameMatch = keywords.some(keyword => 
        item.name.toLowerCase().includes(keyword)
      );
      const descriptionMatch = item.description && keywords.some(keyword => 
        item.description.toLowerCase().includes(keyword)
      );
      const categoryMatch = keywords.some(keyword => 
        item.category.toLowerCase().includes(keyword)
      );
      const tagMatch = item.tags && keywords.some(keyword => 
        item.tags?.some(tag => tag.toLowerCase().includes(keyword))
      );
      
      return nameMatch || descriptionMatch || categoryMatch || tagMatch;
    });
  };
  
  const findItemsByDietaryRestriction = (restriction: string): MenuItem[] => {
    const vegetarianTerms = ['veg', 'vegetarian', 'plant-based'];
    const dairyFreeTerms = ['dairy-free', 'no dairy', 'lactose'];
    const glutenFreeTerms = ['gluten-free', 'no gluten'];
    
    if (vegetarianTerms.some(term => restriction.toLowerCase().includes(term))) {
      return menuItems.filter(item => item.vegetarian || item.veg);
    }
    
    if (dairyFreeTerms.some(term => restriction.toLowerCase().includes(term))) {
      // This would require more detailed ingredients data
      return menuItems.filter(item => 
        item.tags?.includes('dairy-free') || 
        (item.description && !item.description.toLowerCase().includes('milk') && 
         !item.description.toLowerCase().includes('cheese') && 
         !item.description.toLowerCase().includes('cream'))
      );
    }
    
    if (glutenFreeTerms.some(term => restriction.toLowerCase().includes(term))) {
      // This would require more detailed ingredients data
      return menuItems.filter(item => 
        item.tags?.includes('gluten-free') || 
        (item.category !== 'bread' && 
         item.description && !item.description.toLowerCase().includes('wheat') && 
         !item.description.toLowerCase().includes('gluten'))
      );
    }
    
    return [];
  };
  
  const findItemsByHealthCondition = (condition: string): MenuItem[] => {
    const diabetesTerms = ['diabetes', 'diabetic', 'sugar', 'low glycemic'];
    const heartHealthTerms = ['heart', 'cardiac', 'cholesterol', 'blood pressure'];
    
    if (diabetesTerms.some(term => condition.toLowerCase().includes(term))) {
      // For diabetics, focus on low-carb, high-fiber items
      return menuItems.filter(item => 
        (item.tags?.includes('low-carb') || item.tags?.includes('high-fiber')) ||
        (item.category !== 'dessert' && item.category !== 'bread') ||
        (item.vegetarian || item.veg)
      );
    }
    
    if (heartHealthTerms.some(term => condition.toLowerCase().includes(term))) {
      // For heart health, focus on items that are not fried and are plant-based
      return menuItems.filter(item => 
        (item.vegetarian || item.veg) && 
        (item.description && !item.description.toLowerCase().includes('fried') && 
         !item.description.toLowerCase().includes('butter'))
      );
    }
    
    return [];
  };
  
  const checkForOrderIntent = (userMessage: string) => {
    const orderTerms = ['order', 'get', 'buy', 'purchase', 'want', 'would like', 'I\'d like'];
    
    for (const term of orderTerms) {
      if (userMessage.toLowerCase().includes(term)) {
        const words = userMessage.toLowerCase().split(' ');
        const termIndex = words.findIndex(word => word === term || word.includes(term));
        
        if (termIndex !== -1 && termIndex < words.length - 1) {
          const potentialItemName = words.slice(termIndex + 1).join(' ');
          const matchingItems = findMatchingMenuItems(potentialItemName);
          
          if (matchingItems.length > 0) {
            return matchingItems[0]; // Return the first matching item
          }
        }
      }
    }
    
    return null;
  };
  
  const generateResponse = (userMessage: string): string => {
    // Check for greetings
    if (/\b(hi|hello|hey|greetings)\b/i.test(userMessage)) {
      return "Hello! I'm your cafeteria assistant. How can I help you today?";
    }
    
    // Check for goodbye
    if (/\b(bye|goodbye|see you|farewell)\b/i.test(userMessage)) {
      return "Goodbye! Feel free to chat again if you need assistance.";
    }
    
    // Check for help request
    if (/\b(help|assist|support)\b/i.test(userMessage)) {
      return "I can help you with: menu recommendations, dietary advice, placing orders, checking your wallet balance, or providing information about the cafeteria.";
    }
    
    // Check for wallet balance inquiry
    if (/\b(wallet|balance|money|funds)\b/i.test(userMessage)) {
      if (user) {
        return `Your current wallet balance is ₹${user.walletBalance.toFixed(2)}. Would you like to add more funds or proceed to order?`;
      } else {
        return "You need to be logged in to check your wallet balance. Would you like to go to the login page?";
      }
    }
    
    // Check for dietary restrictions
    if (/\b(vegetarian|vegan|gluten|dairy|lactose|allergic|allergy)\b/i.test(userMessage)) {
      const matchedItems = findItemsByDietaryRestriction(userMessage);
      
      if (matchedItems.length > 0) {
        const suggestions = matchedItems.slice(0, 3).map(item => item.name).join(', ');
        return `Based on your dietary preferences, I recommend: ${suggestions}. Would you like to see more details about any of these items?`;
      } else {
        return "I couldn't find menu items matching your specific dietary requirements. Please check with our staff for customized options.";
      }
    }
    
    // Check for health conditions
    if (/\b(diabetes|diabetic|heart|cardiac|cholesterol|blood pressure)\b/i.test(userMessage)) {
      const matchedItems = findItemsByHealthCondition(userMessage);
      
      if (matchedItems.length > 0) {
        const suggestions = matchedItems.slice(0, 3).map(item => item.name).join(', ');
        return `For your health condition, these menu items might be suitable: ${suggestions}. Would you like more information?`;
      } else {
        return "I couldn't find specific menu items for your health condition. Please consult with our staff for personalized recommendations.";
      }
    }
    
    // Check for recommendation request
    if (/\b(recommend|suggestion|what's good|popular|best|suggest)\b/i.test(userMessage)) {
      // Check for specific category recommendations
      let category = '';
      
      if (/\b(breakfast)\b/i.test(userMessage)) {
        category = 'breakfast';
      } else if (/\b(lunch)\b/i.test(userMessage)) {
        category = 'lunch';
      } else if (/\b(dinner)\b/i.test(userMessage)) {
        category = 'dinner';
      } else if (/\b(snack|snacks)\b/i.test(userMessage)) {
        category = 'snacks';
      } else if (/\b(beverage|drink|coffee|tea)\b/i.test(userMessage)) {
        category = 'beverage';
      } else if (/\b(dessert|sweet)\b/i.test(userMessage)) {
        category = 'dessert';
      }
      
      if (category) {
        const categoryItems = menuItems.filter(item => 
          item.category.toLowerCase() === category.toLowerCase() && 
          item.status === 'available'
        );
        
        if (categoryItems.length > 0) {
          // Sort by rating or popularity
          const sortedItems = [...categoryItems].sort((a, b) => 
            (b.rating || 0) - (a.rating || 0)
          );
          
          const topItems = sortedItems.slice(0, 3);
          const suggestions = topItems.map(item => item.name).join(', ');
          
          return `For ${category}, I recommend: ${suggestions}. Would you like to order any of these?`;
        }
      }
      
      // General recommendations
      const popularItems = [...menuItems]
        .filter(item => item.status === 'available')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      
      const suggestions = popularItems.map(item => item.name).join(', ');
      return `Our most popular items are: ${suggestions}. Would you like to know more about any of these?`;
    }
    
    // Check for menu inquiry
    if (/\b(menu|food|items|dishes|offerings)\b/i.test(userMessage)) {
      const categories = Array.from(new Set(menuItems.map(item => item.category)));
      const categoryList = categories.map(c => c.replace('_', ' ')).join(', ');
      
      return `Our menu includes various categories: ${categoryList}. You can browse the complete menu in the Menu section. Would you like me to recommend something specific?`;
    }
    
    // Check for specific item inquiry
    const matchedItems = findMatchingMenuItems(userMessage);
    if (matchedItems.length > 0) {
      const item = matchedItems[0];
      return `${item.name} (₹${item.price}): ${item.description}. ${item.status === 'available' ? 'It\'s currently available to order.' : 'Sorry, this item is currently unavailable.'}`;
    }
    
    // Default response
    return "I'm not sure I understand. You can ask me about menu items, dietary options, or place an order. How can I assist you?";
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      sender: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Check if this is an order intent
    const orderItem = checkForOrderIntent(userMessage.content);
    
    // Simulate AI processing delay
    setTimeout(() => {
      let botResponse = generateResponse(userMessage.content);
      
      // If order intent detected and item is available
      if (orderItem && orderItem.status === 'available') {
        addToCart(orderItem, 1);
        botResponse = `I've added ${orderItem.name} to your cart. Would you like to checkout now or add something else?`;
        
        // Navigate to cart after a short delay
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      }
      
      const botMessage: ChatMessage = {
        sender: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed" style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 1000 }}>
      <div
        ref={chatRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {isOpen ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#192244] border border-[#384374] rounded-lg shadow-lg w-80 sm:w-96 overflow-hidden"
          >
            <div className="p-3 bg-[#131b38] border-b border-[#384374] flex justify-between items-center">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-400" />
                <h3 className="font-medium text-white">Smart Cafe Assistant</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
                className="h-8 w-8 hover:bg-[#212a4e] rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#131b38] text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 flex justify-start"
                  >
                    <div className="max-w-[80%] p-3 rounded-lg bg-[#131b38] text-white">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
            
            <div className="p-3 bg-[#131b38] border-t border-[#384374] flex items-center">
              <Input
                value={message}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="bg-[#192244] border-[#384374] text-white"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSendMessage}
                className="ml-2 hover:bg-[#212a4e] text-blue-400"
                disabled={isTyping || !message.trim()}
              >
                {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg"
          >
            <Bot className="h-6 w-6" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
