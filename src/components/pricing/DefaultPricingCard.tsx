
import React from "react";

const DefaultPricingCard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center pointer-events-none">
      <h3 className="text-lg font-bold text-white mb-2">Select Your Ranks</h3>
      <p className="text-sm text-gray-400 mb-4">
        Please select your current rank and target rank to see pricing and options.
      </p>
    </div>
  );
};

export default DefaultPricingCard;
