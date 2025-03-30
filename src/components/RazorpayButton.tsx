
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { razorpayService } from '@/services/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess: (paymentId: string) => void;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  customerName,
  customerEmail,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load the Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Create Razorpay order
      const { data, error } = await razorpayService.createOrder(amount);
      
      if (error) throw new Error(error.message);
      if (!data || !data.order || !data.order.id) throw new Error('Failed to create order');
      
      const orderId = data.order.id;
      
      const options = {
        key: "rzp_test_POq2XFKRJtQMNr", // Your provided key
        amount: parseInt((amount * 100).toString()), // Amount in paise
        currency: "INR",
        name: "Smart Cafeteria",
        description: "Payment for cafeteria order",
        order_id: orderId,
        image: "https://example.com/your_logo",
        handler: async function(response: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) {
          // Verify payment
          const { data: verifyData, error: verifyError } = await razorpayService.verifyPayment(
            response.razorpay_payment_id, 
            response.razorpay_order_id, 
            response.razorpay_signature
          );
          
          if (verifyError || !verifyData.valid) {
            toast({
              title: "Payment Verification Failed",
              description: "Your payment could not be verified. Please contact support.",
              variant: "destructive",
            });
            return;
          }
          
          // Handle the success response
          onSuccess(response.razorpay_payment_id);
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          setIsLoading(false);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: "#15187C", // Updated to your requested color
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
              variant: "destructive",
            });
          },
        },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an issue with the payment process",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full bg-[#15187C] hover:bg-[#0e105a]"
    >
      {isLoading ? 'Processing...' : 'Pay with Razorpay'}
    </Button>
  );
};
