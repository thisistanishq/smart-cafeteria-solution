
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Truck,
  Utensils,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';

const OrderDetail = () => {
  const { orders, cancelOrder, isLoading, isAuthenticated } = useApp();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Find the order
  const order = orders.find(o => o.id === id);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Calculate time remaining for active orders
  useEffect(() => {
    if (!order || !['confirmed', 'preparing', 'ready'].includes(order.status)) {
      return;
    }
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const estimatedReady = new Date(order.estimatedReadyTime);
      const createdAt = new Date(order.createdAt);
      
      const totalDuration = estimatedReady.getTime() - createdAt.getTime();
      const elapsed = now.getTime() - createdAt.getTime();
      const remaining = estimatedReady.getTime() - now.getTime();
      
      // Calculate progress percentage
      const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setProgressPercentage(Math.round(progress));
      
      // If time's up, return 0
      if (remaining <= 0) {
        return 0;
      }
      
      // Return remaining time in minutes
      return Math.ceil(remaining / (1000 * 60));
    };
    
    // Set initial values
    setTimeRemaining(calculateTimeRemaining());
    
    // Update every minute
    const intervalId = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      // If time's up, clear interval
      if (remaining === 0) {
        clearInterval(intervalId);
      }
    }, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [order]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  const getStatusMessage = () => {
    if (!order) return '';
    
    switch(order.status) {
      case 'pending':
        return 'Your order is being processed';
      case 'confirmed':
        return 'Your order has been confirmed and will be prepared soon';
      case 'preparing':
        return 'Your order is being prepared by our chefs';
      case 'ready':
        return 'Your order is ready for pickup';
      case 'completed':
        return 'Your order has been completed';
      case 'cancelled':
        return 'Your order has been cancelled';
      default:
        return 'Order status unknown';
    }
  };
  
  const getStatusIcon = () => {
    if (!order) return null;
    
    switch(order.status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'preparing':
        return <Utensils className="h-6 w-6 text-yellow-500" />;
      case 'ready':
        return <Truck className="h-6 w-6 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const handleCancel = async () => {
    if (!order) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder(order.id);
    }
  };
  
  if (isLoading) {
    return <Loader text="Loading order details..." />;
  }
  
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/orders')}>
              View Your Orders
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isOrderActive = ['confirmed', 'preparing', 'ready'].includes(order.status);
  const isOrderCancellable = !['completed', 'cancelled'].includes(order.status);
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">Order #{order.id.substring(6)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge
                      className={`capitalize px-3 py-1 ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Order status and progress */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-muted">
                      {getStatusIcon()}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{getStatusMessage()}</h3>
                      
                      {isOrderActive && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Order Progress</span>
                            {timeRemaining !== null && (
                              <span>
                                {timeRemaining > 0 
                                  ? `${timeRemaining} min${timeRemaining !== 1 ? 's' : ''} remaining` 
                                  : 'Ready any moment now'}
                              </span>
                            )}
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order timeline */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Order Timeline</h3>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div className="w-0.5 h-full bg-gray-200" />
                        </div>
                        <div>
                          <p className="font-medium">Order Placed</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {(order.status !== 'pending' && order.status !== 'cancelled') && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="w-0.5 h-full bg-gray-200" />
                          </div>
                          <div>
                            <p className="font-medium">Order Confirmed</p>
                            <p className="text-sm text-muted-foreground">
                              Your order was accepted by the cafeteria
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {(order.status === 'preparing' || order.status === 'ready' || order.status === 'completed') && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="w-0.5 h-full bg-gray-200" />
                          </div>
                          <div>
                            <p className="font-medium">Preparing</p>
                            <p className="text-sm text-muted-foreground">
                              Your food is being prepared
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {(order.status === 'ready' || order.status === 'completed') && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="w-0.5 h-full bg-gray-200" />
                          </div>
                          <div>
                            <p className="font-medium">Ready for Pickup</p>
                            <p className="text-sm text-muted-foreground">
                              Your order is ready to be collected
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {order.status === 'completed' && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">Completed</p>
                            <p className="text-sm text-muted-foreground">
                              {order.completedAt 
                                ? `Delivered on ${formatDate(order.completedAt)}`
                                : 'Your order has been delivered'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {order.status === 'cancelled' && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                          </div>
                          <div>
                            <p className="font-medium">Cancelled</p>
                            <p className="text-sm text-muted-foreground">
                              Your order has been cancelled
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                {isOrderCancellable && (
                  <CardFooter>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={handleCancel}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Order
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div 
                        key={`${item.itemId}-${index}`}
                        className="flex justify-between py-3 border-b last:border-b-0"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="outline">x{item.quantity}</Badge>
                          </div>
                          
                          {item.specialInstructions && (
                            <div className="flex items-start gap-1 text-sm text-muted-foreground mt-1">
                              <MessageSquare className="h-3 w-3 mt-0.5" />
                              <span>{item.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">₹{item.total}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <Badge 
                        variant={order.paymentStatus === 'completed' ? 'default' : 'destructive'}
                        className="capitalize"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  {order.specialInstructions && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-1">Special Instructions</h4>
                        <p className="text-sm">{order.specialInstructions}</p>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/orders')}
                  >
                    Back to My Orders
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetail;
