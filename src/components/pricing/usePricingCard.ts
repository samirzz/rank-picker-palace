
import { useState, useEffect } from "react";
import { calculatePrice } from "@/data/ranks";
import type { Rank } from "@/data/ranks/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useOrderService } from "@/hooks/useOrderService";

interface UsePricingCardProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  currentStars?: number;
  targetStars?: number;
  currentMythicPoints?: number;
  targetMythicPoints?: number;
}

export const usePricingCard = ({
  currentRank,
  targetRank,
  currentSubdivision = 0,
  targetSubdivision = 0,
  currentStars = 0,
  targetStars = 0,
  currentMythicPoints = 0,
  targetMythicPoints = 0
}: UsePricingCardProps) => {
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
    }, 600); // Default animation delay
    return () => clearTimeout(timer);
  }, []);

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

  const formatRankName = (rank: Rank, subdivisionIndex: number = 0, stars: number = 0, mythicPoints: number = 0): string => {
    if (!rank) return '';

    const rankHasPoints = (r: Rank | null): boolean => {
      if (!r) return false;
      return Boolean(r.points) || Boolean(r.id === "mythic" && r.subdivisions?.[0]?.points);
    };

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

  const getEstimatedTime = (): string => {
    if (!currentRank || !targetRank || price === 0) return "N/A";
    const tierDifference = targetRank.tier - currentRank.tier;
    if (tierDifference <= 1) return "1-2 days";
    if (tierDifference <= 3) return "3-5 days";
    return "5-7 days";
  };

  return {
    isVisible,
    showDetails,
    setShowDetails,
    price,
    showPayment,
    setShowPayment,
    orderComplete,
    handleProceedToCheckout,
    handlePaymentSuccess,
    handlePaymentCancel,
    formatRankName,
    getEstimatedTime,
    user,
    isProcessing,
    canCalculatePrice: currentRank && targetRank && price !== null && price > 0
  };
};
