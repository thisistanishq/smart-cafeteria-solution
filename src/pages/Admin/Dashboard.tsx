
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Banknote, 
  TrendingUp,
  AlertTriangle,
  Trash2,
  BarChart3,
  ListPlus,
  RotateCcw,
  Search,
  Plus,
  Filter,
  BrainCircuit,
  FileWarning,
  Settings
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';
import { Loader } from '@/components/Loader';
import type { User, InventoryItem, MenuItem, Transaction, AIRecommendation, WasteLog, SalesAnalytics } from '@/types';
import { mockInventory } from '@/data/inventory';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Student',
    email: 'student@example.com',
    role: 'student',
    walletBalance: 500,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'user-2',
    name: 'Jane Staff',
    email: 'staff@example.com',
    role: 'staff',
    walletBalance: 1000,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 'user-3',
    name: 'Cafe Manager',
    email: 'cafe@example.com',
    role: 'cafeteria_staff',
    walletBalance: 0,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    walletBalance: 0,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
  }
];

// Transform mockInventory to match InventoryItem type
const inventoryData: InventoryItem[] = mockInventory.map(item => ({
  id: item.id,
  name: item.name,
  category: item.category,
  quantity: item.quantity,
  unit: item.unit,
  threshold: item.thresholdLevel || 5, // Default threshold
  costPerUnit: item.cost || 0,
  supplier: item.supplier || '',
  lastRestocked: item.lastRestocked || ''
}));

// Mock AI recommendations
const mockRecommendations: AIRecommendation[] = [
  {
    type: 'inventory',
    title: 'Low Rice Stock',
    description: 'Rice inventory is below threshold. Order 20kg more to meet demand for the next week.',
    impact: 'high',
    actionable: true
  },
  {
    type: 'menu',
    title: 'Add Seasonal Items',
    description: 'Consider adding mango-based desserts to the menu as mango season approaches.',
    impact: 'medium',
    actionable: true
  },
  {
    type: 'pricing',
    title: 'Adjust Dosa Prices',
    description: 'Masala Dosa is priced lower than market average. Consider increasing by 10%.',
    impact: 'medium',
    actionable: true
  }
];

// Mock waste logs
const mockWasteLogs: WasteLog[] = [
  {
    id: 'waste-1',
    itemId: 'inv-3',
    itemName: 'Potatoes',
    quantity: 2,
    unit: 'kg',
    wasteType: 'expired',
    reason: 'Past expiration date',
    recordedBy: 'user-3',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'waste-2',
    itemId: 'inv-9',
    itemName: 'Tomatoes',
    quantity: 1.5,
    unit: 'kg',
    wasteType: 'damaged',
    reason: 'Poor quality on delivery',
    recordedBy: 'user-3',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock sales analytics data
const mockSalesAnalytics: SalesAnalytics = {
  period: 'Last 7 days',
  revenue: 45600,
  orders: 324,
  averageOrderValue: 141,
  topSellingItems: [
    { itemId: 'item-1', name: 'Masala Dosa', quantity: 124, revenue: 7440 },
    { itemId: 'item-8', name: 'Hyderabadi Biryani', quantity: 98, revenue: 17640 },
    { itemId: 'item-11', name: 'Filter Coffee', quantity: 210, revenue: 6300 }
  ]
};

// Daily sales data for chart
const dailySalesData = [
  { day: 'Monday', revenue: 5800, orders: 42 },
  { day: 'Tuesday', revenue: 6200, orders: 45 },
  { day: 'Wednesday', revenue: 7100, orders: 51 },
  { day: 'Thursday', revenue: 6800, orders: 48 },
  { day: 'Friday', revenue: 8400, orders: 60 },
  { day: 'Saturday', revenue: 7200, orders: 52 },
  { day: 'Sunday', revenue: 4100, orders: 30 }
];

// Inventory levels data for chart
const inventoryLevelsData = inventoryData.map(item => ({
  name: item.name,
  current: item.quantity,
  threshold: item.thresholdLevel || 5,
  unit: item.unit
}));

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, isAuthenticated, user } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(inventoryData);
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockRecommendations);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(mockWasteLogs);
  const [salesData, setSalesData] = useState<SalesAnalytics>(mockSalesAnalytics);
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [newInventoryItem, setNewInventoryItem] = useState<Partial<InventoryItem>>({});
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  
  // Check authentication and admin role
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  
  // Calculate low stock items
  useEffect(() => {
    const lowStock = inventoryItems.filter(item => 
      item.quantity <= item.threshold
    );
    setLowStockItems(lowStock);
  }, [inventoryItems]);
  
  // Handle adding new inventory item
  const handleAddInventoryItem = () => {
    if (!newInventoryItem.name || !newInventoryItem.quantity || !newInventoryItem.category) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newInventoryItem.name,
      quantity: Number(newInventoryItem.quantity),
      unit: newInventoryItem.unit || 'pcs',
      category: newInventoryItem.category,
      threshold: Number(newInventoryItem.threshold) || 5,
      costPerUnit: Number(newInventoryItem.costPerUnit) || 0,
      supplier: newInventoryItem.supplier || '',
      lastRestocked: new Date().toISOString()
    };
    
    setInventoryItems(prev => [...prev, newItem]);
    setNewInventoryItem({});
    setIsAddingInventory(false);
    
    toast({
      title: "Inventory item added",
      description: `${newItem.name} has been added to inventory`
    });
  };
  
  // Handle recording waste
  const handleRecordWaste = (wasteData: Partial<WasteLog>) => {
    const newWasteLog: WasteLog = {
      id: `waste-${Date.now()}`,
      itemId: wasteData.itemId || '',
      itemName: wasteData.itemName || '',
      quantity: Number(wasteData.quantity) || 0,
      unit: wasteData.unit || '',
      wasteType: wasteData.wasteType as any || 'other',
      reason: wasteData.reason,
      recordedBy: user?.id,
      createdAt: new Date().toISOString()
    };
    
    // Update inventory quantity
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === wasteData.itemId 
          ? { ...item, quantity: Math.max(0, item.quantity - (Number(wasteData.quantity) || 0)) } 
          : item
      )
    );
    
    setWasteLogs(prev => [newWasteLog, ...prev]);
    
    toast({
      title: "Waste recorded",
      description: `${newWasteLog.quantity} ${newWasteLog.unit} of ${newWasteLog.itemName} recorded as waste`
    });
  };
  
  // Filter inventory items based on search
  const filteredInventory = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter users based on search
  const filteredUsers = usersList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return <Loader text="Loading admin dashboard..." />;
  }
  
  return (
    <div className="min-h-screen bg-[#0c1329] text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#131b38] h-screen fixed border-r border-[#384374] shadow-lg overflow-auto">
          <div className="p-6 border-b border-[#384374]">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Smart Cafeteria System</p>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedTab('dashboard')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'dashboard' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('inventory')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'inventory' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <Package className="h-5 w-5" />
                  <span>Inventory</span>
                  {lowStockItems.length > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {lowStockItems.length}
                    </Badge>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('users')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'users' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('financial')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'financial' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <Banknote className="h-5 w-5" />
                  <span>Financial</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('waste')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'waste' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Waste Management</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('analytics')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'analytics' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('ai')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'ai' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <BrainCircuit className="h-5 w-5" />
                  <span>AI Insights</span>
                  {recommendations.length > 0 && (
                    <Badge variant="default" className="ml-auto bg-blue-600">
                      {recommendations.length}
                    </Badge>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab('settings')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === 'settings' ? 'bg-[#192244] text-white' : 'text-gray-400 hover:bg-[#192244]/50 hover:text-white'}`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 mt-8 border-t border-[#384374]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-[#192244] hover:bg-[#131b38] text-white py-2 rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="ml-64 flex-1 p-8">
          {/* Dashboard Tab */}
          {selectedTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <div className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Banknote className="h-5 w-5 mr-2 text-green-400" />
                      Today's Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{salesData.revenue.toLocaleString()}</div>
                    <p className="text-gray-400 text-sm">+8% from yesterday</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{salesData.orders}</div>
                    <p className="text-gray-400 text-sm">Avg. ₹{salesData.averageOrderValue} per order</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-400" />
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{usersList.length}</div>
                    <p className="text-gray-400 text-sm">Across all user roles</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                      Low Stock Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{lowStockItems.length}</div>
                    <p className="text-gray-400 text-sm">Items below threshold</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Revenue Trend (7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailySalesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#384374" />
                        <XAxis dataKey="day" stroke="#8993b7" />
                        <YAxis stroke="#8993b7" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: '#131b38', 
                            borderColor: '#384374',
                            color: 'white' 
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#4f46e5" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Orders by Day</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailySalesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#384374" />
                        <XAxis dataKey="day" stroke="#8993b7" />
                        <YAxis stroke="#8993b7" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: '#131b38', 
                            borderColor: '#384374',
                            color: 'white' 
                          }}
                        />
                        <Legend />
                        <Bar dataKey="orders" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              {/* Top Selling Items */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                  <CardDescription className="text-gray-400">
                    Best performing menu items in the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableHead className="text-gray-400">Item</TableHead>
                        <TableHead className="text-gray-400">Quantity Sold</TableHead>
                        <TableHead className="text-gray-400">Revenue</TableHead>
                        <TableHead className="text-gray-400">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.topSellingItems.map((item) => (
                        <TableRow key={item.itemId} className="hover:bg-[#131b38] border-[#384374]">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.revenue.toLocaleString()}</TableCell>
                          <TableCell>
                            {Math.round((item.revenue / salesData.revenue) * 100)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* AI Recommendations Preview */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-bold">AI Insights</CardTitle>
                  <Button 
                    variant="link" 
                    className="text-blue-400"
                    onClick={() => setSelectedTab('ai')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.slice(0, 2).map((rec, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-4 rounded-lg border border-[#384374] p-4"
                      >
                        <div className={`p-2 rounded-full ${
                          rec.impact === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : rec.impact === 'medium' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-green-500/20 text-green-400'
                        }`}>
                          <BrainCircuit className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-sm text-gray-400">{rec.description}</p>
                        </div>
                        <Badge className={
                          rec.impact === 'high' 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : rec.impact === 'medium' 
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }>
                          {rec.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Inventory Management */}
          {selectedTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsAddingInventory(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              {/* Search and Filter Bar */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search inventory..."
                    className="pl-10 bg-[#131b38] border-[#384374] text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-[#384374] bg-[#131b38] hover:bg-[#192244] text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#131b38] border-[#384374] text-white">
                    <DropdownMenuLabel>Filter By Category</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#384374]" />
                    <DropdownMenuItem>All Categories</DropdownMenuItem>
                    <DropdownMenuItem>Grains</DropdownMenuItem>
                    <DropdownMenuItem>Lentils</DropdownMenuItem>
                    <DropdownMenuItem>Vegetables</DropdownMenuItem>
                    <DropdownMenuItem>Spices</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Inventory Tabs */}
              <Tabs defaultValue="all" className="text-white">
                <TabsList className="bg-[#131b38] mb-4">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="low-stock" className="relative">
                    <span>Low Stock</span>
                    {lowStockItems.length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {lowStockItems.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="well-stocked">Well Stocked</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-[#131b38] border-[#384374]">
                            <TableHead className="text-gray-400">Name</TableHead>
                            <TableHead className="text-gray-400">Category</TableHead>
                            <TableHead className="text-gray-400">Quantity</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Unit Cost</TableHead>
                            <TableHead className="text-gray-400">Total Value</TableHead>
                            <TableHead className="text-gray-400">Last Restocked</TableHead>
                            <TableHead className="text-gray-400">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInventory.map((item) => (
                            <TableRow key={item.id} className="hover:bg-[#131b38] border-[#384374]">
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span>{item.quantity} {item.unit}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  item.quantity <= item.threshold / 2
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                                    : item.quantity <= item.threshold
                                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                }>
                                  {item.quantity <= item.threshold / 2
                                    ? 'Critical'
                                    : item.quantity <= item.threshold
                                      ? 'Low'
                                      : 'Good'}
                                </Badge>
                              </TableCell>
                              <TableCell>₹{item.costPerUnit}</TableCell>
                              <TableCell>₹{(item.quantity * item.costPerUnit).toFixed(2)}</TableCell>
                              <TableCell>
                                {item.lastRestocked 
                                  ? new Date(item.lastRestocked).toLocaleDateString() 
                                  : 'Not available'}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                      <Filter className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-[#131b38] border-[#384374] text-white">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Update Stock</DropdownMenuItem>
                                    <DropdownMenuItem>View History</DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-[#384374]" />
                                    <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="low-stock" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardContent className="pt-6">
                      {lowStockItems.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-[#131b38] border-[#384374]">
                              <TableHead className="text-gray-400">Name</TableHead>
                              <TableHead className="text-gray-400">Category</TableHead>
                              <TableHead className="text-gray-400">Quantity</TableHead>
                              <TableHead className="text-gray-400">Threshold</TableHead>
                              <TableHead className="text-gray-400">Status</TableHead>
                              <TableHead className="text-gray-400">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {lowStockItems.map((item) => (
                              <TableRow key={item.id} className="hover:bg-[#131b38] border-[#384374]">
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity} {item.unit}</TableCell>
                                <TableCell>{item.threshold} {item.unit}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    item.quantity <= item.threshold / 2
                                      ? 'bg-red-500/20 text-red-400' 
                                      : 'bg-yellow-500/20 text-yellow-400'
                                  }>
                                    {item.quantity <= item.threshold / 2 ? 'Critical' : 'Low'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Restock
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-blue-500/10 inline-flex p-3 rounded-full">
                            <Package className="h-6 w-6 text-blue-500" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium">All items well-stocked</h3>
                          <p className="mt-2 text-sm text-gray-400">
                            There are no items below their threshold levels
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="well-stocked" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-[#131b38] border-[#384374]">
                            <TableHead className="text-gray-400">Name</TableHead>
                            <TableHead className="text-gray-400">Category</TableHead>
                            <TableHead className="text-gray-400">Quantity</TableHead>
                            <TableHead className="text-gray-400">Threshold</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryItems
                            .filter(item => item.quantity > item.threshold)
                            .map((item) => (
                              <TableRow key={item.id} className="hover:bg-[#131b38] border-[#384374]">
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity} {item.unit}</TableCell>
                                <TableCell>{item.threshold} {item.unit}</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-500/20 text-green-400">
                                    Good
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Add Inventory Item Dialog */}
              <Dialog open={isAddingInventory} onOpenChange={setIsAddingInventory}>
                <DialogContent className="bg-[#131b38] border-[#384374] text-white">
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Add a new item to the inventory management system
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter item name"
                          className="bg-[#192244] border-[#384374] text-white"
                          value={newInventoryItem.name || ''}
                          onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          onValueChange={(value) => setNewInventoryItem({...newInventoryItem, category: value})}
                        >
                          <SelectTrigger className="bg-[#192244] border-[#384374] text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                            <SelectItem value="Grains">Grains</SelectItem>
                            <SelectItem value="Lentils">Lentils</SelectItem>
                            <SelectItem value="Vegetables">Vegetables</SelectItem>
                            <SelectItem value="Fruits">Fruits</SelectItem>
                            <SelectItem value="Dairy">Dairy</SelectItem>
                            <SelectItem value="Meat">Meat</SelectItem>
                            <SelectItem value="Beverages">Beverages</SelectItem>
                            <SelectItem value="Spices">Spices</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Enter quantity"
                          className="bg-[#192244] border-[#384374] text-white"
                          value={newInventoryItem.quantity || ''}
                          onChange={(e) => setNewInventoryItem({...newInventoryItem, quantity: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select
                          onValueChange={(value) => setNewInventoryItem({...newInventoryItem, unit: value})}
                        >
                          <SelectTrigger className="bg-[#192244] border-[#384374] text-white">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="liter">liter</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="pcs">pcs</SelectItem>
                            <SelectItem value="box">box</SelectItem>
                            <SelectItem value="pack">pack</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="costPerUnit">Cost Per Unit (₹)</Label>
                        <Input
                          id="costPerUnit"
                          type="number"
                          placeholder="Enter cost"
                          className="bg-[#192244] border-[#384374] text-white"
                          value={newInventoryItem.costPerUnit || ''}
                          onChange={(e) => setNewInventoryItem({...newInventoryItem, costPerUnit: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="threshold">Low Stock Threshold</Label>
                        <Input
                          id="threshold"
                          type="number"
                          placeholder="Enter threshold"
                          className="bg-[#192244] border-[#384374] text-white"
                          value={newInventoryItem.threshold || ''}
                          onChange={(e) => setNewInventoryItem({...newInventoryItem, threshold: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier (Optional)</Label>
                      <Input
                        id="supplier"
                        placeholder="Enter supplier"
                        className="bg-[#192244] border-[#384374] text-white"
                        value={newInventoryItem.supplier || ''}
                        onChange={(e) => setNewInventoryItem({...newInventoryItem, supplier: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingInventory(false)}
                      className="border-[#384374] text-white hover:bg-[#192244]"
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddInventoryItem}
                    >
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* User Management */}
          {selectedTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="relative flex-grow mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  className="pl-10 bg-[#131b38] border-[#384374] text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Users Table */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableHead className="text-gray-400">User</TableHead>
                        <TableHead className="text-gray-400">Role</TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Wallet Balance</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-[#131b38] border-[#384374]">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#131b38]">
                                {user.profileImageUrl ? (
                                  <img 
                                    src={user.profileImageUrl} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                    <span className="text-white font-bold">{user.name.charAt(0)}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-400">ID: {user.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              user.role === 'admin' 
                                ? 'bg-purple-500/20 text-purple-400'
                                : user.role === 'cafeteria_staff'
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : user.role === 'staff'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-green-500/20 text-green-400'
                            }>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>₹{user.walletBalance}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                  <Filter className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#131b38] border-[#384374] text-white">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                <DropdownMenuItem>Adjust Balance</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#384374]" />
                                <DropdownMenuItem className="text-red-400">Deactivate Account</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Financial Management */}
          {selectedTab === 'financial' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Financial Management</h1>
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Banknote className="h-5 w-5 mr-2 text-green-400" />
                      Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹184,500</div>
                    <p className="text-gray-400 text-sm">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                      Profit Margin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">32%</div>
                    <p className="text-gray-400 text-sm">+5% from last month</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Package className="h-5 w-5 mr-2 text-yellow-400" />
                      Inventory Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹72,430</div>
                    <p className="text-gray-400 text-sm">Across {inventoryItems.length} items</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Revenue Chart */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                  <CardDescription className="text-gray-400">
                    Financial performance over the last 12 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', revenue: 92500 },
                        { month: 'Feb', revenue: 98700 },
                        { month: 'Mar', revenue: 106400 },
                        { month: 'Apr', revenue: 112800 },
                        { month: 'May', revenue: 118900 },
                        { month: 'Jun', revenue: 132400 },
                        { month: 'Jul', revenue: 138200 },
                        { month: 'Aug', revenue: 142000 },
                        { month: 'Sep', revenue: 156800 },
                        { month: 'Oct', revenue: 164300 },
                        { month: 'Nov', revenue: 175600 },
                        { month: 'Dec', revenue: 184500 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#384374" />
                      <XAxis dataKey="month" stroke="#8993b7" />
                      <YAxis stroke="#8993b7" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#131b38', 
                          borderColor: '#384374',
                          color: 'white' 
                        }}
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4f46e5" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Expense Categories */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly expenses by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Ingredients</span>
                          <span>₹48,500 (55%)</span>
                        </div>
                        <Progress value={55} className="h-2 bg-[#131b38]" indicatorClassName="bg-blue-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Staff Salaries</span>
                          <span>₹22,000 (25%)</span>
                        </div>
                        <Progress value={25} className="h-2 bg-[#131b38]" indicatorClassName="bg-purple-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilities</span>
                          <span>₹8,800 (10%)</span>
                        </div>
                        <Progress value={10} className="h-2 bg-[#131b38]" indicatorClassName="bg-green-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Equipment Maintenance</span>
                          <span>₹5,280 (6%)</span>
                        </div>
                        <Progress value={6} className="h-2 bg-[#131b38]" indicatorClassName="bg-yellow-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Marketing</span>
                          <span>₹1,760 (2%)</span>
                        </div>
                        <Progress value={2} className="h-2 bg-[#131b38]" indicatorClassName="bg-red-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Miscellaneous</span>
                          <span>₹1,760 (2%)</span>
                        </div>
                        <Progress value={2} className="h-2 bg-[#131b38]" indicatorClassName="bg-orange-500" />
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-[#131b38] border-[#384374]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Total Monthly Expenses</h4>
                          <p className="text-sm text-gray-400">Dec 2023</p>
                        </div>
                        <div className="text-2xl font-bold">₹88,100</div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
              
              {/* Financial Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Generate and download financial reports for your records.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <FileWarning className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Budget Planning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Plan and manage your monthly budget allocations.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <FileWarning className="h-4 w-4 mr-2" />
                      Budget Planner
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Forecast</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      AI-powered financial forecasting for the next 3 months.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Generate Forecast
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Waste Management */}
          {selectedTab === 'waste' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Waste Management</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Record Waste
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#131b38] border-[#384374] text-white">
                    <DialogHeader>
                      <DialogTitle>Record Food Waste</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Log food waste to track inventory and monitor waste patterns
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemId">Item</Label>
                        <Select>
                          <SelectTrigger className="bg-[#192244] border-[#384374] text-white">
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                            {inventoryItems.map(item => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name} ({item.quantity} {item.unit} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="Enter quantity"
                            className="bg-[#192244] border-[#384374] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wasteType">Waste Type</Label>
                          <Select>
                            <SelectTrigger className="bg-[#192244] border-[#384374] text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                              <SelectItem value="expired">Expired</SelectItem>
                              <SelectItem value="damaged">Damaged</SelectItem>
                              <SelectItem value="excess">Excess</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Input
                          id="reason"
                          placeholder="Enter reason for waste"
                          className="bg-[#192244] border-[#384374] text-white"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" className="border-[#384374] text-white hover:bg-[#192244]">
                        Cancel
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Record Waste
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Waste Overview */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Waste Overview</CardTitle>
                  <CardDescription className="text-gray-400">
                    Total food waste recorded in the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Waste Value</p>
                          <p className="text-2xl font-bold">₹4,325</p>
                        </div>
                        <Banknote className="h-10 w-10 text-red-400 opacity-70" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Waste Quantity</p>
                          <p className="text-2xl font-bold">56.3 kg</p>
                        </div>
                        <Package className="h-10 w-10 text-yellow-400 opacity-70" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Most Wasted Item</p>
                          <p className="text-xl font-bold">Tomatoes</p>
                        </div>
                        <FileWarning className="h-10 w-10 text-orange-400 opacity-70" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Waste Percentage</p>
                          <p className="text-2xl font-bold">4.2%</p>
                        </div>
                        <RotateCcw className="h-10 w-10 text-blue-400 opacity-70" />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Waste by Category</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Vegetables</span>
                          <span>24.8 kg (44%)</span>
                        </div>
                        <Progress value={44} className="h-2 bg-[#131b38]" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Dairy</span>
                          <span>10.7 kg (19%)</span>
                        </div>
                        <Progress value={19} className="h-2 bg-[#131b38]" indicatorClassName="bg-blue-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Grains</span>
                          <span>8.4 kg (15%)</span>
                        </div>
                        <Progress value={15} className="h-2 bg-[#131b38]" indicatorClassName="bg-yellow-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Meat</span>
                          <span>7.3 kg (13%)</span>
                        </div>
                        <Progress value={13} className="h-2 bg-[#131b38]" indicatorClassName="bg-red-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Others</span>
                          <span>5.1 kg (9%)</span>
                        </div>
                        <Progress value={9} className="h-2 bg-[#131b38]" indicatorClassName="bg-purple-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Waste Log Table */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Waste Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Item</TableHead>
                        <TableHead className="text-gray-400">Quantity</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Reason</TableHead>
                        <TableHead className="text-gray-400">Recorded By</TableHead>
                        <TableHead className="text-gray-400">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wasteLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-[#131b38] border-[#384374]">
                          <TableCell>{new Date(log.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{log.itemName}</TableCell>
                          <TableCell>{log.quantity} {log.unit}</TableCell>
                          <TableCell>
                            <Badge className={
                              log.wasteType === 'expired' 
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : log.wasteType === 'damaged'
                                  ? 'bg-red-500/20 text-red-400'
                                  : log.wasteType === 'excess'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-gray-500/20 text-gray-400'
                            }>
                              {log.wasteType}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.reason || 'Not specified'}</TableCell>
                          <TableCell>Staff #{log.recordedBy?.substring(5) || 'Unknown'}</TableCell>
                          <TableCell>
                            {/* Calculate approximate value based on inventory item cost */}
                            {(() => {
                              const item = inventoryItems.find(i => i.id === log.itemId);
                              if (item) {
                                const value = item.costPerUnit * log.quantity;
                                return `₹${value.toFixed(2)}`;
                              }
                              return 'N/A';
                            })()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Analytics */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              
              {/* Date Range Selector */}
              <Card className="bg-[#192244] border-[#384374] text-white">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span>Date Range:</span>
                    </div>
                    <Select defaultValue="last7days">
                      <SelectTrigger className="bg-[#131b38] border-[#384374] text-white">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                        <SelectItem value="last30days">Last 30 Days</SelectItem>
                        <SelectItem value="thisMonth">This Month</SelectItem>
                        <SelectItem value="lastMonth">Last Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="md:ml-auto bg-blue-600 hover:bg-blue-700">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Sales Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{salesData.revenue.toLocaleString()}</div>
                    <p className="text-gray-400 text-sm">+14% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{salesData.orders}</div>
                    <p className="text-gray-400 text-sm">+8% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₹{salesData.averageOrderValue}</div>
                    <p className="text-gray-400 text-sm">+5% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">68%</div>
                    <p className="text-gray-400 text-sm">+2% from previous period</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sales Trends */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Sales Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    Hourly sales distribution to identify peak periods
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { hour: '7-8 AM', orders: 12, revenue: 1200 },
                        { hour: '8-9 AM', orders: 28, revenue: 2950 },
                        { hour: '9-10 AM', orders: 42, revenue: 4680 },
                        { hour: '10-11 AM', orders: 35, revenue: 3940 },
                        { hour: '11-12 PM', orders: 40, revenue: 4650 },
                        { hour: '12-1 PM', orders: 52, revenue: 6260 },
                        { hour: '1-2 PM', orders: 48, revenue: 5690 },
                        { hour: '2-3 PM', orders: 30, revenue: 3450 },
                        { hour: '3-4 PM', orders: 25, revenue: 2870 },
                        { hour: '4-5 PM', orders: 32, revenue: 3580 },
                        { hour: '5-6 PM', orders: 38, revenue: 4260 },
                        { hour: '6-7 PM', orders: 42, revenue: 4980 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#384374" />
                      <XAxis dataKey="hour" stroke="#8993b7" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8993b7" />
                      <YAxis yAxisId="right" orientation="right" stroke="#8993b7" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#131b38', 
                          borderColor: '#384374',
                          color: 'white' 
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="orders" fill="#4f46e5" name="Orders" />
                      <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Popular Items */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Popular Menu Items</CardTitle>
                  <CardDescription className="text-gray-400">
                    Top performing items based on order frequency and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableHead className="text-gray-400">Item</TableHead>
                        <TableHead className="text-gray-400">Orders</TableHead>
                        <TableHead className="text-gray-400">Revenue</TableHead>
                        <TableHead className="text-gray-400">Average Rating</TableHead>
                        <TableHead className="text-gray-400">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableCell className="font-medium">Masala Dosa</TableCell>
                        <TableCell>124</TableCell>
                        <TableCell>₹7,440</TableCell>
                        <TableCell>4.8/5</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-400">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +8%
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableCell className="font-medium">Hyderabadi Biryani</TableCell>
                        <TableCell>98</TableCell>
                        <TableCell>₹17,640</TableCell>
                        <TableCell>4.9/5</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-400">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12%
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableCell className="font-medium">Filter Coffee</TableCell>
                        <TableCell>210</TableCell>
                        <TableCell>₹6,300</TableCell>
                        <TableCell>4.8/5</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-400">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +5%
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableCell className="font-medium">Idli Sambar</TableCell>
                        <TableCell>156</TableCell>
                        <TableCell>₹7,800</TableCell>
                        <TableCell>4.5/5</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-500/20 text-yellow-400">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            0%
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-[#131b38] border-[#384374]">
                        <TableCell className="font-medium">Appam with Stew</TableCell>
                        <TableCell>78</TableCell>
                        <TableCell>₹7,410</TableCell>
                        <TableCell>4.7/5</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500/20 text-red-400">
                            <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                            -3%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Customer Analytics */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium mb-2">User Demographics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span>Students</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-2" indicatorClassName="bg-blue-500" />
                          
                          <div className="flex justify-between items-center text-sm">
                            <span>Staff</span>
                            <span>25%</span>
                          </div>
                          <Progress value={25} className="h-2" indicatorClassName="bg-green-500" />
                          
                          <div className="flex justify-between items-center text-sm">
                            <span>Visitors</span>
                            <span>10%</span>
                          </div>
                          <Progress value={10} className="h-2" indicatorClassName="bg-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium mb-2">Retention Rate</h4>
                        <div className="text-3xl font-bold mb-2">78%</div>
                        <p className="text-sm text-gray-400">
                          Percentage of customers who return for multiple orders in a month
                        </p>
                        <Progress value={78} className="h-2 mt-4" indicatorClassName="bg-purple-500" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#131b38] border-[#384374]">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium mb-2">Payment Methods</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span>Wallet</span>
                            <span>42%</span>
                          </div>
                          <Progress value={42} className="h-2" indicatorClassName="bg-blue-500" />
                          
                          <div className="flex justify-between items-center text-sm">
                            <span>UPI</span>
                            <span>35%</span>
                          </div>
                          <Progress value={35} className="h-2" indicatorClassName="bg-green-500" />
                          
                          <div className="flex justify-between items-center text-sm">
                            <span>Card</span>
                            <span>18%</span>
                          </div>
                          <Progress value={18} className="h-2" indicatorClassName="bg-yellow-500" />
                          
                          <div className="flex justify-between items-center text-sm">
                            <span>Cash</span>
                            <span>5%</span>
                          </div>
                          <Progress value={5} className="h-2" indicatorClassName="bg-red-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* AI Insights */}
          {selectedTab === 'ai' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">AI Insights</h1>
              <p className="text-gray-400">
                AI-powered recommendations and insights to optimize your operations and increase revenue
              </p>
              
              {/* AI Recommendations */}
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <Card 
                    key={idx} 
                    className={`bg-[#192244] border-[#384374] text-white shadow-lg transition-all hover:shadow-xl ${
                      rec.impact === 'high' ? 'border-l-4 border-l-red-500' :
                      rec.impact === 'medium' ? 'border-l-4 border-l-yellow-500' :
                      'border-l-4 border-l-green-500'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-full mr-4 ${
                          rec.impact === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : rec.impact === 'medium' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-green-500/20 text-green-400'
                        }`}>
                          <BrainCircuit className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{rec.title}</h3>
                            <Badge className={
                              rec.impact === 'high' 
                                ? 'bg-red-500/20 text-red-400' 
                                : rec.impact === 'medium' 
                                  ? 'bg-yellow-500/20 text-yellow-400' 
                                  : 'bg-green-500/20 text-green-400'
                            }>
                              {rec.impact} impact
                            </Badge>
                          </div>
                          <p className="text-gray-400 mb-4">{rec.description}</p>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-[#131b38] text-white">
                              {rec.type}
                            </Badge>
                            {rec.actionable && (
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                Take Action
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* AI Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                      Sales Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      AI-powered sales forecasting for the next week based on historical data, events, and weather.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Generate Forecast
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ListPlus className="h-5 w-5 mr-2 text-green-400" />
                      Menu Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Smart recommendations for menu changes, pricing, and new items based on customer preferences.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Optimize Menu
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-yellow-400" />
                      Inventory Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      AI-driven inventory management to predict needs, minimize waste, and optimize ordering.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Predict Needs
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* AI Chat Assistant */}
              <Card className="bg-[#192244] border-[#384374] text-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-purple-400" />
                    AI Business Assistant
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Ask anything about your business data, get reports, or request analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-[#131b38] p-4 rounded-lg max-h-60 overflow-y-auto space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4" />
                        </div>
                        <div className="bg-[#1c2a4a] p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            Hello! I'm your AI business assistant. How can I help optimize your cafeteria operations today?
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <div className="bg-[#2d375f] p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            What are our top selling items this week?
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">{user?.name?.charAt(0)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4" />
                        </div>
                        <div className="bg-[#1c2a4a] p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            This week's top selling items are:
                            <br />1. Hyderabadi Biryani - 98 orders (₹17,640)
                            <br />2. Masala Dosa - 124 orders (₹7,440)
                            <br />3. Filter Coffee - 210 orders (₹6,300)
                            <br /><br />Would you like me to generate a detailed report or provide recommendations based on these trends?
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ask a question about your business data..." 
                        className="bg-[#131b38] border-[#384374] text-white"
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Ask
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge className="bg-[#131b38] hover:bg-[#1c2a4a] cursor-pointer">
                        Predict tomorrow's sales
                      </Badge>
                      <Badge className="bg-[#131b38] hover:bg-[#1c2a4a] cursor-pointer">
                        Analyze inventory trends
                      </Badge>
                      <Badge className="bg-[#131b38] hover:bg-[#1c2a4a] cursor-pointer">
                        Suggest menu improvements
                      </Badge>
                      <Badge className="bg-[#131b38] hover:bg-[#1c2a4a] cursor-pointer">
                        Optimize staffing
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Settings */}
          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">System Settings</h1>
              
              <Tabs defaultValue="account" className="text-white">
                <TabsList className="bg-[#131b38] mb-4">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your account details and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#131b38]">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="text-white text-3xl font-bold">{user?.name?.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium">{user?.name}</h3>
                          <p className="text-gray-400">{user?.email}</p>
                          <p className="text-sm bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full inline-block mt-2">
                            {user?.role}
                          </p>
                        </div>
                        <Button variant="outline" className="ml-auto border-[#384374] hover:bg-[#131b38]">
                          Change Avatar
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input 
                              id="fullName" 
                              defaultValue={user?.name}
                              className="bg-[#131b38] border-[#384374] text-white" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              defaultValue={user?.email}
                              className="bg-[#131b38] border-[#384374] text-white" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input 
                            id="password" 
                            type="password" 
                            value="********"
                            className="bg-[#131b38] border-[#384374] text-white" 
                          />
                        </div>
                      </div>
                      
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your notification preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Notification settings content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-400">Receive system alerts via email</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Low Stock Alerts</h4>
                            <p className="text-sm text-gray-400">Get notified when inventory items are running low</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Financial Reports</h4>
                            <p className="text-sm text-gray-400">Receive daily and weekly financial reports</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">AI Insights</h4>
                            <p className="text-sm text-gray-400">Get notified about new AI-generated insights</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Save Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Customize how the dashboard looks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Appearance settings content */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#131b38] p-4 rounded-lg border-2 border-blue-600 flex items-center justify-center cursor-pointer">
                              <span>Dark Blue</span>
                            </div>
                            <div className="bg-[#1a1a2e] p-4 rounded-lg border border-[#384374] flex items-center justify-center cursor-pointer">
                              <span>Dark Purple</span>
                            </div>
                            <div className="bg-[#1c1c1c] p-4 rounded-lg border border-[#384374] flex items-center justify-center cursor-pointer">
                              <span>Dark Gray</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Dashboard Layout</Label>
                          <Select defaultValue="default">
                            <SelectTrigger className="bg-[#131b38] border-[#384374] text-white">
                              <SelectValue placeholder="Select layout" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="expanded">Expanded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Apply Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="system" className="mt-0">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Configure system-wide settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* System settings content */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger className="bg-[#131b38] border-[#384374] text-white">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="ta">Tamil</SelectItem>
                              <SelectItem value="te">Telugu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Date Format</Label>
                          <Select defaultValue="dd-mm-yyyy">
                            <SelectTrigger className="bg-[#131b38] border-[#384374] text-white">
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                              <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                              <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Data Backup</h4>
                            <p className="text-sm text-gray-400">Enable automatic daily data backups</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Analytics Retention Period</Label>
                          <Select defaultValue="90">
                            <SelectTrigger className="bg-[#131b38] border-[#384374] text-white">
                              <SelectValue placeholder="Select retention period" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b38] border-[#384374] text-white">
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Save System Settings
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
