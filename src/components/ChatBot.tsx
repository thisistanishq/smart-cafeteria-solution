
import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingCart, Wallet, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import { MenuItem } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimized: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMinimized 
}) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your smart cafeteria assistant. I can help you order food, check menu items, or answer questions about nutrition. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart, menuItems, user, orders } = useApp();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    // Process the message and generate a response
    setTimeout(() => {
      const response = processUserMessage(input);
      setMessages(prevMessages => [...prevMessages, response]);
    }, 500);
  };

  const processUserMessage = (message: string): ChatMessage => {
    const lowerMsg = message.toLowerCase();
    
    // Check for food order intents
    if (lowerMsg.includes('order') || lowerMsg.includes('get') || lowerMsg.includes('want')) {
      // Extract food items from request
      const foundItems = findMenuItemsInText(lowerMsg);
      
      if (foundItems.length > 0) {
        // Add items to cart
        foundItems.forEach(item => {
          addToCart(item, 1);
        });
        
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've added ${foundItems.map(i => i.name).join(', ')} to your cart. Would you like to order anything else or proceed to checkout?`,
          timestamp: new Date()
        };
      }
    }
    
    // Check for dietary restrictions
    if (lowerMsg.includes('diabetes') || lowerMsg.includes('diabetic')) {
      const lowSugarItems = menuItems.filter(item => 
        !item.tags?.includes('sweet') && 
        item.calories && item.calories < 300 && 
        item.veg
      );
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `For people with diabetes, I recommend these lower carb options: ${lowSugarItems.slice(0, 3).map(i => i.name).join(', ')}. These items are lower in carbohydrates and have a lower glycemic index.`,
        timestamp: new Date()
      };
    }
    
    // Check for recommendations
    if (lowerMsg.includes('recommend') || lowerMsg.includes('suggestion') || lowerMsg.includes('popular')) {
      // Get popular items based on ratings and orders
      const popularItems = menuItems
        .filter(item => item.status === 'available')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Based on our most popular items, I recommend: ${popularItems.map(i => i.name).join(', ')}. Would you like to know more about any of these?`,
        timestamp: new Date()
      };
    }
    
    // Check for vegetarian options
    if (lowerMsg.includes('vegetarian') || lowerMsg.includes('veg')) {
      const vegItems = menuItems
        .filter(item => item.veg && item.status === 'available')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Here are some great vegetarian options: ${vegItems.map(i => i.name).join(', ')}. All of these are customer favorites!`,
        timestamp: new Date()
      };
    }
    
    // Check for spicy food
    if (lowerMsg.includes('spicy')) {
      const spicyItems = menuItems
        .filter(item => 
          item.tags?.includes('spicy') && 
          item.status === 'available'
        )
        .slice(0, 3);
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `If you enjoy spicy food, try these: ${spicyItems.map(i => i.name).join(', ')}. These are known for their vibrant flavors and heat!`,
        timestamp: new Date()
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I can help you find food items, make recommendations based on dietary preferences, or answer questions about our menu. Is there something specific you\'re looking for?',
      timestamp: new Date()
    };
  };

  // Helper function to find menu items mentioned in text
  const findMenuItemsInText = (text: string): MenuItem[] => {
    const foundItems: MenuItem[] = [];
    
    menuItems.forEach(item => {
      const itemNameLower = item.name.toLowerCase();
      if (text.toLowerCase().includes(itemNameLower) && item.status === 'available') {
        foundItems.push(item);
      }
    });
    
    return foundItems;
  };

  const renderWalletInfo = () => {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p>Please login to view your wallet information.</p>
        </div>
      );
    }

    const recentTransactions = orders
      .filter(order => order.customerId === user.id)
      .slice(0, 5);

    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center p-4 bg-blue-950 rounded-lg">
          <h3 className="text-lg font-medium mb-1">Current Balance</h3>
          <p className="text-3xl font-bold">₹{user.walletBalance.toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-2 bg-blue-950/50 rounded-md">
                  <div>
                    <p className="font-medium">{tx.items.map(i => i.name).join(', ')}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-medium">₹{tx.totalAmount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">No recent transactions</p>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Card className={`fixed transition-all duration-300 shadow-xl bg-[#0c1329] border-[#384374] text-white overflow-hidden ${
      isMinimized 
        ? 'w-64 h-12 bottom-4 right-4'
        : 'w-80 h-[500px] bottom-4 right-4 md:w-96 md:h-[600px]'
    }`}>
      {isMinimized ? (
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={onMaximize}>
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="/ai-assistant.png" />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">AI</AvatarFallback>
            </Avatar>
            <span className="font-medium">Smart Assistant</span>
          </div>
          <Maximize2 className="h-4 w-4 text-gray-400" />
        </div>
      ) : (
        <>
          <CardHeader className="p-3 flex flex-row items-center justify-between bg-blue-950 border-b border-[#384374]">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/ai-assistant.png" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Smart Assistant</h3>
                <p className="text-xs text-gray-400">Always here to help</p>
              </div>
            </div>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={onMinimize} className="h-8 w-8">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100%-56px)]">
            <TabsList className="grid grid-cols-2 bg-[#131b38] border-b border-[#384374] rounded-none">
              <TabsTrigger value="chat" className="data-[state=active]:bg-[#0c1329]">Chat</TabsTrigger>
              <TabsTrigger value="wallet" className="data-[state=active]:bg-[#0c1329]">Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
              <CardContent className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-[#192244] border border-[#384374] text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <CardFooter className="border-t border-[#384374] p-3">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    className="flex-1 bg-[#131b38] border-[#384374] text-white"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="wallet" className="flex-1 m-0 p-4 overflow-y-auto">
              {renderWalletInfo()}
            </TabsContent>
          </Tabs>
        </>
      )}
    </Card>
  );
};
