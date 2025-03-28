
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/types/hero.types";
import { Rank } from "@/data/ranks";
import { sendOrderConfirmationEmail } from "@/services/email.service";
import { ServiceOption } from "@/types/service.types";

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
  options?: ServiceOption[];
}

export async function createOrder(orderData: OrderData, userId: string, userEmail: string) {
  try {
    if (!userId || !userEmail) {
      throw new Error("User must be logged in to create an order");
    }

    // Generate a simple order number based on timestamp and random digits
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    
    console.log("Creating order with data:", JSON.stringify({
      ...orderData,
      userId,
      userEmail,
      orderNumber
    }, null, 2));
    
    // Validate orderType
    if (orderData.orderType !== "rank" && orderData.orderType !== "mmr") {
      console.error(`Invalid orderType: ${orderData.orderType}, auto-detecting`);
      orderData.orderType = orderData.hero ? "mmr" : "rank";
      console.log("Auto-detected orderType:", orderData.orderType);
    }
    
    // Create order data object with the fields that exist in the database
    const orderDataToSave = {
      user_id: userId,
      order_type: orderData.orderType,
      current_rank: orderData.currentRank?.id,
      target_rank: orderData.targetRank?.id,
      current_mmr: orderData.currentMMR,
      target_mmr: orderData.targetMMR,
      hero_id: orderData.hero?.id,
      total_amount: orderData.totalAmount,
      email: userEmail,
      customer_name: orderData.customerName || userEmail.split("@")[0],
      order_number: orderNumber
    };
    
    console.log("Saving order to database with:", JSON.stringify(orderDataToSave, null, 2));
    
    // Save order to database
    const { data: orderRecord, error: saveError } = await supabase.from("orders").insert(orderDataToSave).select().single();

    if (saveError) {
      console.error("Error saving order:", saveError);
      throw saveError;
    }

    console.log("Order saved successfully:", orderRecord);

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
      // Send confirmation email with a timeout
      console.log("Preparing to send order confirmation email...");
      
      const emailDetails = {
        id: orderRecord.id,
        orderNumber,
        customerName: orderData.customerName || userEmail.split("@")[0],
        email: userEmail,
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
      };
      
      console.log("Email details prepared:", JSON.stringify(emailDetails, null, 2));
      
      // Send email and wait for result
      const emailSent = await sendOrderConfirmationEmail(emailDetails);
      
      console.log("Email sending result:", emailSent);

      return { 
        success: true, 
        orderId: orderRecord.id, 
        orderNumber,
        emailSent
      };
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

  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error };
  }
}
