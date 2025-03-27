
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Rank, RankCombination } from "@/data/ranks";
import { CombinationRowProps, SubdivisionOption } from "./types";

const CombinationRow: React.FC<CombinationRowProps> = ({
  combo,
  index,
  ranks,
  onCombinationChange,
  onRemoveCombination
}) => {
  // Find a rank by its ID
  const findRank = (rankId: string): Rank | undefined => {
    return ranks.find(rank => rank.id === rankId);
  };

  // Get subdivision options for a specific rank
  const getSubdivisionOptions = (rankId: string): SubdivisionOption[] => {
    const rank = findRank(rankId);
    if (!rank || !rank.subdivisions) return [];
    
    return rank.subdivisions.map((sub, index) => ({
      value: index,
      label: sub.name
    }));
  };

  const fromRank = findRank(combo.fromRankId);
  const toRank = findRank(combo.toRankId);
  const fromSubOptions = getSubdivisionOptions(combo.fromRankId);
  const toSubOptions = getSubdivisionOptions(combo.toRankId);
  
  return (
    <div className="grid grid-cols-12 items-center gap-2 border-b border-white/5 pb-3">
      <div className="col-span-4 md:col-span-5">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <select
            value={combo.fromRankId}
            onChange={(e) => onCombinationChange(index, 'fromRankId', e.target.value)}
            className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
          >
            {ranks.map(rank => (
              <option key={rank.id} value={rank.id}>
                {rank.name}
              </option>
            ))}
          </select>
          
          {fromSubOptions.length > 0 && (
            <select
              value={combo.fromSubdivision !== undefined ? combo.fromSubdivision : ''}
              onChange={(e) => onCombinationChange(
                index, 
                'fromSubdivision', 
                e.target.value === '' ? undefined : Number(e.target.value)
              )}
              className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
            >
              <option value="">Any subdivision</option>
              {fromSubOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      <div className="col-span-4 md:col-span-5">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <select
            value={combo.toRankId}
            onChange={(e) => onCombinationChange(index, 'toRankId', e.target.value)}
            className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
          >
            {ranks.map(rank => (
              <option key={rank.id} value={rank.id}>
                {rank.name}
              </option>
            ))}
          </select>
          
          {toSubOptions.length > 0 && (
            <select
              value={combo.toSubdivision !== undefined ? combo.toSubdivision : ''}
              onChange={(e) => onCombinationChange(
                index, 
                'toSubdivision', 
                e.target.value === '' ? undefined : Number(e.target.value)
              )}
              className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
            >
              <option value="">Any subdivision</option>
              {toSubOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      <div className="col-span-3 md:col-span-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={combo.price}
          onChange={(e) => onCombinationChange(index, 'price', e.target.value)}
          className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveCombination(index)}
          className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CombinationRow;
