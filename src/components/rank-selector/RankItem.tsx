
import React from "react";
import { ChevronRight } from "lucide-react";
import { Rank, getRankPlaceholderImage } from "@/data/ranks";

interface RankItemProps {
  rank: Rank;
  isDisabled: boolean;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const RankItem: React.FC<RankItemProps> = ({
  rank,
  isDisabled,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 transition-all duration-200 cursor-pointer ${
        isDisabled 
          ? "opacity-50 bg-black/60 cursor-not-allowed" 
          : "hover:bg-mlbb-purple/20"
      }`}
      onClick={onClick}
    >
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
        <img 
          src={rank.image} 
          alt={rank.name} 
          className="w-6 h-6 md:w-8 md:h-8 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getRankPlaceholderImage();
          }}
        />
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-white text-xs md:text-sm">{rank.name}</div>
        <div className="flex items-center">
          {rank.points && (
            <span className="text-xs text-mlbb-gold">
              Points: {rank.points.min}-{rank.points.max}
            </span>
          )}
          {rank.subdivisions && (
            <span className="text-2xs md:text-xs text-gray-400 flex items-center gap-1">
              {rank.subdivisions.length} tiers
              <ChevronRight className="h-2 w-2 md:h-3 md:w-3 text-mlbb-purple" />
            </span>
          )}
        </div>
      </div>
      
      {isSelected && (
        <div className="w-2 h-2 rounded-full bg-mlbb-purple"></div>
      )}
    </div>
  );
};

export default RankItem;
