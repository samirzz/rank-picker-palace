
import React from "react";
import { usePricingCard } from "./usePricingCard";
import type { Rank } from "@/data/ranks/types";
import PricingDetails from "./PricingDetails";
import CheckoutButton from "./CheckoutButton";
import PricingCardDetails from "./PricingCardDetails";
import DefaultPricingCard from "./DefaultPricingCard";
import OrderConfirmation from "./OrderConfirmation";
import PaymentMethods from "@/components/payments/PaymentMethods";
import { ServiceOption } from "@/types/service.types";

interface PricingCardProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision?: number;
  targetSubdivision?: number;
  currentStars?: number;
  targetStars?: number;
  currentMythicPoints?: number;
  targetMythicPoints?: number;
  serviceOptions?: ServiceOption[];
  animationDelay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  currentRank,
  targetRank,
  currentSubdivision = 0,
  targetSubdivision = 0,
  currentStars = 0,
  targetStars = 0,
  currentMythicPoints = 0,
  targetMythicPoints = 0,
  serviceOptions = [],
  animationDelay = 0
}) => {
  const {
    isVisible,
    showDetails,
    setShowDetails,
    basePrice,
    price,
    showPayment,
    orderComplete,
    handleProceedToCheckout,
    handlePaymentSuccess,
    handlePaymentCancel,
    formatRankName,
    getEstimatedTime,
    user,
    isProcessing,
    canCalculatePrice,
    emailSent
  } = usePricingCard({
    currentRank,
    targetRank,
    currentSubdivision,
    targetSubdivision,
    currentStars,
    targetStars,
    currentMythicPoints,
    targetMythicPoints,
    serviceOptions
  });

  // Get active service options for display
  const activeOptions = serviceOptions?.filter(opt => opt.isActive) || [];

  return (
    <div className={`transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
      <div className="glass-panel overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-purple/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-mlbb-gold/20 rounded-full filter blur-3xl opacity-10"></div>
        
        {canCalculatePrice ? (
          <div className="p-6 md:p-8">
            <div className="flex flex-col">
              <PricingDetails
                currentRankName={formatRankName(currentRank, currentSubdivision, currentStars, currentMythicPoints)}
                targetRankName={formatRankName(targetRank, targetSubdivision, targetStars, targetMythicPoints)}
                price={price}
                basePrice={basePrice}
                activeOptions={activeOptions}
              />
              
              {orderComplete ? (
                <OrderConfirmation emailSent={emailSent} />
              ) : (
                <CheckoutButton
                  onProceedToCheckout={handleProceedToCheckout}
                  isProcessing={isProcessing}
                  isLoggedIn={!!user}
                />
              )}
              
              <PricingCardDetails
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                estimatedTime={getEstimatedTime()}
              />
            </div>
          </div>
        ) : (
          <DefaultPricingCard />
        )}
        
        {showPayment && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md">
              <PaymentMethods 
                amount={price || 0} 
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
