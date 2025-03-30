
import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MenuCard } from '@/components/MenuCard';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MenuCategory, MenuItem } from '@/types';

const Menu = () => {
  const { menuItems, isLoading } = useApp();
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('');
  
  // Filter and sort menu items
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
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        selectedCategories.includes(item.category)
      );
    }
    
    // Apply sorting
    if (sortOrder === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOrder === 'popular') {
      filtered.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    }
    
    setFilteredItems(filtered);
  }, [menuItems, searchQuery, selectedCategories, sortOrder]);
  
  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map(item => item.category))
  ) as MenuCategory[];
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortOrder('');
  };
  
  if (isLoading) {
    return <Loader text="Loading menu..." />;
  }
  
  // Format category name for display
  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-gradient-to-r from-yellow-100 to-amber-100 py-10">
          <div className="cafeteria-container">
            <h1 className="text-3xl font-bold mb-4">Explore Our Menu</h1>
            <p className="text-lg text-gray-700 mb-6">
              Discover authentic South Indian flavors prepared fresh daily
            </p>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for dishes, ingredients, or categories"
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
                        checked={selectedCategories.includes(category)}
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
                      <ChevronsUpDown className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === 'price-low'}
                      onCheckedChange={() => setSortOrder('price-low')}
                    >
                      Price: Low to High
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === 'price-high'}
                      onCheckedChange={() => setSortOrder('price-high')}
                    >
                      Price: High to Low
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === 'rating'}
                      onCheckedChange={() => setSortOrder('rating')}
                    >
                      Highest Rated
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === 'popular'}
                      onCheckedChange={() => setSortOrder('popular')}
                    >
                      Most Popular
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Active filters */}
            {(selectedCategories.length > 0 || sortOrder || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {searchQuery && (
                  <Badge variant="secondary" className="flex gap-1">
                    Search: {searchQuery}
                  </Badge>
                )}
                
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="flex gap-1">
                    {formatCategory(category)}
                  </Badge>
                ))}
                
                {sortOrder && (
                  <Badge variant="secondary" className="flex gap-1">
                    {sortOrder === 'price-low' && 'Price: Low to High'}
                    {sortOrder === 'price-high' && 'Price: High to Low'}
                    {sortOrder === 'rating' && 'Highest Rated'}
                    {sortOrder === 'popular' && 'Most Popular'}
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Menu items section */}
        <section className="py-10 bg-stone-50">
          <div className="cafeteria-container">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
