
import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderConfirmationProps {
  emailSent?: boolean;
  orderNumber?: string | null;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  emailSent = true, 
  orderNumber = null 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-6 p-4 bg-green-500/20 rounded-md text-center">
      <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
      <h3 className="text-lg font-medium text-white mb-1">Order Confirmed!</h3>
      
      {orderNumber && (
        <p className="text-sm text-white/90 mb-2">Order Number: #{orderNumber}</p>
      )}
      
      <p className="text-sm text-gray-300 mb-3">
        Thank you for your order. 
        {emailSent ? (
          " We've sent a confirmation email with all the details."
        ) : (
          " Our team will begin processing your order immediately."
        )}
      </p>
      
      {!emailSent && (
        <div className="flex items-center justify-center mt-2 mb-3 p-2 bg-yellow-500/20 rounded-md">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0" />
          <span className="text-xs text-gray-300">We couldn't send a confirmation email. Please check your account for order details.</span>
        </div>
      )}
      
      <Button 
        onClick={() => navigate('/')} 
        variant="outline" 
        size="sm" 
        className="mt-2 bg-purple-900/30 border-purple-700/50 hover:bg-purple-800/40"
      >
        Return to Home
      </Button>
    </div>
  );
};

export default OrderConfirmation;
