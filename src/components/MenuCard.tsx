
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MenuItem } from '@/types';
import { motion } from 'framer-motion';

interface MenuCardProps {
  item: MenuItem;
  isMobile?: boolean;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, isMobile = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    addToCart(
      item,
      1,
      ''
    );
  };
  
  if (isMobile) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/menu/${item.id}`)}
      >
        <Card className="border overflow-hidden cursor-pointer h-full">
          <div className="relative overflow-hidden">
            <img 
              src={item.imageUrl || 'https://via.placeholder.com/300'}
              alt={item.name}
              className="w-full aspect-square object-cover"
            />
            {item.status !== 'available' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
              <div className="text-sm font-bold whitespace-nowrap">
                ₹{item.price.toFixed(0)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{item.prepTime || 10} min</span>
              </div>
              <Badge className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200">
                {item.rating ? item.rating.toFixed(1) : '4.5'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Desktop version
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer h-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
        onClick={() => navigate(`/menu/${item.id}`)}
      >
        <div className="relative overflow-hidden h-48">
          <img 
            src={item.imageUrl || 'https://via.placeholder.com/300'}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {item.status !== 'available' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          
          {item.vegetarian && (
            <Badge 
              className="absolute top-2 left-2 bg-green-100 text-green-800 hover:bg-green-200"
            >
              Veg
            </Badge>
          )}
          
          {item.bestSeller && (
            <Badge 
              className="absolute top-2 right-2 bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              Best Seller
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2 flex justify-between items-start">
            <h3 className="font-bold text-lg">{item.name}</h3>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              {item.rating ? item.rating.toFixed(1) : '4.5'} ★
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {item.description || 'Delicious South Indian dish prepared with authentic spices and ingredients.'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="h-4 w-4" />
              <span>{item.prepTime || 10} min</span>
            </div>
            <p className="font-bold text-lg">₹{item.price.toFixed(2)}</p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Button 
              className="w-full bg-[#15187C] hover:bg-[#0e105a]"
              size="sm"
              onClick={handleAddToCart}
              disabled={item.status !== 'available'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
