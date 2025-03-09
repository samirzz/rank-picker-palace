
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { calculatePrice } from "@/data/ranks";
import type { Rank } from "@/data/ranks";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface PricingCardProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  animationDelay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  currentRank,
  targetRank,
  currentSubdivision = 0,
  targetSubdivision = 0,
  animationDelay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  useEffect(() => {
    if (currentRank && targetRank) {
      const calculatedPrice = calculatePrice(currentRank, targetRank);

      // Apply additional pricing based on subdivisions
      let finalPrice = calculatedPrice;

      // Add subdivision modifier if same tier but different subdivision
      if (currentRank.tier === targetRank.tier && currentRank.subdivisions && targetRank.subdivisions && currentSubdivision !== undefined && targetSubdivision !== undefined) {
        // Only if target subdivision is higher than current subdivision
        if (targetSubdivision < currentSubdivision) {
          const subdivisionDiff = currentSubdivision - targetSubdivision;
          const subdivisionPrice = 5 * subdivisionDiff; // $5 per subdivision
          finalPrice = subdivisionPrice;
        }
      }
      setPrice(finalPrice);
    } else {
      setPrice(null);
    }
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision]);

  const canCalculatePrice = currentRank && targetRank && price !== null && price > 0;
  const benefits = ["Top 1% boosters", "24/7 Customer support", "Stream enabled", "Guaranteed secure account handling", "100% boosting completion rate"];

  // Estimate completion time based on tier difference
  const getEstimatedTime = (): string => {
    if (!currentRank || !targetRank || price === 0) return "N/A";
    const tierDifference = targetRank.tier - currentRank.tier;
    if (tierDifference <= 1) return "1-2 days";
    if (tierDifference <= 3) return "3-5 days";
    return "5-7 days";
  };

  // Format the rank name with subdivision if available
  const formatRankName = (rank: Rank, subdivisionIndex: number = 0): string => {
    if (!rank) return '';
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
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
        
        {/* Card content */}
        <div className="p-4 md:p-6 lg:p-8 relative z-10">
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">Boost Summary</h3>
            <p className="text-gray-400 text-xs md:text-sm">Select ranks to calculate your price</p>
          </div>
          
          {canCalculatePrice ? <>
              {/* Pricing information */}
              <div className="bg-gradient-to-r from-mlbb-purple/10 to-mlbb-purple/20 rounded-lg p-3 md:p-4 text-center mb-4 md:mb-6">
                <div className="text-xs md:text-sm text-mlbb-lightpurple mb-1">Total Price</div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  ${price.toFixed(2)}
                </div>
                <div className="text-2xs md:text-xs text-gray-400 mt-1">
                  Est. Completion: {getEstimatedTime()}
                </div>
              </div>
              
              {/* Order summary */}
              <div className="mb-4 md:mb-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 md:pb-3 mb-2 md:mb-3">
                  <span className="text-gray-300 text-xs md:text-sm">From Rank</span>
                  <span className="font-semibold text-white text-xs md:text-sm">{formatRankName(currentRank, currentSubdivision)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2 md:pb-3 mb-2 md:mb-3">
                  <span className="text-gray-300 text-xs md:text-sm">To Rank</span>
                  <span className="font-semibold text-white text-xs md:text-sm">{formatRankName(targetRank, targetSubdivision)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-xs md:text-sm">Tier Difference</span>
                  <span className="font-semibold text-white text-xs md:text-sm">
                    {currentRank.tier === targetRank.tier ? "Same Tier" : Math.abs(targetRank.tier - currentRank.tier)}
                  </span>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="mb-4 md:mb-6">
                <button onClick={() => setShowDetails(!showDetails)} className="flex items-center justify-between w-full text-mlbb-lightpurple text-xs md:text-sm mb-2 md:mb-3">
                  <span>Service Details</span>
                  {showDetails ? <ChevronUp className="h-3 w-3 md:h-4 md:w-4" /> : <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />}
                </button>
                
                {showDetails && <div className="animate-slide-down">
                    <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-300">
                      {benefits.map((benefit, index) => <li key={index} className="flex items-start">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-mlbb-purple mr-1 md:mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>)}
                    </ul>
                  </div>}
              </div>
              
              {/* CTA Button */}
              <Button className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:opacity-90 text-white py-4 text-sm md:text-base transition-all duration-300">
                Proceed to Checkout
              </Button>
            </> : <div className="text-center py-4 md:py-6">
              {!currentRank || !targetRank ? <p className="text-gray-400 text-xs md:text-sm">Please select both current and target ranks</p> : price === 0 ? <p className="text-amber-400 text-xs md:text-sm">
                  Target rank must be higher than current rank
                </p> : <p className="text-gray-400 text-xs md:text-sm">Calculating price...</p>}
            </div>}
        </div>
      </div>
    </div>;
};

export default PricingCard;
