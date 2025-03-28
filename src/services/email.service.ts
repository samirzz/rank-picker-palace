
import { supabase } from "@/integrations/supabase/client";

interface OrderEmailDetails {
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
}

export async function sendOrderConfirmationEmail(details: OrderEmailDetails): Promise<boolean> {
  try {
    console.log("Sending order confirmation email with details:", JSON.stringify(details, null, 2));
    
    // Make sure orderType is properly set to either "rank" or "mmr"
    if (details.orderType !== "rank" && details.orderType !== "mmr") {
      console.warn(`Invalid orderType: ${details.orderType}, defaulting to "rank"`);
      details.orderType = details.heroName ? "mmr" : "rank";
    }
    
    // Validate order number
    if (!details.orderNumber) {
      console.error("Missing order number in email details");
      details.orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      console.log("Generated fallback order number:", details.orderNumber);
    }
    
    // Validate required fields
    if (!details.email) {
      throw new Error("Missing required email address");
    }
    
    const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
      body: details,
    });
    
    if (error) {
      console.error("Error invoking send-order-confirmation function:", error);
      return false;
    }
    
    console.log("Email function response:", data);
    return data?.success || false;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return false;
  }
}
