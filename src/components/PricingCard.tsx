import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { calculatePrice } from "@/data/ranks";
import type { Rank } from "@/data/ranks";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import PaymentMethods from "./payments/PaymentMethods";
import { useToast } from "@/hooks/use-toast";

interface PricingCardProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  currentStars?: number;
  targetStars?: number;
  currentMythicPoints?: number;
  targetMythicPoints?: number;
  animationDelay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  currentRank,
  targetRank,
  currentSubdivision = 0,
  targetSubdivision = 0,
  currentStars = 0,
  targetStars = 0,
  currentMythicPoints = 0,
  targetMythicPoints = 0,
  animationDelay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  useEffect(() => {
    const handleCombinationChange = () => {
      if (currentRank && targetRank) {
        const calculatedPrice = calculatePrice(
          currentRank, 
          targetRank, 
          currentSubdivision, 
          targetSubdivision,
          currentStars,
          targetStars,
          currentMythicPoints,
          targetMythicPoints
        );
        setPrice(calculatedPrice);
      }
    };

    window.addEventListener('adminCombinationsChange', handleCombinationChange);
    
    return () => {
      window.removeEventListener('adminCombinationsChange', handleCombinationChange);
    };
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, currentMythicPoints, targetMythicPoints]);

  useEffect(() => {
    if (currentRank && targetRank) {
      const calculatedPrice = calculatePrice(
        currentRank, 
        targetRank, 
        currentSubdivision, 
        targetSubdivision,
        currentStars,
        targetStars,
        currentMythicPoints,
        targetMythicPoints
      );
      setPrice(calculatedPrice);
    } else {
      setPrice(null);
    }
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, currentMythicPoints, targetMythicPoints]);

  const handleProceedToCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast({
      title: "Order Confirmed",
      description: "Thank you for your order! Our boosters will start working on it shortly.",
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const canCalculatePrice = currentRank && targetRank && price !== null && price > 0;
  const benefits = ["Top 1% boosters", "24/7 Customer support", "Stream enabled", "Guaranteed secure account handling", "100% boosting completion rate"];

  const getEstimatedTime = (): string => {
    if (!currentRank || !targetRank || price === 0) return "N/A";
    const tierDifference = targetRank.tier - currentRank.tier;
    if (tierDifference <= 1) return "1-2 days";
    if (tierDifference <= 3) return "3-5 days";
    return "5-7 days";
  };

  // Helper to check if rank is a Mythic rank with points
  const rankHasPoints = (rank: Rank | null): boolean => {
    if (!rank) return false;
    return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions?.[0]?.points);
  };

  const formatRankName = (rank: Rank, subdivisionIndex: number = 0, stars: number = 0, mythicPoints: number = 0): string => {
    if (!rank) return '';
    
    // For Mythic ranks with points
    if (rankHasPoints(rank) && mythicPoints > 0) {
      return `${rank.name} (${mythicPoints} points)`;
    }
    
    // For Legend rank with stars
    if (rank.id === "legend" && stars > 0) {
      if (rank.subdivisions && rank.subdivisions[subdivisionIndex]) {
        return `${rank.subdivisions[subdivisionIndex].name} (${stars} stars)`;
      }
    }
    
    if (rank.subdivisions && rank.subdivisions[subdivisionIndex]) {
      return rank.subdivisions[subdivisionIndex].name;
    }
    if (rank.points) {
      return `${rank.name} (${rank.points.min}-${rank.points.max} points)`;
    }
    return rank.name;
  };

  return (
    <div className={`transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
      <div className="glass-panel overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
        
        <div className="p-4 md:p-6 lg:p-8 relative z-10">
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">Boost Summary</h3>
            <p className="text-gray-400 text-xs md:text-sm">Select ranks to calculate your price</p>
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
                      <span className="text-gray-300 text-xs md:text-sm">From Rank</span>
                      <span className="font-semibold text-white text-xs md:text-sm">
                        {formatRankName(currentRank, currentSubdivision, currentStars, currentMythicPoints)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 md:pb-3 mb-2 md:mb-3">
                      <span className="text-gray-300 text-xs md:text-sm">To Rank</span>
                      <span className="font-semibold text-white text-xs md:text-sm">
                        {formatRankName(targetRank, targetSubdivision, targetStars, targetMythicPoints)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-xs md:text-sm">Tier Difference</span>
                      <span className="font-semibold text-white text-xs md:text-sm">
                        {currentRank.tier === targetRank.tier ? "Same Tier" : Math.abs(targetRank.tier - currentRank.tier)}
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
                    Proceed to Checkout
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-4 md:py-6">
              {!currentRank || !targetRank ? (
                <p className="text-gray-400 text-xs md:text-sm">Please select both current and target ranks</p>
              ) : price === 0 ? (
                <p className="text-amber-400 text-xs md:text-sm">
                  Target rank must be higher than current rank
                </p>
              ) : (
                <p className="text-gray-400 text-xs md:text-sm">Calculating price...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
