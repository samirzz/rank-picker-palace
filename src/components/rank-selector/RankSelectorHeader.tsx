
import React from "react";
import { getRankPlaceholderImage } from "@/data/ranks";
import { ChevronRight } from "lucide-react";
import RankTierInfo from "@/components/RankTierInfo";

interface RankSelectorHeaderProps {
  label: string;
  selectedRank: any;
  selectedSubdivision: number;
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const RankSelectorHeader: React.FC<RankSelectorHeaderProps> = ({
  label,
  selectedRank,
  selectedSubdivision,
  isExpanded,
  onClick,
}) => {
  return (
    <div 
      className="glass-panel p-3 md:p-4 cursor-pointer relative overflow-hidden hover:shadow-lg hover:shadow-mlbb-purple/10 transition-all duration-300"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 shimmer-bg transition-opacity duration-500" 
        style={{ pointerEvents: 'none' }}
      ></div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
          {selectedRank ? (
            <img 
              src={selectedRank.image} 
              alt={selectedRank.name} 
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getRankPlaceholderImage();
              }}
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-mlbb-purple/20 flex items-center justify-center text-xs md:text-sm text-mlbb-lightpurple">
              Select
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="font-semibold text-white text-sm md:text-base">
            {selectedRank 
              ? (selectedRank.subdivisions 
                ? selectedRank.subdivisions[selectedSubdivision]?.name 
                : selectedRank.name)
              : "Select Rank"
            }
          </div>
          {selectedRank && (
            <RankTierInfo 
              rank={selectedRank} 
              selectedSubdivision={selectedSubdivision} 
            />
          )}
        </div>
        
        <ChevronRight className={`h-4 w-4 md:h-5 md:w-5 text-mlbb-purple transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
      </div>
    </div>
  );
};

export default RankSelectorHeader;
