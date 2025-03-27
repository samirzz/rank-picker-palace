
import React from "react";
import { Rank } from "@/data/ranks/types";
import RankSelector from "@/components/rank-selector/RankSelector";
import StarsInput from "./StarsInput";
import PointsInput from "./PointsInput";

interface RankSelectColumnProps {
  label: string;
  selectedRank: Rank | null;
  onRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  disabledRanks: Rank[];
  animationDelay: number;
  availableRanks: Rank[];
  stars: number;
  onStarsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  points: number;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rankHasPoints: (rank: Rank | null) => boolean;
  rankHasStars: (rank: Rank | null) => boolean;
  className?: string; // Added className prop for more flexible positioning
}

const RankSelectColumn: React.FC<RankSelectColumnProps> = ({
  label,
  selectedRank,
  onRankSelect,
  disabledRanks,
  animationDelay,
  availableRanks,
  stars,
  onStarsChange,
  points,
  onPointsChange,
  rankHasPoints,
  rankHasStars,
  className = ""
}) => {
  // Determine max stars for the selected rank subdivision
  const getMaxStars = () => {
    if (!selectedRank || !selectedRank.subdivisions) return 5;
    const subdivision = selectedRank.subdivisions[0]; // Using first subdivision as reference
    return subdivision.stars || 5;
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <RankSelector
        label={label}
        selectedRank={selectedRank}
        onRankSelect={onRankSelect}
        disabledRanks={disabledRanks}
        animationDelay={animationDelay}
        ranks={availableRanks}
      />

      {/* Stars Input for all ranks except those with points */}
      {selectedRank && rankHasStars(selectedRank) && (
        <StarsInput 
          label={`${label === "Current Rank" ? "Current" : "Desired"} Stars`}
          value={stars}
          onChange={onStarsChange}
          maxStars={getMaxStars()}
          className="mt-4"
        />
      )}

      {/* Mythic Points Input */}
      {selectedRank && rankHasPoints(selectedRank) && (
        <PointsInput
          label={`${label === "Current Rank" ? "Current" : "Desired"} Points`}
          value={points}
          onChange={onPointsChange}
          rank={selectedRank}
        />
      )}
    </div>
  );
};

export default RankSelectColumn;
