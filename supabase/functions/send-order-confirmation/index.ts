
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
  gmailUser?: string;
  gmailAppPassword?: string;
  isTest?: boolean;
}

// Email content generation function
function generateEmailContent(details: OrderEmailDetails): { subject: string; htmlContent: string } {
  const subject = details.isTest 
    ? `Test Email - Order Confirmation System` 
    : `Order Confirmation: #${details.orderNumber}`;
  
  // Create clean, optimized HTML email template
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${details.isTest ? 'Test Email' : 'Order Confirmation'}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #6b21a8; color: white; padding: 15px; text-align: center;">
      <h1 style="margin: 0;">${details.companyName}${details.isTest ? ' - Test Email' : ' - Order Confirmation'}</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
      ${details.isTest ? 
        `<p><strong>This is a test email to verify your email configuration.</strong></p>
         <p>If you're receiving this, your email settings are working correctly!</p>` 
        : 
        `<p>Dear ${details.customerName},</p>
         <p>Thank you for your order! We're excited to help you achieve your gaming goals.</p>`
      }
      
      <div style="margin-bottom: 10px;"><strong>Order Number:</strong> #${details.orderNumber}</div>
      <div style="margin-bottom: 10px;"><strong>Order Type:</strong> ${details.orderType === 'rank' ? 'Rank Boost' : 'MMR Boost'}</div>
      
      ${details.orderType === 'rank' ? `
      <div style="margin-bottom: 10px;"><strong>Current Rank:</strong> ${details.currentRank}</div>
      <div style="margin-bottom: 10px;"><strong>Target Rank:</strong> ${details.targetRank}</div>
      ` : `
      <div style="margin-bottom: 10px;"><strong>Hero:</strong> ${details.heroName}</div>
      <div style="margin-bottom: 10px;"><strong>Current MMR:</strong> ${details.currentMMR}</div>
      <div style="margin-bottom: 10px;"><strong>Target MMR:</strong> ${details.targetMMR}</div>
      `}
      
      <div style="margin-bottom: 10px;"><strong>Total Amount:</strong> $${details.totalAmount.toFixed(2)}</div>
      
      <p>Our team will begin processing your order immediately. Join our Discord community to get real-time updates on your order and chat with our boosters:</p>
      
      <p style="text-align: center; margin: 25px 0;">
        <a href="${details.discordInviteLink}" style="background-color: #6b21a8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Join Discord</a>
      </p>
      
      <p>If you have any questions, please contact our support team at ${details.supportEmail}.</p>
      
      <p>Best regards,<br>${details.companyName} Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
      <p>This is an automated email, please do not reply directly to this message.</p>
      <p>${details.companyName} | ${details.supportEmail}</p>
    </div>
  </div>
</body>
</html>`;

  return { subject, htmlContent };
}

// Validate request data
function validateRequest(details: OrderEmailDetails): void {
  if (!details.email || !details.orderNumber) {
    throw new Error("Missing required email information");
  }

  if (details.orderType !== "rank" && details.orderType !== "mmr") {
    throw new Error(`Invalid orderType: ${details.orderType}`);
  }
}

// Send email using SMTP
async function sendEmail(
  client: SMTPClient, 
  to: string, 
  from: string, 
  subject: string, 
  htmlContent: string
): Promise<any> {
  try {
    console.log("Sending email to:", to);
    
    const emailResult = await client.send({
      from: from,
      to: to,
      subject: subject,
      html: htmlContent,
      headers: {
        "X-Priority": "1",
        "Importance": "high",
        "X-MSMail-Priority": "High"
      },
      contentType: "text/html",
      encoding: "8bit", // Using 8bit encoding to avoid =20 issues
    });
    
    console.log("Email sent successfully:", emailResult);
    return emailResult;
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
    throw new Error(`Email sending failed: ${emailError.message}`);
  }
}

// Setup SMTP client with credentials
function setupSMTPClient(gmailUser: string, gmailAppPassword: string): SMTPClient {
  console.log("Setting up SMTP client with Gmail");
  
  return new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: gmailUser,
        password: gmailAppPassword,
      },
    },
  });
}

// Main request handler
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
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed, only POST is supported`);
    }

    const details: OrderEmailDetails = await req.json();
    
    // Remove password from logs for security
    const logSafeDetails = { ...details };
    if (logSafeDetails.gmailAppPassword) {
      logSafeDetails.gmailAppPassword = "********";
    }
    console.log("Received order details:", JSON.stringify(logSafeDetails, null, 2));

    // Use provided Gmail credentials or fall back to environment variables
    const gmailUser = details.gmailUser || Deno.env.get("GMAIL_USER");
    const gmailAppPassword = details.gmailAppPassword || Deno.env.get("GMAIL_APP_PASSWORD");
    
    if (!gmailUser || !gmailAppPassword) {
      console.error("Gmail credentials are not set");
      throw new Error("Email service configuration is missing");
    }

    // Validate request data
    validateRequest(details);

    // Generate email content
    const { subject, htmlContent } = generateEmailContent(details);

    // Setup SMTP client and send email
    const client = setupSMTPClient(gmailUser, gmailAppPassword);
    const emailFrom = `"${details.companyName}" <${gmailUser}>`;
    const emailResult = await sendEmail(client, details.email, emailFrom, subject, htmlContent);
    
    await client.close();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        id: emailResult
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
    
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
