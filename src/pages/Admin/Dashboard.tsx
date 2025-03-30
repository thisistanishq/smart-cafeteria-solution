
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/NavBar';
import { useApp } from '@/context/AppContext';
import { inventoryService, profileService, orderService, aiService } from '@/services/supabase';
import { InventoryItem } from '@/types';
import { motion } from 'framer-motion';

// 3D visualization with Three.js
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Text } from '@react-three/drei';

// Custom 3D component for sales visualization
const SalesVisualization = ({ data }: { data: any[] }) => {
  // Normalize data for visualization
  const maxValue = Math.max(...data.map(item => item.value));
  const normalizedData = data.map(item => ({
    ...item,
    normalizedValue: item.value / maxValue
  }));
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} />
      
      {normalizedData.map((item, index) => (
        <group key={index} position={[index * 2 - (normalizedData.length - 1), 0, 0]}>
          <mesh position={[0, item.normalizedValue * 2, 0]}>
            <boxGeometry args={[1, item.normalizedValue * 4, 1]} />
            <meshStandardMaterial color="#15187C" />
          </mesh>
          <Text
            position={[0, -1.5, 0]}
            fontSize={0.5}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {item.name}
          </Text>
          <Text
            position={[0, item.normalizedValue * 4 + 1, 0]}
            fontSize={0.4}
            color="#15187C"
            anchorX="center"
            anchorY="middle"
          >
            {item.value}
          </Text>
        </group>
      ))}
    </>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApp();
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<any>({
    inventoryRecommendations: [],
    salesPredictions: null,
    isLoading: true,
    error: null
  });
  
  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    // Fetch data
    const fetchData = async () => {
      try {
        // Fetch inventory
        const { data: inventoryData } = await inventoryService.getAllInventory();
        if (inventoryData) {
          setInventoryItems(inventoryData);
          // Find low stock items
          setLowStockItems(
            inventoryData.filter(item => item.quantity <= (item.thresholdLevel || 10))
          );
        }
        
        // Fetch orders
        const { data: ordersData } = await orderService.getAllOrders();
        if (ordersData) {
          setOrders(ordersData);
        }
        
        // Fetch users
        const { data: usersData } = await profileService.getAllProfiles();
        if (usersData) {
          setUsers(usersData);
        }
        
        // Fetch AI recommendations
        try {
          const { data: inventoryRecommendations } = await aiService.getInventoryRecommendations();
          const { data: salesPredictions } = await aiService.getSalesPredictions();
          
          setAiRecommendations({
            inventoryRecommendations: inventoryRecommendations || [],
            salesPredictions: salesPredictions || null,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error("AI error:", error);
          setAiRecommendations({
            inventoryRecommendations: [],
            salesPredictions: null,
            isLoading: false,
            error: "Failed to load AI recommendations"
          });
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate, user]);
  
  // Sample data for charts
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];
  
  const categoryData = [
    { name: 'Meals', value: 400 },
    { name: 'Snacks', value: 300 },
    { name: 'Beverages', value: 300 },
    { name: 'Desserts', value: 200 },
  ];
  
  const COLORS = ['#15187C', '#3f44c9', '#4e53e6', '#7a7eff'];
  
  const predictionData = [
    { name: 'Week 1', actual: 4000, predicted: 4100 },
    { name: 'Week 2', actual: 3000, predicted: 3200 },
    { name: 'Week 3', actual: 5000, predicted: 4800 },
    { name: 'Week 4', actual: 4500, predicted: 4700 },
    { name: 'Week 5', actual: null, predicted: 6200 },
    { name: 'Week 6', actual: null, predicted: 5700 },
  ];
  
  const inventoryMovementData = [
    { name: 'Rice', in: 300, out: 250 },
    { name: 'Vegetables', in: 450, out: 400 },
    { name: 'Chicken', in: 200, out: 180 },
    { name: 'Spices', in: 150, out: 100 },
    { name: 'Dairy', in: 250, out: 220 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="cafeteria-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="transition-all"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <h3 className="text-2xl font-bold">₹45,231</h3>
                      <div className="flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">+12.5%</span>
                        <span className="text-xs text-muted-foreground ml-1">from last month</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-[#15187C]/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#15187C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="transition-all"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <h3 className="text-2xl font-bold">{orders.length || 0}</h3>
                      <div className="flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">+18.2%</span>
                        <span className="text-xs text-muted-foreground ml-1">from last month</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-[#15187C]/10 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-[#15187C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="transition-all"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <h3 className="text-2xl font-bold">{users.length || 0}</h3>
                      <div className="flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">+5.3%</span>
                        <span className="text-xs text-muted-foreground ml-1">from last month</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-[#15187C]/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-[#15187C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="transition-all"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Order</p>
                      <h3 className="text-2xl font-bold">₹242</h3>
                      <div className="flex items-center mt-1">
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-xs text-red-500">-3.1%</span>
                        <span className="text-xs text-muted-foreground ml-1">from last month</span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-[#15187C]/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-[#15187C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <CardTitle className="text-red-700">Low Stock Alert</CardTitle>
                  </div>
                  <CardDescription className="text-red-500">
                    {lowStockItems.length} items are running low on stock and may need replenishment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lowStockItems.slice(0, 3).map((item) => (
                      <Card key={item.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-red-500">Only {item.quantity} {item.unit} left</p>
                            </div>
                            <Button size="sm" className="bg-[#15187C] hover:bg-[#0e105a]">Restock</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                {lowStockItems.length > 3 && (
                  <CardFooter>
                    <Button variant="link" className="text-red-700">
                      View all {lowStockItems.length} low stock items
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          )}
          
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="border-[#15187C]/20 bg-[#15187C]/5">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-[#15187C] mr-2" />
                  <CardTitle className="text-[#15187C]">AI Insights & Recommendations</CardTitle>
                </div>
                <CardDescription>
                  Actionable insights and predictions powered by our AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="bg-white border-[#15187C]/20">
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">Sales Prediction</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="actual" 
                              stroke="#15187C" 
                              strokeWidth={2} 
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="predicted" 
                              stroke="#4e53e6" 
                              strokeDasharray="5 5" 
                              strokeWidth={2} 
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 p-4 bg-[#15187C]/5 rounded-lg">
                        <h4 className="font-medium text-[#15187C]">AI Recommendation</h4>
                        <p className="text-sm mt-1">
                          Based on prediction models, sales are expected to increase by 12% in the next two weeks. 
                          Consider increasing inventory for popular menu items like "Chicken Tikka Masala" and "Mango Lassi".
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white border-[#15187C]/20">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Menu Optimization</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Add Seasonal Items</h4>
                                <p className="text-sm text-gray-500">Customer trends show increased interest</p>
                              </div>
                              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                +15% Revenue
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Discount Low-performing Items</h4>
                                <p className="text-sm text-gray-500">5 items have low turnover rates</p>
                              </div>
                              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                Reduce Waste
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">Bundle Meal Deals</h4>
                                <p className="text-sm text-gray-500">Popular combo suggestions</p>
                              </div>
                              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                +8% Orders
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white border-[#15187C]/20">
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Staff Scheduling</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-[#15187C]">
                                  Monday Staff Coverage
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-[#15187C]">
                                  85%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#15187C]/10">
                              <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#15187C]"></div>
                            </div>
                          </div>
                          
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-red-500">
                                  Tuesday Staff Coverage (Understaffed)
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-red-500">
                                  65%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-100">
                              <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                            </div>
                          </div>
                          
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-[#15187C]">
                                  Wednesday Staff Coverage
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-[#15187C]">
                                  90%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#15187C]/10">
                              <div style={{ width: "90%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#15187C]"></div>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-medium text-yellow-700">AI Recommendation</h4>
                            <p className="text-sm mt-1 text-yellow-700">
                              Add 2 more staff members to Tuesday's lunch shift based on predicted customer traffic.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Tabs Section */}
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="3d">3D Visualization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                  <CardDescription>
                    Overview of sales performance over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Revenue']}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Bar dataKey="value" fill="#15187C" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>
                      Distribution of sales across different menu categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} orders`, 'Quantity']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Movement</CardTitle>
                    <CardDescription>
                      Tracking inventory inflow and usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={inventoryMovementData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="in" fill="#15187C" name="Purchased" />
                          <Bar dataKey="out" fill="#3f44c9" name="Used" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>
                    Current inventory levels and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-3 bg-muted/50 font-medium">
                      <div>Item</div>
                      <div>Category</div>
                      <div>Quantity</div>
                      <div>Threshold</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {inventoryItems.slice(0, 5).map((item) => (
                        <div key={item.id} className="grid grid-cols-5 p-3 items-center">
                          <div className="font-medium">{item.name}</div>
                          <div>{item.category}</div>
                          <div>{item.quantity} {item.unit}</div>
                          <div>{item.thresholdLevel}</div>
                          <div>
                            {item.quantity <= (item.thresholdLevel || 10) ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                Sufficient
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {inventoryItems.length > 5 && (
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline">View All Inventory Items</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Overview</CardTitle>
                  <CardDescription>
                    Summary of customer statistics and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <h3 className="text-3xl font-bold text-[#15187C]">{users.length || 0}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Total Users</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <h3 className="text-3xl font-bold text-[#15187C]">42%</h3>
                          <p className="text-sm text-muted-foreground mt-1">Returning Customers</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <h3 className="text-3xl font-bold text-[#15187C]">28</h3>
                          <p className="text-sm text-muted-foreground mt-1">New Users This Week</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Recent Users</h3>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-3 bg-muted/50 font-medium">
                        <div>Name</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Wallet Balance</div>
                      </div>
                      <div className="divide-y">
                        {users.slice(0, 5).map((user: any) => (
                          <div key={user.id} className="grid grid-cols-4 p-3 items-center">
                            <div className="font-medium">{user.name || 'N/A'}</div>
                            <div>{user.email}</div>
                            <div className="capitalize">{user.role?.replace('_', ' ') || 'User'}</div>
                            <div>₹{user.wallet_balance || 0}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="3d" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>3D Sales Visualization</CardTitle>
                  <CardDescription>
                    Interactive 3D visualization of your sales data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-50 rounded-lg border">
                    <Canvas>
                      <SalesVisualization data={salesData} />
                    </Canvas>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Click and drag to rotate. Scroll to zoom in/out.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
