import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/Loader';
import { NavBar } from '@/components/NavBar';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { menuService } from '@/services/supabase';

const Scanner = () => {
  const { user, isAuthenticated, cart, addToCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Simulate QR scanning process
  const startScanning = () => {
    setIsScanning(true);
    setError(null);
    
    // Simulated scan after 2 seconds
    setTimeout(async () => {
      try {
        setIsLoading(true);
        
        // Mock QR scan - in real app, this ID would come from the QR scanner
        const mockMenuItemId = 'item-1'; 
        
        // Fix the getMenuItem call to use the correct number of parameters
        const { data, error } = await menuService.getMenuItem(mockMenuItemId);
        
        if (error) throw new Error(error.message);
        if (!data) throw new Error('Item not found');
        
        setScannedItem(data);
      } catch (err: any) {
        setError('Failed to scan item. Please try again.');
        console.error('Scan error:', err);
      } finally {
        setIsScanning(false);
        setIsLoading(false);
      }
    }, 2000);
  };
  
  const handleAddToCart = () => {
    if (scannedItem) {
      // Fixed: Call addToCart with the correct parameters (item, quantity, specialInstructions)
      addToCart(
        {
          id: scannedItem.id,
          name: scannedItem.name,
          price: scannedItem.price,
          imageUrl: scannedItem.image_url,
          category: scannedItem.category || 'other',
          description: scannedItem.description || '',
          ingredients: [],
          status: 'available',
          prepTime: scannedItem.preparation_time || 10,
        }, 
        1, // Quantity
        '' // Special instructions (empty)
      );
      
      navigate('/cart');
    }
  };
  
  if (isLoading) {
    return <Loader text="Loading item details..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="cafeteria-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="text-center bg-[#15187C] text-white">
              <CardTitle className="text-2xl">QR Code Scanner</CardTitle>
              <CardDescription className="text-gray-200">
                Scan a QR code to quickly add items to your cart
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {scannedItem ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Item Scanned Successfully!</h3>
                    <p className="text-gray-500">Would you like to add this to your cart?</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <img
                      src={scannedItem.image_url || 'https://via.placeholder.com/150'}
                      alt={scannedItem.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-medium">{scannedItem.name}</h4>
                    <p className="text-[#15187C] font-bold">₹{scannedItem.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setScannedItem(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-[#15187C] hover:bg-[#0e105a]"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="aspect-square max-w-[280px] mx-auto bg-gray-100 rounded-lg relative overflow-hidden">
                    {isScanning ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Animated scanner effect */}
                          <motion.div
                            className="absolute w-full h-1 bg-[#15187C] left-0"
                            initial={{ top: 0 }}
                            animate={{ top: '100%' }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "linear"
                            }}
                          />
                          
                          {/* QR code frame */}
                          <div className="w-48 h-48 border-2 border-[#15187C] rounded-lg"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <p className="text-gray-600 mb-2">
                            Tap the button below to start scanning a QR code
                          </p>
                          {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-[#15187C] hover:bg-[#0e105a]"
                    onClick={startScanning}
                    disabled={isScanning}
                  >
                    {isScanning ? 'Scanning...' : 'Start Scanning'}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      className="text-[#15187C]"
                      onClick={() => navigate('/menu')}
                    >
                      Browse Menu Instead
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Scanner;
