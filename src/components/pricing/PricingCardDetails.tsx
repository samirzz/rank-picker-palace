
import React from "react";
import { ChevronUp, ChevronDown, CheckCircle } from "lucide-react";

interface PricingCardDetailsProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  estimatedTime: string;
}

const PricingCardDetails: React.FC<PricingCardDetailsProps> = ({
  showDetails,
  setShowDetails,
  estimatedTime
}) => {
  const benefits = [
    "Top 1% boosters", 
    "24/7 Customer support", 
    "Stream enabled", 
    "Guaranteed secure account handling", 
    "100% boosting completion rate"
  ];

  return (
    <>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center justify-center gap-1 mt-3 text-sm text-gray-400 hover:text-white transition-colors"
      >
        {showDetails ? (
          <>
            Hide details <ChevronUp size={16} />
          </>
        ) : (
          <>
            Show details <ChevronDown size={16} />
          </>
        )}
      </button>
      
      {showDetails && (
        <div className="mt-5 pt-5 border-t border-gray-700/30">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Estimated Completion Time:</span>
              <span className="text-sm font-medium text-white">{estimatedTime}</span>
            </div>
            
            <div className="pt-3">
              <h4 className="text-sm font-medium text-white mb-2">Included Benefits:</h4>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingCardDetails;
