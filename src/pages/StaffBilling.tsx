
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { NavBar } from '@/components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2, Printer, Check, FileText, Info } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { menuService, orderService } from '@/services/supabase';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// Receipt component for printing
const Receipt = React.forwardRef<HTMLDivElement, any>(
  ({ orderData, orderNumber, customerName, totalAmount, paymentMethod, taxRate, taxAmount, orderDate }, ref) => {
    return (
      <div ref={ref} className="p-8 max-w-md mx-auto bg-white" style={{ display: 'none' }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Smart Cafeteria</h2>
          <p className="text-xs text-gray-600">123 College Avenue, Campus Central</p>
          <p className="text-xs text-gray-600">Tel: (555) 123-4567</p>
          <p className="text-sm font-semibold mt-2">RECEIPT</p>
          <p className="text-xs text-gray-600">{orderDate}</p>
          <p className="text-xs font-medium mt-1">Order #: {orderNumber}</p>
        </div>
        
        <div className="mb-4 text-sm">
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>
        
        <div className="border-t border-b border-gray-200 py-2 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Item</th>
                <th className="text-center py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData?.map((item: OrderItem) => (
                <tr key={item.id} className="border-b border-dashed">
                  <td className="py-1">{item.name}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-1">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mb-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{(totalAmount - taxAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>TOTAL:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-600 mt-8">
          <p>Thank you for your order!</p>
          <p className="mt-1">Visit us again soon!</p>
          <p className="mt-4 text-[8px]">This receipt is generated electronically and is valid without signature.</p>
        </div>
      </div>
    );
  }
);

const StaffBilling = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [taxRate, setTaxRate] = useState(0.05); // 5% tax rate
  const [orderNumber, setOrderNumber] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Fetch menu items and categories on component mount
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        // Fetch menu items
        const { data: menuData, error: menuError } = await menuService.getAllMenuItems();
        if (menuError) throw menuError;
        
        if (menuData) {
          setMenuItems(menuData);
          setFilteredItems(menuData);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(menuData.map((item: any) => item.category)));
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast({
          title: 'Failed to load menu',
          description: 'Please try refreshing the page.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, [toast]);
  
  // Handle printing receipt
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onAfterPrint: () => {
      toast({
        title: "Receipt printed successfully",
        description: "A copy has been saved to your records.",
      });
    }
  });
  
  // Filter items when category or search query changes
  useEffect(() => {
    if (menuItems.length > 0) {
      let filtered = menuItems;
      
      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((item) => item.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((item) => 
          item.name.toLowerCase().includes(query) || 
          item.description?.toLowerCase().includes(query)
        );
      }
      
      setFilteredItems(filtered);
    }
  }, [selectedCategory, searchQuery, menuItems]);
  
  // Calculate totals
  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTaxAmount = () => {
    return calculateSubtotal() * taxRate;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };
  
  // Add item to order
  const addItemToOrder = (menuItem: any) => {
    if (!menuItem) return;
    
    // Check if item already exists in order
    const existingItem = orderItems.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      // Update quantity if already in order
      updateItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      setOrderItems([...orderItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }]);
    }
    
    // Show toast notification
    toast({
      title: "Item added",
      description: `${menuItem.name} added to order`,
    });
  };
  
  // Update item quantity
  const updateItemQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(id);
      return;
    }
    
    setOrderItems(orderItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Remove item from order
  const removeItemFromOrder = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "Item removed from order",
    });
  };
  
  // Generate random order number
  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${random}`;
  };
  
  // Handle order submission
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "Cannot create order",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Generate order number
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);
      
      // Prepare order data
      const orderData = {
        customer_name: 'Walk-in Customer',
        order_number: newOrderNumber,
        total_amount: calculateTotal(),
        status: 'completed',
        payment_method: paymentMethod,
        payment_status: 'completed',
      };
      
      // Create order items
      const orderItemsData = orderItems.map(item => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));
      
      // Save order to database
      const { data, error } = await orderService.createOrder(orderData, orderItemsData);
      
      if (error) throw error;
      
      toast({
        title: "Order completed",
        description: `Order #${newOrderNumber} has been processed`,
      });
      
      // Print receipt
      handlePrint();
      
      // Reset form
      setOrderItems([]);
      setPaymentMethod('cash');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error creating order",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  
  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };
  
  // Render menu items grid
  const renderMenuItems = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15187C]"></div>
        </div>
      );
    }
    
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No items found. Try a different category or search term.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              item.status !== 'available' ? 'opacity-50' : ''
            }`}
            onClick={() => item.status === 'available' && addItemToOrder(item)}
          >
            <CardContent className="p-4">
              <div 
                className="w-full h-24 bg-gray-100 rounded-md mb-2 bg-cover bg-center" 
                style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : 'none' }}
              />
              <h3 className="font-medium text-sm truncate">{item.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-bold">₹{item.price.toFixed(2)}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.status === 'available' && addItemToOrder(item);
                  }}
                  disabled={item.status !== 'available'}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {item.status !== 'available' && (
                <span className="text-xs text-red-500 mt-1 block">
                  {item.status === 'unavailable' ? 'Unavailable' : 'Low Stock'}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#15187C] mb-6">POS Billing System</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Menu Items</CardTitle>
                    <Input
                      className="w-64"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {renderCategoryTabs()}
                  {renderMenuItems()}
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.length > 0 ? (
                    <div className="space-y-4">
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orderItems.map(item => (
                              <tr key={item.id}>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  <div className="flex items-center justify-center space-x-2">
                                    <Button 
                                      size="icon"
                                      variant="outline"
                                      className="h-6 w-6 rounded-full p-0"
                                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button 
                                      size="icon"
                                      variant="outline"
                                      className="h-6 w-6 rounded-full p-0"
                                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                  <Button 
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                    onClick={() => removeItemFromOrder(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="space-y-2 p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax ({(taxRate * 100).toFixed(2)}%):</span>
                          <span>₹{calculateTaxAmount().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total:</span>
                          <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No items added to this order yet
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="wallet">Cafeteria Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                    onClick={handleSubmitOrder}
                    disabled={orderItems.length === 0}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Complete Order
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handlePrint}
                    disabled={orderItems.length === 0}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/staff/menu')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Menu Management
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/staff/orders')}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Hidden receipt for printing */}
      <Receipt 
        ref={receiptRef} 
        orderData={orderItems} 
        orderNumber={orderNumber}
        customerName="Walk-in Customer"
        totalAmount={calculateTotal()}
        paymentMethod={paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
        taxRate={taxRate}
        taxAmount={calculateTaxAmount()}
        orderDate={new Date().toLocaleString()}
      />
    </div>
  );
};

export default StaffBilling;
