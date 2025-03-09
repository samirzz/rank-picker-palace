
import React, { useState } from "react";
import StripePayment from "./StripePayment";
import PayPalPayment from "./PayPalPayment";
import { CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodsProps {
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  amount, 
  onPaymentSuccess,
  onPaymentCancel 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | null>(null);
  const { toast } = useToast();

  const handlePaymentSelect = (method: "stripe" | "paypal") => {
    setPaymentMethod(method);
  };

  const handleBack = () => {
    setPaymentMethod(null);
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Payment Successful",
      description: "Your boost order has been placed successfully!",
    });
    onPaymentSuccess();
  };

  if (paymentMethod === "stripe") {
    return <StripePayment amount={amount} onSuccess={handlePaymentComplete} onCancel={handleBack} />;
  }

  if (paymentMethod === "paypal") {
    return <PayPalPayment amount={amount} onSuccess={handlePaymentComplete} onCancel={handleBack} />;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm md:text-base font-medium text-white mb-2">Select Payment Method</h3>
      
      <button 
        onClick={() => handlePaymentSelect("stripe")}
        className="w-full flex items-center justify-between p-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-xs md:text-sm font-medium">Credit/Debit Card</span>
        </div>
        <span className="text-2xs md:text-xs opacity-70">Powered by Stripe</span>
      </button>
      
      <button 
        onClick={() => handlePaymentSelect("paypal")}
        className="w-full flex items-center justify-between p-3 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-xs md:text-sm font-medium">PayPal</span>
        </div>
        <span className="text-2xs md:text-xs opacity-70">Fast & secure</span>
      </button>
      
      <button 
        onClick={onPaymentCancel}
        className="w-full text-center text-xs text-gray-400 hover:text-gray-300 mt-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default PaymentMethods;
