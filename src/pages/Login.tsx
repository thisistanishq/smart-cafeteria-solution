
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { Loader } from '@/components/Loader';
import { CookingAnimation } from '@/components/CookingAnimation';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const { login, isLoading } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [cookingAnimation, setCookingAnimation] = useState<'dosa' | 'idli' | 'biryani' | 'poori'>('dosa');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
  
  // Cycle through cooking animations
  useEffect(() => {
    const animations: Array<'dosa' | 'idli' | 'biryani' | 'poori'> = ['dosa', 'idli', 'biryani', 'poori'];
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % animations.length;
      setCookingAnimation(animations[currentIndex]);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error is already handled in AppContext
      console.error('Login failed:', error);
    }
  };
  
  // Demo login shortcuts
  const loginAsDemo = async (role: string) => {
    let email = '';
    let password = 'password'; // In a real app, you'd use proper auth
    
    switch(role) {
      case 'student':
        email = 'student@example.com';
        break;
      case 'staff':
        email = 'staff@example.com';
        break;
      case 'cafeteria':
        email = 'cafe@example.com';
        break;
      case 'admin':
        email = 'admin@example.com';
        break;
    }
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };
  
  if (isLoading) {
    return <Loader text="Logging in..." />;
  }
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100 p-4"
    >
      <div className="w-full max-w-md order-2 md:order-1">
        <motion.div variants={itemVariants}>
          <Button 
            variant="ghost" 
            className="mb-4 text-navy-700"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-navy-100">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.3
                  }}
                  className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center"
                >
                  <Coffee className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-navy-800">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : 'border-navy-200'}`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 ${errors.password ? 'border-red-500' : 'border-navy-200'}`}
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Button 
                      type="submit" 
                      className="w-full bg-navy-700 hover:bg-navy-800 text-white"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </div>
              </form>
              
              <motion.div variants={itemVariants} className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Quick Demo Login
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="text-xs border-navy-200 hover:bg-navy-100"
                    onClick={() => loginAsDemo('student')}
                  >
                    Student Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs border-navy-200 hover:bg-navy-100"
                    onClick={() => loginAsDemo('staff')}
                  >
                    Staff Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs border-navy-200 hover:bg-navy-100"
                    onClick={() => loginAsDemo('cafeteria')}
                  >
                    Cafeteria Staff
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs border-navy-200 hover:bg-navy-100"
                    onClick={() => loginAsDemo('admin')}
                  >
                    Admin Account
                  </Button>
                </div>
              </motion.div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-navy-700 hover:underline">
                  Sign up
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Cooking Animation Section */}
      <motion.div 
        variants={itemVariants}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md md:ml-8 mt-8 md:mt-0 order-1 md:order-2"
      >
        <div className="bg-navy-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-navy-800 text-white">
            <h3 className="text-xl font-semibold">Smart Cafeteria Experience</h3>
            <p className="text-navy-100 text-sm">Watch our chefs in action</p>
          </div>
          <div className="p-8 bg-navy-700">
            <CookingAnimation type={cookingAnimation} className="h-[300px]" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
