
import { supabase } from "@/integrations/supabase/client";

export interface OrderEmailDetails {
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

/**
 * Send order confirmation email via Supabase function
 */
export async function sendOrderConfirmationEmail(orderDetails: OrderEmailDetails): Promise<boolean> {
  try {
    console.log("Calling send-order-confirmation edge function with details:", 
      JSON.stringify(orderDetails, null, 2));
    
    // Call the Supabase Edge Function directly
    const { data, error } = await supabase.functions.invoke("send-order-confirmation", {
      body: orderDetails,
    });

    if (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }

    console.log("Edge function response:", data);
    return data?.success || false;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}
