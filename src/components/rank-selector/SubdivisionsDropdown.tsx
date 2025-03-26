
import React from "react";
import { ChevronDown } from "lucide-react";
import { Rank } from "@/data/ranks/types";
import SubdivisionItem from "./SubdivisionItem";

interface SubdivisionsDropdownProps {
  selectedRank: Rank;
  selectedSubdivision: number;
  onBackClick: (e: React.MouseEvent) => void;
  onSubdivisionClick: (rank: Rank, subdivisionIndex: number, e: React.MouseEvent) => void;
}

const SubdivisionsDropdown: React.FC<SubdivisionsDropdownProps> = ({
  selectedRank,
  selectedSubdivision,
  onBackClick,
  onSubdivisionClick,
}) => {
  if (!selectedRank.subdivisions) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-50 animate-scale-up max-h-48 md:max-h-64 overflow-y-auto">
      <div className="p-2 border-b border-white/10 flex items-center gap-2">
        <ChevronDown 
          className="h-3 w-3 md:h-4 md:w-4 text-mlbb-purple cursor-pointer" 
          onClick={onBackClick}
        />
        <span className="text-xs md:text-sm text-white">{selectedRank.name} Tiers</span>
      </div>
      <div className="grid grid-cols-1 divide-y divide-white/5">
        {selectedRank.subdivisions.map((subdivision, subIndex) => (
          <SubdivisionItem 
            key={subdivision.name}
            subdivision={subdivision}
            index={subIndex}
            selectedSubdivision={selectedSubdivision}
            onSelect={(index, e) => onSubdivisionClick(selectedRank, index, e)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubdivisionsDropdown;
