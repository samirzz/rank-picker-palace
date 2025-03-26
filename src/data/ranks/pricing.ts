
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
  if (currentRank.tier > targetRank.tier) {
    return 0;
  }
  
  if (currentRank.tier === targetRank.tier && currentRank.id === targetRank.id) {
    if (currentRank.id === "legend") {
      if (currentSubdivision < targetSubdivision) {
        return 0;
      }
      
      if (currentSubdivision === targetSubdivision && currentStars >= targetStars) {
        return 0;
      }
    } 
    else if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      if (currentMythicPoints >= targetMythicPoints) {
        return 0;
      }
    }
    else if (currentSubdivision <= targetSubdivision) {
      return 0;
    }
  }
  
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
  
  const adminRanks = await getAdminRanks();
  
  let updatedCurrentRank = currentRank;
  let updatedTargetRank = targetRank;
  
  const foundCurrentRank = adminRanks.find((rank: Rank) => rank.id === currentRank.id);
  const foundTargetRank = adminRanks.find((rank: Rank) => rank.id === targetRank.id);
  
  if (foundCurrentRank) updatedCurrentRank = foundCurrentRank;
  if (foundTargetRank) updatedTargetRank = foundTargetRank;
  
  let price = 0;
  
  price += updatedCurrentRank.basePrice || 0;
  
  if (!rankHasPoints(currentRank) && !rankHasPoints(targetRank)) {
    const totalStars = calculateTotalStars(
      updatedCurrentRank, 
      updatedTargetRank, 
      currentSubdivision, 
      targetSubdivision,
      currentStars,
      targetStars
    );
    
    price += totalStars * (updatedCurrentRank.costPerStar || 0);
  } else {
    if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      if (currentRank.tier === targetRank.tier) {
        const pointsDifference = targetMythicPoints - currentMythicPoints;
        if (pointsDifference > 0) {
          price += 3 * pointsDifference;
        }
      } else {
        if (targetMythicPoints > 0) {
          const minPoints = targetRank.points?.min || 0;
          const pointsAboveMin = targetMythicPoints - minPoints;
          if (pointsAboveMin > 0) {
            price += 3 * pointsAboveMin;
          }
        }
      }
    }
    else if (!rankHasPoints(currentRank) && rankHasPoints(targetRank) && targetMythicPoints > 0) {
      const minPoints = targetRank.points?.min || 0;
      const pointsAboveMin = targetMythicPoints - minPoints;
      if (pointsAboveMin > 0) {
        price += 3 * pointsAboveMin;
      }
    }
  }
  
  price += updatedTargetRank.basePrice || 0;
  
  return price;
};
