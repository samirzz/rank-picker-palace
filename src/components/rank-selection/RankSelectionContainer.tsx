
import React from "react";
import { Rank } from "@/data/ranks/types";
import RankSelectors from "./RankSelectors";
import ServiceOptions from "./ServiceOptions";
import PricingSection from "./PricingSection";
import { useServiceOptions } from "@/hooks/useServiceOptions";

interface RankSelectionContainerProps {
  isIntersecting: boolean;
  currentRank: Rank | null;
  setCurrentRank: (rank: Rank, subdivisionIndex?: number) => void;
  targetRank: Rank | null;
  setTargetRank: (rank: Rank, subdivisionIndex?: number) => void;
}

const RankSelectionContainer: React.FC<RankSelectionContainerProps> = ({
  isIntersecting,
  currentRank,
  setCurrentRank,
  targetRank,
  setTargetRank
}) => {
  // Calculate base price based on rank selection
  const basePrice = currentRank && targetRank ? 100 : null;
  const { serviceOptions, toggleOption } = useServiceOptions(basePrice);

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
        <SectionHeader />
        
        <RankSelectors
          currentRank={currentRank}
          targetRank={targetRank}
          setCurrentRank={setCurrentRank}
          setTargetRank={setTargetRank}
        />
        
        <ServiceOptions 
          serviceOptions={serviceOptions}
          onToggle={toggleOption}
        />
        
        <PricingSection 
          currentRank={currentRank}
          targetRank={targetRank}
          serviceOptions={serviceOptions}
        />
      </div>
    </section>
  );
};

const SectionHeader: React.FC = () => (
  <div className="text-center mb-8 md:mb-16">
    <span className="inline-block text-xs md:text-sm px-3 py-1 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 text-mlbb-lightpurple mb-3">
      Simple & Secure
    </span>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
      Select Your <span className="text-mlbb-purple">Ranks</span>
    </h2>
    <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-2">
      Choose your current rank and your desired target rank. 
      Our professional boosters will help you achieve your goals quickly.
    </p>
  </div>
);

export default RankSelectionContainer;
