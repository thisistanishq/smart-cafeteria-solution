
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrScanner } from 'react-qr-reader';
import { 
  QrCode, 
  ArrowLeft, 
  Info, 
  ShoppingCart, 
  X, 
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const Scanner = () => {
  const { menuItems, addToCart } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Handle QR code scanning
  useEffect(() => {
    if (scannedData) {
      try {
        // Try to parse the QR data as a menu item
        const data = JSON.parse(scannedData);
        
        if (data.id && data.type === 'menu_item') {
          // Find the item in our menu
          const item = menuItems.find(i => i.id === data.id);
          
          if (item) {
            setScannedItem(item);
            toast({
              title: "Item found",
              description: `${item.name} has been scanned successfully`,
            });
          } else {
            // Create a placeholder item if not found
            setScannedItem({
              id: data.id,
              name: data.name || 'Unknown Item',
              price: data.price || 0,
              imageUrl: data.imageUrl || '/placeholder-food.jpg',
              category: data.category || 'other',
              description: data.description || 'No description available',
              ingredients: [],
              status: 'available',
              prepTime: data.prepTime || 10,
              veg: data.veg || true
            });
            
            toast({
              title: "Item scanned",
              description: `${data.name || 'Item'} was found in QR code`,
            });
          }
        } else {
          toast({
            title: "Invalid QR code",
            description: "This QR code doesn't contain a valid menu item",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error parsing QR data:', error);
        toast({
          title: "Error scanning QR code",
          description: "The QR code couldn't be processed",
          variant: "destructive",
        });
      }
    }
  }, [scannedData, menuItems, toast]);

  const handleScan = (result: any) => {
    if (result) {
      setScannedData(result.text);
      setScanning(false);
    }
  };

  const handleError = (error: any) => {
    console.error('QR scan error:', error);
    toast({
      title: "Scanning error",
      description: "There was an error scanning the QR code",
      variant: "destructive",
    });
  };

  const handleAddToCart = () => {
    if (scannedItem) {
      addToCart(scannedItem, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${scannedItem.name} has been added to your cart`,
      });
      // Reset state
      setScannedItem(null);
      setScannedData(null);
      setQuantity(1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c1329] text-white">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="outline"
              size="icon"
              className="border-[#384374] hover:bg-[#384374]/30"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">QR Scanner</h1>
          </div>
          <p className="text-gray-400">Scan item QR codes to quickly add them to your cart</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {scanning ? (
              <Card className="bg-[#192244] border-[#384374] text-white overflow-hidden">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70"
                    onClick={() => setScanning(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-full h-[400px] relative overflow-hidden">
                    <QrScanner
                      onResult={handleScan}
                      onError={handleError}
                      constraints={{ facingMode: 'environment' }}
                      scanDelay={500}
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-yellow-400 m-10 rounded-lg"></div>
                  </div>
                </div>
                
                <CardFooter className="bg-blue-950 p-4 flex flex-col">
                  <h3 className="text-center mb-2 font-medium">Scanning for QR Codes</h3>
                  <p className="text-sm text-center text-gray-300">
                    Position the QR code within the scanning area
                  </p>
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-[#192244] border-[#384374] text-white h-full flex flex-col justify-center">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-900/50 flex items-center justify-center mb-6">
                    <QrCode className="h-12 w-12 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Scan Item QR Code</h2>
                  <p className="text-gray-400 mb-8 max-w-xs">
                    Point your camera at a food item QR code to quickly add it to your cart
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setScanning(true)}
                  >
                    Start Scanning
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            {scannedItem ? (
              <Card className="bg-[#192244] border-[#384374] text-white h-full">
                <div className="p-4 flex items-center justify-between bg-blue-950 border-b border-[#384374]">
                  <h3 className="font-medium flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    Item Scanned
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => {
                      setScannedItem(null);
                      setScannedData(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden">
                      <img 
                        src={scannedItem.imageUrl || '/placeholder-food.jpg'} 
                        alt={scannedItem.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-bold">{scannedItem.name}</h2>
                        <Badge 
                          variant="outline" 
                          className={scannedItem.veg ? 'bg-green-500/20 text-green-200 border-green-500/30' : 'bg-red-500/20 text-red-200 border-red-500/30'}
                        >
                          {scannedItem.veg ? 'Veg' : 'Non-Veg'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-400 capitalize mb-2">
                        {scannedItem.category.replace('_', ' ')}
                      </p>
                      
                      <p className="text-lg font-semibold">₹{scannedItem.price}</p>
                      
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-[#384374] hover:bg-[#384374]/30"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-[#384374] hover:bg-[#384374]/30"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-sm text-gray-300">{scannedItem.description}</p>
                    </div>
                    
                    {scannedItem.ingredients && scannedItem.ingredients.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Ingredients</h4>
                        <div className="flex flex-wrap gap-2">
                          {scannedItem.ingredients.map((ingredient: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-900/30 border-blue-500/20"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Prep time: {scannedItem.prepTime} mins</span>
                      </div>
                      
                      {scannedItem.calories && (
                        <span className="text-gray-300">{scannedItem.calories} calories</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-[#384374] p-4">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart - ₹{(scannedItem.price * quantity).toFixed(2)}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-[#192244] border-[#384374] text-white h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full justify-center items-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center mb-4">
                      <ShoppingCart className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Items Scanned</h3>
                    <p className="text-gray-400 mb-6 max-w-xs">
                      Scan a QR code to add items directly to your cart
                    </p>
                    
                    <div className="w-full max-w-xs">
                      <Button
                        variant="outline"
                        className="w-full border-[#384374] hover:bg-[#384374]/30 mb-3"
                        onClick={() => navigate('/menu')}
                      >
                        Browse Menu
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-[#384374] hover:bg-[#384374]/30"
                        onClick={() => navigate('/cart')}
                      >
                        View Cart
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Scanner;
