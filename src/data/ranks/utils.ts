
import { Rank } from "./types";
import { ranks } from "./constants";

export const rankHasPoints = (rank: Rank | null): boolean => {
  if (!rank) return false;
  return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions && rank.subdivisions[0]?.points);
};

export const calculateTotalStars = (
  currentRank: Rank,
  targetRank: Rank,
  currentSubdivision: number = 0,
  targetSubdivision: number = 0,
  currentStars: number = 0,
  targetStars: number = 0
): number => {
  let totalStars = 0;
  
  if (currentRank.id === targetRank.id && currentSubdivision === targetSubdivision) {
    return targetStars - currentStars;
  }
  
  if (currentRank.id === targetRank.id) {
    if (currentRank.subdivisions && currentRank.subdivisions[currentSubdivision]) {
      const maxStars = currentRank.subdivisions[currentSubdivision].stars || 0;
      totalStars += maxStars - currentStars;
    }
    
    for (let i = currentSubdivision - 1; i > targetSubdivision; i--) {
      if (currentRank.subdivisions && currentRank.subdivisions[i]) {
        totalStars += currentRank.subdivisions[i].stars || 0;
      }
    }
    
    if (targetRank.subdivisions && targetRank.subdivisions[targetSubdivision]) {
      totalStars += targetStars;
    }
    
    return totalStars;
  }
  
  if (currentRank.subdivisions) {
    const currentMaxStars = currentRank.subdivisions[currentSubdivision]?.stars || 0;
    totalStars += currentMaxStars - currentStars;
    
    for (let i = currentSubdivision - 1; i >= 0; i--) {
      totalStars += currentRank.subdivisions[i]?.stars || 0;
    }
  }
  
  const ranksInBetween = ranks.filter(r => 
    r.tier > currentRank.tier && r.tier < targetRank.tier
  );
  
  for (const rank of ranksInBetween) {
    if (rank.subdivisions) {
      for (const subdivision of rank.subdivisions) {
        totalStars += subdivision.stars || 0;
      }
    }
  }
  
  if (targetRank.subdivisions) {
    for (let i = targetRank.subdivisions.length - 1; i > targetSubdivision; i--) {
      totalStars += targetRank.subdivisions[i]?.stars || 0;
    }
    
    totalStars += targetStars;
  }
  
  return totalStars;
};
