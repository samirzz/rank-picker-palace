
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Hero } from "@/types/hero.types";
import type { Rank } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/services/order.service";

interface OrderData {
  orderType: "rank" | "mmr";
  currentRank?: Rank;
  targetRank?: Rank;
  currentSubdivision?: number;
  targetSubdivision?: number;
  currentMMR?: number;
  targetMMR?: number;
  hero?: Hero;
  totalAmount: number;
  customerName?: string;
}

interface OrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  emailSent?: boolean;
  error?: any;
}

export function useOrderService() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCreateOrder = async (orderData: OrderData): Promise<OrderResult> => {
    try {
      setIsProcessing(true);
      
      if (!user || !user.email) {
        throw new Error("User must be logged in to create an order");
      }

      // Pass the user ID and email to the order service
      const result = await createOrder(orderData, user.id, user.email);

      if (result.success) {
        if (result.emailSent) {
          toast({
            title: "Order Created",
            description: "Your order has been created and a confirmation email has been sent.",
            variant: "default",
          });
        } else {
          toast({
            title: "Order Created",
            description: "Your order was created but we couldn't send a confirmation email. Please check your orders in your account.",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Order Failed",
          description: "We couldn't process your order. Please try again later.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Failed",
        description: "We couldn't process your order. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createOrder: handleCreateOrder,
    isProcessing
  };
}
