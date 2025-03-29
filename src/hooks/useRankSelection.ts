
import { useState, useEffect, useCallback } from "react";
import { Rank, initializeRanks } from "@/data/ranks";

interface RankSelectionProps {
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
}: RankSelectionProps) => {
  const [availableRanks, setAvailableRanks] = useState<Rank[]>([]);
  const [currentSubdivision, setCurrentSubdivision] = useState<number>(0);
  const [targetSubdivision, setTargetSubdivision] = useState<number>(0);
  const [currentStars, setCurrentStars] = useState<number>(0);
  const [targetStars, setTargetStars] = useState<number>(0);
  const [currentMythicPoints, setCurrentMythicPoints] = useState<number>(0);
  const [targetMythicPoints, setTargetMythicPoints] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check localStorage for cached ranks data
    const cachedRanks = localStorage.getItem('cachedRanks');
    const lastCacheTime = localStorage.getItem('ranksCacheTime');
    const cacheExpiryTime = 1000 * 60 * 60; // 1 hour cache
    
    const loadRanks = async () => {
      try {
        // Use cached data if valid and not expired
        if (cachedRanks && lastCacheTime && 
            (Date.now() - parseInt(lastCacheTime)) < cacheExpiryTime) {
          console.log('Using cached ranks data');
          setAvailableRanks(JSON.parse(cachedRanks));
        } else {
          console.log('Fetching fresh ranks data');
          const ranks = await initializeRanks();
          setAvailableRanks(ranks);
          
          // Cache the ranks data
          localStorage.setItem('cachedRanks', JSON.stringify(ranks));
          localStorage.setItem('ranksCacheTime', Date.now().toString());
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize ranks:", error);
      }
    };

    loadRanks();
  }, []);

  const handleCurrentRankSelect = useCallback((rank: Rank, subdivisionIndex = 0) => {
    setCurrentRank(rank, subdivisionIndex);
    setCurrentSubdivision(subdivisionIndex);
    
    if (rankHasStars(rank)) {
      setCurrentStars(0);
    }
    
    if (rankHasPoints(rank)) {
      setCurrentMythicPoints(rank.points?.min || 0);
    }
  }, [setCurrentRank]);

  const handleTargetRankSelect = useCallback((rank: Rank, subdivisionIndex = 0) => {
    setTargetRank(rank, subdivisionIndex);
    setTargetSubdivision(subdivisionIndex);
    
    if (rankHasStars(rank)) {
      setTargetStars(0);
    }
    
    if (rankHasPoints(rank)) {
      setTargetMythicPoints(rank.points?.min || 0);
    }
  }, [setTargetRank]);

  const handleCurrentStarsChange = useCallback((stars: number) => {
    setCurrentStars(stars);
  }, []);

  const handleTargetStarsChange = useCallback((stars: number) => {
    setTargetStars(stars);
  }, []);

  const handleCurrentMythicPointsChange = useCallback((points: number) => {
    setCurrentMythicPoints(points);
  }, []);

  const handleTargetMythicPointsChange = useCallback((points: number) => {
    setTargetMythicPoints(points);
  }, []);

  const rankHasPoints = useCallback((rank: Rank | null): boolean => {
    if (!rank) return false;
    return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions?.[0]?.points);
  }, []);

  const rankHasStars = useCallback((rank: Rank | null): boolean => {
    if (!rank) return false;
    return Boolean(rank.id === "legend");
  }, []);

  const getDisabledTargetRanks = useCallback(() => {
    if (!currentRank) return [];
    
    return availableRanks.filter(rank => rank.tier <= currentRank.tier).map(rank => rank.id);
  }, [availableRanks, currentRank]);

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
    getDisabledTargetRanks,
    isInitialized
  };
};
