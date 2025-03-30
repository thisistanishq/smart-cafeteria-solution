import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, User, KeyRound, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useApp();
  
  // Advanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Check if user has admin role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied: Admin privileges required');
      }
      
      // Fix the login function call to match the expected parameters in context
      // Assuming it needs both email and password
      login(email, password);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-[#15187C]/10 shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{
                    type: "spring",
                    stiffness: 200, 
                    damping: 10,
                    delay: 0.3
                  }}
                  className="w-16 h-16 bg-[#15187C] rounded-full flex items-center justify-center text-white"
                >
                  <Shield className="h-8 w-8" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-[#15187C]">Admin Login</CardTitle>
              <CardDescription>
                Please enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4 text-[#15187C]" />
                    <span>Email Address</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-3 border-[#15187C]/20 focus-visible:ring-[#15187C]/50"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <KeyRound className="h-4 w-4 text-[#15187C]" />
                    <span>Password</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-3 border-[#15187C]/20 focus-visible:ring-[#15187C]/50"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="border-t border-gray-100 flex justify-center">
              <motion.p 
                variants={itemVariants}
                className="text-center text-xs text-gray-500 mt-2"
              >
                <Lock className="h-3 w-3 inline-block mr-1" />
                Secure admin-only access panel
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-4 text-center"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-[#15187C]"
          >
            Back to Main Site
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
