
import React from "react";
import { RankCombination } from "@/data/ranks";
import CombinationRow from "./CombinationRow";

interface CombinationsTableProps {
  combinations: RankCombination[];
  ranks: any[];
  onCombinationChange: (index: number, field: keyof RankCombination, value: string | number) => void;
  onRemoveCombination: (index: number) => void;
}

const CombinationsTable: React.FC<CombinationsTableProps> = ({
  combinations,
  ranks,
  onCombinationChange,
  onRemoveCombination
}) => {
  if (combinations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No custom combinations added yet.</p>
        <p className="text-sm mt-2">Click "Add Combination" to create custom rank-to-rank prices.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 text-xs text-gray-400 pb-2 border-b border-white/10 px-2">
        <div className="col-span-4 md:col-span-5">From Rank</div>
        <div className="col-span-4 md:col-span-5">To Rank</div>
        <div className="col-span-3 md:col-span-2">Price ($)</div>
        <div className="col-span-1"></div>
      </div>
      
      {combinations.map((combo, index) => (
        <CombinationRow
          key={index}
          combo={combo}
          index={index}
          ranks={ranks}
          onCombinationChange={onCombinationChange}
          onRemoveCombination={onRemoveCombination}
        />
      ))}
    </div>
  );
};

export default CombinationsTable;
