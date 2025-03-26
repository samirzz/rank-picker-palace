
import React from "react";
import { Rank } from "@/data/ranks/types";
import RankItem from "./RankItem";

interface RanksDropdownProps {
  ranks: Rank[];
  selectedRank: Rank | null;
  disabledRanks: Rank[];
  onRankClick: (rank: Rank, e: React.MouseEvent) => void;
}

const RanksDropdown: React.FC<RanksDropdownProps> = ({
  ranks,
  selectedRank,
  disabledRanks,
  onRankClick,
}) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-50 animate-scale-up max-h-48 md:max-h-64 overflow-y-auto">
      <div className="grid grid-cols-1 divide-y divide-white/5">
        {ranks.map((rank) => {
          const isDisabled = disabledRanks.some(disabled => disabled.id === rank.id);
          
          return (
            <RankItem
              key={rank.id}
              rank={rank}
              isDisabled={isDisabled}
              isSelected={selectedRank?.id === rank.id}
              onClick={(e) => onRankClick(rank, e)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RanksDropdown;
