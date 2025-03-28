
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOrderService } from "@/hooks/useOrderService";
import { ServiceOption } from "@/types/service.types";
import { Rank } from "@/data/ranks/types";
import { Hero } from "@/types/hero.types";

export interface CheckoutData {
  orderType: "rank" | "mmr";
  currentRank?: Rank | null;
  targetRank?: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  currentStars?: number;
  targetStars?: number;
  currentMythicPoints?: number;
  targetMythicPoints?: number;
  hero?: Hero | null;
  currentMMR?: number;
  targetMMR?: number;
  basePrice: number | null;
  totalPrice: number | null;
  options: ServiceOption[];
}

export const useCheckout = (locationState: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createOrder, isProcessing } = useOrderService();
  
  const [orderData, setOrderData] = useState<CheckoutData | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(true);
  
  // Initialize order data from location state
  useEffect(() => {
    if (!locationState) {
      navigate('/');
      toast({
        title: "Missing order information",
        description: "Please select your boost details before proceeding to checkout",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure orderType is correctly set
    const state = {
      ...locationState,
      orderType: locationState.hero ? "mmr" : "rank"
    };
    
    setOrderData(state);
    console.log("Checkout initialized with data:", JSON.stringify(state, null, 2));
  }, [locationState, navigate, toast]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handlePaymentSuccess = async () => {
    try {
      if (!orderData || !orderData.totalPrice) {
        throw new Error("Missing required order information");
      }
      
      // Ensure orderType is correct and matches the expected type
      const orderType: "rank" | "mmr" = orderData.hero ? "mmr" : "rank";
      console.log(`Creating ${orderType} order`);
      
      const orderRequest = {
        orderType: orderType,
        totalAmount: orderData.totalPrice,
        customerName: user?.email?.split("@")[0],
        options: orderData.options.filter(opt => opt.isActive)
      };
      
      // Add rank-specific fields
      if (orderType === "rank" && orderData.currentRank && orderData.targetRank) {
        Object.assign(orderRequest, {
          currentRank: orderData.currentRank,
          targetRank: orderData.targetRank,
          currentSubdivision: orderData.currentSubdivision,
          targetSubdivision: orderData.targetSubdivision
        });
      }
      
      // Add MMR-specific fields
      if (orderType === "mmr" && orderData.hero) {
        Object.assign(orderRequest, {
          hero: orderData.hero,
          currentMMR: orderData.currentMMR,
          targetMMR: orderData.targetMMR
        });
      }
      
      console.log("Submitting order request:", JSON.stringify(orderRequest, null, 2));
      
      const result = await createOrder(orderRequest);
      
      if (!result.success) {
        throw new Error("Failed to process order");
      }
      
      setOrderComplete(true);
      setOrderNumber(result.orderNumber || null);
      setEmailSent(result.emailSent || false);
      
      toast({
        title: "Order Confirmed",
        description: result.emailSent 
          ? "Thank you for your order! Check your email for confirmation details."
          : "Your order has been confirmed. We couldn't send a confirmation email, but your order has been saved.",
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
  
  return {
    orderData,
    orderComplete,
    orderNumber,
    emailSent,
    isProcessing,
    handleBack,
    handlePaymentSuccess
  };
};
