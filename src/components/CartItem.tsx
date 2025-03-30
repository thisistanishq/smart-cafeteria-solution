
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl: string;
  specialInstructions?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  total,
  imageUrl,
  specialInstructions
}) => {
  const { updateCartItemQuantity, removeFromCart } = useApp();
  
  const handleQuantityChange = (amount: number) => {
    updateCartItemQuantity(id, quantity + amount);
  };
  
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <img 
        src={imageUrl} 
        alt={name} 
        className="h-16 w-16 object-cover rounded-md"
      />
      
      <div className="flex-grow">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">₹{price} per item</p>
        
        {specialInstructions && (
          <p className="text-xs text-muted-foreground mt-1">
            Note: {specialInstructions}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="w-8 text-center font-medium">{quantity}</span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="w-20 text-right font-medium">₹{total}</div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => removeFromCart(id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
