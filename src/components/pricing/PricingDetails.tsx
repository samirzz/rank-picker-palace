
import React from "react";
import { ServiceOption } from "@/types/service.types";

interface PricingDetailsProps {
  currentRankName: string;
  targetRankName: string;
  price: number | null;
  basePrice?: number | null;
  activeOptions?: ServiceOption[];
}

const PricingDetails: React.FC<PricingDetailsProps> = ({
  currentRankName,
  targetRankName,
  price,
  basePrice,
  activeOptions = []
}) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">Rank Boost</h3>
          <div className="text-xs md:text-sm text-gray-400 mt-1">From {currentRankName} to {targetRankName}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Price</div>
          <div className="text-2xl md:text-3xl font-bold text-mlbb-gold">${price?.toFixed(2)}</div>
          
          {basePrice && basePrice !== price && (
            <div className="text-xs text-gray-400">
              Base: ${basePrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      
      {activeOptions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/30">
          <h4 className="text-sm font-medium text-white mb-2">Additional Services:</h4>
          <ul className="space-y-2">
            {activeOptions.map(option => (
              <li key={option.id} className="flex justify-between text-sm">
                <span className="text-gray-300">{option.name}</span>
                <span className="text-mlbb-gold">+{option.percentageIncrease}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PricingDetails;
