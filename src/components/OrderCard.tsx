
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, XCircle, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { useApp } from '@/context/AppContext';

interface OrderCardProps {
  order: Order;
  showControls?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, showControls = false }) => {
  const navigate = useNavigate();
  const { cancelOrder, updateOrderStatus } = useApp();
  
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
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'ready':
        return <ShoppingBag className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
    }
  };
  
  const handleStatusChange = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    updateOrderStatus(order.id, newStatus as any);
  };
  
  const handleCardClick = () => {
    navigate(`/orders/${order.id}`);
  };
  
  const isOrderCancellable = !['completed', 'cancelled'].includes(order.status);
  
  const getNextStatus = (currentStatus: string) => {
    switch(currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return null;
    }
  };
  
  const nextStatus = getNextStatus(order.status);
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id.substring(6)}</CardTitle>
            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <Badge
            className={`flex items-center gap-1 capitalize ${getStatusColor(order.status)}`}
          >
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Items</span>
            <span className="text-sm font-medium">{order.items.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Total</span>
            <span className="text-sm font-medium">₹{order.totalAmount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Payment</span>
            <span className="text-sm font-medium capitalize">{order.paymentMethod}</span>
          </div>
          
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="flex justify-between text-sm">
              <span>Estimated Ready</span>
              <span className="font-medium">
                {formatDate(order.estimatedReadyTime)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {showControls ? (
          <div className="w-full flex gap-2">
            {nextStatus && (
              <Button 
                className="flex-1"
                onClick={(e) => handleStatusChange(e, nextStatus)}
              >
                Mark as {nextStatus}
              </Button>
            )}
            
            {isOrderCancellable && (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel Order
              </Button>
            )}
          </div>
        ) : (
          isOrderCancellable && (
            <Button 
              variant="outline" 
              className="w-full text-destructive"
              onClick={handleCancel}
            >
              Cancel Order
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};
