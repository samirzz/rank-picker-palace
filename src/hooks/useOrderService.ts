
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Hero } from "@/types/hero.types";
import type { Rank } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";

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

  const createOrder = async (orderData: OrderData): Promise<OrderResult> => {
    try {
      setIsProcessing(true);
      
      if (!user || !user.email) {
        throw new Error("User must be logged in to create an order");
      }

      // Generate a simple order number based on timestamp and random digits
      const orderNumber = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
      
      // Save order to database
      const { data: orderRecord, error: saveError } = await supabase.from("orders").insert({
        user_id: user.id,
        order_type: orderData.orderType,
        current_rank: orderData.currentRank?.id,
        target_rank: orderData.targetRank?.id,
        current_mmr: orderData.currentMMR,
        target_mmr: orderData.targetMMR,
        hero_id: orderData.hero?.id,
        total_amount: orderData.totalAmount,
        email: user.email,
        customer_name: orderData.customerName || user.email.split("@")[0],
      }).select().single();

      if (saveError) {
        console.error("Error saving order:", saveError);
        toast({
          title: "Order Error",
          description: "Failed to save your order. Please try again.",
          variant: "destructive",
        });
        throw saveError;
      }

      // Fetch necessary configuration for email
      const { data: configData, error: configError } = await supabase
        .from("configuration")
        .select("id, value")
        .in("id", ["discord_invite_link", "company_name", "support_email"]);

      if (configError) {
        console.error("Error fetching configuration:", configError);
        // Continue with default values
      }

      // Create configuration object with defaults
      const config = (configData || []).reduce((acc, item) => {
        acc[item.id] = item.value;
        return acc;
      }, {
        discord_invite_link: "https://discord.gg/example",
        company_name: "MLBooster",
        support_email: "support@mlbooster.com"
      } as Record<string, string>);

      try {
        // Add timeout protection for the function call
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Email function timed out")), 10000);
        });
        
        // Send confirmation email with timeout protection
        await Promise.race([
          sendOrderConfirmationEmail({
            id: orderRecord.id,
            orderNumber,
            customerName: orderData.customerName || user.email.split("@")[0],
            email: user.email,
            orderType: orderData.orderType,
            currentRank: orderData.currentRank?.name,
            targetRank: orderData.targetRank?.name,
            currentMMR: orderData.currentMMR,
            targetMMR: orderData.targetMMR,
            heroName: orderData.hero?.name,
            totalAmount: orderData.totalAmount,
            discordInviteLink: config.discord_invite_link,
            companyName: config.company_name,
            supportEmail: config.support_email,
          }),
          timeoutPromise
        ]);
        
        return { 
          success: true, 
          orderId: orderRecord.id, 
          orderNumber,
          emailSent: true
        };
      } catch (emailError) {
        // Log the error but return a partial success since the order was created
        console.error("Failed to send confirmation email but order was created:", emailError);
        toast({
          title: "Order Created",
          description: "Your order was created but we couldn't send a confirmation email. Please check your orders in your account.",
          variant: "default",
        });
        
        return { 
          success: true, 
          orderId: orderRecord.id, 
          orderNumber,
          emailSent: false
        };
      }
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
    createOrder,
    isProcessing
  };
}

async function sendOrderConfirmationEmail(orderDetails: {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  orderType: "rank" | "mmr";
  currentRank?: string;
  targetRank?: string;
  currentMMR?: number;
  targetMMR?: number;
  heroName?: string;
  totalAmount: number;
  discordInviteLink: string;
  companyName: string;
  supportEmail: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke("send-order-confirmation", {
      body: orderDetails,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    throw error;
  }
}
