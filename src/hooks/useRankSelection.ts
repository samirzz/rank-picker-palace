
import { useState, useEffect } from "react";
import { Rank, initializeRanks } from "@/data/ranks";

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

  // Load ranks on initial render
  useEffect(() => {
    const loadRanks = async () => {
      try {
        console.log('Loading ranks in useRankSelection');
        const loadedRanks = await initializeRanks();
        console.log(`Loaded ${loadedRanks.length} ranks`);
        setAvailableRanks([...loadedRanks]);
        
        // Update current and target ranks if they exist
        if (currentRank) {
          const updatedCurrentRank = loadedRanks.find(rank => rank.id === currentRank.id);
          if (updatedCurrentRank) {
            setCurrentRank(updatedCurrentRank, currentSubdivision);
          }
        }
        
        if (targetRank) {
          const updatedTargetRank = loadedRanks.find(rank => rank.id === targetRank.id);
          if (updatedTargetRank) {
            setTargetRank(updatedTargetRank, targetSubdivision);
          }
        }
      } catch (error) {
        console.error("Error loading ranks:", error);
      }
    };

    loadRanks();

    // Listen for admin price changes
    const handleAdminPriceChange = () => {
      loadRanks();
    };
    
    window.addEventListener('adminPriceChange', handleAdminPriceChange);
    
    return () => {
      window.removeEventListener('adminPriceChange', handleAdminPriceChange);
    };
  }, [currentRank, targetRank, currentSubdivision, targetSubdivision, setCurrentRank, setTargetRank]);

  const handleCurrentRankSelect = (rank: Rank, subdivisionIndex: number = 0) => {
    setCurrentRank(rank);
    setCurrentSubdivision(subdivisionIndex);
    
    // Instead of resetting stars, update them to the maximum for this rank if needed
    const maxStars = getMaxStarsForRank(rank);
    if (currentStars > maxStars) {
      setCurrentStars(maxStars);
    } else if (currentStars === 0) {
      // Only set default stars if it was previously 0
      setCurrentStars(0);
    }
    
    if (rankHasPoints(rank)) {
      setCurrentMythicPoints(rank.points?.min || 0);
    } else {
      setCurrentMythicPoints(0);
    }
  };

  const handleTargetRankSelect = (rank: Rank, subdivisionIndex: number = 0) => {
    setTargetRank(rank);
    setTargetSubdivision(subdivisionIndex);
    
    // Instead of resetting stars, update them to the maximum for this rank if needed
    const maxStars = getMaxStarsForRank(rank);
    if (targetStars > maxStars) {
      setTargetStars(maxStars);
    } else if (targetStars === 0) {
      // For target rank, set to max stars by default
      setTargetStars(maxStars);
    }
    
    if (rankHasPoints(rank)) {
      setTargetMythicPoints(rank.points?.min || 0);
    } else {
      setTargetMythicPoints(0);
    }
  };

  // Handle current stars input change
  const handleCurrentStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxStars = getMaxStarsForRank(currentRank);
    setCurrentStars(Math.min(Math.max(value, 0), maxStars)); // Limit between 0-maxStars
  };

  // Handle target stars input change
  const handleTargetStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxStars = getMaxStarsForRank(targetRank);
    setTargetStars(Math.min(Math.max(value, 0), maxStars)); // Limit between 0-maxStars
  };

  // Get the maximum stars for a given rank
  const getMaxStarsForRank = (rank: Rank | null): number => {
    if (!rank || !rank.subdivisions || rank.subdivisions.length === 0) return 5;
    const subdivision = rank.subdivisions[0]; // Using first subdivision as reference
    return subdivision.stars || 5;
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

  // Check if rank has stars system (all ranks except those with points)
  const rankHasStars = (rank: Rank | null): boolean => {
    if (!rank) return false;
    // Ranks with points don't use the star system
    return !rankHasPoints(rank);
  };

  // Determine which ranks should be disabled for target selection
  const getDisabledTargetRanks = () => {
    if (!currentRank) return [];
    
    return availableRanks.filter(rank => {
      // Allow selecting the same rank for Immortal (to allow boosting to higher points)
      if (currentRank.id === 'immortal' && rank.id === 'immortal') {
        return false;
      }
      
      // Filter out ranks with lower tier than current rank
      if (rank.tier < currentRank.tier) {
        return true;
      }
      
      // If same rank tier but different rank ID, allow it
      if (rank.tier === currentRank.tier && rank.id !== currentRank.id) {
        return false;
      }
      
      // If same rank, only filter out same or lower subdivisions
      if (rank.id === currentRank.id) {
        if (!rank.subdivisions || currentRank.subdivisions?.length <= 1) {
          return true; // Disable if there are no subdivisions to select
        }
        
        // Only disable the rank if we want to prevent same rank selection completely
        // For now, we'll allow it and handle subdivision selection logic separately
        return false;
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
    rankHasStars,
    getDisabledTargetRanks
  };
};
