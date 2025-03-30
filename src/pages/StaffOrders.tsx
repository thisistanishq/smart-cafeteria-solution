
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { OrderCard } from '@/components/OrderCard';
import { useApp } from '@/context/AppContext';

const StaffOrders = () => {
  const { orders, isLoading, isAuthenticated, user } = useApp();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  
  // Redirect if not authenticated or not cafeteria staff
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'cafeteria_staff')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  
  if (isLoading || !isAuthenticated || user?.role !== 'cafeteria_staff') {
    return <Loader text="Loading orders..." />;
  }
  
  // Filter orders based on search and status filter
  const filterOrders = (orders: any[]) => {
    return orders.filter(order => {
      // Apply search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === '' || 
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower);
      
      // Apply status filter
      const matchesStatus = 
        statusFilter.length === 0 || 
        statusFilter.includes(order.status);
      
      return matchesSearch && matchesStatus;
    });
  };
  
  // Active orders: confirmed, preparing, ready
  const activeOrders = orders.filter(order => 
    ['confirmed', 'preparing', 'ready'].includes(order.status)
  );
  
  // Past orders: completed, cancelled
  const pastOrders = orders.filter(order => 
    ['completed', 'cancelled'].includes(order.status)
  );
  
  // Apply filters
  const filteredActiveOrders = filterOrders(activeOrders);
  const filteredPastOrders = filterOrders(pastOrders);
  
  // Toggle status filter
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter([]);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  'confirmed', 'preparing', 'ready', 'completed', 'cancelled'
                ].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  >
                    <span className="capitalize">{status}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
          
          {/* Active filters */}
          {(statusFilter.length > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchQuery && (
                <Badge variant="secondary" className="flex gap-1">
                  Search: {searchQuery}
                </Badge>
              )}
              
              {statusFilter.map(status => (
                <Badge key={status} variant="secondary" className="capitalize flex gap-1">
                  {status}
                </Badge>
              ))}
            </div>
          )}
          
          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger 
                value="active"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Active Orders
                {activeOrders.length > 0 && (
                  <Badge className="ml-1 bg-turmeric-500">
                    {activeOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Past Orders
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {filteredActiveOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActiveOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      showControls={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  {activeOrders.length > 0 ? (
                    <>
                      <AlertTriangle className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No matching orders</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters to see more results.
                      </p>
                      <Button onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No active orders</h3>
                      <p className="text-gray-500">
                        All orders have been completed or cancelled.
                      </p>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {filteredPastOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPastOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  {pastOrders.length > 0 ? (
                    <>
                      <AlertTriangle className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No matching orders</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters to see more results.
                      </p>
                      <Button onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </>
                  ) : (
                    <>
                      <RotateCw className="mx-auto h-10 w-10 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No completed orders</h3>
                      <p className="text-gray-500">
                        There are no completed or cancelled orders yet.
                      </p>
                    </>
                  )}
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

export default StaffOrders;
