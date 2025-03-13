
import React, { useState, useEffect } from "react";
import RankSelector from "@/components/RankSelector";
import PricingCard from "@/components/PricingCard";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Rank, ranks, getAdminRanks } from "@/data/ranks";
import { Input } from "@/components/ui/input";

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
  const [availableRanks, setAvailableRanks] = useState(ranks);
  const [currentStars, setCurrentStars] = useState(0);
  const [targetStars, setTargetStars] = useState(0);
  const [currentMythicPoints, setCurrentMythicPoints] = useState(0);
  const [targetMythicPoints, setTargetMythicPoints] = useState(0);

  // Update ranks when admin changes prices
  useEffect(() => {
    const handleAdminPriceChange = () => {
      const updatedRanks = getAdminRanks();
      setAvailableRanks(updatedRanks);
      
      // Update current and target ranks with new price modifiers if they exist
      if (currentRank) {
        const updatedCurrentRank = updatedRanks.find(rank => rank.id === currentRank.id);
        if (updatedCurrentRank) {
          setCurrentRank(updatedCurrentRank, currentSubdivision);
        }
      }
      
      if (targetRank) {
        const updatedTargetRank = updatedRanks.find(rank => rank.id === targetRank.id);
        if (updatedTargetRank) {
          setTargetRank(updatedTargetRank, targetSubdivision);
        }
      }
    };

    // Listen for the custom event
    window.addEventListener('adminPriceChange', handleAdminPriceChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('adminPriceChange', handleAdminPriceChange);
    };
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, setCurrentRank, setTargetRank]);

  const handleCurrentRankSelect = (rank: Rank, subdivisionIndex: number = 0) => {
    setCurrentRank(rank);
    setCurrentSubdivision(subdivisionIndex);
    setCurrentStars(0); // Reset stars when changing rank
    setCurrentMythicPoints(0); // Reset mythic points when changing rank
  };

  const handleTargetRankSelect = (rank: Rank, subdivisionIndex: number = 0) => {
    setTargetRank(rank);
    setTargetSubdivision(subdivisionIndex);
    setTargetStars(0); // Reset stars when changing rank
    setTargetMythicPoints(0); // Reset mythic points when changing rank
  };

  // Handle current stars input change
  const handleCurrentStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCurrentStars(Math.min(Math.max(value, 0), 5)); // Limit between 0-5
  };

  // Handle target stars input change
  const handleTargetStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTargetStars(Math.min(Math.max(value, 0), 5)); // Limit between 0-5
  };

  // Handle current mythic points input change
  const handleCurrentMythicPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    // Get min and max values from the rank's points property
    const minPoints = currentRank?.points?.min || 0;
    const maxPoints = currentRank?.points?.max || 999;
    setCurrentMythicPoints(Math.min(Math.max(value, minPoints), maxPoints));
  };

  // Handle target mythic points input change
  const handleTargetMythicPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    // Get min and max values from the rank's points property
    const minPoints = targetRank?.points?.min || 0;
    const maxPoints = targetRank?.points?.max || 999;
    setTargetMythicPoints(Math.min(Math.max(value, minPoints), maxPoints));
  };

  // Check if rank has points system (Mythic and above)
  const rankHasPoints = (rank: Rank | null): boolean => {
    return !!rank?.points || (rank?.id === "mythic" && rank?.subdivisions?.[0]?.points);
  };

  // Determine which ranks should be disabled for target selection
  const getDisabledTargetRanks = () => {
    if (!currentRank) return [];
    
    // If current rank has subdivisions selected, we need to disable:
    // 1. All ranks with lower tier than current rank
    // 2. Current rank's subdivisions that are lower than or equal to selected subdivision
    return availableRanks.filter(rank => {
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
      className="relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)]"></div>
      <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-mlbb-purple/10 rounded-full filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-mlbb-gold/10 rounded-full filter blur-[100px] opacity-20"></div>
      
      <div 
        className={`container mx-auto max-w-5xl transition-all duration-1000 transform ${
          isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-8 md:mb-16">
          <span className="inline-block text-xs md:text-sm px-3 py-1 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 text-mlbb-lightpurple mb-3">
            Simple & Secure
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Select Your <span className="text-mlbb-purple">Ranks</span></h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-2">
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
              ranks={availableRanks}
            />

            {/* Current Stars Input for Legend rank */}
            {currentRank && currentRank.id === "legend" && (
              <div className="mt-4 glass-panel p-4 animate-fade-in">
                <label className="block text-sm text-mlbb-lightpurple mb-2">
                  Current Stars
                </label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={currentStars}
                  onChange={handleCurrentStarsChange}
                  className="bg-black/20 border-mlbb-purple/30 text-white"
                />
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-4 h-4 mx-0.5 rounded-full ${i < currentStars ? 'bg-mlbb-gold' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2">{currentStars}/5</span>
                </div>
              </div>
            )}

            {/* Current Mythic Points Input */}
            {currentRank && rankHasPoints(currentRank) && (
              <div className="mt-4 glass-panel p-4 animate-fade-in">
                <label className="block text-sm text-mlbb-lightpurple mb-2">
                  Current Points
                </label>
                <Input
                  type="number"
                  min={currentRank?.points?.min || 0}
                  max={currentRank?.points?.max || 999}
                  value={currentMythicPoints}
                  onChange={handleCurrentMythicPointsChange}
                  className="bg-black/20 border-mlbb-purple/30 text-white"
                />
                <div className="mt-2 text-xs text-gray-400">
                  {currentRank?.id === "mythic" ? "Mythic Points" : 
                   currentRank?.id === "mythic-honor" ? "Mythic Honor Points" : 
                   currentRank?.id === "mythical-glory" ? "Mythical Glory Points" : 
                   "Immortal Points"}
                </div>
              </div>
            )}
          </div>
          
          {/* Arrow - vertical on mobile, horizontal on desktop */}
          <div className="md:col-span-2 flex items-center justify-center py-2 md:py-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 flex items-center justify-center">
              <ArrowDown className="h-5 w-5 md:hidden text-mlbb-purple" />
              <ArrowRight className="h-5 w-5 hidden md:block text-mlbb-purple" />
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
              ranks={availableRanks}
            />

            {/* Target Stars Input for Legend rank */}
            {targetRank && targetRank.id === "legend" && (
              <div className="mt-4 glass-panel p-4 animate-fade-in">
                <label className="block text-sm text-mlbb-lightpurple mb-2">
                  Desired Stars
                </label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={targetStars}
                  onChange={handleTargetStarsChange}
                  className="bg-black/20 border-mlbb-purple/30 text-white"
                />
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-4 h-4 mx-0.5 rounded-full ${i < targetStars ? 'bg-mlbb-gold' : 'bg-gray-700'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2">{targetStars}/5</span>
                </div>
              </div>
            )}

            {/* Target Mythic Points Input */}
            {targetRank && rankHasPoints(targetRank) && (
              <div className="mt-4 glass-panel p-4 animate-fade-in">
                <label className="block text-sm text-mlbb-lightpurple mb-2">
                  Desired Points
                </label>
                <Input
                  type="number"
                  min={targetRank?.points?.min || 0}
                  max={targetRank?.points?.max || 999}
                  value={targetMythicPoints}
                  onChange={handleTargetMythicPointsChange}
                  className="bg-black/20 border-mlbb-purple/30 text-white"
                />
                <div className="mt-2 text-xs text-gray-400">
                  {targetRank?.id === "mythic" ? "Mythic Points" : 
                   targetRank?.id === "mythic-honor" ? "Mythic Honor Points" : 
                   targetRank?.id === "mythical-glory" ? "Mythical Glory Points" : 
                   "Immortal Points"}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Pricing Card */}
        <div className="mt-8 md:mt-12 mx-auto max-w-full md:max-w-md">
          <PricingCard
            currentRank={currentRank}
            targetRank={targetRank}
            currentSubdivision={currentSubdivision}
            targetSubdivision={targetSubdivision}
            currentStars={currentStars}
            targetStars={targetStars}
            currentMythicPoints={currentMythicPoints}
            targetMythicPoints={targetMythicPoints}
            animationDelay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default RankSelectionSection;
