
import { Rank, RankCombination } from "./types";
import { ranks } from "./constants";
import { rankHasPoints, calculateTotalStars } from "./utils";
import { getAdminRanks, getRankCombinations, getBasePrice } from "./database";

export const calculatePrice = async (
  currentRank: Rank, 
  targetRank: Rank, 
  currentSubdivision: number = 0,
  targetSubdivision: number = 0,
  currentStars: number = 0,
  targetStars: number = 0,
  currentMythicPoints: number = 0,
  targetMythicPoints: number = 0
): Promise<number> => {
  // Check if user is trying to boost to a lower rank or same rank without improvement
  if (currentRank.tier > targetRank.tier) {
    return 0;
  }
  
  // Special case for same rank boosts
  if (currentRank.tier === targetRank.tier && currentRank.id === targetRank.id) {
    // Allow same rank but higher subdivision or stars
    if (currentRank.subdivisions && targetRank.subdivisions) {
      // If target subdivision is lower or same with lower/equal stars, return 0
      if (
        (currentSubdivision < targetSubdivision) || 
        (currentSubdivision === targetSubdivision && currentStars <= targetStars)
      ) {
        // This is a valid boosting scenario
      } else {
        return 0; // Invalid boosting scenario
      }
    }
    // Special handling for Immortal rank to boost points
    else if (currentRank.id === "immortal") {
      if (currentMythicPoints >= targetMythicPoints) {
        return 0; // Cannot boost to lower or same points
      }
    }
    else if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      if (currentMythicPoints >= targetMythicPoints) {
        return 0; // Cannot boost to lower or same points
      }
    }
    else {
      // For other cases, require moving to a higher subdivision
      return 0;
    }
  }
  
  // Check for custom price combinations from database
  const combinations = await getRankCombinations();
  const customCombination = combinations.find(combo => 
    combo.fromRankId === currentRank.id && 
    combo.toRankId === targetRank.id &&
    (combo.fromSubdivision === undefined || combo.fromSubdivision === currentSubdivision) &&
    (combo.toSubdivision === undefined || combo.toSubdivision === targetSubdivision)
  );
  
  if (customCombination) {
    return customCombination.price;
  }
  
  // Get latest ranks data from database
  const adminRanks = await getAdminRanks();
  
  let updatedCurrentRank = currentRank;
  let updatedTargetRank = targetRank;
  
  const foundCurrentRank = adminRanks.find((rank: Rank) => rank.id === currentRank.id);
  const foundTargetRank = adminRanks.find((rank: Rank) => rank.id === targetRank.id);
  
  if (foundCurrentRank) updatedCurrentRank = foundCurrentRank;
  if (foundTargetRank) updatedTargetRank = foundTargetRank;
  
  // Calculate price
  let price = 0;
  
  // Add current rank base price
  price += updatedCurrentRank.basePrice || 0;
  
  // Handle stars-based ranks
  if (!rankHasPoints(currentRank) && !rankHasPoints(targetRank)) {
    // Calculate total stars difference for regular ranks
    
    // Same rank with different subdivisions needs special handling
    if (currentRank.id === targetRank.id) {
      // Calculate subdivision delta price based on progression
      const subdivisionsToProgress = targetSubdivision - currentSubdivision;
      if (subdivisionsToProgress > 0) {
        const starsPerSubdivision = updatedCurrentRank.subdivisions?.[0]?.stars || 5;
        const totalSubdivisionStars = subdivisionsToProgress * starsPerSubdivision;
        
        // Calculate star differences within subdivisions
        const startingStars = currentStars;
        const endingStars = targetStars;
        const starsDifference = totalSubdivisionStars - startingStars + endingStars;
        
        price += starsDifference * (updatedCurrentRank.costPerStar || 1);
      } else {
        // Same subdivision but different stars
        const starsDifference = targetStars - currentStars;
        if (starsDifference > 0) {
          price += starsDifference * (updatedCurrentRank.costPerStar || 1);
        }
      }
    } 
    else {
      // Calculate across different ranks
      const totalStars = calculateTotalStars(
        updatedCurrentRank, 
        updatedTargetRank, 
        currentSubdivision, 
        targetSubdivision,
        currentStars,
        targetStars
      );
      
      price += totalStars * (updatedCurrentRank.costPerStar || 0);
    }
  } 
  // Handle points-based ranks (Mythic and above)
  else {
    // Case: both ranks have points (Mythic to higher Mythic or Immortal to higher Immortal)
    if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      // Same tier rank with points
      if (currentRank.tier === targetRank.tier) {
        const pointsDifference = targetMythicPoints - currentMythicPoints;
        if (pointsDifference > 0) {
          price += 3 * pointsDifference; // 3 dollars per point as base price
        }
      } 
      // Different tiers
      else {
        // Add price for points above minimum in target rank
        if (targetMythicPoints > 0) {
          const minPoints = targetRank.points?.min || 0;
          const pointsAboveMin = targetMythicPoints - minPoints;
          if (pointsAboveMin > 0) {
            price += 3 * pointsAboveMin;
          }
        }
      }
    }
    // Case: star rank to points rank
    else if (!rankHasPoints(currentRank) && rankHasPoints(targetRank) && targetMythicPoints > 0) {
      const minPoints = targetRank.points?.min || 0;
      const pointsAboveMin = targetMythicPoints - minPoints;
      if (pointsAboveMin > 0) {
        price += 3 * pointsAboveMin;
      }
    }
  }
  
  // Add target rank base price
  price += updatedTargetRank.basePrice || 0;
  
  return price;
};
