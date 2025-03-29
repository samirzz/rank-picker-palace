
import React from "react";
import { Rank } from "@/data/ranks/types";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useRankSelection } from "@/hooks/useRankSelection";
import RankSelector from "./RankSelector";

interface RankSelectorsProps {
  availableRanks: Rank[];
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision: number;
  targetSubdivision: number;
  currentStars: number;
  targetStars: number;
  currentMythicPoints: number;
  targetMythicPoints: number;
  onCurrentRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  onTargetRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  onCurrentStarsChange: (stars: number) => void;
  onTargetStarsChange: (stars: number) => void;
  onCurrentMythicPointsChange: (points: number) => void;
  onTargetMythicPointsChange: (points: number) => void;
  rankHasPoints: (rank: Rank | null) => boolean;
  rankHasStars: (rank: Rank | null) => boolean;
  disabledTargetRanks: string[];
}

const RankSelectors: React.FC<RankSelectorsProps> = ({
  availableRanks,
  currentRank,
  targetRank,
  currentSubdivision,
  targetSubdivision,
  currentStars,
  targetStars,
  currentMythicPoints,
  targetMythicPoints,
  onCurrentRankSelect,
  onTargetRankSelect,
  onCurrentStarsChange,
  onTargetStarsChange,
  onCurrentMythicPointsChange,
  onTargetMythicPointsChange,
  rankHasPoints,
  rankHasStars,
  disabledTargetRanks
}) => {
  // Handle subdivision selection
  const handleCurrentSubdivisionSelect = (subdivisionIndex: number) => {
    if (currentRank) {
      onCurrentRankSelect(currentRank, subdivisionIndex);
    }
  };

  const handleTargetSubdivisionSelect = (subdivisionIndex: number) => {
    if (targetRank) {
      onTargetRankSelect(targetRank, subdivisionIndex);
    }
  };
  
  // Event handler adapters to convert input events to number values
  const handleCurrentStarsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCurrentStarsChange(Number(e.target.value));
  };
  
  const handleTargetStarsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTargetStarsChange(Number(e.target.value));
  };
  
  const handleCurrentPointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCurrentMythicPointsChange(Number(e.target.value));
  };
  
  const handleTargetPointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTargetMythicPointsChange(Number(e.target.value));
  };

  if (!availableRanks.length) {
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
          onRankSelect={onCurrentRankSelect}
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
          onRankSelect={onTargetRankSelect}
          onSubdivisionSelect={handleTargetSubdivisionSelect}
          onStarsChange={handleTargetStarsInputChange}
          onPointsChange={handleTargetPointsInputChange}
          disabledRanks={disabledTargetRanks}
          rankHasPoints={rankHasPoints}
          rankHasStars={rankHasStars}
          animationDelay={400}
        />
      </div>
    </div>
  );
};

export default RankSelectors;
