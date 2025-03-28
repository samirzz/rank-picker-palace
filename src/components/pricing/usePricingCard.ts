
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { calculatePrice } from "@/data/ranks";
import { useAuth } from "@/hooks/useAuth";
import { useOrderService } from "@/hooks/useOrderService";
import { useToast } from "@/hooks/use-toast";
import type { Rank } from "@/data/ranks/types";
import { ServiceOption } from "@/types/service.types";

interface UsePricingCardProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  currentStars?: number;
  targetStars?: number;
  currentMythicPoints?: number;
  targetMythicPoints?: number;
  serviceOptions?: ServiceOption[];
}

export const usePricingCard = ({
  currentRank,
  targetRank,
  currentSubdivision = 0,
  targetSubdivision = 0,
  currentStars = 0,
  targetStars = 0,
  currentMythicPoints = 0,
  targetMythicPoints = 0,
  serviceOptions = []
}: UsePricingCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { user } = useAuth();
  const { createOrder, isProcessing } = useOrderService();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Calculate base price
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
          setBasePrice(calculatedPrice);
          
          // Apply service options to calculate final price
          let finalPrice = calculatedPrice;
          const activeOptions = serviceOptions.filter(opt => opt.isActive);
          if (activeOptions.length > 0) {
            const percentageIncrease = activeOptions.reduce((total, option) => {
              return total + option.percentageIncrease;
            }, 0);
            
            finalPrice = calculatedPrice * (1 + percentageIncrease / 100);
          }
          
          setPrice(Math.round(finalPrice * 100) / 100); // Round to 2 decimal places
        } catch (error) {
          console.error("Error calculating price:", error);
          setBasePrice(null);
          setPrice(null);
        }
      } else {
        setBasePrice(null);
        setPrice(null);
      }
    };
    
    updatePrice();
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, currentStars, targetStars, 
      currentMythicPoints, targetMythicPoints, serviceOptions]);
  
  // Check if we can calculate a price
  const canCalculatePrice = currentRank && targetRank && price !== null && price > 0;
  
  // Handle proceeding to checkout
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
    
    // Navigate to checkout page with all the necessary data
    navigate('/checkout', { 
      state: {
        currentRank,
        targetRank,
        currentSubdivision,
        targetSubdivision,
        currentStars,
        targetStars,
        currentMythicPoints,
        targetMythicPoints,
        basePrice,
        totalPrice: price,
        options: serviceOptions
      }
    });
  };
  
  // Handle payment success
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
        customerName: user?.email?.split("@")[0],
        options: serviceOptions.filter(opt => opt.isActive)
      });
      
      if (!result.success) {
        throw new Error("Failed to process order");
      }
      
      setShowPayment(false);
      setOrderComplete(true);
      setEmailSent(Boolean(result.emailSent));
      
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
  
  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setShowPayment(false);
  };
  
  // Format rank name with subdivisions/stars/points
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
  
  // Get estimated completion time based on rank difference
  const getEstimatedTime = (): string => {
    if (!currentRank || !targetRank || price === 0) return "N/A";
    const tierDifference = targetRank.tier - currentRank.tier;
    if (tierDifference <= 1) return "1-2 days";
    if (tierDifference <= 3) return "3-5 days";
    return "5-7 days";
  };
  
  // Check if rank has points system (Mythic and above)
  const rankHasPoints = (rank: Rank | null): boolean => {
    if (!rank) return false;
    return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions?.[0]?.points);
  };
  
  return {
    isVisible,
    showDetails,
    setShowDetails,
    basePrice,
    price,
    showPayment,
    orderComplete,
    handleProceedToCheckout,
    handlePaymentSuccess,
    handlePaymentCancel,
    formatRankName,
    getEstimatedTime,
    user,
    isProcessing,
    canCalculatePrice,
    emailSent
  };
};
