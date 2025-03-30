
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingCart, 
  AlertTriangle,
  Utensils,
  FireExtinguisher,
  Leaf,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useApp } from '@/context/AppContext';
import { MenuItem } from '@/types';

const ItemDetail = () => {
  const { menuItems, addToCart, isLoading } = useApp();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Find the menu item
  const item = menuItems.find(item => item.id === id);
  
  if (isLoading) {
    return <Loader text="Loading item details..." />;
  }
  
  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="mb-6">The item you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/menu')}>
              Back to Menu
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions);
    navigate('/cart');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow">
        <div className="cafeteria-container py-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/menu')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Item Image */}
            <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
              
              {item.status !== 'available' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="destructive" className="flex gap-1 text-sm py-1 px-3">
                    <AlertTriangle size={16} />
                    {item.status === 'unavailable' ? 'Out of Stock' : 'Low Stock'}
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-turmeric-500 hover:bg-turmeric-600 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {item.rating}
                </Badge>
              </div>
            </div>
            
            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{item.name}</h1>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">₹{item.price}</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {item.prepTime} mins
                </Badge>
                {item.calories && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FireExtinguisher className="h-4 w-4" />
                    {item.calories} cal
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {item.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag === 'vegetarian' ? <Leaf className="h-3 w-3 mr-1" /> : null}
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Utensils className="h-4 w-4 text-gray-500" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Special Instructions</h3>
                <Textarea
                  placeholder="Add any special instructions or dietary requirements"
                  className="resize-none"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  className="w-full bg-turmeric-500 hover:bg-turmeric-600"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={item.status !== 'available'}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart • ₹{item.price * quantity}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ItemDetail;
