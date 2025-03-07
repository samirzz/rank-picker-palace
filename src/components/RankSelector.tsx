
import React, { useState, useEffect } from "react";
import { ranks, Rank, getRankPlaceholderImage } from "@/data/ranks";
import { ChevronRight, ChevronDown, Star } from "lucide-react";
import RankTierInfo from "./RankTierInfo";

interface RankSelectorProps {
  label: string;
  selectedRank: Rank | null;
  onRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  disabledRanks?: Rank[];
  animationDelay?: number;
}

const RankSelector: React.FC<RankSelectorProps> = ({
  label,
  selectedRank,
  onRankSelect,
  disabledRanks = [],
  animationDelay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubdivision, setSelectedSubdivision] = useState(0);
  const [showSubdivisions, setShowSubdivisions] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const handleRankClick = (rank: Rank) => {
    if (disabledRanks.some(disabled => disabled.id === rank.id)) {
      return;
    }
    
    setSelectedSubdivision(0);
    onRankSelect(rank, 0);
    
    // If the rank has subdivisions, show them
    if (rank.subdivisions && rank.subdivisions.length > 0) {
      setShowSubdivisions(true);
    } else {
      setIsExpanded(false);
    }
  };
  
  const handleSubdivisionClick = (rank: Rank, subdivisionIndex: number) => {
    setSelectedSubdivision(subdivisionIndex);
    onRankSelect(rank, subdivisionIndex);
    setShowSubdivisions(false);
    setIsExpanded(false);
  };

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-white">{label}</h3>
      </div>
      
      <div 
        className="relative"
        onMouseLeave={() => {
          setIsExpanded(false);
          setShowSubdivisions(false);
        }}
      >
        {/* Selected Rank (or placeholder) */}
        <div 
          className="glass-panel p-4 cursor-pointer relative overflow-hidden hover:shadow-lg hover:shadow-mlbb-purple/10 transition-all duration-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 shimmer-bg transition-opacity duration-500" 
            style={{ pointerEvents: 'none' }}
          ></div>
          
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
              {selectedRank ? (
                <img 
                  src={selectedRank.image} 
                  alt={selectedRank.name} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getRankPlaceholderImage();
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-mlbb-purple/20 flex items-center justify-center text-sm text-mlbb-lightpurple">
                  Select
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="font-semibold text-white">
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
            
            <ChevronRight className={`h-5 w-5 text-mlbb-purple transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
          </div>
        </div>
        
        {/* Rank Selection Dropdown */}
        {isExpanded && !showSubdivisions && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-20 animate-scale-up max-h-64 overflow-y-auto">
            <div className="grid grid-cols-1 divide-y divide-white/5">
              {ranks.map((rank, index) => {
                const isDisabled = disabledRanks.some(disabled => disabled.id === rank.id);
                
                return (
                  <div
                    key={rank.id}
                    className={`flex items-center gap-3 p-3 transition-all duration-200 cursor-pointer ${
                      isDisabled 
                        ? "opacity-50 bg-black/60 cursor-not-allowed" 
                        : "hover:bg-mlbb-purple/20"
                    }`}
                    onClick={() => handleRankClick(rank)}
                  >
                    <div className="w-10 h-10 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
                      <img 
                        src={rank.image} 
                        alt={rank.name} 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getRankPlaceholderImage();
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-white">{rank.name}</div>
                      <div className="flex items-center">
                        {rank.points && (
                          <span className="text-xs text-mlbb-gold">
                            Points: {rank.points.min}-{rank.points.max}
                          </span>
                        )}
                        {rank.subdivisions && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            {rank.subdivisions.length} tiers
                            <ChevronRight className="h-3 w-3 text-mlbb-purple" />
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {selectedRank && selectedRank.id === rank.id && (
                      <div className="w-2 h-2 rounded-full bg-mlbb-purple"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Subdivision Selection Dropdown */}
        {isExpanded && showSubdivisions && selectedRank && selectedRank.subdivisions && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-20 animate-scale-up max-h-64 overflow-y-auto">
            <div className="p-2 border-b border-white/10 flex items-center gap-2">
              <ChevronDown 
                className="h-4 w-4 text-mlbb-purple cursor-pointer" 
                onClick={() => setShowSubdivisions(false)}
              />
              <span className="text-sm text-white">{selectedRank.name} Tiers</span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-white/5">
              {selectedRank.subdivisions.map((subdivision, subIndex) => (
                <div
                  key={subdivision.name}
                  className="flex items-center gap-3 p-3 transition-all duration-200 cursor-pointer hover:bg-mlbb-purple/20"
                  onClick={() => handleSubdivisionClick(selectedRank, subIndex)}
                >
                  <div className="w-10 h-10 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {subdivision.name.split(' ').pop()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-white">{subdivision.name}</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: subdivision.stars || 0 }).map((_, starIndex) => (
                        <Star 
                          key={starIndex} 
                          className="h-3 w-3 text-mlbb-gold fill-mlbb-gold" 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {selectedSubdivision === subIndex && (
                    <div className="w-2 h-2 rounded-full bg-mlbb-purple"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankSelector;
