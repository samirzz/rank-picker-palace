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
        
      </div>
    </div>;
};
export default PricingCard;