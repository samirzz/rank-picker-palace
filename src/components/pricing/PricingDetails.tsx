
import React from "react";

interface PricingDetailsProps {
  currentRankName: string;
  targetRankName: string;
  price: number | null;
}

const PricingDetails: React.FC<PricingDetailsProps> = ({
  currentRankName,
  targetRankName,
  price
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg md:text-xl font-bold text-white">Rank Boost</h3>
        <div className="text-xs md:text-sm text-gray-400 mt-1">
          From {currentRankName} to {targetRankName}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">Price</div>
        <div className="text-2xl md:text-3xl font-bold text-mlbb-gold">
          ${price?.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;
