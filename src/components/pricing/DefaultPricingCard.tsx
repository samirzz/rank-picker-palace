
import React from "react";
import { PointerIcon } from "lucide-react";

const DefaultPricingCard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
      <PointerIcon className="w-8 h-8 text-mlbb-purple/60 mb-3 animate-bounce" />
      <h3 className="text-lg font-bold text-white mb-2">Select Your Ranks</h3>
      <p className="text-sm text-gray-400">
        Please select your current rank and target rank above to see pricing and options.
      </p>
    </div>
  );
};

export default DefaultPricingCard;
