
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, User, KeyRound, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, user } = useApp();
  
  // Check if already logged in as admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user && user.role !== 'admin') {
      // Redirect non-admin users
      toast({
        title: "Access Denied",
        description: "This area is restricted to admin users only.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);
  
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
      
      login(email, password);
      
      toast({
        title: "Admin Login Successful",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-zinc-700 bg-zinc-800 shadow-lg">
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
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white"
                >
                  <Shield className="h-8 w-8" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
              <CardDescription className="text-zinc-400">
                Please enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-1">
                    <User className="h-4 w-4 text-zinc-300" />
                    <span>Email Address</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-3 bg-zinc-700 border-zinc-600 text-white focus-visible:ring-purple-500/50"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-1">
                    <KeyRound className="h-4 w-4 text-zinc-300" />
                    <span>Password</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-3 bg-zinc-700 border-zinc-600 text-white focus-visible:ring-purple-500/50"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white"
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
                
                <motion.div variants={itemVariants}>
                  <div className="p-3 bg-red-900/30 text-red-300 rounded-md flex items-start space-x-2 border border-red-900/50">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
                    <div className="text-sm">
                      <p className="font-semibold">Admin Area Only</p>
                      <p>This login is strictly for cafeteria administrators. Regular users and staff should use the standard login.</p>
                    </div>
                  </div>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="border-t border-zinc-700 flex justify-center">
              <motion.p 
                variants={itemVariants}
                className="text-center text-xs text-zinc-400 mt-2"
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
            className="text-zinc-400 hover:text-white"
          >
            Back to Main Site
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
