import React from "react";
import { Input } from "@/components/ui/input";
import { Rank } from "@/data/ranks/types";

interface PointsInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rank: Rank | null;
}

const PointsInput: React.FC<PointsInputProps> = ({ label, value, onChange, rank }) => {
  if (!rank) return null;
  
  // Get min and max from rank's points property
  const minPoints = rank.points?.min || 0;
  const maxPoints = rank.points?.max || 999;
  
  let pointsLabel = "Points";
  if (rank.id === "mythic") pointsLabel = "Mythic Points";
  else if (rank.id === "mythic-honor") pointsLabel = "Mythic Honor Points";
  else if (rank.id === "mythical-glory") pointsLabel = "Mythical Glory Points";
  else if (rank.id === "immortal") pointsLabel = "Immortal Points";

  return (
    <div className="mt-4 glass-panel p-4 animate-fade-in">
      <label className="block text-sm text-mlbb-lightpurple mb-2">
        {label}
      </label>
      <Input
        type="number"
        min={minPoints}
        max={maxPoints}
        value={value}
        onChange={onChange}
        className="bg-black/20 border-mlbb-purple/30 text-white"
      />
      <div className="mt-2 text-xs text-gray-400">
        {pointsLabel}
      </div>
    </div>
  );
};

export default PointsInput;
