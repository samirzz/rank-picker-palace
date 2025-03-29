
import React from "react";
import { ServiceOption } from "@/types/service.types";

interface PriceDisplayProps {
  title: string;
  subtitle: string;
  price: number | null;
  basePrice?: number | null;
  activeOptions?: ServiceOption[];
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  title,
  subtitle,
  price,
  basePrice,
  activeOptions = []
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
        <div className="text-xs md:text-sm text-gray-400 mt-1">{subtitle}</div>
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
  );
};

export default PriceDisplay;
