
import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import CheckoutContainer from "@/components/checkout/CheckoutContainer";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { useCheckout } from "@/hooks/useCheckout";

const Checkout: React.FC = () => {
  const location = useLocation();
  const { 
    orderData, 
    orderComplete, 
    orderNumber, 
    emailSent,
    handleBack, 
    handlePaymentSuccess 
  } = useCheckout(location.state);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-16">
        {!orderData ? (
          <div className="text-center">
            <p>Loading checkout information...</p>
          </div>
        ) : !orderComplete ? (
          <CheckoutContainer 
            orderType={orderData.orderType}
            currentRank={orderData.currentRank}
            targetRank={orderData.targetRank}
            currentSubdivision={orderData.currentSubdivision}
            targetSubdivision={orderData.targetSubdivision}
            hero={orderData.hero}
            currentMMR={orderData.currentMMR}
            targetMMR={orderData.targetMMR}
            totalPrice={orderData.totalPrice}
            options={orderData.options}
            onBack={handleBack}
            onPaymentSuccess={handlePaymentSuccess}
          />
        ) : (
          <OrderConfirmation 
            orderNumber={orderNumber} 
            emailSent={emailSent}
          />
        )}
      </main>
      
      <LiveChat />
      <Footer />
    </div>
  );
};

export default Checkout;
