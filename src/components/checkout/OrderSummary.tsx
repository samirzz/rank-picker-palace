
import React from "react";
import { Rank } from "@/data/ranks/types";
import { ServiceOption } from "@/types/service.types";
import { Hero } from "@/types/hero.types";
import { Shield } from "lucide-react";

interface OrderSummaryProps {
  orderType: "rank" | "mmr";
  currentRank?: Rank | null;
  targetRank?: Rank | null;
  hero?: Hero | null;
  currentMMR?: number;
  targetMMR?: number;
  totalPrice?: number | null;
  options: ServiceOption[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderType,
  currentRank,
  targetRank,
  hero,
  currentMMR,
  targetMMR,
  totalPrice,
  options
}) => {
  const activeOptions = options.filter(opt => opt.isActive);
  
  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {orderType === "rank" ? (
          <div className="flex justify-between">
            <span>Rank Boost:</span>
            <span>
              {currentRank?.name} → {targetRank?.name}
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <span>Hero:</span>
              <span>{hero?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>MMR Boost:</span>
              <span>
                {currentMMR} → {targetMMR}
              </span>
            </div>
          </>
        )}
        
        {activeOptions.length > 0 && (
          <div>
            <div className="font-medium mb-2">Additional Services:</div>
            <ul className="space-y-2">
              {activeOptions.map(option => (
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
            <span className="text-mlbb-gold">${totalPrice?.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-gray-400 mt-4">
          <Shield className="h-3 w-3 mr-2 flex-shrink-0" />
          <span>Secure payment processing. Your account information is protected.</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
