
import React from "react";
import { Rank } from "@/data/ranks/types";
import { ArrowRight, ArrowDown } from "lucide-react";
import RankSelectColumn from "@/components/rank/RankSelectColumn";

export interface RankSelectorsProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  currentSubdivision: number;
  targetSubdivision: number;
  currentStars: number;
  targetStars: number;
  currentMythicPoints: number;
  targetMythicPoints: number;
  handleCurrentRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  handleTargetRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  handleCurrentStarsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTargetStarsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCurrentMythicPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTargetMythicPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rankHasPoints: (rank: Rank | null) => boolean;
  rankHasStars: (rank: Rank | null) => boolean;
  disabledTargetRanks: Rank[];
  availableRanks: Rank[];
}

const RankSelectors: React.FC<RankSelectorsProps> = ({
  currentRank,
  targetRank,
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
  disabledTargetRanks,
  availableRanks
}) => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      <div className="lg:col-span-5">
        <RankSelectColumn
          label="Current Rank"
          selectedRank={currentRank}
          onRankSelect={(rank, subdivisionIndex) => handleCurrentRankSelect(rank, subdivisionIndex || 0)}
          disabledRanks={[]}
          animationDelay={200}
          availableRanks={availableRanks}
          stars={currentStars}
          onStarsChange={handleCurrentStarsChange}
          points={currentMythicPoints}
          onPointsChange={handleCurrentMythicPointsChange}
          rankHasPoints={rankHasPoints}
          rankHasStars={rankHasStars}
        />
      </div>
      
      <div className="lg:col-span-2 flex items-center justify-center py-2 lg:py-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 flex items-center justify-center">
          <ArrowDown className="h-5 w-5 lg:hidden text-mlbb-purple" />
          <ArrowRight className="h-5 w-5 hidden lg:block text-mlbb-purple" />
        </div>
      </div>
      
      <div className="lg:col-span-5">
        <RankSelectColumn
          label="Desired Rank"
          selectedRank={targetRank}
          onRankSelect={(rank, subdivisionIndex) => handleTargetRankSelect(rank, subdivisionIndex || 0)}
          disabledRanks={disabledTargetRanks}
          animationDelay={400}
          availableRanks={availableRanks}
          stars={targetStars}
          onStarsChange={handleTargetStarsChange}
          points={targetMythicPoints}
          onPointsChange={handleTargetMythicPointsChange}
          rankHasPoints={rankHasPoints}
          rankHasStars={rankHasStars}
        />
      </div>
    </div>
  );
};

export default RankSelectors;
