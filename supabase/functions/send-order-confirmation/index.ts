
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderDetails {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderDetails: OrderDetails = await req.json();
    
    // Generate the email content
    const emailContent = generateOrderConfirmationEmail(orderDetails);

    // Send the email
    const { data, error } = await resend.emails.send({
      from: `${orderDetails.companyName} <onboarding@resend.dev>`,
      to: [orderDetails.email],
      subject: `Order Confirmation – [Order #${orderDetails.orderNumber}]`,
      html: emailContent,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order confirmation email sent successfully",
        data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateOrderConfirmationEmail(order: OrderDetails): string {
  // Create common details section
  const commonDetails = `
    <tr>
      <td style="padding: 8px 0;">Order Number:</td>
      <td style="padding: 8px 0;"><strong>#${order.orderNumber}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px 0;">Total Amount:</td>
      <td style="padding: 8px 0;"><strong>$${order.totalAmount.toFixed(2)}</strong></td>
    </tr>
  `;

  // Create order-specific details based on order type
  let orderSpecificDetails = '';
  if (order.orderType === 'rank') {
    orderSpecificDetails = `
      <tr>
        <td style="padding: 8px 0;">Current Rank:</td>
        <td style="padding: 8px 0;"><strong>${order.currentRank}</strong></td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">Desired Rank:</td>
        <td style="padding: 8px 0;"><strong>${order.targetRank}</strong></td>
      </tr>
    `;
  } else if (order.orderType === 'mmr') {
    orderSpecificDetails = `
      <tr>
        <td style="padding: 8px 0;">Selected Hero:</td>
        <td style="padding: 8px 0;"><strong>${order.heroName}</strong></td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">Current MMR:</td>
        <td style="padding: 8px 0;"><strong>${order.currentMMR}</strong></td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">Desired MMR:</td>
        <td style="padding: 8px 0;"><strong>${order.targetMMR}</strong></td>
      </tr>
    `;
  }

  // Generate the complete HTML email
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1a2039; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #f6d26b; margin: 0; text-align: center;">${order.companyName}</h1>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
        <h2 style="color: #1a2039; margin-top: 0;">Order Confirmation</h2>
        
        <p>Dear ${order.customerName},</p>
        
        <p>Thank you for your order! 🎉 We have received your boost request and are excited to help you reach your desired rank. Below are your order details:</p>
        
        <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1a2039;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${commonDetails}
            ${orderSpecificDetails}
          </table>
        </div>
        
        <div style="background-color: #1a2039; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="color: #fff; margin-top: 0;">To proceed with your order, please join our Discord server:</p>
          <a href="${order.discordInviteLink}" style="display: inline-block; background-color: #f6d26b; color: #1a2039; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">Join Our Discord</a>
        </div>
        
        <p>Once you join, our team will guide you through the next steps. If you have any questions, feel free to reach out to our support team at <a href="mailto:${order.supportEmail}" style="color: #1a2039;">${order.supportEmail}</a>.</p>
        
        <p>Thank you for choosing us! 🚀</p>
        
        <p>Best regards,<br>${order.companyName} Team</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} ${order.companyName}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
