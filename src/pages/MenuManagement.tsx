
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';
import { MenuItem } from '@/types';

const MenuManagement = () => {
  const { menuItems, isLoading, isAuthenticated, user, updateItemAvailability } = useApp();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  
  // Redirect if not authenticated or not cafeteria staff
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'cafeteria_staff')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  
  // Filter menu items
  useEffect(() => {
    let filtered = [...menuItems];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(item => 
        categoryFilter.includes(item.category)
      );
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(item => 
        statusFilter.includes(item.status)
      );
    }
    
    setFilteredItems(filtered);
  }, [menuItems, searchQuery, categoryFilter, statusFilter]);
  
  if (isLoading || !isAuthenticated || user?.role !== 'cafeteria_staff') {
    return <Loader text="Loading menu items..." />;
  }
  
  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map(item => item.category))
  );
  
  // Toggle category filter
  const toggleCategory = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(prev => prev.filter(c => c !== category));
    } else {
      setCategoryFilter(prev => [...prev, category]);
    }
  };
  
  // Toggle status filter
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(prev => prev.filter(s => s !== status));
    } else {
      setStatusFilter(prev => [...prev, status]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter([]);
    setStatusFilter([]);
  };
  
  // Handle availability toggle
  const handleAvailabilityToggle = async (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    await updateItemAvailability(itemId, newStatus as any);
  };
  
  // Format category name for display
  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Menu</h1>
            <Button
              className="bg-turmeric-500 hover:bg-turmeric-600"
              onClick={() => navigate('/staff/menu/add')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={categoryFilter.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    >
                      {formatCategory(category)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
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
                  {['available', 'unavailable', 'low_stock'].map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    >
                      <span className="capitalize">{status.replace('_', ' ')}</span>
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
          </div>
          
          {/* Active filters */}
          {(categoryFilter.length > 0 || statusFilter.length > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {searchQuery && (
                <Badge variant="secondary" className="flex gap-1">
                  Search: {searchQuery}
                </Badge>
              )}
              
              {categoryFilter.map(category => (
                <Badge key={category} variant="secondary" className="flex gap-1">
                  {formatCategory(category)}
                </Badge>
              ))}
              
              {statusFilter.map(status => (
                <Badge key={status} variant="secondary" className="capitalize flex gap-1">
                  {status.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Menu Items Table */}
          {filteredItems.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {formatCategory(item.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'available' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {item.status === 'available' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.status === 'available'}
                          onCheckedChange={() => handleAvailabilityToggle(item.id, item.status)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/menu/${item.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/staff/menu/edit/${item.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                                  // In a real app, we'd implement delete functionality
                                  alert('Delete functionality would be implemented in a real app');
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <AlertTriangle className="mx-auto h-10 w-10 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuManagement;
