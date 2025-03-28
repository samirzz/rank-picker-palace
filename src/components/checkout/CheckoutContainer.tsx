
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "@/components/payments/PaymentMethods";
import { Rank } from "@/data/ranks/types";
import { Hero } from "@/types/hero.types";
import { ServiceOption } from "@/types/service.types";

interface CheckoutContainerProps {
  orderType: "rank" | "mmr";
  currentRank?: Rank | null;
  targetRank?: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  hero?: Hero | null;
  currentMMR?: number;
  targetMMR?: number;
  totalPrice?: number | null;
  options: ServiceOption[];
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  orderType,
  currentRank,
  targetRank,
  hero,
  currentMMR,
  targetMMR,
  totalPrice,
  options,
  onBack,
  onPaymentSuccess
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-8 text-gray-400 hover:text-white"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
      </Button>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Complete Your Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-3">
          <OrderSummary 
            orderType={orderType}
            currentRank={currentRank}
            targetRank={targetRank}
            hero={hero}
            currentMMR={currentMMR}
            targetMMR={targetMMR}
            totalPrice={totalPrice}
            options={options}
          />
        </div>
        
        <div className="lg:col-span-4">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            
            <PaymentMethods 
              amount={totalPrice || 0} 
              onSuccess={onPaymentSuccess}
              onCancel={onBack}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContainer;
