
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderConfirmationProps {
  orderNumber: string | null;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderNumber }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="glass-panel p-8 md:p-12">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Order Confirmed!</h1>
        
        {orderNumber && (
          <p className="text-gray-300 mb-2">Order Number: #{orderNumber}</p>
        )}
        
        <p className="text-gray-300 mb-6">
          Thank you for your order. We've sent a confirmation email with all the details.
          Our team will begin processing your order immediately.
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="bg-mlbb-purple hover:bg-mlbb-darkpurple"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
