
import React from "react";
import { Star } from "lucide-react";
import { Rank, RankSubdivision } from "@/data/ranks";

interface RankTierInfoProps {
  rank: Rank;
  selectedSubdivision?: number;
}

const RankTierInfo: React.FC<RankTierInfoProps> = ({ 
  rank, 
  selectedSubdivision = 0 
}) => {
  // For Mythic ranks that use points instead of stars
  if (rank.points) {
    return (
      <div className="mt-1 text-xs text-gray-400">
        <span className="text-mlbb-gold">Points: {rank.points.min}-{rank.points.max}</span>
      </div>
    );
  }
  
  // For ranks with subdivisions and stars
  if (rank.subdivisions && rank.subdivisions.length > 0) {
    const subdivision = rank.subdivisions[selectedSubdivision];
    
    if (!subdivision) return null;
    
    return (
      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: subdivision.stars }).map((_, index) => (
          <Star 
            key={index} 
            className="h-3 w-3 text-mlbb-gold fill-mlbb-gold" 
          />
        ))}
      </div>
    );
  }
  
  return null;
};

export default RankTierInfo;
