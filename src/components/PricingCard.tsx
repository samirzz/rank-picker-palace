
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { calculatePrice } from "@/data/ranks";
import type { Rank } from "@/data/ranks/types";
import { CheckCircle, ChevronDown, ChevronUp, Lock } from "lucide-react";
import PaymentMethods from "./payments/PaymentMethods";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useOrderService } from "@/hooks/useOrderService";

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
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createOrder, isProcessing } = useOrderService();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  useEffect(() => {
    const handleCombinationChange = async () => {
      if (currentRank && targetRank) {
        try {
          const calculatedPrice = await calculatePrice(
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
        } catch (error) {
          console.error("Error calculating price:", error);
        }
      }
    };
    
    window.addEventListener('adminCombinationsChange', handleCombinationChange);
    
    return () => {
      window.removeEventListener('adminCombinationsChange', handleCombinationChange);
    };
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, currentMythicPoints, targetMythicPoints]);

  useEffect(() => {
    const updatePrice = async () => {
      if (currentRank && targetRank) {
        try {
          const calculatedPrice = await calculatePrice(
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
        } catch (error) {
          console.error("Error calculating price:", error);
          setPrice(null);
        }
      } else {
        setPrice(null);
      }
    };
    
    updatePrice();
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, currentMythicPoints, targetMythicPoints]);

  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your purchase",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!currentRank || !targetRank || !price) {
        throw new Error("Missing required order information");
      }
      
      const result = await createOrder({
        orderType: "rank",
        currentRank,
        targetRank,
        currentSubdivision,
        targetSubdivision,
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

  const rankHasPoints = (rank: Rank | null): boolean => {
    if (!rank) return false;
    return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions?.[0]?.points);
  };

  const formatRankName = (rank: Rank, subdivisionIndex: number = 0, stars: number = 0, mythicPoints: number = 0): string => {
    if (!rank) return '';

    if (rankHasPoints(rank) && mythicPoints > 0) {
      return `${rank.name} (${mythicPoints} points)`;
    }

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

  return <div className={`transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
      <div className="glass-panel overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
        
        {canCalculatePrice ? (
          <div className="p-6 md:p-8">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Rank Boost</h3>
                  <div className="text-xs md:text-sm text-gray-400 mt-1">From {currentRank && formatRankName(currentRank, currentSubdivision, currentStars, currentMythicPoints)} to {targetRank && formatRankName(targetRank, targetSubdivision, targetStars, targetMythicPoints)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Price</div>
                  <div className="text-2xl md:text-3xl font-bold text-mlbb-gold">${price?.toFixed(2)}</div>
                </div>
              </div>
              
              {orderComplete ? (
                <div className="mt-6 p-4 bg-green-500/20 rounded-md text-center">
                  <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <h3 className="text-lg font-medium text-white mb-1">Order Confirmed!</h3>
                  <p className="text-sm text-gray-300">
                    Thank you for your order. Please check your email for confirmation details.
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full mt-6 bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90 text-white py-3 rounded-md font-semibold button-glow"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : !user ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login to Purchase
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              )}
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center gap-1 mt-3 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showDetails ? (
                  <>
                    Hide details <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Show details <ChevronDown size={16} />
                  </>
                )}
              </button>
              
              {showDetails && (
                <div className="mt-5 pt-5 border-t border-gray-700/30">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Estimated Completion Time:</span>
                      <span className="text-sm font-medium text-white">{getEstimatedTime()}</span>
                    </div>
                    
                    <div className="pt-3">
                      <h4 className="text-sm font-medium text-white mb-2">Included Benefits:</h4>
                      <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center pointer-events-none">
            <h3 className="text-lg font-bold text-white mb-2">Select Your Ranks</h3>
            <p className="text-sm text-gray-400 mb-4">
              Please select your current rank and target rank to see pricing and options.
            </p>
          </div>
        )}
        
        {showPayment && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md">
              <PaymentMethods 
                amount={price || 0} 
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>;
};

export default PricingCard;
