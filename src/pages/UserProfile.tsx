
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, School, Calendar, Medal, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { Loader } from '@/components/Loader';

const UserProfile = () => {
  const { user, isLoading, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    institution: 'University of Technology',
    joinDate: '15/08/2023',
  });
  
  if (isLoading) {
    return <Loader text="Loading profile..." />;
  }
  
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // In a real app, you'd save to the database here
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };
  
  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      institution: 'University of Technology',
      joinDate: '15/08/2023',
    });
    setIsEditing(false);
  };
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  const orderHistory = [
    { id: 'ORD-7845', date: '12/03/2024', items: 'Masala Dosa, Sambar', amount: '₹250', status: 'Completed' },
    { id: 'ORD-6592', date: '05/03/2024', items: 'Veg Biryani, Raita', amount: '₹180', status: 'Completed' },
    { id: 'ORD-5472', date: '28/02/2024', items: 'Idli, Vada, Coffee', amount: '₹120', status: 'Completed' },
  ];
  
  const walletTransactions = [
    { id: 'TXN-4921', date: '15/03/2024', type: 'Deposit', amount: '+₹500', method: 'UPI' },
    { id: 'TXN-4825', date: '12/03/2024', type: 'Payment', amount: '-₹250', method: 'Wallet' },
    { id: 'TXN-4712', date: '05/03/2024', type: 'Payment', amount: '-₹180', method: 'Wallet' },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Profile Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="border-navy-200 shadow-md overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-navy-700 to-navy-900"></div>
                <div className="relative px-6 pb-6">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-navy-800 border-4 border-white flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="text-navy-700 font-semibold mt-2">
                      Wallet Balance: ₹{user.walletBalance || 0}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 mt-6 text-center">
                    <div className="bg-navy-50 rounded-lg px-2 py-3">
                      <p className="text-sm text-gray-500">Orders</p>
                      <p className="font-bold text-navy-800">23</p>
                    </div>
                    <div className="bg-navy-50 rounded-lg px-2 py-3">
                      <p className="text-sm text-gray-500">Spent</p>
                      <p className="font-bold text-navy-800">₹4,250</p>
                    </div>
                    <div className="bg-navy-50 rounded-lg px-2 py-3">
                      <p className="text-sm text-gray-500">Points</p>
                      <p className="font-bold text-navy-800">320</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full bg-navy-700 hover:bg-navy-800"
                      onClick={() => navigate('/wallet')}
                    >
                      Add Money to Wallet
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Tabs Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile Details</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet Transactions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your personal details</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 text-navy-700"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            className="flex items-center gap-1 text-red-500"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="flex items-center gap-1 text-green-600"
                            onClick={handleSave}
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-navy-500" />
                            <span>Full Name</span>
                          </div>
                          {isEditing ? (
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="border-navy-200 focus:border-navy-500 focus:ring-navy-500"
                            />
                          ) : (
                            <p className="font-medium">{formData.name}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-navy-500" />
                            <span>Email Address</span>
                          </div>
                          {isEditing ? (
                            <Input
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="border-navy-200 focus:border-navy-500 focus:ring-navy-500"
                            />
                          ) : (
                            <p className="font-medium">{formData.email}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-navy-500" />
                            <span>Phone Number</span>
                          </div>
                          {isEditing ? (
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="border-navy-200 focus:border-navy-500 focus:ring-navy-500"
                            />
                          ) : (
                            <p className="font-medium">{formData.phone || 'Not set'}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <School className="h-4 w-4 mr-2 text-navy-500" />
                            <span>Institution</span>
                          </div>
                          {isEditing ? (
                            <Input
                              name="institution"
                              value={formData.institution}
                              onChange={handleChange}
                              className="border-navy-200 focus:border-navy-500 focus:ring-navy-500"
                            />
                          ) : (
                            <p className="font-medium">{formData.institution}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-navy-500" />
                            <span>Join Date</span>
                          </div>
                          <p className="font-medium">{formData.joinDate}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Medal className="h-4 w-4 mr-2 text-navy-500" />
                            <span>Account Type</span>
                          </div>
                          <p className="font-medium capitalize">{user.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>View your order history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-navy-50">
                              <th className="px-4 py-3 text-left font-medium">Order ID</th>
                              <th className="px-4 py-3 text-left font-medium">Date</th>
                              <th className="px-4 py-3 text-left font-medium">Items</th>
                              <th className="px-4 py-3 text-left font-medium">Amount</th>
                              <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orderHistory.map((order) => (
                              <tr key={order.id} className="hover:bg-navy-50/50">
                                <td className="px-4 py-3 font-medium text-navy-700">{order.id}</td>
                                <td className="px-4 py-3">{order.date}</td>
                                <td className="px-4 py-3">{order.items}</td>
                                <td className="px-4 py-3">{order.amount}</td>
                                <td className="px-4 py-3">
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button 
                        variant="outline" 
                        className="text-navy-700 border-navy-300 hover:bg-navy-50"
                        onClick={() => navigate('/orders')}
                      >
                        View All Orders
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="wallet">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wallet Transactions</CardTitle>
                      <CardDescription>Track your wallet activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-navy-50">
                              <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
                              <th className="px-4 py-3 text-left font-medium">Date</th>
                              <th className="px-4 py-3 text-left font-medium">Type</th>
                              <th className="px-4 py-3 text-left font-medium">Amount</th>
                              <th className="px-4 py-3 text-left font-medium">Method</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {walletTransactions.map((transaction) => (
                              <tr key={transaction.id} className="hover:bg-navy-50/50">
                                <td className="px-4 py-3 font-medium text-navy-700">{transaction.id}</td>
                                <td className="px-4 py-3">{transaction.date}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    transaction.type === 'Deposit' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {transaction.type}
                                  </span>
                                </td>
                                <td className={`px-4 py-3 ${
                                  transaction.amount.startsWith('+') 
                                    ? 'text-green-600' 
                                    : 'text-amber-600'
                                }`}>
                                  {transaction.amount}
                                </td>
                                <td className="px-4 py-3">{transaction.method}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button 
                        variant="outline" 
                        className="text-navy-700 border-navy-300 hover:bg-navy-50"
                        onClick={() => navigate('/wallet')}
                      >
                        View All Transactions
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
