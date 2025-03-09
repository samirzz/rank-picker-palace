
import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PayPalPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, onSuccess, onCancel }) => {
  // Convert amount to USD string format
  const formattedAmount = amount.toFixed(2);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-sm md:text-base font-medium text-white">PayPal Checkout</h3>
        <p className="text-2xs md:text-xs text-gray-400 mt-1">
          Complete your payment securely with PayPal
        </p>
      </div>

      <PayPalScriptProvider options={{ 
        clientId: "test", // Replace with your actual client ID
        currency: "USD",
        intent: "capture"
      }}>
        <div className="bg-white p-2 rounded-md">
          <PayPalButtons
            style={{ 
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "pay"
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE", // Add the required intent property
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: formattedAmount,
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              // This would be replaced with actual order capture in production
              return new Promise((resolve) => {
                setTimeout(() => {
                  onSuccess();
                  resolve(undefined);
                }, 1000);
              });
            }}
          />
        </div>
      </PayPalScriptProvider>

      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default PayPalPayment;
