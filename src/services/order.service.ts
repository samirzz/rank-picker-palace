
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Hero } from "@/types/hero.types";
import { Rank } from "@/data/ranks";

export interface OrderData {
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

export async function createOrder(orderData: OrderData) {
  try {
    const { user } = useAuth();
    
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
      throw saveError;
    }

    // Fetch necessary configuration for email
    const { data: configData, error: configError } = await supabase
      .from("configuration")
      .select("id, value")
      .in("id", ["discord_invite_link", "company_name", "support_email"]);

    if (configError) {
      console.error("Error fetching configuration:", configError);
      throw configError;
    }

    // Create configuration object
    const config = configData.reduce((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {} as Record<string, string>);

    try {
      // Send confirmation email with better error handling
      await sendOrderConfirmationEmail({
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
        discordInviteLink: config.discord_invite_link || "https://discord.gg/example",
        companyName: config.company_name || "MLBooster",
        supportEmail: config.support_email || "support@mlbooster.com",
      });
    } catch (emailError) {
      // Log the email error but don't fail the order creation
      console.error("Failed to send confirmation email but order was created:", emailError);
      // Return partial success
      return { 
        success: true, 
        orderId: orderRecord.id, 
        orderNumber,
        emailSent: false
      };
    }

    return { success: true, orderId: orderRecord.id, orderNumber, emailSent: true };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error };
  }
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
    // Use a timeout to prevent hanging indefinitely
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Email function timed out")), 10000);
    });
    
    // Call the function with timeout protection
    const { data, error } = await Promise.race([
      supabase.functions.invoke("send-order-confirmation", {
        body: orderDetails,
      }),
      timeoutPromise
    ]) as any;

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
