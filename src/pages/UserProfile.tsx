
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  CreditCard, 
  ShoppingCart, 
  ClipboardList,
  Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!user) {
    useEffect(() => {
      navigate('/login');
    }, [navigate]);
    
    return null;
  }

  // Default phone if not available
  const phoneNumber = user.phone || '+91 98765 43210';
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
        damping: 20
      }
    }
  };
  
  const statsVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring", 
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  const stats = [
    { 
      label: 'Total Orders', 
      value: 12, 
      icon: ShoppingCart,
      color: 'bg-[#192244] text-blue-200'
    },
    { 
      label: 'Points Earned', 
      value: 450, 
      icon: CreditCard,
      color: 'bg-[#192244] text-green-200'
    },
    { 
      label: 'Referrals', 
      value: 3, 
      icon: User,
      color: 'bg-[#192244] text-purple-200'
    }
  ];
  
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#131b38] text-gray-100 pt-20 pb-16">
        <motion.div 
          className="cafeteria-container space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Card */}
            <motion.div variants={itemVariants} className="w-full md:w-1/3">
              <Card className="bg-[#192244] border-[#384374] text-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#212a4e] to-[#1e2e64]" />
                <CardContent className="-mt-16 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-[#384374] border-4 border-[#192244] overflow-hidden mb-3">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#212a4e]">
                          <User className="w-12 h-12 text-gray-100" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mt-2">{user.name}</h3>
                    <p className="text-sm text-gray-300 capitalize">{user.role.replace('_', ' ')}</p>
                    
                    <div className="w-full space-y-3 mt-6">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">{phoneNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">Campus Area, Room 203</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center w-full mt-6">
                      <Button className="w-full bg-[#212a4e] hover:bg-[#2d375f] text-white">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <motion.div variants={itemVariants} className="mt-6">
                <Card className="bg-[#192244] border-[#384374] text-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Wallet Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">₹{user.walletBalance || 0}</p>
                        <p className="text-sm text-gray-300">Available Balance</p>
                      </div>
                      <Button 
                        className="bg-[#212a4e] hover:bg-[#2d375f]"
                        onClick={() => navigate('/wallet')}
                      >
                        Top Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            
            {/* Right Column */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Stats */}
              <motion.div 
                variants={itemVariants} 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {stats.map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    variants={statsVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="bg-[#192244] border-[#384374] text-gray-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-sm text-gray-300">{stat.label}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Recent Orders */}
              <motion.div variants={itemVariants}>
                <Card className="bg-[#192244] border-[#384374] text-gray-100">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription className="text-gray-400">Your latest 5 orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((order) => (
                        <div 
                          key={order} 
                          className="border border-[#384374] rounded-lg p-4 hover:bg-[#212a4e] transition-colors cursor-pointer"
                          onClick={() => navigate(`/orders/${1000 + order}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Order #{1000 + order}</h4>
                              <p className="text-sm text-gray-400">3 items • ₹270</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                                Delivered
                              </span>
                              <p className="text-xs text-gray-400 mt-1">June {15 + order}, 2023</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] text-gray-300 hover:bg-[#212a4e] hover:text-white"
                      onClick={() => navigate('/orders')}
                    >
                      <ClipboardList className="mr-2 h-4 w-4" />
                      View All Orders
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Favorite Items */}
              <motion.div variants={itemVariants}>
                <Card className="bg-[#192244] border-[#384374] text-gray-100">
                  <CardHeader>
                    <CardTitle>Favorite Items</CardTitle>
                    <CardDescription className="text-gray-400">Your most ordered items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Masala Dosa', 'Veg Biryani', 'Butter Naan'].map((item, i) => (
                        <div 
                          key={item} 
                          className="flex items-center gap-4 border border-[#384374] rounded-lg p-3 hover:bg-[#212a4e] transition-colors cursor-pointer"
                          onClick={() => navigate('/menu')}
                        >
                          <div className="w-12 h-12 bg-[#212a4e] rounded-md flex items-center justify-center">
                            <img 
                              src={`/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png`}
                              alt={item}
                              className="w-10 h-10 object-cover rounded"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{item}</h4>
                            <p className="text-xs text-gray-400">Ordered {5 - i} times</p>
                          </div>
                          <div className="ml-auto flex items-center text-gray-300">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-[#2d375f] hover:text-white rounded-full h-8 w-8 p-0"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] text-gray-300 hover:bg-[#212a4e] hover:text-white"
                      onClick={() => navigate('/menu')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Browse Full Menu
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
