
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart as AreaChartIcon, 
  BarChart as BarChartIcon, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Calendar,
  Utensils,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';

// Mock data for dashboard
const salesData = [
  { name: 'Mon', value: 4800 },
  { name: 'Tue', value: 5200 },
  { name: 'Wed', value: 4900 },
  { name: 'Thu', value: 6800 },
  { name: 'Fri', value: 7200 },
  { name: 'Sat', value: 8400 },
  { name: 'Sun', value: 6500 }
];

const orderTrendData = [
  { name: 'Week 1', orders: 145, revenue: 12500 },
  { name: 'Week 2', orders: 160, revenue: 14200 },
  { name: 'Week 3', orders: 175, revenue: 15800 },
  { name: 'Week 4', orders: 190, revenue: 17500 }
];

const categoryData = [
  { name: 'Breakfast', value: 35 },
  { name: 'Lunch', value: 40 },
  { name: 'Dinner', value: 20 },
  { name: 'Snacks', value: 15 },
  { name: 'Beverages', value: 20 }
];

const wasteData = [
  { name: 'Week 1', food: 15, packaging: 5 },
  { name: 'Week 2', food: 12, packaging: 4 },
  { name: 'Week 3', food: 8, packaging: 6 },
  { name: 'Week 4', food: 5, packaging: 3 }
];

const lowStockItems = [
  { id: 1, name: 'Rice', category: 'Grains', quantity: 3, threshold: 5 },
  { id: 2, name: 'Urad Dal', category: 'Lentils', quantity: 1, threshold: 2 },
  { id: 3, name: 'Coffee Powder', category: 'Beverages', quantity: 0.5, threshold: 1 }
];

const COLORS = ['#eab308', '#ef4444', '#84cc16', '#0ea5e9', '#8b5cf6'];

const AdminDashboard = () => {
  const { isLoading, isAuthenticated, user } = useApp();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  
  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return <Loader text="Loading admin dashboard..." />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="p-2 bg-turmeric-100 rounded-md">
                  <DollarSign className="h-5 w-5 text-turmeric-500" />
                </div>
                <Badge variant="outline">Today</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹12,450</div>
                <p className="text-muted-foreground">Revenue</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from yesterday
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="p-2 bg-spice-100 rounded-md">
                  <ShoppingBag className="h-5 w-5 text-spice-500" />
                </div>
                <Badge variant="outline">Today</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-muted-foreground">Orders</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from yesterday
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="p-2 bg-curry-100 rounded-md">
                  <Users className="h-5 w-5 text-curry-500" />
                </div>
                <Badge variant="outline">Total</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,546</div>
                <p className="text-muted-foreground">Customers</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +24 new today
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="p-2 bg-turmeric-100 rounded-md">
                  <Calendar className="h-5 w-5 text-turmeric-500" />
                </div>
                <Badge variant="outline">This Month</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹2,85,720</div>
                <p className="text-muted-foreground">Monthly Revenue</p>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% from last month
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Daily revenue for the past week</CardDescription>
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
                      <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Trends</CardTitle>
                <CardDescription>Weekly order and revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={orderTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'orders' ? value : `₹${value}`, 
                          name === 'orders' ? 'Orders' : 'Revenue'
                        ]}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#ef4444" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#84cc16" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Waste Management</CardTitle>
                <CardDescription>Food and packaging waste trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={wasteData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="food" name="Food Waste (kg)" fill="#ef4444" />
                      <Bar dataKey="packaging" name="Packaging Waste (kg)" fill="#84cc16" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Alerts</CardTitle>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Low Stock Items
                </Badge>
              </div>
              <CardDescription>Items that need to be restocked soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map(item => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-red-100">
                        <Utensils className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} / {item.threshold}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current / Threshold
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
