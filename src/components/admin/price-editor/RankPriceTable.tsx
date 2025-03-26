
import React from "react";
import RankPriceRow from "./RankPriceRow";

interface RankPriceTableProps {
  editedRanks: any[];
  onBasePriceChange: (rankId: string, value: string) => void;
  onCostPerStarChange: (rankId: string, value: string) => void;
}

const RankPriceTable: React.FC<RankPriceTableProps> = ({
  editedRanks,
  onBasePriceChange,
  onCostPerStarChange,
}) => {
  if (!editedRanks || editedRanks.length === 0) {
    return <p className="text-white text-center">No ranks data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-white/10">
            <th className="pb-2 text-left font-medium">#</th>
            <th className="pb-2 text-left font-medium">Rank</th>
            <th className="pb-2 text-left font-medium">Tier</th>
            <th className="pb-2 text-left font-medium">Base Price ($)</th>
            <th className="pb-2 text-left font-medium">Cost per Star ($)</th>
          </tr>
        </thead>
        <tbody>
          {editedRanks.map((rank, index) => (
            <RankPriceRow
              key={rank.id}
              rank={rank}
              index={index}
              onBasePriceChange={onBasePriceChange}
              onCostPerStarChange={onCostPerStarChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankPriceTable;
