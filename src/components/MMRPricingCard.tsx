import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react";
import { Hero } from "@/data/heroes";
import { useToast } from "@/hooks/use-toast";
import PaymentMethods from "./payments/PaymentMethods";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useOrderService } from "@/hooks/useOrderService";

interface MMRPricingCardProps {
  hero: Hero | null;
  currentMMR: number;
  targetMMR: number;
  price: number;
}

const MMRPricingCard: React.FC<MMRPricingCardProps> = ({ 
  hero,
  currentMMR,
  targetMMR,
  price
}) => {
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createOrder, isProcessing } = useOrderService();
  
  const isComplete = hero && currentMMR < targetMMR;
  
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your purchase",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!isComplete) return;
    setShowPayment(true);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handlePaymentSuccess = async () => {
    try {      
      if (!hero) {
        throw new Error("Missing hero information");
      }
      
      // Create the order in the database and send confirmation email
      const result = await createOrder({
        orderType: "mmr",
        currentMMR,
        targetMMR,
        hero,
        totalAmount: price,
        customerName: user?.email?.split("@")[0]
      });

      if (!result.success) {
        throw new Error("Failed to process order");
      }

      setShowPayment(false);
      setOrderComplete(true);
      toast({
        title: "Order Confirmed",
        description: "Thank you for your order! Check your email for confirmation details.",
      });
    } catch (error) {
      console.error("Order processing error:", error);
      toast({
        title: "Order Processing Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="bg-mlbb-darkpurple/40 border-mlbb-purple/20 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-white">Boost Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {showPayment ? (
          <PaymentMethods 
            amount={price} 
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        ) : orderComplete ? (
          <div className="space-y-4 text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-white">Order Confirmed!</h3>
            <p className="text-gray-400 text-sm">
              Your MMR boost will begin shortly. Please check your email for confirmation details.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Selected Hero</div>
              <div className="text-white font-medium">
                {hero ? hero.name : "No hero selected"}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Current MMR</div>
              <div className="text-white font-medium">{currentMMR}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Target MMR</div>
              <div className="text-white font-medium">{targetMMR}</div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Price</span>
                <span className="text-mlbb-gold text-xl font-bold">${price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {!showPayment && !orderComplete && (
        <CardFooter>
          <Button 
            className="w-full bg-mlbb-gold hover:bg-mlbb-gold/80 text-black"
            disabled={!isComplete || isProcessing}
            onClick={handleAddToCart}
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Proceed to Payment
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MMRPricingCard;
