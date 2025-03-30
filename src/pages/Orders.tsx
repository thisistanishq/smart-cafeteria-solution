
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { OrderCard } from '@/components/OrderCard';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { orders, isLoading, isAuthenticated, user } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('active');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  if (isLoading || !isAuthenticated) {
    return <Loader text="Loading your orders..." />;
  }
  
  // Filter orders for the current user
  const userOrders = orders.filter(order => order.customerId === user?.id);
  
  // Active orders: confirmed, preparing, ready
  const activeOrders = userOrders.filter(order => 
    ['confirmed', 'preparing', 'ready'].includes(order.status)
  );
  
  // Past orders: completed, cancelled
  const pastOrders = userOrders.filter(order => 
    ['completed', 'cancelled'].includes(order.status)
  );
  
  // If no orders, show empty state
  if (userOrders.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow py-10">
          <div className="cafeteria-container">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet. Browse our menu to get started.
              </p>
              <Button 
                className="bg-turmeric-500 hover:bg-turmeric-600"
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          
          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger 
                value="active"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Active Orders
                {activeOrders.length > 0 && (
                  <span className="ml-1 rounded-full bg-turmeric-100 text-turmeric-600 px-2 py-0.5 text-xs font-medium">
                    {activeOrders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="past"
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Order History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <AlertTriangle className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active orders</h3>
                  <p className="text-gray-500 mb-4">
                    You don't have any active orders at the moment.
                  </p>
                  <Button 
                    onClick={() => navigate('/menu')}
                    className="bg-turmeric-500 hover:bg-turmeric-600"
                  >
                    Place an Order
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No order history</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't completed any orders yet.
                  </p>
                  <Button 
                    onClick={() => navigate('/menu')}
                    className="bg-turmeric-500 hover:bg-turmeric-600"
                  >
                    Place Your First Order
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
