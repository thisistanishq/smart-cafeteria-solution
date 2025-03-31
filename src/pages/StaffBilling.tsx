
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'framer-motion';
import { 
  Printer, 
  Search, 
  Receipt, 
  Download, 
  Clock, 
  Calendar, 
  FileText,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface OrderWithItems {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  completed_at: string | null;
  razorpay_payment_id: string | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

const BillTemplate = React.forwardRef<HTMLDivElement, { order: OrderWithItems }>((props, ref) => {
  const { order } = props;
  const orderDate = new Date(order.created_at);
  const orderNumber = `#${order.id.substring(0, 8)}`;
  
  return (
    <div ref={ref} className="p-8 bg-white text-black max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Smart Cafeteria</h1>
        <p className="text-sm">123 Campus Drive, Education City</p>
        <p className="text-sm">Tel: (123) 456-7890</p>
      </div>
      
      <div className="border-t border-b border-gray-300 py-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Order Number:</span>
          <span>{orderNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Date:</span>
          <span>{orderDate.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Time:</span>
          <span>{orderDate.toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Customer:</span>
          <span>{order.customer_name}</span>
        </div>
      </div>
      
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2">{item.name}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
              <td className="text-right py-2">₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Subtotal:</span>
          <span>₹{order.total_amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Tax (Included):</span>
          <span>₹{(order.total_amount * 0.05).toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2 font-bold">
          <span>Grand Total:</span>
          <span>₹{order.total_amount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Payment Method:</span>
          <span>{order.payment_method}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Payment Status:</span>
          <span>{order.payment_status}</span>
        </div>
        {order.razorpay_payment_id && (
          <div className="flex justify-between">
            <span className="font-semibold">Transaction ID:</span>
            <span className="text-sm">{order.razorpay_payment_id}</span>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm">
        <p>Thank you for your order!</p>
        <p>Visit us again soon.</p>
        <p className="mt-4">--- Smart Cafeteria ---</p>
      </div>
    </div>
  );
});

const StaffBilling = () => {
  const { isLoading } = useApp();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const billRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => billRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 200);
      });
    },
    onAfterPrint: () => setIsPrinting(false),
  });
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockOrders: OrderWithItems[] = Array.from({ length: 10 }, (_, i) => {
      const id = `${Math.random().toString(36).substring(2, 10)}`;
      const date = new Date();
      date.setHours(date.getHours() - i);
      
      const items = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => {
        const itemNames = ['Masala Dosa', 'Idli Sambar', 'Veg Biryani', 'Butter Naan', 'Paneer Curry'];
        const name = itemNames[Math.floor(Math.random() * itemNames.length)];
        const price = Math.floor(Math.random() * 150) + 50;
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        return {
          id: `item-${Math.random().toString(36).substring(2, 10)}`,
          name,
          quantity,
          price,
          total: price * quantity
        };
      });
      
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      const statuses = ['pending', 'completed', 'cancelled'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentStatuses = ['paid', 'pending', 'failed'];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      const paymentMethods = ['wallet', 'card', 'upi'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      return {
        id,
        customer_name: `Customer ${i + 1}`,
        customer_email: `customer${i + 1}@example.com`,
        total_amount: totalAmount,
        status,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        created_at: date.toISOString(),
        completed_at: status === 'completed' ? new Date(date.getTime() + 1000 * 60 * 15).toISOString() : null,
        razorpay_payment_id: Math.random() > 0.5 ? `pay_${Math.random().toString(36).substring(2, 10)}` : null,
        items
      };
    });
    
    setOrders(mockOrders);
    
    // Calculate summary stats
    const totalRev = mockOrders.reduce((sum, order) => {
      return order.payment_status === 'paid' ? sum + order.total_amount : sum;
    }, 0);
    
    setTotalRevenue(totalRev);
    setTotalOrders(mockOrders.length);
  }, []);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.payment_status === filterPayment;
    
    // Filter by selected date
    const orderDate = new Date(order.created_at).toISOString().split('T')[0];
    const matchesDate = orderDate === selectedDate;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });
  
  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const paymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (isLoading) {
    return <Loader text="Loading billing information..." />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0c1329]">
      <NavBar />
      
      <main className="flex-grow px-4 py-8 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-white">Billing Management</h1>
            <p className="text-gray-400 mb-8">View, filter, and print customer bills</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-[#192244] border-[#384374] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-[#4a5680]" />
                    Today's Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</h3>
                  <p className="text-sm text-gray-400">
                    From {totalOrders} orders
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#192244] border-[#384374] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#4a5680]" />
                    Completed Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-3xl font-bold">
                    {orders.filter(o => o.status === 'completed').length}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {Math.round((orders.filter(o => o.status === 'completed').length / totalOrders) * 100)}% completion rate
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-[#192244] border-[#384374] text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <XCircle className="h-5 w-5 mr-2 text-[#4a5680]" />
                    Payment Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-3xl font-bold">
                    {orders.filter(o => o.payment_status === 'failed').length}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {Math.round((orders.filter(o => o.payment_status === 'failed').length / totalOrders) * 100)}% failure rate
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders" className="text-white">
                <TabsList className="bg-[#131b38] border border-[#384374]">
                  <TabsTrigger value="orders" className="data-[state=active]:bg-[#192244]">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-[#192244]">
                    Transactions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="mt-4">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Orders List
                        </CardTitle>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Search by name or ID..."
                              className="pl-10 bg-[#131b38] border-[#384374] text-white"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          
                          <Input
                            type="date"
                            className="bg-[#131b38] border-[#384374] text-white"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between px-6 py-3 border-b border-[#384374]">
                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="border-[#384374] hover:bg-[#2d375f]">
                                <Filter className="h-4 w-4 mr-2" />
                                Status: {filterStatus === 'all' ? 'All' : filterStatus}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#192244] border-[#384374] text-white">
                              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                All
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                                Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                                Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                                Cancelled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="border-[#384374] hover:bg-[#2d375f]">
                                <Filter className="h-4 w-4 mr-2" />
                                Payment: {filterPayment === 'all' ? 'All' : filterPayment}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#192244] border-[#384374] text-white">
                              <DropdownMenuItem onClick={() => setFilterPayment('all')}>
                                All
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterPayment('paid')}>
                                Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterPayment('pending')}>
                                Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setFilterPayment('failed')}>
                                Failed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-sm text-gray-400">
                          Showing {filteredOrders.length} orders
                        </p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-[#212a4e] border-[#384374]">
                              <TableHead className="text-gray-300">Order ID</TableHead>
                              <TableHead className="text-gray-300">Customer</TableHead>
                              <TableHead className="text-gray-300">Time</TableHead>
                              <TableHead className="text-gray-300">Amount</TableHead>
                              <TableHead className="text-gray-300">Status</TableHead>
                              <TableHead className="text-gray-300">Payment</TableHead>
                              <TableHead className="text-gray-300 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders.length > 0 ? (
                              filteredOrders.map((order) => (
                                <TableRow 
                                  key={order.id} 
                                  className="hover:bg-[#212a4e] border-[#384374] cursor-pointer"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <TableCell className="font-medium">
                                    #{order.id.substring(0, 8)}
                                  </TableCell>
                                  <TableCell>{order.customer_name}</TableCell>
                                  <TableCell className="whitespace-nowrap">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3 text-gray-400" />
                                      <span>
                                        {new Date(order.created_at).toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={`${statusColor(order.status)} text-white border-0`}>
                                      {order.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={`${paymentStatusColor(order.payment_status)} text-white border-0`}>
                                      {order.payment_status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedOrder(order);
                                        setTimeout(() => handlePrint(), 100);
                                      }}
                                    >
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                                  No orders found matching your filters
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="transactions" className="mt-4">
                  <Card className="bg-[#192244] border-[#384374] text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Receipt className="h-5 w-5 mr-2" />
                        Transaction History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-[#212a4e] border-[#384374]">
                              <TableHead className="text-gray-300">Transaction ID</TableHead>
                              <TableHead className="text-gray-300">Type</TableHead>
                              <TableHead className="text-gray-300">Amount</TableHead>
                              <TableHead className="text-gray-300">Date</TableHead>
                              <TableHead className="text-gray-300">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders
                              .filter(o => o.razorpay_payment_id)
                              .map((order) => (
                                <TableRow key={order.id} className="hover:bg-[#212a4e] border-[#384374]">
                                  <TableCell className="font-medium">
                                    {order.razorpay_payment_id?.substring(0, 12)}...
                                  </TableCell>
                                  <TableCell>{order.payment_method}</TableCell>
                                  <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                                  <TableCell>
                                    {new Date(order.created_at).toLocaleDateString([], {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={`${paymentStatusColor(order.payment_status)} text-white border-0`}>
                                      {order.payment_status}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="order-first lg:order-last">
              <Card className="bg-[#192244] border-[#384374] text-white sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Bill Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrder ? (
                    <div className="space-y-4">
                      <div className="bg-white text-black rounded-lg p-4 overflow-hidden">
                        <div className="text-center mb-3">
                          <h3 className="text-lg font-bold">Order #{selectedOrder.id.substring(0, 8)}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedOrder.created_at).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity} × {item.name}</span>
                              <span>₹{item.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Payment Method</span>
                            <span>{selectedOrder.payment_method}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-[#212a4e] hover:bg-[#2d375f]"
                          onClick={handlePrint}
                          disabled={isPrinting}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Print Bill
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-[#384374] hover:bg-[#2d375f]"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="text-sm text-center text-gray-400">
                        <p>Need to generate a GST invoice?</p>
                        <Button 
                          variant="link" 
                          className="text-[#4a5680] hover:text-white p-0 h-auto"
                        >
                          Create Tax Invoice
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Receipt className="h-12 w-12 text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Bill Selected</h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Select an order from the list to view and print the bill
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Hidden printable bill template */}
          <div className="hidden">
            {selectedOrder && (
              <BillTemplate ref={billRef} order={selectedOrder} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StaffBilling;
