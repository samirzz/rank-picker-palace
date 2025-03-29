
import React from "react";
import { ServiceOption } from "@/types/service.types";
import PriceDisplay from "./PriceDisplay";
import ActiveOptions from "./ActiveOptions";

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
      <PriceDisplay
        title="Rank Boost"
        subtitle={`From ${currentRankName} to ${targetRankName}`}
        price={price}
        basePrice={basePrice}
      />
      
      <ActiveOptions options={activeOptions} />
    </div>
  );
};

export default PricingDetails;
