
import React from "react";
import { Rank } from "@/data/ranks";
import RankSelector from "@/components/RankSelector";
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
  rankHasPoints
}) => {
  return (
    <div className="md:col-span-5">
      <RankSelector
        label={label}
        selectedRank={selectedRank}
        onRankSelect={onRankSelect}
        disabledRanks={disabledRanks}
        animationDelay={animationDelay}
        ranks={availableRanks}
      />

      {/* Stars Input for Legend rank */}
      {selectedRank && selectedRank.id === "legend" && (
        <StarsInput 
          label={`${label === "Current Rank" ? "Current" : "Desired"} Stars`}
          value={stars}
          onChange={onStarsChange}
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
