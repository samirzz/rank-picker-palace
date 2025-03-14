
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/data/heroes";
import { CheckCircle, ChevronDown, ChevronUp, Zap } from "lucide-react";
import PaymentMethods from "./payments/PaymentMethods";
import { useToast } from "@/hooks/use-toast";

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
  const [showDetails, setShowDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const handleProceedToCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast({
      title: "Order Confirmed",
      description: "Thank you for your MMR boost order! Our boosters will start working on it shortly.",
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const canCalculatePrice = hero && price > 0;
  const benefits = [
    "Top 1% MMR boosters", 
    "24/7 Customer support", 
    "Guaranteed secure account handling", 
    "100% boosting completion rate",
    "Fast turnaround time"
  ];

  const getEstimatedTime = (): string => {
    if (!hero || price === 0) return "N/A";
    const mmrDifference = targetMMR - currentMMR;
    if (mmrDifference <= 500) return "1-2 days";
    if (mmrDifference <= 1000) return "2-3 days";
    return "4-7 days";
  };

  return (
    <div className="glass-panel overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
      
      <div className="p-4 md:p-6 lg:p-8 relative z-10">
        <div className="text-center mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">MMR Boost Summary</h3>
          <p className="text-gray-400 text-xs md:text-sm">Select a hero and MMR range to calculate your price</p>
        </div>
        
        {canCalculatePrice ? (
          <>
            {showPayment ? (
              <PaymentMethods 
                amount={price} 
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentCancel={handlePaymentCancel}
              />
            ) : (
              <>
                <div className="bg-gradient-to-r from-mlbb-purple/10 to-mlbb-purple/20 rounded-lg p-3 md:p-4 text-center mb-4 md:mb-6">
                  <div className="text-xs md:text-sm text-mlbb-lightpurple mb-1">Total Price</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    ${price.toFixed(2)}
                  </div>
                  <div className="text-2xs md:text-xs text-gray-400 mt-1">
                    Est. Completion: {getEstimatedTime()}
                  </div>
                </div>
                
                <div className="mb-4 md:mb-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 md:pb-3 mb-2 md:mb-3">
                    <span className="text-gray-300 text-xs md:text-sm">Hero</span>
                    <span className="font-semibold text-white text-xs md:text-sm">
                      {hero?.name || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 md:pb-3 mb-2 md:mb-3">
                    <span className="text-gray-300 text-xs md:text-sm">Current MMR</span>
                    <span className="font-semibold text-white text-xs md:text-sm">
                      {currentMMR}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 md:pb-3 mb-2 md:mb-3">
                    <span className="text-gray-300 text-xs md:text-sm">Target MMR</span>
                    <span className="font-semibold text-white text-xs md:text-sm">
                      {targetMMR}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs md:text-sm">MMR to Boost</span>
                    <span className="font-semibold text-mlbb-gold text-xs md:text-sm">
                      {targetMMR - currentMMR} points
                    </span>
                  </div>
                </div>
                
                <div className="mb-4 md:mb-6">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(!showDetails);
                    }} 
                    className="flex items-center justify-between w-full text-mlbb-lightpurple text-xs md:text-sm mb-2 md:mb-3"
                  >
                    <span>Service Details</span>
                    {showDetails ? <ChevronUp className="h-3 w-3 md:h-4 md:w-4" /> : <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />}
                  </button>
                  
                  {showDetails && (
                    <div className="animate-slide-down">
                      <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-300">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-mlbb-purple mr-1 md:mr-2 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90 text-white py-4 text-sm md:text-base transition-all duration-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Boost My MMR Now
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-4 md:py-6">
            {!hero ? (
              <p className="text-gray-400 text-xs md:text-sm">Please select a hero and MMR range</p>
            ) : price === 0 ? (
              <p className="text-amber-400 text-xs md:text-sm">
                Target MMR must be higher than current MMR
              </p>
            ) : (
              <p className="text-gray-400 text-xs md:text-sm">Calculating price...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MMRPricingCard;
