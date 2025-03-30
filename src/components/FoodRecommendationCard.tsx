
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem } from '@/types';

interface FoodRecommendationCardProps {
  item: MenuItem;
}

export const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({ item }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/menu/${item.id}`)}
    >
      <CardContent className="p-3 space-y-2">
        <div className="aspect-square w-full rounded-lg overflow-hidden mb-2">
          <img 
            src={item.imageUrl || 'https://via.placeholder.com/200'} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="font-bold text-base line-clamp-1">{item.name}</h3>
        
        <p className="text-sm text-gray-500 line-clamp-1">
          {item.description || 'Delicious South Indian dish'}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">₹{item.price.toFixed(0)}</span>
          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm font-medium">
            {item.rating ? item.rating.toFixed(1) : '4.5'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
