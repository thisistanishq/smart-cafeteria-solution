
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  History, 
  Settings,
  Edit,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const UserProfile = () => {
  const { isLoading, isAuthenticated, user, transactions, orders } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [activeTab, setActiveTab] = useState("profile");
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Set initial profile data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // In a real application, this would call an API to update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };
  
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'credit':
      case 'deposit':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/20">+</Badge>;
      case 'debit':
      case 'payment':
      case 'withdrawal':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/20">-</Badge>;
      case 'refund':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20">↩</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/20">?</Badge>;
    }
  };
  
  if (isLoading || !user) {
    return <Loader text="Loading profile..." />;
  }
  
  // Filter orders for this user
  const userOrders = orders.filter(order => order.customerId === user.id);
  const recentOrders = [...userOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  // Filter transactions for this user
  const userTransactions = transactions.filter(transaction => transaction.userId === user.id);
  const recentTransactions = [...userTransactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  return (
    <div className="min-h-screen bg-[#0c1329]">
      <NavBar />
      
      <main className="py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-white">User Profile</h1>
            <p className="text-gray-400 mb-8">View and manage your account information</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24 border-4 border-[#384374]">
                      {user.profileImageUrl ? (
                        <AvatarImage src={user.profileImageUrl} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="text-center">
                      <h2 className="text-xl font-bold">{user.name}</h2>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/20">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="bg-[#131b38] rounded-lg p-4 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">Wallet Balance</h3>
                        <button 
                          className="text-xs text-blue-400 hover:text-blue-300"
                          onClick={() => navigate('/wallet')}
                        >
                          Top Up
                        </button>
                      </div>
                      <div className="text-2xl font-bold">₹{user.walletBalance.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] hover:bg-[#131b38] justify-start"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile Information
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] hover:bg-[#131b38] justify-start"
                      onClick={() => setActiveTab("orders")}
                    >
                      <History className="mr-2 h-4 w-4" />
                      Order History
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] hover:bg-[#131b38] justify-start"
                      onClick={() => setActiveTab("transactions")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Transactions
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-[#384374] hover:bg-[#131b38] justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        Your personal information and preferences
                      </CardDescription>
                    </div>
                    
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        className="border-[#384374] hover:bg-[#131b38]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setIsEditing(false)}
                          className="border-[#384374] hover:bg-[#131b38]"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleSaveProfile}
                          className="border-[#384374] hover:bg-[#131b38]"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-400">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            className="bg-[#131b38] border-[#384374] text-white"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 rounded-md bg-[#131b38]">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{profileData.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-400">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="bg-[#131b38] border-[#384374] text-white"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 rounded-md bg-[#131b38]">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{profileData.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-400">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="bg-[#131b38] border-[#384374] text-white"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 rounded-md bg-[#131b38]">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{profileData.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#384374]">
                      <h3 className="text-lg font-medium mb-4">Account Overview</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-[#131b38] border-[#384374]">
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-400">Account Type</div>
                            <div className="text-lg font-medium">{user.role.replace('_', ' ')}</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-[#131b38] border-[#384374]">
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-400">Total Orders</div>
                            <div className="text-lg font-medium">{userOrders.length}</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-[#131b38] border-[#384374]">
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-400">Member Since</div>
                            <div className="text-lg font-medium">July 2023</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "orders" && (
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription className="text-gray-400">
                      Track and review your past orders
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {recentOrders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-[#131b38] border-[#384374]">
                            <TableHead className="text-gray-400">Order ID</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Amount</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentOrders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-[#131b38] border-[#384374]">
                              <TableCell className="font-medium">
                                #{order.id.substring(0, 8)}
                              </TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge className={`${
                                  order.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : order.status === 'cancelled'
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="border-[#384374] hover:bg-[#131b38]"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders found</h3>
                        <p className="text-sm text-gray-400 mb-6">
                          You haven't placed any orders yet
                        </p>
                        <Button 
                          onClick={() => navigate('/menu')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Browse Menu
                        </Button>
                      </div>
                    )}
                    
                    {recentOrders.length > 0 && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline"
                          className="border-[#384374] hover:bg-[#131b38]"
                          onClick={() => navigate('/orders')}
                        >
                          View All Orders
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "transactions" && (
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Wallet Transactions</CardTitle>
                    <CardDescription className="text-gray-400">
                      Review your wallet activities and transactions
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {recentTransactions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-[#131b38] border-[#384374]">
                            <TableHead className="text-gray-400">Transaction</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Amount</TableHead>
                            <TableHead className="text-gray-400">Description</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-[#131b38] border-[#384374]">
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getTransactionIcon(transaction.type)}
                                  <span className="font-medium">
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className={
                                transaction.type === 'credit' || transaction.type === 'deposit' || transaction.type === 'refund'
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }>
                                {(transaction.type === 'credit' || transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-')}₹{transaction.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{transaction.description || 'No description'}</TableCell>
                              <TableCell>
                                <Badge className={`${
                                  transaction.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : transaction.status === 'failed'
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                        <p className="text-sm text-gray-400 mb-6">
                          You haven't made any wallet transactions yet
                        </p>
                        <Button 
                          onClick={() => navigate('/wallet')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Go to Wallet
                        </Button>
                      </div>
                    )}
                    
                    {recentTransactions.length > 0 && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline"
                          className="border-[#384374] hover:bg-[#131b38]"
                          onClick={() => navigate('/wallet')}
                        >
                          View All Transactions
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "settings" && (
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications" className="block mb-1">
                              Email Notifications
                            </Label>
                            <p className="text-sm text-gray-400">
                              Receive order updates and promotional offers
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            id="email-notifications"
                            className="toggle toggle-primary"
                            defaultChecked
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="order-updates" className="block mb-1">
                              Order Status Updates
                            </Label>
                            <p className="text-sm text-gray-400">
                              Get notified when your order status changes
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            id="order-updates"
                            className="toggle toggle-primary"
                            defaultChecked
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketing" className="block mb-1">
                              Marketing Communications
                            </Label>
                            <p className="text-sm text-gray-400">
                              Receive special offers and promotions
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            id="marketing"
                            className="toggle toggle-primary"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-[#384374]">
                      <h3 className="text-lg font-medium">Security</h3>
                      
                      <Button
                        variant="outline"
                        className="w-full border-[#384374] hover:bg-[#131b38] text-left justify-start"
                      >
                        Change Password
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-[#384374] hover:bg-[#131b38] text-left justify-start"
                      >
                        Two-Factor Authentication
                      </Button>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-[#384374]">
                      <h3 className="text-lg font-medium">Danger Zone</h3>
                      
                      <Button
                        variant="destructive"
                        className="w-full"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        toast({
                          title: "Settings saved",
                          description: "Your account settings have been saved.",
                        });
                      }}
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
