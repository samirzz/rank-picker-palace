
import React, { useState } from "react";
import RankSelector from "@/components/RankSelector";
import PricingCard from "@/components/PricingCard";
import { ArrowRight, Star } from "lucide-react";
import { Rank, ranks } from "@/data/ranks";

interface RankSelectionSectionProps {
  isIntersecting: boolean;
  currentRank: Rank | null;
  setCurrentRank: (rank: Rank, subdivisionIndex?: number) => void;
  targetRank: Rank | null;
  setTargetRank: (rank: Rank, subdivisionIndex?: number) => void;
}

const RankSelectionSection: React.FC<RankSelectionSectionProps> = ({
  isIntersecting,
  currentRank,
  setCurrentRank,
  targetRank,
  setTargetRank
}) => {
  const [currentSubdivision, setCurrentSubdivision] = useState(0);
  const [targetSubdivision, setTargetSubdivision] = useState(0);

  const handleCurrentRankSelect = (rank: Rank, subdivisionIndex: number = 0) => {
    setCurrentRank(rank);
    setCurrentSubdivision(subdivisionIndex);
  };

  const handleTargetRankSelect = (rank: Rank, subdivisionIndex: number = 0) => {
    setTargetRank(rank);
    setTargetSubdivision(subdivisionIndex);
  };

  // Determine which ranks should be disabled for target selection
  const getDisabledTargetRanks = () => {
    if (!currentRank) return [];
    
    // If current rank has subdivisions selected, we need to disable:
    // 1. All ranks with lower tier than current rank
    // 2. Current rank's subdivisions that are lower than or equal to selected subdivision
    return ranks.filter(rank => {
      // Filter out lower tier ranks
      if (rank.tier < currentRank.tier) return true;
      
      // If same rank, filter out same or lower subdivisions
      if (rank.id === currentRank.id) {
        if (!rank.subdivisions) return true;
        // This rank would be completely disabled if not using subdivisions
        return true;
      }
      
      return false;
    });
  };

  return (
    <section
      id="ranks"
      className="relative py-20 md:py-32 px-4 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-mlbb-purple/10 rounded-full filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-mlbb-gold/10 rounded-full filter blur-[100px] opacity-20"></div>
      
      <div 
        className={`container mx-auto max-w-5xl transition-all duration-1000 transform ${
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-16">
          <span className="inline-block text-sm px-3 py-1 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 text-mlbb-lightpurple mb-3">
            Simple & Secure
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Select Your <span className="text-mlbb-purple">Ranks</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose your current rank and your desired target rank. 
            Our professional boosters will help you achieve your goals quickly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Current Rank Selector */}
          <div className="md:col-span-5">
            <RankSelector
              label="Current Rank"
              selectedRank={currentRank}
              onRankSelect={handleCurrentRankSelect}
              disabledRanks={[]}
              animationDelay={200}
            />
          </div>
          
          {/* Arrow */}
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-mlbb-purple" />
            </div>
          </div>
          
          {/* Target Rank Selector */}
          <div className="md:col-span-5">
            <RankSelector
              label="Desired Rank"
              selectedRank={targetRank}
              onRankSelect={handleTargetRankSelect}
              disabledRanks={getDisabledTargetRanks()}
              animationDelay={400}
            />
          </div>
        </div>
        
        {/* Pricing Card */}
        <div className="mt-12 max-w-md mx-auto">
          <PricingCard
            currentRank={currentRank}
            targetRank={targetRank}
            currentSubdivision={currentSubdivision}
            targetSubdivision={targetSubdivision}
            animationDelay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default RankSelectionSection;
