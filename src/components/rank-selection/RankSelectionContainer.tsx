
import React, { useState, useEffect } from "react";
import RankSelectors from "./RankSelectors";
import ServiceOptions from "./ServiceOptions";
import PricingSection from "./PricingSection";
import { useRankSelection } from "@/hooks/useRankSelection";
import { useServiceOptions } from "@/hooks/useServiceOptions";
import { Rank } from "@/data/ranks/types";

const RankSelectionContainer: React.FC = () => {
  const [currentRank, setCurrentRank] = useState<Rank | null>(null);
  const [targetRank, setTargetRank] = useState<Rank | null>(null);
  
  const {
    availableRanks,
    currentSubdivision,
    targetSubdivision,
    currentStars,
    targetStars,
    currentMythicPoints,
    targetMythicPoints,
    handleCurrentRankSelect,
    handleTargetRankSelect,
    handleCurrentStarsChange,
    handleTargetStarsChange,
    handleCurrentMythicPointsChange,
    handleTargetMythicPointsChange,
    rankHasPoints,
    rankHasStars,
    getDisabledTargetRanks
  } = useRankSelection({
    currentRank, 
    targetRank,
    setCurrentRank: (rank: Rank) => setCurrentRank(rank),
    setTargetRank: (rank: Rank) => setTargetRank(rank)
  });
  
  // Calculate price based on selected ranks
  const { serviceOptions, toggleOption, totalPrice } = useServiceOptions(null);
  
  // Handle option toggle
  const handleOptionToggle = (id: string, isActive: boolean) => {
    toggleOption(id, isActive);
  };
  
  return (
    <div className="flex flex-col space-y-10 pt-6 md:pt-10">
      <RankSelectors 
        availableRanks={availableRanks}
        currentRank={currentRank}
        targetRank={targetRank}
        currentSubdivision={currentSubdivision}
        targetSubdivision={targetSubdivision}
        currentStars={currentStars}
        targetStars={targetStars}
        currentMythicPoints={currentMythicPoints}
        targetMythicPoints={targetMythicPoints}
        onCurrentRankSelect={handleCurrentRankSelect}
        onTargetRankSelect={handleTargetRankSelect}
        onCurrentStarsChange={handleCurrentStarsChange}
        onTargetStarsChange={handleTargetStarsChange}
        onCurrentMythicPointsChange={handleCurrentMythicPointsChange}
        onTargetMythicPointsChange={handleTargetMythicPointsChange}
        rankHasPoints={rankHasPoints}
        rankHasStars={rankHasStars}
        disabledTargetRanks={getDisabledTargetRanks()}
      />
      
      <ServiceOptions
        serviceOptions={serviceOptions}
        onToggle={handleOptionToggle}
      />
      
      <PricingSection
        currentRank={currentRank}
        targetRank={targetRank}
        serviceOptions={serviceOptions}
      />
    </div>
  );
};

export default RankSelectionContainer;
