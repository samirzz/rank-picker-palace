
import React from "react";
import { CheckCircle } from "lucide-react";

const OrderConfirmation: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-green-500/20 rounded-md text-center">
      <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
      <h3 className="text-lg font-medium text-white mb-1">Order Confirmed!</h3>
      <p className="text-sm text-gray-300">
        Thank you for your order. Please check your email for confirmation details.
      </p>
    </div>
  );
};

export default OrderConfirmation;
