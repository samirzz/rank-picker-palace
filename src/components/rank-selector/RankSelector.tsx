
import React from "react";
import { Rank } from "@/data/ranks";
import { useRankSelector } from "./useRankSelector";
import RankSelectorHeader from "./RankSelectorHeader";
import RanksDropdown from "./RanksDropdown";
import SubdivisionsDropdown from "./SubdivisionsDropdown";

interface RankSelectorProps {
  label: string;
  selectedRank: Rank | null;
  onRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  disabledRanks?: Rank[];
  animationDelay?: number;
  ranks: Rank[];
}

const RankSelector: React.FC<RankSelectorProps> = ({
  label,
  selectedRank,
  onRankSelect,
  disabledRanks = [],
  animationDelay = 0,
  ranks
}) => {
  const {
    isVisible,
    isExpanded,
    selectedSubdivision,
    showSubdivisions,
    toggleDropdown,
    handleRankClick,
    handleSubdivisionClick,
    handleBackToRanks,
    dropdownId
  } = useRankSelector({
    label,
    selectedRank,
    onRankSelect,
    animationDelay
  });

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="text-center mb-2 md:mb-3">
        <h3 className="text-base md:text-lg font-semibold text-white">{label}</h3>
      </div>
      
      <div id={dropdownId} className="relative">
        <RankSelectorHeader 
          label={label}
          selectedRank={selectedRank}
          selectedSubdivision={selectedSubdivision}
          isExpanded={isExpanded}
          onClick={toggleDropdown}
        />
        
        {isExpanded && !showSubdivisions && (
          <RanksDropdown 
            ranks={ranks}
            selectedRank={selectedRank}
            disabledRanks={disabledRanks}
            onRankClick={handleRankClick}
          />
        )}
        
        {isExpanded && showSubdivisions && selectedRank && selectedRank.subdivisions && (
          <SubdivisionsDropdown 
            selectedRank={selectedRank}
            selectedSubdivision={selectedSubdivision}
            onBackClick={handleBackToRanks}
            onSubdivisionClick={handleSubdivisionClick}
          />
        )}
      </div>
    </div>
  );
};

export default RankSelector;
