
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight,
  AlertCircle,
  Wallet,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { CartItem } from '@/components/CartItem';
import { RazorpayButton } from '@/components/RazorpayButton';
import { useApp } from '@/context/AppContext';

const Cart = () => {
  const { cart, clearCart, user, placeOrder, isLoading } = useApp();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const deliveryFee = 0; // Free delivery
  const discount = 0; // No discount for now
  const grandTotal = subtotal + tax + deliveryFee - discount;
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  const handlePaymentSuccess = async () => {
    const order = await placeOrder(paymentMethod);
    if (order) {
      navigate(`/orders/${order.id}`);
    }
  };
  
  const handleCheckout = async () => {
    // Direct payment with wallet if wallet is selected
    if (paymentMethod === 'wallet') {
      const order = await placeOrder(paymentMethod);
      if (order) {
        navigate(`/orders/${order.id}`);
      }
    }
    // For other payment methods, payment is handled by the RazorpayButton component
  };
  
  if (isLoading) {
    return <Loader text="Processing your order..." />;
  }
  
  // Show empty cart message if cart is empty
  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow py-10">
          <div className="cafeteria-container">
            <div className="text-center py-16">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button 
                className="bg-turmeric-500 hover:bg-turmeric-600"
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow py-10">
        <div className="cafeteria-container">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Cart Items ({cart.length})</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={handleClearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear Cart
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {cart.map(item => (
                      <CartItem 
                        key={item.itemId}
                        id={item.itemId}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        total={item.total}
                        imageUrl={item.imageUrl}
                        specialInstructions={item.specialInstructions}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/menu')}
                  >
                    Add More Items
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Grand Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                  
                  {/* Payment methods */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Payment Method</h3>
                    
                    {/* Show warning if not logged in */}
                    {!user && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Authentication Required</AlertTitle>
                        <AlertDescription>
                          Please login to place an order.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                      className="space-y-2"
                    >
                      {user && (
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <RadioGroupItem value="wallet" id="wallet" />
                          <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wallet className="h-4 w-4 mr-2" />
                                Wallet
                              </div>
                              <span className="text-sm">₹{user.walletBalance}</span>
                            </div>
                          </Label>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            UPI / Razorpay
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Credit / Debit Card
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Insufficient balance warning */}
                  {user && paymentMethod === 'wallet' && user.walletBalance < grandTotal && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Insufficient Balance</AlertTitle>
                      <AlertDescription>
                        Your wallet balance (₹{user.walletBalance}) is insufficient for this order (₹{grandTotal}).
                        Please add money to your wallet or select a different payment method.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  {paymentMethod === 'wallet' ? (
                    <Button 
                      className="w-full bg-turmeric-500 hover:bg-turmeric-600"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={!user || (user.walletBalance < grandTotal)}
                    >
                      Pay from Wallet
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    user ? (
                      <RazorpayButton 
                        amount={grandTotal}
                        customerName={user.name}
                        customerEmail={user.email}
                        onSuccess={handlePaymentSuccess}
                      />
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => navigate('/login')}
                      >
                        Login to Continue
                      </Button>
                    )
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/menu')}
                  >
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
