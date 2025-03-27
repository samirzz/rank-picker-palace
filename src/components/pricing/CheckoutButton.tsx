
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface CheckoutButtonProps {
  onProceedToCheckout: () => void;
  isProcessing: boolean;
  isLoggedIn: boolean;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  onProceedToCheckout,
  isProcessing,
  isLoggedIn
}) => {
  return (
    <Button 
      onClick={onProceedToCheckout}
      className="w-full mt-6 bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90 text-white py-3 rounded-md font-semibold button-glow"
      disabled={isProcessing}
    >
      {isProcessing ? "Processing..." : !isLoggedIn ? (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Login to Purchase
        </>
      ) : (
        "Proceed to Checkout"
      )}
    </Button>
  );
};

export default CheckoutButton;
