
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Wallet, 
  History,
  Edit,
  Save,
  ChevronRight,
  LogOut
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user, orders, transactions, logout, isLoading } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user, isLoading, navigate]);

  const handleSaveProfile = () => {
    // In a real app, this would update the profile
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading || !user) {
    return <Loader text="Loading your profile..." />;
  }

  // Get user's recent orders
  const recentOrders = orders.filter(order => order.customerId === user.id).slice(0, 5);
  
  // Get user's recent transactions
  const recentTransactions = transactions.filter(tx => tx.userId === user.id).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c1329] text-white">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400">Manage your account and view your activity</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-[#192244] border-[#384374] text-white overflow-hidden">
              <CardHeader className="pb-2 text-center bg-gradient-to-r from-blue-900 to-indigo-900">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white/10">
                    <AvatarImage src={user.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <Badge variant="outline" className="mt-1 capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-md bg-blue-950/50">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-md bg-blue-950/50">
                    <Phone className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-md bg-blue-950/50">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Role</p>
                      <p className="capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-md bg-blue-950/50">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Wallet Balance</p>
                      <p className="font-semibold">₹{user.walletBalance.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/wallet')}
                    >
                      Add Money to Wallet
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] hover:bg-[#384374]/30 text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[#131b38] border border-[#384374]">
                <TabsTrigger value="profile" className="data-[state=active]:bg-[#192244]">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-[#192244]">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-[#192244]">
                  Transactions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="p-0 border-none">
                <Card className="bg-[#192244] border-[#384374] text-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Details</CardTitle>
                      <p className="text-sm text-gray-400">Update your profile information</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-[#384374] hover:bg-[#384374]/30"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Name</label>
                      {isEditing ? (
                        <Input 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="bg-[#131b38] border-[#384374] text-white"
                        />
                      ) : (
                        <p className="py-2 px-3 bg-blue-950/30 rounded-md">{user.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Email</label>
                      <p className="py-2 px-3 bg-blue-950/30 rounded-md">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
                      {isEditing ? (
                        <Input 
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="bg-[#131b38] border-[#384374] text-white"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="py-2 px-3 bg-blue-950/30 rounded-md">{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                    
                    {isEditing && (
                      <Button 
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders" className="p-0 border-none">
                <Card className="bg-[#192244] border-[#384374] text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="h-5 w-5 mr-2" />
                      Order History
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    {recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {recentOrders.map(order => (
                          <div 
                            key={order.id}
                            className="p-4 rounded-lg bg-blue-950/30 border border-[#384374] hover:bg-blue-950/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${order.status === 'completed' ? 'bg-green-500/20 text-green-200 border-green-500/30' : 
                                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-200 border-red-500/30' : 
                                    'bg-yellow-500/20 text-yellow-200 border-yellow-500/30'}
                                `}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()} • 
                              {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            
                            <div className="mt-2">
                              <p className="text-sm mb-1">Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                              <p className="font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                            
                            <div className="flex justify-end mt-2">
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        ))}
                        
                        <div className="text-center">
                          <Button 
                            variant="link" 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => navigate('/orders')}
                          >
                            View All Orders
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
                        <Button 
                          onClick={() => navigate('/menu')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Browse Menu
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transactions" className="p-0 border-none">
                <Card className="bg-[#192244] border-[#384374] text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2" />
                      Wallet Transactions
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {recentTransactions.map(tx => (
                          <div 
                            key={tx.id}
                            className="p-4 rounded-lg bg-blue-950/30 border border-[#384374]"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium capitalize">{tx.type}</h3>
                              <span className={tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}>
                                {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-400">
                              {new Date(tx.createdAt).toLocaleDateString()} • 
                              {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            
                            {tx.description && (
                              <p className="text-sm mt-2 text-gray-300">{tx.description}</p>
                            )}
                          </div>
                        ))}
                        
                        <div className="text-center">
                          <Button 
                            variant="link" 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => navigate('/wallet')}
                          >
                            View Wallet History
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">No transaction history available.</p>
                        <Button 
                          onClick={() => navigate('/wallet')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add Funds
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
