
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Printer, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Receipt, 
  CreditCard,
  Banknote,
  CheckCircle2,
  Layers,
  BarChart3,
  FileSpreadsheet,
  Clock,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService, orderService, inventoryService } from '@/services/supabase';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { NavBar } from '@/components/NavBar';
import { RazorpayButton } from '@/components/RazorpayButton';
import { useScroll } from 'framer-motion';

// Bill Receipt component to be printed
const BillReceipt = React.forwardRef(({ orderData, customerName, totalAmount, paymentMethod }, ref) => {
  if (!orderData) return null;
  
  const date = new Date();
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  
  return (
    <div ref={ref} className="p-6 bg-white max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">Smart Cafeteria</h1>
        <p className="text-sm text-gray-600">University Campus, Main Building</p>
        <p className="text-sm text-gray-600">Tel: +91 1234567890</p>
      </div>
      
      <div className="border-t border-b border-gray-300 py-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Invoice #: {Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
          <span>Date: {formattedDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Customer: {customerName || 'Walk-in Customer'}</span>
          <span>Time: {formattedTime}</span>
        </div>
      </div>
      
      <table className="w-full mb-4 text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-2">{item.name}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
              <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="border-t border-gray-300 pt-2 mb-6">
        <div className="flex justify-between mb-1">
          <span className="font-medium">Subtotal:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="font-medium">Tax (5%):</span>
          <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>₹{(totalAmount * 1.05).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="text-center text-sm mb-6">
        <p className="font-medium">Payment Method: {paymentMethod}</p>
        <p>Thank you for dining with us!</p>
      </div>
      
      <div className="text-center text-xs text-gray-500">
        <p>This is a computer-generated invoice</p>
        <p>Smart Cafeteria © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
});

const StaffBilling = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { scrollYProgress } = useScroll();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [printReceiptAfterPayment, setPrintReceiptAfterPayment] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  const receiptRef = useRef();
  
  // Check if authenticated and is cafeteria staff
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'cafeteria_staff')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Fetch menu items
  const { data: menuItems, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await menuService.getAllMenuItems();
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await menuService.getAllCategories();
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch inventory
  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await inventoryService.getAllInventory();
      if (error) throw error;
      return data;
    }
  });
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const { data, error } = await orderService.createOrder(
        orderData.order,
        orderData.orderItems
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
  
  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: async (inventory) => {
      const { data, error } = await inventoryService.updateInventoryItem(
        inventory.id,
        { quantity: inventory.newQuantity }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
  
  // Filter menu items based on search and category
  const filteredMenuItems = menuItems ? menuItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = category === 'all' || 
      (item.category_id && item.category_id === category);
    
    return matchesSearch && matchesCategory && item.status === 'available';
  }) : [];
  
  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    
    // Add animation effect
    toast({
      title: "Item Added",
      description: `${item.name} added to cart`,
      duration: 1500,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };
  
  // Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Handle print receipt
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${Date.now()}`,
    onAfterPrint: () => {
      if (orderComplete) {
        resetOrder();
      }
    }
  });
  
  // Process payment
  const processPayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to the cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingOrder(true);
    
    try {
      // Prepare order data
      const order = {
        customer_id: customerEmail ? null : null, // If we had customer accounts
        customer_name: customerName || 'Walk-in Customer',
        customer_email: customerEmail || null,
        total_amount: totalAmount,
        status: 'confirmed',
        payment_method: paymentMethod,
        payment_status: 'completed',
        special_instructions: specialInstructions
      };
      
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        special_instructions: null
      }));
      
      // Update inventory based on order
      // This is a simplified version - in a real app you'd update based on recipes
      if (inventory) {
        for (const item of cartItems) {
          // Find matching inventory items (in a real app, this would be based on recipes)
          const matchingInventory = inventory.find(inv => 
            inv.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
          );
          
          if (matchingInventory) {
            const newQuantity = Math.max(0, matchingInventory.quantity - item.quantity);
            await updateInventoryMutation.mutateAsync({
              id: matchingInventory.id,
              newQuantity
            });
            
            // Alert if inventory is low
            if (newQuantity <= matchingInventory.threshold) {
              toast({
                title: "Low Inventory Alert",
                description: `${matchingInventory.name} is below threshold level!`,
                variant: "destructive",
              });
            }
          }
        }
      }
      
      // Create order in database
      const orderData = await createOrderMutation.mutateAsync({ order, orderItems });
      
      setCurrentOrder({
        orderData: orderItems,
        customerName,
        totalAmount,
        paymentMethod
      });
      
      setOrderComplete(true);
      
      toast({
        title: "Order Successful",
        description: "Order has been placed successfully!",
        variant: "default",
      });
      
      // Print receipt if enabled
      if (printReceiptAfterPayment) {
        // Small delay to ensure the receipt is rendered
        setTimeout(() => {
          handlePrint();
        }, 300);
      }
    } catch (error) {
      console.error("Order processing error:", error);
      toast({
        title: "Order Failed",
        description: error.message || "There was an error processing your order",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOrder(false);
      setShowPaymentSheet(false);
    }
  };
  
  // Handle Razorpay payment success
  const handleRazorpaySuccess = (paymentId) => {
    // In a real app, update the order with the payment ID
    processPayment();
  };
  
  // Reset order after completion
  const resetOrder = () => {
    setCartItems([]);
    setCustomerName('');
    setCustomerEmail('');
    setSpecialInstructions('');
    setPaymentMethod('cash');
    setOrderComplete(false);
    setCurrentOrder(null);
  };
  
  // Menu item card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };
  
  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  if (isLoadingMenu || isLoadingCategories || isLoadingInventory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="cafeteria-container py-10">
          <h1 className="text-3xl font-bold mb-6">Billing System</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Loading menu items...</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-4" />
                          <Skeleton className="h-10 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Order</CardTitle>
                  <CardDescription>Loading cart...</CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#15187C] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      
      <div className="cafeteria-container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Calculator className="inline-block mr-2 h-7 w-7" /> 
            Smart Billing System
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/staff/orders')}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              View Orders
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/staff/menu')}
              className="flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Menu Management
            </Button>
            
            <Button 
              variant="default"
              className="bg-[#15187C] hover:bg-[#0e105a] flex items-center gap-2"
              onClick={handlePrint}
              disabled={!currentOrder}
            >
              <Printer className="h-4 w-4" />
              Print Last Receipt
            </Button>
          </motion.div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Menu items section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="menu" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Menu
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Reports
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu">
                <Card>
                  <CardHeader>
                    <CardTitle>Menu Items</CardTitle>
                    <CardDescription>
                      Add items to the customer's order
                    </CardDescription>
                    
                    {/* Search and filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search menu items..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <Select 
                        value={category} 
                        onValueChange={setCategory}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories?.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map(item => (
                          <motion.div 
                            key={item.id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="h-full"
                          >
                            <Card className="h-full flex flex-col justify-between">
                              <div>
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <Badge variant="outline">₹{item.price}</Badge>
                                  </div>
                                  {item.description && (
                                    <CardDescription className="line-clamp-2">
                                      {item.description}
                                    </CardDescription>
                                  )}
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <div className="flex flex-wrap gap-2">
                                    {item.veg ? (
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Veg</Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Non-Veg</Badge>
                                    )}
                                    {item.calories && (
                                      <Badge variant="outline">{item.calories} Cal</Badge>
                                    )}
                                    {item.preparation_time && (
                                      <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {item.preparation_time} min
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </div>
                              <CardFooter>
                                <motion.div 
                                  className="w-full"
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    onClick={() => addToCart(item)} 
                                    className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                                  >
                                    Add to Order
                                  </Button>
                                </motion.div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                          <Search className="h-10 w-10 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No matching items</h3>
                          <p className="text-gray-500 mb-4">
                            Try adjusting your search or filters
                          </p>
                          <Button onClick={() => {
                            setSearchTerm('');
                            setCategory('all');
                          }}>
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="inventory">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>
                      Track and manage inventory levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventory?.map(item => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>
                                {item.quantity <= item.threshold ? (
                                  <Badge className="bg-red-100 text-red-800">Low Stock</Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Reports</CardTitle>
                    <CardDescription>
                      View and generate sales reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium mb-1">Today's Sales</h3>
                            <p className="text-2xl font-bold text-[#15187C]">₹8,245</p>
                            <p className="text-sm text-green-600">+12% from yesterday</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium mb-1">Orders</h3>
                            <p className="text-2xl font-bold text-[#15187C]">42</p>
                            <p className="text-sm text-green-600">+8% from yesterday</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="text-lg font-medium mb-1">Average Order</h3>
                            <p className="text-2xl font-bold text-[#15187C]">₹196</p>
                            <p className="text-sm text-red-600">-2% from yesterday</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="bg-[#15187C] hover:bg-[#0e105a]">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Generate Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Cart section */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Customer Order</CardTitle>
                <CardDescription>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in order
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map(item => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-start border-b pb-3">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-red-500 hover:text-red-700"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Subtotal */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tax (5%):</span>
                      <span className="font-medium">₹{(totalAmount * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-lg">₹{(totalAmount * 1.05).toFixed(2)}</span>
                    </div>
                    
                    {/* Customer information */}
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label htmlFor="customerName">Customer Name (Optional)</Label>
                        <Input 
                          id="customerName"
                          placeholder="Enter customer name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
                        <Input 
                          id="customerEmail"
                          type="email"
                          placeholder="Enter customer email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialInstructions">Special Instructions</Label>
                        <Textarea 
                          id="specialInstructions"
                          placeholder="Any special instructions"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="pt-4 space-y-2">
                      <Button 
                        className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                        onClick={() => setShowPaymentSheet(true)}
                        disabled={cartItems.length === 0}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Complete Order
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setCartItems([])}
                        disabled={cartItems.length === 0}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Order
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Cart is Empty</h3>
                    <p className="text-gray-500">
                      Start adding items from the menu
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Payment Sheet */}
      <Sheet open={showPaymentSheet} onOpenChange={setShowPaymentSheet}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <SheetHeader>
            <SheetTitle>Complete Order</SheetTitle>
            <SheetDescription>
              Choose a payment method to complete the order
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <RadioGroup 
              defaultValue="cash" 
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center">
                  <Banknote className="mr-2 h-5 w-5 text-[#15187C]" />
                  Cash Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-[#15187C]" />
                  Card Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="flex items-center">
                  <img 
                    src="https://razorpay.com/build/browser/static/razorpay-logo.7d8a9ba.svg"
                    alt="Razorpay" 
                    className="mr-2 h-4"
                  />
                  Razorpay Online
                </Label>
              </div>
            </RadioGroup>
            
            <div className="flex items-center space-x-2 mt-6">
              <Switch 
                id="print-receipt" 
                checked={printReceiptAfterPayment}
                onCheckedChange={setPrintReceiptAfterPayment}
              />
              <Label htmlFor="print-receipt">Print receipt after payment</Label>
            </div>
            
            <div className="mt-8 space-y-3">
              {paymentMethod === 'razorpay' ? (
                <RazorpayButton 
                  amount={totalAmount * 1.05}
                  customerName={customerName || 'Customer'}
                  customerEmail={customerEmail || 'customer@example.com'}
                  onSuccess={handleRazorpaySuccess}
                />
              ) : (
                <Button 
                  className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                  onClick={processPayment}
                  disabled={isProcessingOrder}
                >
                  {isProcessingOrder ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete Payment
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPaymentSheet(false)}
                disabled={isProcessingOrder}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Success Dialog */}
      <Dialog 
        open={orderComplete} 
        onOpenChange={setOrderComplete}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Complete</DialogTitle>
            <DialogDescription>
              The order has been successfully processed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="bg-green-100 text-green-700 rounded-full p-3 mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Payment Received</h3>
            <p className="text-center text-gray-500 mb-4">
              Total Amount: ₹{(totalAmount * 1.05).toFixed(2)}
            </p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button 
              className="flex-1 bg-[#15187C] hover:bg-[#0e105a]"
              onClick={resetOrder}
            >
              <Save className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden Receipt for printing */}
      <div className="hidden">
        <BillReceipt 
          ref={receiptRef} 
          orderData={currentOrder?.orderData}
          customerName={currentOrder?.customerName}
          totalAmount={currentOrder?.totalAmount}
          paymentMethod={currentOrder?.paymentMethod}
        />
      </div>
    </div>
  );
};

export default StaffBilling;
