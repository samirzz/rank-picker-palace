
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
    
    // Validate required fields
    if (!details.email) {
      throw new Error("Missing required email address");
    }
    
    if (!details.orderNumber) {
      console.warn("Missing order number in email details");
      details.orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      console.log("Generated fallback order number:", details.orderNumber);
    }
    
    // Set default values for optional fields
    details.discordInviteLink = details.discordInviteLink || "https://discord.gg/mlboost";
    details.companyName = details.companyName || "MLBooster";
    details.supportEmail = details.supportEmail || "support@mlbooster.com";
    
    // First, let's get the email configuration from the database
    const { data: configData, error: configError } = await supabase
      .from("configuration")
      .select("id, value")
      .in("id", ["gmail_user", "gmail_app_password"]);
    
    if (configError) {
      console.error("Error fetching email configuration:", configError);
      throw new Error("Could not fetch email configuration");
    }
    
    // Create configuration object from database values
    const emailConfig = configData.reduce((acc, item) => {
      acc[item.id] = item.value;
      return acc;
    }, {} as Record<string, string>);
    
    // Add email configuration to the request
    const requestWithConfig = {
      ...details,
      gmailUser: emailConfig.gmail_user,
      gmailAppPassword: emailConfig.gmail_app_password
    };
    
    if (!requestWithConfig.gmailUser || !requestWithConfig.gmailAppPassword) {
      console.error("Missing Gmail configuration. Please set up email settings in admin panel.");
      return false;
    }
    
    const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
      body: requestWithConfig,
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
