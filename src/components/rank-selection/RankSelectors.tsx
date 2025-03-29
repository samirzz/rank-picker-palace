
import React from "react";
import { Rank } from "@/data/ranks/types";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useRankSelection } from "@/hooks/useRankSelection";
import RankSelector from "./RankSelector";

interface RankSelectorsProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  setCurrentRank: (rank: Rank, subdivisionIndex?: number) => void;
  setTargetRank: (rank: Rank, subdivisionIndex?: number) => void;
}

const RankSelectors: React.FC<RankSelectorsProps> = ({
  currentRank,
  targetRank,
  setCurrentRank,
  setTargetRank
}) => {
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
    getDisabledTargetRanks,
    isInitialized
  } = useRankSelection({
    currentRank,
    targetRank,
    setCurrentRank,
    setTargetRank
  });
  
  // Handle subdivision selection
  const handleCurrentSubdivisionSelect = (subdivisionIndex: number) => {
    if (currentRank) {
      handleCurrentRankSelect(currentRank, subdivisionIndex);
    }
  };

  const handleTargetSubdivisionSelect = (subdivisionIndex: number) => {
    if (targetRank) {
      handleTargetRankSelect(targetRank, subdivisionIndex);
    }
  };
  
  // Event handler adapters to convert input events to number values
  const handleCurrentStarsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrentStarsChange(Number(e.target.value));
  };
  
  const handleTargetStarsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTargetStarsChange(Number(e.target.value));
  };
  
  const handleCurrentPointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCurrentMythicPointsChange(Number(e.target.value));
  };
  
  const handleTargetPointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTargetMythicPointsChange(Number(e.target.value));
  };

  if (!isInitialized) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 opacity-50">
        <div className="lg:col-span-5 h-40 bg-black/20 animate-pulse rounded-lg"></div>
        <div className="lg:col-span-2 flex items-center justify-center"></div>
        <div className="lg:col-span-5 h-40 bg-black/20 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      <div className="lg:col-span-5">
        <RankSelector
          label="Current Rank"
          availableRanks={availableRanks}
          selectedRank={currentRank}
          selectedSubdivision={currentSubdivision}
          stars={currentStars}
          points={currentMythicPoints}
          onRankSelect={handleCurrentRankSelect}
          onSubdivisionSelect={handleCurrentSubdivisionSelect}
          onStarsChange={handleCurrentStarsInputChange}
          onPointsChange={handleCurrentPointsInputChange}
          disabledRanks={[]}
          rankHasPoints={rankHasPoints}
          rankHasStars={rankHasStars}
          animationDelay={200}
        />
      </div>
      
      <div className="lg:col-span-2 flex items-center justify-center py-2 lg:py-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 flex items-center justify-center">
          <ArrowDown className="h-5 w-5 lg:hidden text-mlbb-purple" />
          <ArrowRight className="h-5 w-5 hidden lg:block text-mlbb-purple" />
        </div>
      </div>
      
      <div className="lg:col-span-5">
        <RankSelector
          label="Desired Rank"
          availableRanks={availableRanks}
          selectedRank={targetRank}
          selectedSubdivision={targetSubdivision}
          stars={targetStars}
          points={targetMythicPoints}
          onRankSelect={handleTargetRankSelect}
          onSubdivisionSelect={handleTargetSubdivisionSelect}
          onStarsChange={handleTargetStarsInputChange}
          onPointsChange={handleTargetPointsInputChange}
          disabledRanks={getDisabledTargetRanks()}
          rankHasPoints={rankHasPoints}
          rankHasStars={rankHasStars}
          animationDelay={400}
        />
      </div>
    </div>
  );
};

export default RankSelectors;
