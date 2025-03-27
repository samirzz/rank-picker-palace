
import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface OrderConfirmationProps {
  emailSent?: boolean;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ emailSent = true }) => {
  return (
    <div className="mt-6 p-4 bg-green-500/20 rounded-md text-center">
      <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
      <h3 className="text-lg font-medium text-white mb-1">Order Confirmed!</h3>
      <p className="text-sm text-gray-300">
        Thank you for your order. 
        {emailSent ? (
          " Please check your email for confirmation details."
        ) : (
          <span className="flex items-center justify-center mt-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
            <span>We couldn't send a confirmation email. Please check your account for order details.</span>
          </span>
        )}
      </p>
    </div>
  );
};

export default OrderConfirmation;
