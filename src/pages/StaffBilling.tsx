
import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Receipt,
  QrCode
} from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Order {
  id: string;
  customer: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  time: string;
  paymentMethod: string;
  orderNumber: string;
}

const generateRandomOrderNumber = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const StaffBilling = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const printBillRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => printBillRef.current,
    onAfterPrint: () => {
      toast({
        title: "Bill Printed Successfully",
        description: "The bill has been sent to the printer.",
      });
    },
  });
  
  // Sample orders data
  const orders: Order[] = [
    {
      id: "ord-001",
      customer: "Arjun Kumar",
      items: [
        { name: "Masala Dosa", price: 120, quantity: 2 },
        { name: "Filter Coffee", price: 40, quantity: 2 }
      ],
      total: 320,
      status: "completed",
      date: "2023-03-15",
      time: "12:30 PM",
      paymentMethod: "UPI",
      orderNumber: "12345"
    },
    {
      id: "ord-002",
      customer: "Priya Singh",
      items: [
        { name: "Veg Biryani", price: 180, quantity: 1 },
        { name: "Raita", price: 30, quantity: 1 },
        { name: "Sweet Lassi", price: 60, quantity: 1 }
      ],
      total: 270,
      status: "pending",
      date: "2023-03-15",
      time: "1:15 PM",
      paymentMethod: "Cash",
      orderNumber: "12346"
    },
    {
      id: "ord-003",
      customer: "Rahul Sharma",
      items: [
        { name: "Idli Plate", price: 80, quantity: 1 },
        { name: "Vada", price: 40, quantity: 2 },
        { name: "Sambar", price: 30, quantity: 1 }
      ],
      total: 190,
      status: "cancelled",
      date: "2023-03-14",
      time: "7:45 PM",
      paymentMethod: "Wallet",
      orderNumber: "12347"
    },
    {
      id: "ord-004",
      customer: "Ananya Patel",
      items: [
        { name: "Poori Bhaji", price: 110, quantity: 1 },
        { name: "Masala Chai", price: 30, quantity: 2 }
      ],
      total: 170,
      status: "completed",
      date: "2023-03-14",
      time: "9:20 AM",
      paymentMethod: "Card",
      orderNumber: "12348"
    },
    {
      id: "ord-005",
      customer: "Vikram Reddy",
      items: [
        { name: "Chole Bhature", price: 150, quantity: 1 },
        { name: "Sweet Lassi", price: 60, quantity: 1 }
      ],
      total: 210,
      status: "completed",
      date: "2023-03-13",
      time: "2:10 PM",
      paymentMethod: "UPI",
      orderNumber: "12349"
    }
  ];

  // Filter orders based on search query, status, and date
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.orderNumber.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Function to print a receipt for a specific order
  const printReceipt = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Function to handle the creation of a new bill
  const generateNewBill = () => {
    const newOrderNumber = generateRandomOrderNumber();
    toast({
      title: "New Bill Generated",
      description: `Bill #${newOrderNumber} has been created.`,
    });
    // In a real app, you would create a new order in the database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-navy-800">Billing System</h1>
          
          <Tabs defaultValue="billing">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="billing">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">New Bill</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="customer-name">Customer Name</Label>
                        <Input 
                          id="customer-name" 
                          placeholder="Enter customer name"
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input 
                          id="contact" 
                          placeholder="Enter contact number" 
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center h-20 border-2 border-navy-200 hover:border-navy-500 hover:bg-navy-50"
                        >
                          <div className="text-center">
                            <CreditCard className="h-6 w-6 mx-auto mb-1 text-navy-700" />
                            <span className="text-sm">Card</span>
                          </div>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center h-20 border-2 border-navy-200 hover:border-navy-500 hover:bg-navy-50"
                        >
                          <div className="text-center">
                            <QrCode className="h-6 w-6 mx-auto mb-1 text-navy-700" />
                            <span className="text-sm">UPI</span>
                          </div>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center h-20 border-2 border-navy-200 hover:border-navy-500 hover:bg-navy-50"
                        >
                          <div className="text-center">
                            <Receipt className="h-6 w-6 mx-auto mb-1 text-navy-700" />
                            <span className="text-sm">Cash</span>
                          </div>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center h-20 border-2 border-navy-200 hover:border-navy-500 hover:bg-navy-50"
                        >
                          <div className="text-center">
                            <AlertCircle className="h-6 w-6 mx-auto mb-1 text-navy-700" />
                            <span className="text-sm">Other</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Items</h3>
                        <Button variant="outline" size="sm">Add Item</Button>
                      </div>
                      
                      <div className="bg-navy-50 rounded-md p-4">
                        <p className="text-center text-gray-500">No items added yet</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Tax (GST 5%)</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹0.00</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="flex-1 bg-navy-700 hover:bg-navy-800"
                        onClick={generateNewBill}
                      >
                        Generate Bill
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-navy-500 text-navy-700 hover:bg-navy-50"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div 
                        key={order.id} 
                        className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-navy-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-xs text-gray-500">Order #{order.orderNumber}</p>
                          </div>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{order.date}, {order.time}</span>
                          <span className="font-semibold">₹{order.total}</span>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full text-navy-700 hover:bg-navy-50"
                    >
                      View All Transactions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Transaction History</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-navy-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input 
                        placeholder="Search by customer, order ID or number" 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                      />
                    </div>
                    
                    <div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-navy-50">
                          <th className="text-left py-3 px-4 text-sm font-medium">Order #</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Date & Time</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Customer</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Items</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="border-b border-gray-200 hover:bg-navy-50">
                            <td className="py-3 px-4 text-navy-700 font-medium">{order.orderNumber}</td>
                            <td className="py-3 px-4 text-sm">{order.date}<br/>{order.time}</td>
                            <td className="py-3 px-4">{order.customer}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                {order.items.map((item, idx) => (
                                  <span key={idx} className="text-sm">
                                    {item.quantity}x {item.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">₹{order.total}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                                {order.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                {order.status === 'cancelled' && <AlertCircle className="mr-1 h-3 w-3" />}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-navy-700 hover:bg-navy-100"
                                onClick={() => printReceipt(order)}
                              >
                                <Printer className="h-4 w-4 mr-1" />
                                Print
                              </Button>
                            </td>
                          </tr>
                        ))}
                        
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-gray-500">
                              No transactions found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Hidden receipt for printing */}
          <div className="hidden">
            <div ref={printBillRef} className="p-6 max-w-sm mx-auto bg-white">
              {selectedOrder && (
                <div className="text-sm">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold">Smart Cafeteria</h2>
                    <p>University of Technology Campus</p>
                    <p>Tel: +91 1234567890</p>
                  </div>
                  
                  <div className="border-t border-b border-gray-300 py-2 mb-4">
                    <p><strong>Receipt #:</strong> {selectedOrder.orderNumber}</p>
                    <p><strong>Date:</strong> {selectedOrder.date}</p>
                    <p><strong>Time:</strong> {selectedOrder.time}</p>
                    <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  </div>
                  
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left">Item</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="py-1">{item.name}</td>
                          <td className="py-1 text-right">{item.quantity}</td>
                          <td className="py-1 text-right">₹{item.price}</td>
                          <td className="py-1 text-right">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.total - Math.round(selectedOrder.total * 0.05)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%):</span>
                      <span>₹{Math.round(selectedOrder.total * 0.05)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-1 mt-1">
                      <span>Total:</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p>Thank you for your order!</p>
                    <p>Visit us again soon</p>
                  </div>
                  
                  <div className="text-center mt-4 text-xs text-gray-500">
                    <p>This is a computer-generated receipt.</p>
                    <p>No signature required.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffBilling;
