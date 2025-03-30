
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  
  const handlePayment = () => {
    setIsLoading(true);
    
    try {
      const options = {
        key: "rzp_test_LWHOa6RA1jVpOB", // Enter the Key ID here
        amount: parseInt((amount * 100).toString()), // Amount in paise
        currency: "INR",
        name: "Smart Cafeteria",
        description: "Payment for cafeteria order",
        image: "https://example.com/your_logo",
        handler: function(response: { razorpay_payment_id: string }) {
          // Handle the success response
          onSuccess(response.razorpay_payment_id);
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
        },
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: "#eab308",
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
      className="w-full bg-turmeric-500 hover:bg-turmeric-600"
    >
      {isLoading ? 'Processing...' : 'Pay with Razorpay'}
    </Button>
  );
};
