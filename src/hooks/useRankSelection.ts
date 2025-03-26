
import { useState, useEffect } from "react";
import { Rank, getAdminRanks } from "@/data/ranks";

interface UseRankSelectionProps {
  currentRank: Rank | null;
  targetRank: Rank | null;
  setCurrentRank: (rank: Rank, subdivisionIndex?: number) => void;
  setTargetRank: (rank: Rank, subdivisionIndex?: number) => void;
}

export const useRankSelection = ({
  currentRank,
  targetRank,
  setCurrentRank,
  setTargetRank
}: UseRankSelectionProps) => {
  const [currentSubdivision, setCurrentSubdivision] = useState(0);
  const [targetSubdivision, setTargetSubdivision] = useState(0);
  const [availableRanks, setAvailableRanks] = useState<Rank[]>([]);
  const [currentStars, setCurrentStars] = useState(0);
  const [targetStars, setTargetStars] = useState(0);
  const [currentMythicPoints, setCurrentMythicPoints] = useState(0);
  const [targetMythicPoints, setTargetMythicPoints] = useState(0);

  // Update ranks when admin changes prices
  useEffect(() => {
    const handleAdminPriceChange = async () => {
      try {
        const updatedRanks = await getAdminRanks();
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
      } catch (error) {
        console.error("Error updating ranks:", error);
      }
    };

    // Initial load
    handleAdminPriceChange();

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
    if (!rank) return false;
    return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions?.[0]?.points);
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

  return {
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
    getDisabledTargetRanks
  };
};
