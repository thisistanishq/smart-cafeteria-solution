
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { UserManagement } from '@/components/Admin/UserManagement';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertCircle,
  BarChart3,
  Utensils
} from 'lucide-react';
import { adminService } from '@/services/adminService';

// Chart component imports
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

// Colors for charts
const COLORS = ['#15187C', '#1976D2', '#63A4FF', '#83C3FF', '#B9DEFF'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for analytics data
  const [salesData, setSalesData] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [wasteData, setWasteData] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    sales: true,
    inventory: true,
    waste: true,
    recommendations: true
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales data
        const { data: salesResult, error: salesError } = await adminService.getSalesSummary();
        if (salesError) throw salesError;
        setSalesData(salesResult || []);
        setLoading(prev => ({ ...prev, sales: false }));
        
        // Fetch low stock alerts
        const { data: stockResult, error: stockError } = await adminService.getLowStockAlerts();
        if (stockError) throw stockError;
        setLowStockItems(stockResult || []);
        setLoading(prev => ({ ...prev, inventory: false }));
        
        // Fetch waste data
        const { data: wasteResult, error: wasteError } = await adminService.getWasteReports();
        if (wasteError) throw wasteError;
        setWasteData(wasteResult || []);
        setLoading(prev => ({ ...prev, waste: false }));
        
        // Fetch AI recommendations
        const { data: recResult, error: recError } = await adminService.getAIRecommendations();
        if (recError) throw recError;
        setRecommendations(recResult || []);
        setLoading(prev => ({ ...prev, recommendations: false }));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Failed to load dashboard data',
          description: 'Please refresh the page to try again.',
          variant: 'destructive',
        });
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Format sales data for chart
  const formatSalesData = () => {
    return salesData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: parseFloat(item.total_sales),
      orders: item.total_orders
    })).reverse();
  };
  
  // Format waste data for chart
  const formatWasteData = () => {
    return wasteData.map(item => ({
      date: new Date(item.date || item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      waste: parseFloat(item.total_waste || item.total_cost || 0)
    })).reverse();
  };
  
  // Format inventory data for chart
  const formatInventoryData = () => {
    const categories: { [key: string]: number } = {};
    
    lowStockItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += 1;
    });
    
    return Object.keys(categories).map(category => ({
      name: category,
      value: categories[category]
    }));
  };
  
  // Render recommendation cards
  const renderRecommendations = () => {
    if (loading.recommendations) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
        </div>
      );
    }
    
    if (!recommendations || recommendations.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No recommendations available at this time.
        </div>
      );
    }
    
    return recommendations.map((rec, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`mb-4 ${rec.priority === 1 ? 'border-red-500' : rec.priority === 2 ? 'border-orange-400' : 'border-blue-400'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              {rec.recommendation_type === 'inventory' && <Package className="w-4 h-4 mr-2" />}
              {rec.recommendation_type === 'waste' && <AlertCircle className="w-4 h-4 mr-2" />}
              {rec.recommendation_type === 'sales' && <DollarSign className="w-4 h-4 mr-2" />}
              {rec.recommendation_type?.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{rec.recommendation_text}</p>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };
  
  // Loading state
  if (loading.sales && loading.inventory && loading.waste && loading.recommendations) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto p-4 py-8">
          <h1 className="text-3xl font-bold text-[#15187C] mb-6">Admin Dashboard</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#15187C]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#15187C] mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#15187C] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-[#15187C] data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-[#15187C] data-[state=active]:text-white">
                Inventory
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-[#15187C] data-[state=active]:text-white">
                User Management
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground">Total Revenue</p>
                        <h3 className="text-2xl font-bold">
                          ₹{salesData.length > 0 ? 
                            salesData.reduce((sum, item) => sum + parseFloat(item.total_sales || '0'), 0).toFixed(2) :
                            '0.00'}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-[#15187C]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground">Total Orders</p>
                        <h3 className="text-2xl font-bold">
                          {salesData.length > 0 ? 
                            salesData.reduce((sum, item) => sum + parseInt(item.total_orders || '0'), 0) :
                            '0'}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground">Low Stock</p>
                        <h3 className="text-2xl font-bold">
                          {lowStockItems.length}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                        <Package className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground">Food Waste</p>
                        <h3 className="text-2xl font-bold">
                          ₹{wasteData.length > 0 ? 
                            wasteData.reduce((sum, item) => sum + parseFloat(item.total_waste || item.total_cost || '0'), 0).toFixed(2) :
                            '0.00'}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sales & Inventory Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Last 7 days sales performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading.sales ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                        </div>
                      ) : (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={formatSalesData()}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#15187C" 
                                fill="#15187C" 
                                fillOpacity={0.2} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>AI Recommendations</CardTitle>
                      <CardDescription>Smart insights and suggestions</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-64 overflow-y-auto">
                      {renderRecommendations()}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Low Stock & Waste Data */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Low Stock Items</CardTitle>
                      <CardDescription>Inventory requiring restock</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-72 overflow-y-auto px-0">
                      {loading.inventory ? (
                        <div className="flex justify-center items-center h-16">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#15187C]"></div>
                        </div>
                      ) : lowStockItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No low stock items at this time.
                        </div>
                      ) : (
                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {lowStockItems.map((item, index) => (
                                <tr key={item.id || index}>
                                  <td className="px-4 py-3 text-sm">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.category}</div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    {item.quantity} {item.unit}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      item.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                                      item.status === 'very_low' ? 'bg-orange-100 text-orange-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {item.status === 'out_of_stock' ? 'Out of Stock' :
                                       item.status === 'very_low' ? 'Very Low' : 'Low'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Food Waste Analysis</CardTitle>
                      <CardDescription>Last 7 days waste records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading.waste ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                        </div>
                      ) : wasteData.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No waste data recorded yet.
                        </div>
                      ) : (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={formatWasteData()}
                              margin={{ top: 10, right: 10, left: 0, bottom: 15 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="waste" fill="#F87171" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue & Orders</CardTitle>
                    <CardDescription>Daily performance trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading.sales ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={formatSalesData()}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" fill="#15187C" name="Revenue (₹)" />
                            <Bar yAxisId="right" dataKey="orders" fill="#4A72CF" name="Orders" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Waste Trend</CardTitle>
                    <CardDescription>Daily waste cost</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading.waste ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={formatWasteData()}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="waste" 
                              stroke="#F87171" 
                              fill="#F87171" 
                              fillOpacity={0.2} 
                              name="Waste Cost (₹)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock by Category</CardTitle>
                    <CardDescription>Category distribution of low stock items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading.inventory ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                      </div>
                    ) : lowStockItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No low stock items at this time.
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={formatInventoryData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {formatInventoryData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                    <CardDescription>Smart insights and suggestions</CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    {renderRecommendations()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Items</CardTitle>
                  <CardDescription>Items requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto px-0">
                  {loading.inventory ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                    </div>
                  ) : lowStockItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No low stock items at this time.
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {lowStockItems.map((item, index) => (
                            <tr key={item.id || index}>
                              <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                              <td className="px-4 py-3 text-sm">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-right">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                {item.threshold} {item.unit}
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                                  item.status === 'very_low' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status === 'out_of_stock' ? 'Out of Stock' :
                                   item.status === 'very_low' ? 'Very Low' : 'Low'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Food Waste Management</CardTitle>
                  <CardDescription>Track and analyze food waste</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto px-0">
                  {loading.waste ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#15187C]"></div>
                    </div>
                  ) : wasteData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No waste data recorded yet.
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Waste</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {wasteData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm font-medium">
                                {new Date(item.date || item.day).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                {(item.items?.length || '0')} items
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-medium">
                                ₹{parseFloat(item.total_waste || item.total_cost || '0').toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* User Management Tab */}
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
