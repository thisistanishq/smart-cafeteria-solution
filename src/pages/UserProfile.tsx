
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  BookOpen, 
  Settings, 
  LogOut,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';
import { MobileNavBar } from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { CookingAnimation } from '@/components/CookingAnimation';

const UserProfile = () => {
  const { user, isLoading, logout } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences'>('personal');
  const [cookingType, setCookingType] = useState<'dosa' | 'idli' | 'biryani' | 'poori' | 'friedrice'>('dosa');
  
  // Cycle through cooking animations
  useEffect(() => {
    const animations: Array<'dosa' | 'idli' | 'biryani' | 'poori' | 'friedrice'> = ['dosa', 'idli', 'biryani', 'poori', 'friedrice'];
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % animations.length;
      setCookingType(animations[currentIndex]);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return <Loader text="Loading profile..." />;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        {!isMobile && <NavBar />}
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-md">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-2">Not Logged In</h1>
            <p className="text-gray-500 mb-6">
              Please log in to view your profile and manage your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-turmeric-500 hover:bg-turmeric-600"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
        {isMobile ? <MobileNavBar /> : <Footer />}
      </div>
    );
  }
  
  // Animation variants for profile sections
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0c1329] to-[#131b38]">
      {!isMobile && <NavBar />}
      
      <main className="flex-grow p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-8"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold mb-2 text-white"
            >
              My Profile
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400"
            >
              Manage your personal information and preferences
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Card */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="rounded-xl overflow-hidden bg-[#192244] border border-[#384374] shadow-xl text-white">
                <div className="relative h-32 bg-[#212a4e]">
                  <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-gradient-to-br from-[#4a5680] to-transparent"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-3 left-3 w-16 h-16 rounded-full bg-[#4a5680] opacity-20"></div>
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#4a5680] opacity-20"></div>
                </div>
                
                <div className="relative px-6 pb-6">
                  <div className="absolute -top-12 left-6">
                    <div className="w-24 h-24 rounded-full bg-[#131b38] border-4 border-[#192244] flex items-center justify-center">
                      <User className="h-12 w-12 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="pt-16">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-gray-400 flex items-center mt-1">
                      <Shield className="h-4 w-4 mr-1" />
                      {user.role.replace('_', ' ').charAt(0).toUpperCase() + user.role.replace('_', ' ').slice(1)}
                    </p>
                    
                    <Separator className="my-4 bg-[#384374]" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-[#4a5680]" />
                        <p className="text-sm">{user.email}</p>
                      </div>
                      {user.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-3 text-[#4a5680]" />
                          <p className="text-sm">{user.phone}</p>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-3 text-[#4a5680]" />
                        <p className="text-sm">₹{user.walletBalance.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-3 text-[#4a5680]" />
                        <p className="text-sm">Joined {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        className="w-full border-[#384374] hover:bg-[#2d375f]"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Main Content */}
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Tabs */}
              <div className="flex border-b border-[#384374] mb-6">
                <button
                  className={`py-3 px-6 font-medium text-sm ${
                    activeTab === 'personal' 
                      ? 'text-white border-b-2 border-[#4a5680]' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Information
                </button>
                <button
                  className={`py-3 px-6 font-medium text-sm ${
                    activeTab === 'preferences' 
                      ? 'text-white border-b-2 border-[#4a5680]' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('preferences')}
                >
                  Preferences
                </button>
              </div>
              
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-white"
                >
                  <div className="bg-[#192244] rounded-xl p-6 border border-[#384374]">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Account Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                        <div className="bg-[#131b38] p-3 rounded-md border border-[#384374]">
                          {user.name}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Email Address</label>
                        <div className="bg-[#131b38] p-3 rounded-md border border-[#384374]">
                          {user.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                        <div className="bg-[#131b38] p-3 rounded-md border border-[#384374]">
                          {user.phone || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Role</label>
                        <div className="bg-[#131b38] p-3 rounded-md border border-[#384374]">
                          {user.role.replace('_', ' ').charAt(0).toUpperCase() + user.role.replace('_', ' ').slice(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        className="border-[#384374] hover:bg-[#2d375f]"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-[#192244] rounded-xl p-6 border border-[#384374]">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Wallet className="h-5 w-5 mr-2" />
                      Wallet
                    </h3>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                        <p className="text-3xl font-bold">₹{user.walletBalance.toFixed(2)}</p>
                      </div>
                      
                      <Button 
                        className="mt-4 md:mt-0 bg-[#212a4e] hover:bg-[#2d375f]"
                        onClick={() => navigate('/wallet')}
                      >
                        Manage Wallet
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cooking Animation Card */}
                  <div className="bg-[#192244] rounded-xl p-6 border border-[#384374]">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Today's Special
                    </h3>
                    
                    <div className="h-64 flex items-center justify-center">
                      <CookingAnimation type={cookingType} className="h-full w-full" />
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button 
                        className="bg-[#212a4e] hover:bg-[#2d375f]"
                        onClick={() => navigate('/menu')}
                      >
                        Explore Menu
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-white"
                >
                  <div className="bg-[#192244] rounded-xl p-6 border border-[#384374]">
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">Order Updates</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                          defaultChecked
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">Special Offers</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                          defaultChecked
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">New Menu Items</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#192244] rounded-xl p-6 border border-[#384374]">
                    <h3 className="text-lg font-medium mb-4">Dietary Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">Vegetarian</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">Vegan</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">Gluten-Free</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex-grow">
                          <span className="text-sm">Low-Sugar</span>
                        </label>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded accent-[#4a5680]" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      {isMobile ? <MobileNavBar /> : <Footer />}
    </div>
  );
};

export default UserProfile;
