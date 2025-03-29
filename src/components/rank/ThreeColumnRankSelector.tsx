
import React from "react";
import { Rank } from "@/data/ranks/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ThreeColumnRankSelectorProps {
  label: string;
  availableRanks: Rank[];
  selectedRank: Rank | null;
  selectedSubdivision: number;
  stars: number;
  points: number;
  onRankSelect: (rank: Rank) => void;
  onSubdivisionSelect: (subdivisionIndex: number) => void;
  onStarsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabledRanks: string[];
  rankHasPoints: (rank: Rank | null) => boolean;
  rankHasStars: (rank: Rank | null) => boolean;
  animationDelay?: number;
}

const ThreeColumnRankSelector: React.FC<ThreeColumnRankSelectorProps> = ({
  label,
  availableRanks,
  selectedRank,
  selectedSubdivision,
  stars,
  points,
  onRankSelect,
  onSubdivisionSelect,
  onStarsChange,
  onPointsChange,
  disabledRanks,
  rankHasPoints,
  rankHasStars,
  animationDelay = 0
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  // Get max stars for current rank subdivision
  const getMaxStars = () => {
    if (!selectedRank || !selectedRank.subdivisions) return 5;
    const subdivision = selectedRank.subdivisions[selectedSubdivision];
    return subdivision?.stars || 5;
  };

  // Filter out disabled ranks
  const filteredRanks = availableRanks.filter(
    rank => !disabledRanks.includes(rank.id)
  );

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="text-center mb-2">
        <h3 className="text-base md:text-lg font-semibold text-white">{label}</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Tier Selection */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Tier</label>
          <Select 
            value={selectedRank?.id || ""}
            onValueChange={(value) => {
              const rank = availableRanks.find(r => r.id === value);
              if (rank) onRankSelect(rank);
            }}
          >
            <SelectTrigger className="w-full bg-black/50 border-gray-700">
              <SelectValue placeholder="Select Tier" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {filteredRanks.map((rank) => (
                <SelectItem key={rank.id} value={rank.id} className="text-white">
                  {rank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sub-tier Selection - only if the rank has subdivisions */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Sub-tier</label>
          <Select 
            value={selectedRank?.subdivisions ? String(selectedSubdivision) : ""}
            onValueChange={(value) => onSubdivisionSelect(parseInt(value))}
            disabled={!selectedRank?.subdivisions || selectedRank.subdivisions.length <= 1}
          >
            <SelectTrigger className="w-full bg-black/50 border-gray-700">
              <SelectValue placeholder="Select Sub-tier" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {selectedRank?.subdivisions?.map((subdivision, index) => (
                <SelectItem key={index} value={String(index)} className="text-white">
                  {subdivision.name.split(" ").pop()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Stars/Points Selection */}
        <div>
          {selectedRank && rankHasStars(selectedRank) ? (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Stars</label>
              <input 
                type="number" 
                min="0" 
                max={getMaxStars()}
                value={stars}
                onChange={onStarsChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              />
            </div>
          ) : selectedRank && rankHasPoints(selectedRank) ? (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Points</label>
              <input 
                type="number" 
                min={selectedRank.points?.min || 0}
                max={selectedRank.points?.max || 999}
                value={points}
                onChange={onPointsChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Stars/Points</label>
              <input 
                type="number" 
                disabled
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white opacity-50"
                placeholder="N/A"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeColumnRankSelector;
