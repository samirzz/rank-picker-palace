
import React from "react";
import { Star } from "lucide-react";
import { Rank } from "@/data/ranks";

interface SubdivisionItemProps {
  subdivision: { name: string; stars?: number };
  index: number;
  selectedSubdivision: number;
  onSelect: (index: number, e: React.MouseEvent) => void;
}

const SubdivisionItem: React.FC<SubdivisionItemProps> = ({
  subdivision,
  index,
  selectedSubdivision,
  onSelect,
}) => {
  return (
    <div
      key={subdivision.name}
      className="flex items-center gap-2 md:gap-3 p-2 md:p-3 transition-all duration-200 cursor-pointer hover:bg-mlbb-purple/20"
      onClick={(e) => onSelect(index, e)}
    >
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
        <span className="text-xs md:text-sm font-medium text-white">
          {subdivision.name.split(' ').pop()}
        </span>
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-white text-xs md:text-sm">{subdivision.name}</div>
        <div className="flex items-center gap-0.5 md:gap-1">
          {subdivision.stars && Array.from({ length: subdivision.stars }).map((_, starIndex) => (
            <Star 
              key={starIndex} 
              className="h-2 w-2 md:h-3 md:w-3 text-mlbb-gold fill-mlbb-gold" 
            />
          ))}
        </div>
      </div>
      
      {selectedSubdivision === index && (
        <div className="w-2 h-2 rounded-full bg-mlbb-purple"></div>
      )}
    </div>
  );
};

export default SubdivisionItem;
