
import React from "react";
import { Rank } from "@/data/ranks/types";
import PricingCard from "@/components/pricing/PricingCard";
import { ServiceOption } from "@/types/service.types";
import { useRankSelection } from "@/hooks/useRankSelection";

interface PricingSectionProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  serviceOptions: ServiceOption[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  currentRank, 
  targetRank,
  serviceOptions 
}) => {
  const {
    currentSubdivision,
    targetSubdivision,
    currentStars,
    targetStars,
    currentMythicPoints,
    targetMythicPoints
  } = useRankSelection({
    currentRank,
    targetRank,
    setCurrentRank: () => {}, // These are required by the hook but not used here
    setTargetRank: () => {},  // as we're only accessing the state values
  });

  return (
    <div className="mt-12 md:mt-16 mx-auto max-w-full md:max-w-md">
      <PricingCard
        currentRank={currentRank}
        targetRank={targetRank}
        currentSubdivision={currentSubdivision}
        targetSubdivision={targetSubdivision}
        currentStars={currentStars}
        targetStars={targetStars}
        currentMythicPoints={currentMythicPoints}
        targetMythicPoints={targetMythicPoints}
        serviceOptions={serviceOptions}
        animationDelay={600}
      />
    </div>
  );
};

export default PricingSection;
