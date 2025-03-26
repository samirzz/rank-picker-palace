
import React from "react";
import { getRankPlaceholderImage } from "@/data/ranks";

interface RankPriceRowProps {
  rank: any;
  index: number;
  onBasePriceChange: (rankId: string, value: string) => void;
  onCostPerStarChange: (rankId: string, value: string) => void;
}

const RankPriceRow: React.FC<RankPriceRowProps> = ({
  rank,
  index,
  onBasePriceChange,
  onCostPerStarChange,
}) => {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="py-3 text-sm text-gray-500">{index + 1}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
            <img
              src={rank.image}
              alt={rank.name}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getRankPlaceholderImage();
              }}
            />
          </div>
          <span className="text-sm text-white">{rank.name}</span>
        </div>
      </td>
      <td className="py-3">
        <span className="text-sm text-gray-300">Tier {rank.tier}</span>
      </td>
      <td className="py-3">
        <input
          type="number"
          min="0"
          step="1"
          value={rank.basePrice || 0}
          onChange={(e) => onBasePriceChange(rank.id, e.target.value)}
          className="w-20 px-3 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
        />
      </td>
      <td className="py-3">
        <input
          type="number"
          min="0"
          step="0.5"
          value={rank.costPerStar || 0}
          onChange={(e) => onCostPerStarChange(rank.id, e.target.value)}
          className="w-20 px-3 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
        />
      </td>
    </tr>
  );
};

export default RankPriceRow;
