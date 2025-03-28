import React, { useState, useEffect } from "react";
import { Rank } from "@/data/ranks/types";
import { ArrowRight, ArrowDown } from "lucide-react";
import PricingCard from "@/components/pricing/PricingCard";
import { useRankSelection } from "@/hooks/useRankSelection";
import ThreeColumnRankSelector from "./rank/ThreeColumnRankSelector";
import ServiceOptionsToggle from "./ServiceOptionsToggle";
import { useServiceOptions } from "@/hooks/useServiceOptions";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

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
  const {
    availableRanks,
    currentSubdivision,
    targetSubdivision,
    currentStars,
    targetStars,
    currentMythicPoints,
    targetMythicPoints,
    handleCurrentRankSelect,
    handleTargetRankSelect,
    handleCurrentStarsChange,
    handleTargetStarsChange,
    handleCurrentMythicPointsChange,
    handleTargetMythicPointsChange,
    rankHasPoints,
    rankHasStars,
    getDisabledTargetRanks
  } = useRankSelection({
    currentRank,
    targetRank,
    setCurrentRank,
    setTargetRank
  });
  
  const handleCurrentSubdivisionSelect = (subdivisionIndex: number) => {
    if (currentRank) {
      handleCurrentRankSelect(currentRank, subdivisionIndex);
    }
  };

  const handleTargetSubdivisionSelect = (subdivisionIndex: number) => {
    if (targetRank) {
      handleTargetRankSelect(targetRank, subdivisionIndex);
    }
  };
  
  const basePrice = currentRank && targetRank ? 100 : null;
  const { serviceOptions, toggleOption, totalPrice } = useServiceOptions(basePrice);
  
  const navigate = useNavigate();
  
  const handleCustomOrderClick = () => {
    navigate('/custom-order');
  };

  return (
    <section
      id="ranks"
      className="relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden"
    >
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
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-5">
            <ThreeColumnRankSelector
              label="Current Rank"
              availableRanks={availableRanks}
              selectedRank={currentRank}
              selectedSubdivision={currentSubdivision}
              stars={currentStars}
              points={currentMythicPoints}
              onRankSelect={(rank) => handleCurrentRankSelect(rank, 0)}
              onSubdivisionSelect={handleCurrentSubdivisionSelect}
              onStarsChange={handleCurrentStarsChange}
              onPointsChange={handleCurrentMythicPointsChange}
              disabledRanks={[]}
              rankHasPoints={rankHasPoints}
              rankHasStars={rankHasStars}
              animationDelay={200}
            />
          </div>
          
          <div className="lg:col-span-2 flex items-center justify-center py-2 lg:py-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 flex items-center justify-center">
              <ArrowDown className="h-5 w-5 lg:hidden text-mlbb-purple" />
              <ArrowRight className="h-5 w-5 hidden lg:block text-mlbb-purple" />
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <ThreeColumnRankSelector
              label="Desired Rank"
              availableRanks={availableRanks}
              selectedRank={targetRank}
              selectedSubdivision={targetSubdivision}
              stars={targetStars}
              points={targetMythicPoints}
              onRankSelect={(rank) => handleTargetRankSelect(rank, 0)}
              onSubdivisionSelect={handleTargetSubdivisionSelect}
              onStarsChange={handleTargetStarsChange}
              onPointsChange={handleTargetMythicPointsChange}
              disabledRanks={getDisabledTargetRanks()}
              rankHasPoints={rankHasPoints}
              rankHasStars={rankHasStars}
              animationDelay={400}
            />
          </div>
        </div>
        
        <ServiceOptionsToggle 
          serviceOptions={serviceOptions}
          onToggle={toggleOption}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-3">Need a special boosting service not listed here?</p>
          <Button 
            onClick={handleCustomOrderClick}
            variant="outline" 
            className="bg-transparent border border-mlbb-purple text-mlbb-purple hover:bg-mlbb-purple/10"
          >
            Request Custom Order
          </Button>
        </div>
        
        <div className="mt-12 md:mt-16 mx-auto max-w-full md:max-w-md">
          <PricingCard
            currentRank={currentRank}
            targetRank={targetRank}
            currentSubdivision={currentSubdivision}
            targetSubdivision={targetSubdivision}
            currentStars={currentStars}
            targetStars={targetStars}
            currentMythicPoints={currentMythicPoints}
            targetMythicPoints={targetMythicPoints}
            serviceOptions={serviceOptions}
            animationDelay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default RankSelectionSection;
