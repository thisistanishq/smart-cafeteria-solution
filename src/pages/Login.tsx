
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { Loader } from '@/components/Loader';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <Card className="shadow-lg animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-turmeric-500 hover:bg-turmeric-600"
                >
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
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
                  className="text-xs"
                  onClick={() => loginAsDemo('student')}
                >
                  Student Account
                </Button>
                <Button 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => loginAsDemo('staff')}
                >
                  Staff Account
                </Button>
                <Button 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => loginAsDemo('cafeteria')}
                >
                  Cafeteria Staff
                </Button>
                <Button 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => loginAsDemo('admin')}
                >
                  Admin Account
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-turmeric-500 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
