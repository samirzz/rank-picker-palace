
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import { Button } from "@/components/ui/button";
import { ServiceOption } from "@/types/service.types";
import { Rank } from "@/data/ranks/types";
import { ArrowLeft, CheckCircle, Shield } from "lucide-react";
import PaymentMethods from "@/components/payments/PaymentMethods";
import { useOrderService } from "@/hooks/useOrderService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Hero } from "@/types/hero.types";

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createOrder, isProcessing } = useOrderService();
  
  const [orderData, setOrderData] = useState<{
    orderType: "rank" | "mmr";
    currentRank?: Rank | null;
    targetRank?: Rank | null;
    currentSubdivision?: number;
    targetSubdivision?: number;
    currentStars?: number;
    targetStars?: number;
    currentMythicPoints?: number;
    targetMythicPoints?: number;
    hero?: Hero | null;
    currentMMR?: number;
    targetMMR?: number;
    basePrice: number | null;
    totalPrice: number | null;
    options: ServiceOption[];
  } | null>(null);
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  useEffect(() => {
    if (!location.state) {
      navigate('/');
      toast({
        title: "Missing order information",
        description: "Please select your boost details before proceeding to checkout",
        variant: "destructive"
      });
      return;
    }
    
    setOrderData(location.state);
    console.log("Checkout initialized with data:", JSON.stringify(location.state, null, 2));
  }, [location.state, navigate, toast]);
  
  const handlePaymentSuccess = async () => {
    try {
      if (!orderData || !orderData.totalPrice) {
        throw new Error("Missing required order information");
      }
      
      // Ensure orderType is correct and matches the expected type
      const orderType: "rank" | "mmr" = orderData.hero ? "mmr" : "rank";
      console.log(`Creating ${orderType} order`);
      
      const orderRequest = {
        orderType: orderType,
        totalAmount: orderData.totalPrice,
        customerName: user?.email?.split("@")[0],
        options: orderData.options.filter(opt => opt.isActive)
      };
      
      // Add rank-specific fields
      if (orderType === "rank" && orderData.currentRank && orderData.targetRank) {
        Object.assign(orderRequest, {
          currentRank: orderData.currentRank,
          targetRank: orderData.targetRank,
          currentSubdivision: orderData.currentSubdivision,
          targetSubdivision: orderData.targetSubdivision
        });
      }
      
      // Add MMR-specific fields
      if (orderType === "mmr" && orderData.hero) {
        Object.assign(orderRequest, {
          hero: orderData.hero,
          currentMMR: orderData.currentMMR,
          targetMMR: orderData.targetMMR
        });
      }
      
      console.log("Submitting order request:", JSON.stringify(orderRequest, null, 2));
      
      const result = await createOrder(orderRequest);
      
      if (!result.success) {
        throw new Error("Failed to process order");
      }
      
      setOrderComplete(true);
      setOrderNumber(result.orderNumber || null);
      
      toast({
        title: "Order Confirmed",
        description: "Thank you for your order! Check your email for confirmation details.",
      });
    } catch (error) {
      console.error("Order processing error:", error);
      toast({
        title: "Order Processing Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  if (!orderData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p>Loading checkout information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-16">
        {!orderComplete ? (
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-8 text-gray-400 hover:text-white"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Complete Your Order</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              <div className="lg:col-span-3">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    {orderData?.orderType === "rank" ? (
                      <div className="flex justify-between">
                        <span>Rank Boost:</span>
                        <span>
                          {orderData?.currentRank?.name} → {orderData?.targetRank?.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Hero:</span>
                          <span>{orderData?.hero?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>MMR Boost:</span>
                          <span>
                            {orderData?.currentMMR} → {orderData?.targetMMR}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {orderData?.options.filter(opt => opt.isActive).length > 0 && (
                      <div>
                        <div className="font-medium mb-2">Additional Services:</div>
                        <ul className="space-y-2">
                          {orderData?.options.filter(opt => opt.isActive).map(option => (
                            <li key={option.id} className="flex justify-between text-sm">
                              <span>{option.name}</span>
                              <span className="text-mlbb-gold">+{option.percentageIncrease}%</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between font-bold">
                        <span>Total Price:</span>
                        <span className="text-mlbb-gold">${orderData?.totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400 mt-4">
                      <Shield className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span>Secure payment processing. Your account information is protected.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  
                  <PaymentMethods 
                    amount={orderData?.totalPrice || 0} 
                    onSuccess={handlePaymentSuccess}
                    onCancel={handleBack}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-panel p-8 md:p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-4">Order Confirmed!</h1>
              
              {orderNumber && (
                <p className="text-gray-300 mb-2">Order Number: #{orderNumber}</p>
              )}
              
              <p className="text-gray-300 mb-6">
                Thank you for your order. We've sent a confirmation email with all the details.
                Our team will begin processing your order immediately.
              </p>
              
              <Button 
                onClick={() => navigate('/')}
                className="bg-mlbb-purple hover:bg-mlbb-darkpurple"
              >
                Return to Home
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <LiveChat />
      <Footer />
    </div>
  );
};

export default Checkout;
