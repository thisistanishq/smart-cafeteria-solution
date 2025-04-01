
import React, { useState, useRef, useEffect } from 'react';
import { Send, PlusCircle, Loader2, X, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { aiService } from '@/services/supabase';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actionable?: boolean;
};

export const SmartChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add initial greeting message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          content: "Hello! I'm your smart cafeteria assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Process message with AI
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await aiService.processChatMessage(input, chatHistory);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to get response');
      }

      const botResponse: Message = {
        id: Date.now().toString(),
        content: response.data.response || "I'm not sure how to respond to that.",
        sender: 'bot',
        timestamp: new Date(),
        actionable: response.data.actionable
      };

      setMessages(prev => [...prev, botResponse]);

      // If the message contains an intent to add to cart, we could handle that here
      if (input.toLowerCase().includes('order') && input.toLowerCase().includes('idli')) {
        // This is just a demonstration - in a real app, you'd parse the user message
        // to identify the exact item they want and add it to cart
        toast({
          title: "Item Added",
          description: "Idli has been added to your cart",
        });
        
        // Optionally navigate to cart
        // navigate('/cart');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I couldn't process your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const handleAction = (actionType: string) => {
    if (actionType === 'cart') {
      navigate('/cart');
    } else if (actionType === 'menu') {
      navigate('/menu');
    }
    // Add more actions as needed
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 text-white p-4 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="flex items-center">
            <span className="mr-1">Ask AI</span>
            <PlusCircle className="h-5 w-5" />
          </div>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-6 z-50 w-full sm:max-w-[400px] rounded-lg overflow-hidden shadow-xl border border-zinc-700"
          >
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">Cafeteria AI Assistant</h3>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:bg-zinc-700"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-zinc-900 h-[400px] overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-zinc-600 to-zinc-700 text-white'
                        : 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'bot' && (
                        <Avatar className="h-6 w-6 bg-zinc-600">
                          <span className="text-xs">AI</span>
                        </Avatar>
                      )}
                      <span className="text-xs text-zinc-400">
                        {message.sender === 'user' ? 'You' : 'Assistant'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Action buttons shown for bot messages that are actionable */}
                    {message.sender === 'bot' && message.actionable && (
                      <div className="mt-2 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="bg-zinc-700 hover:bg-zinc-600 text-white"
                          onClick={() => handleAction('cart')}
                        >
                          <ShoppingCart className="mr-1 h-4 w-4" />
                          View Cart
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="bg-zinc-700 hover:bg-zinc-600 text-white"
                          onClick={() => handleAction('menu')}
                        >
                          <LayoutDashboard className="mr-1 h-4 w-4" />
                          See Menu
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] rounded-lg p-3 bg-gradient-to-r from-zinc-800 to-zinc-700 text-white">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 bg-zinc-600">
                        <span className="text-xs">AI</span>
                      </Avatar>
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                      <span className="text-xs text-zinc-400">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-zinc-800 p-3 flex gap-2 items-center">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask something..."
                className="bg-zinc-700 text-white border-zinc-600 focus-visible:ring-zinc-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                size="icon" 
                className="bg-zinc-700 hover:bg-zinc-600 text-white"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
