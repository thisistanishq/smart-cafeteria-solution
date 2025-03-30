
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MenuItem } from '@/types';
import { useApp } from '@/context/AppContext';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
  };
  
  const handleCardClick = () => {
    navigate(`/menu/${item.id}`);
  };
  
  return (
    <Card 
      className="menu-card group h-full flex flex-col overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="menu-image transition-transform duration-300 group-hover:scale-105"
        />
        
        {item.status !== 'available' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="flex gap-1 text-sm py-1 px-3">
              <AlertTriangle size={16} />
              {item.status === 'unavailable' ? 'Out of Stock' : 'Low Stock'}
            </Badge>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-turmeric-500 hover:bg-turmeric-600 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {item.rating}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rating: {item.rating} / 5</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-bold mb-2">{item.name}</CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs capitalize">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{item.prepTime} mins</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="font-bold">₹{item.price}</span>
        
        <Button 
          variant="default"
          size="sm" 
          className="rounded-full bg-turmeric-500 hover:bg-turmeric-600"
          onClick={handleAddToCart}
          disabled={item.status !== 'available'}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};
