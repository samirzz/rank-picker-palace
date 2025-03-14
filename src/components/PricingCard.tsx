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
  const {
    toast
  } = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);
  useEffect(() => {
    const handleCombinationChange = () => {
      if (currentRank && targetRank) {
        const calculatedPrice = calculatePrice(currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, currentMythicPoints, targetMythicPoints);
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
      const calculatedPrice = calculatePrice(currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, currentMythicPoints, targetMythicPoints);
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
      description: "Thank you for your order! Our boosters will start working on it shortly."
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
  return <div className={`transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
      <div className="glass-panel overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
        
        
      </div>
    </div>;
};
export default PricingCard;