
import React from "react";
import { Rank } from "@/data/ranks/types";
import ThreeColumnRankSelector from "@/components/rank/ThreeColumnRankSelector";

interface RankSelectorProps {
  label: string;
  availableRanks: Rank[];
  selectedRank: Rank | null;
  selectedSubdivision: number;
  stars: number;
  points: number;
  onRankSelect: (rank: Rank) => void;
  onSubdivisionSelect: (subdivisionIndex: number) => void;
  onStarsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabledRanks: string[];
  rankHasPoints: (rank: Rank | null) => boolean;
  rankHasStars: (rank: Rank | null) => boolean;
  animationDelay?: number;
}

const RankSelector: React.FC<RankSelectorProps> = ({
  label,
  availableRanks,
  selectedRank,
  selectedSubdivision,
  stars,
  points,
  onRankSelect,
  onSubdivisionSelect,
  onStarsChange,
  onPointsChange,
  disabledRanks,
  rankHasPoints,
  rankHasStars,
  animationDelay = 0
}) => {
  return (
    <ThreeColumnRankSelector
      label={label}
      availableRanks={availableRanks}
      selectedRank={selectedRank}
      selectedSubdivision={selectedSubdivision}
      stars={stars}
      points={points}
      onRankSelect={onRankSelect}
      onSubdivisionSelect={onSubdivisionSelect}
      onStarsChange={onStarsChange}
      onPointsChange={onPointsChange}
      disabledRanks={disabledRanks}
      rankHasPoints={rankHasPoints}
      rankHasStars={rankHasStars}
      animationDelay={animationDelay}
    />
  );
};

export default RankSelector;
