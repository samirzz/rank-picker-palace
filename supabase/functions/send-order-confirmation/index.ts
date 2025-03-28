
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

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

serve(async (req) => {
  console.log("Order confirmation email function called", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("Email service configuration is missing");
    }

    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed, only POST is supported`);
    }

    const details: OrderEmailDetails = await req.json();
    console.log("Received order details:", JSON.stringify(details, null, 2));

    // Validate request data
    if (!details.email || !details.orderNumber) {
      throw new Error("Missing required email information");
    }

    // Compose email content
    const subject = `Order Confirmation: #${details.orderNumber}`;
    
    // Build HTML email template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #6b21a8; color: white; padding: 15px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
        .button { background-color: #6b21a8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .detail { margin-bottom: 10px; }
        .detail span { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${details.companyName} - Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${details.customerName},</p>
          <p>Thank you for your order! We're excited to help you achieve your gaming goals.</p>
          
          <div class="detail"><span>Order Number:</span> #${details.orderNumber}</div>
          <div class="detail"><span>Order Type:</span> ${details.orderType === 'rank' ? 'Rank Boost' : 'MMR Boost'}</div>
          
          ${details.orderType === 'rank' ? `
          <div class="detail"><span>Current Rank:</span> ${details.currentRank}</div>
          <div class="detail"><span>Target Rank:</span> ${details.targetRank}</div>
          ` : `
          <div class="detail"><span>Hero:</span> ${details.heroName}</div>
          <div class="detail"><span>Current MMR:</span> ${details.currentMMR}</div>
          <div class="detail"><span>Target MMR:</span> ${details.targetMMR}</div>
          `}
          
          <div class="detail"><span>Total Amount:</span> $${details.totalAmount.toFixed(2)}</div>
          
          <p>Our team will begin processing your order immediately. Join our Discord community to get real-time updates on your order and chat with our boosters:</p>
          
          <p style="text-align: center; margin: 25px 0;">
            <a href="${details.discordInviteLink}" class="button">Join Discord</a>
          </p>
          
          <p>If you have any questions, please contact our support team at ${details.supportEmail}.</p>
          
          <p>Best regards,<br>${details.companyName} Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Now let's send the email using Resend
    try {
      console.log("Sending email to:", details.email);
      const resendUrl = "https://api.resend.com/emails";
      
      const emailData = {
        from: `${details.companyName} <onboarding@resend.dev>`,
        to: details.email,
        subject: subject,
        html: htmlContent,
      };
      
      console.log("Email data prepared:", JSON.stringify(emailData, null, 2));
      
      const emailResponse = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      
      const emailResult = await emailResponse.json();
      console.log("Email API response:", JSON.stringify(emailResult, null, 2));
      
      if (!emailResponse.ok) {
        throw new Error(`Email service returned an error: ${JSON.stringify(emailResult)}`);
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email sent successfully",
          id: emailResult.id
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      throw new Error(`Email sending failed: ${emailError.message}`);
    }
    
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
