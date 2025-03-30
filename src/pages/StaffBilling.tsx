
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavBar } from '@/components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2, Printer, Check } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  special_instructions: string;
};

// Receipt component for printing
const Receipt = React.forwardRef<HTMLDivElement, any>(({ orderData, customerName, totalAmount, paymentMethod }, ref) => {
  return (
    <div ref={ref} className="p-8 max-w-md mx-auto bg-white" style={{ display: 'none' }}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Smart Cafeteria</h2>
        <p className="text-sm text-gray-600">Receipt</p>
        <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
      </div>
      
      <div className="mb-4">
        <p><strong>Customer:</strong> {customerName}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
      </div>
      
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {orderData?.map((item: OrderItem) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
              <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold">
            <td colSpan={3} className="text-right py-2">Total:</td>
            <td className="text-right py-2">₹{totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div className="text-center text-sm text-gray-600 mt-8">
        <p>Thank you for your order!</p>
        <p>Visit us again soon!</p>
      </div>
    </div>
  );
});

const StaffBilling = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([
    { id: '1', name: 'Butter Chicken', price: 250, available: true },
    { id: '2', name: 'Paneer Tikka', price: 220, available: true },
    { id: '3', name: 'Veg Biryani', price: 180, available: true },
    { id: '4', name: 'Masala Dosa', price: 120, available: true },
    { id: '5', name: 'Chole Bhature', price: 150, available: true },
  ]);
  const [selectedItemId, setSelectedItemId] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onAfterPrint: () => {
      toast({
        title: "Receipt printed successfully",
        description: "A copy has been saved to your records.",
      });
    }
  });
  
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const addItemToOrder = () => {
    if (!selectedItemId) return;
    
    const menuItem = menuItems.find(item => item.id === selectedItemId);
    if (!menuItem) return;
    
    // Check if item already exists in order
    const existingItem = orderItems.find(item => item.id === selectedItemId);
    
    if (existingItem) {
      // Update quantity if already in order
      updateItemQuantity({ id: existingItem.id, newQuantity: existingItem.quantity + 1 });
    } else {
      // Add new item
      setOrderItems([...orderItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      }]);
    }
    
    setSelectedItemId('');
  };
  
  const updateItemQuantity = ({ id, newQuantity }: { id: string, newQuantity: number }) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(id);
      return;
    }
    
    setOrderItems(orderItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItemFromOrder = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };
  
  const handleSubmitOrder = async () => {
    if (!customerName || orderItems.length === 0) {
      toast({
        title: "Unable to create order",
        description: "Please add customer details and at least one item",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real app, this would save to a database
      const orderData = {
        order: {
          customer_id: `cust-${Date.now()}`,
          customer_name: customerName,
          customer_email: customerEmail || 'guest@example.com',
          total_amount: calculateTotal(),
          status: 'completed',
          payment_method: paymentMethod,
          payment_status: 'paid',
          special_instructions: specialInstructions
        },
        orderItems: orderItems.map(item => ({
          ...item,
          order_id: `order-${Date.now()}`
        }))
      };
      
      // In a production app, save order to database here
      
      toast({
        title: "Order created successfully",
        description: `Order #${Date.now()} has been completed`,
      });
      
      // Print receipt
      handlePrint();
      
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setOrderItems([]);
      setPaymentMethod('cash');
      setSpecialInstructions('');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error creating order",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-6xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#15187C] mb-6">Staff Billing</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input 
                      id="customer-name" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Customer Email (Optional)</Label>
                    <Input 
                      id="customer-email" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter customer email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="special-instructions">Special Instructions (Optional)</Label>
                  <Input 
                    id="special-instructions" 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special instructions"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-lg font-medium">Total Amount</p>
                  <p className="text-3xl font-bold text-[#15187C]">₹{calculateTotal().toFixed(2)}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Items: {orderItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p className="text-sm text-gray-600">Payment: {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
                </div>
                
                <Button 
                  className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                  onClick={handleSubmitOrder}
                  disabled={orderItems.length === 0 || !customerName}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete Order
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handlePrint}
                  disabled={orderItems.length === 0}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </CardContent>
            </Card>
            
            {/* Menu Items */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select menu item" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuItems.map(item => (
                          <SelectItem key={item.id} value={item.id} disabled={!item.available}>
                            {item.name} - ₹{item.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={addItemToOrder}
                    disabled={!selectedItemId}
                    className="bg-[#15187C] hover:bg-[#0e105a]"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                {orderItems.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                  onClick={() => updateItemQuantity({ id: item.id, newQuantity: item.quantity - 1 })}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button 
                                  size="icon"
                                  variant="outline"
                                  className="h-6 w-6 rounded-full p-0"
                                  onClick={() => updateItemQuantity({ id: item.id, newQuantity: item.quantity + 1 })}
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items added to this order yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      {/* Hidden receipt for printing */}
      <Receipt 
        ref={receiptRef} 
        orderData={orderItems} 
        customerName={customerName} 
        totalAmount={calculateTotal()} 
        paymentMethod={paymentMethod} 
      />
    </div>
  );
};

export default StaffBilling;
