
export interface Rank {
  id: string;
  name: string;
  image: string;
  tier: number;
  priceModifier: number;
  basePrice?: number; // Base price for this tier
  costPerStar?: number; // Cost per star for this tier
  subdivisions?: RankSubdivision[];
  points?: PointsRange;
}

export interface RankSubdivision {
  name: string;
  stars?: number;
  points?: PointsRange;
}

export interface PointsRange {
  min: number;
  max: number;
}

export interface RankCombination {
  fromRankId: string;
  fromSubdivision?: number;
  toRankId: string;
  toSubdivision?: number;
  price: number;
}

const originalRanks: Rank[] = [
  {
    id: "warrior",
    name: "Warrior",
    image: "/warrior.png",
    tier: 1,
    priceModifier: 1,
    basePrice: 5,
    costPerStar: 0.5,
    subdivisions: [
      { name: "Warrior I", stars: 5 },
      { name: "Warrior II", stars: 5 },
      { name: "Warrior III", stars: 5 }
    ]
  },
  {
    id: "elite",
    name: "Elite",
    image: "/elite.png",
    tier: 2,
    priceModifier: 1.2,
    basePrice: 10,
    costPerStar: 1,
    subdivisions: [
      { name: "Elite I", stars: 5 },
      { name: "Elite II", stars: 5 },
      { name: "Elite III", stars: 5 }
    ]
  },
  {
    id: "master",
    name: "Master",
    image: "/master.png",
    tier: 3,
    priceModifier: 1.5,
    basePrice: 15,
    costPerStar: 1.5,
    subdivisions: [
      { name: "Master I", stars: 5 },
      { name: "Master II", stars: 5 },
      { name: "Master III", stars: 5 },
      { name: "Master IV", stars: 5 }
    ]
  },
  {
    id: "grandmaster",
    name: "Grand Master",
    image: "/grandmaster.png",
    tier: 4,
    priceModifier: 1.8,
    basePrice: 20,
    costPerStar: 2,
    subdivisions: [
      { name: "Grandmaster I", stars: 5 },
      { name: "Grandmaster II", stars: 5 },
      { name: "Grandmaster III", stars: 5 },
      { name: "Grandmaster IV", stars: 5 },
      { name: "Grandmaster V", stars: 5 }
    ]
  },
  {
    id: "epic",
    name: "Epic",
    image: "/epic.png",
    tier: 5,
    priceModifier: 2.2,
    basePrice: 25,
    costPerStar: 2.5,
    subdivisions: [
      { name: "Epic I", stars: 5 },
      { name: "Epic II", stars: 5 },
      { name: "Epic III", stars: 5 },
      { name: "Epic IV", stars: 5 },
      { name: "Epic V", stars: 5 }
    ]
  },
  {
    id: "legend",
    name: "Legend",
    image: "/legend.png",
    tier: 6,
    priceModifier: 2.8,
    basePrice: 30,
    costPerStar: 3,
    subdivisions: [
      { name: "Legend I", stars: 5 },
      { name: "Legend II", stars: 5 },
      { name: "Legend III", stars: 5 },
      { name: "Legend IV", stars: 5 },
      { name: "Legend V", stars: 5 }
    ]
  },
  {
    id: "mythic",
    name: "Mythic",
    image: "/mythic.png",
    tier: 7,
    priceModifier: 3.5,
    basePrice: 40,
    costPerStar: 4,
    subdivisions: [
      { name: "Mythic", points: { min: 0, max: 24 } }
    ]
  },
  {
    id: "mythic-honor",
    name: "Mythic Honor",
    image: "/mythic.png",
    tier: 8,
    priceModifier: 4,
    basePrice: 50,
    costPerStar: 5,
    points: { min: 25, max: 49 }
  },
  {
    id: "mythical-glory",
    name: "Mythical Glory",
    image: "/mythical-glory.png",
    tier: 9,
    priceModifier: 5,
    basePrice: 60,
    costPerStar: 6,
    points: { min: 50, max: 99 }
  },
  {
    id: "immortal",
    name: "Immortal",
    image: "/mythical-glory.png",
    tier: 10,
    priceModifier: 6,
    basePrice: 80,
    costPerStar: 8,
    points: { min: 100, max: 9999 }
  }
];

const defaultRankCombinations: RankCombination[] = [];

export const getAdminRanks = (): Rank[] => {
  const savedRanks = localStorage.getItem("adminRanks");
  if (savedRanks) {
    return JSON.parse(savedRanks);
  }
  return originalRanks;
};

export const getBasePrice = (): number => {
  const storedBasePrice = localStorage.getItem("basePricePerTier");
  return storedBasePrice ? parseFloat(storedBasePrice) : 10;
};

export const getRankCombinations = (): RankCombination[] => {
  const storedCombinations = localStorage.getItem("rankCombinations");
  return storedCombinations ? JSON.parse(storedCombinations) : defaultRankCombinations;
};

export const saveRankCombinations = (combinations: RankCombination[]): void => {
  localStorage.setItem("rankCombinations", JSON.stringify(combinations));
};

export const ranks = getAdminRanks();

// Updated rankHasPoints function to properly return a boolean
const rankHasPoints = (rank: Rank | null): boolean => {
  if (!rank) return false;
  return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions && rank.subdivisions[0]?.points);
};

// Calculate the total stars required between two ranks and subdivisions
const calculateTotalStars = (
  currentRank: Rank,
  targetRank: Rank,
  currentSubdivision: number = 0,
  targetSubdivision: number = 0,
  currentStars: number = 0,
  targetStars: number = 0
): number => {
  let totalStars = 0;
  
  // If same rank and subdivision, just calculate star difference
  if (currentRank.id === targetRank.id && currentSubdivision === targetSubdivision) {
    return targetStars - currentStars;
  }
  
  // Same rank, different subdivisions
  if (currentRank.id === targetRank.id) {
    // Calculate stars in current subdivision (remaining stars)
    if (currentRank.subdivisions && currentRank.subdivisions[currentSubdivision]) {
      const maxStars = currentRank.subdivisions[currentSubdivision].stars || 0;
      totalStars += maxStars - currentStars;
    }
    
    // Add stars for in-between subdivisions
    for (let i = currentSubdivision - 1; i > targetSubdivision; i--) {
      if (currentRank.subdivisions && currentRank.subdivisions[i]) {
        totalStars += currentRank.subdivisions[i].stars || 0;
      }
    }
    
    // Add stars for target subdivision
    if (targetRank.subdivisions && targetRank.subdivisions[targetSubdivision]) {
      totalStars += targetStars;
    }
    
    return totalStars;
  }
  
  // Different ranks
  
  // 1. Stars remaining in current rank
  if (currentRank.subdivisions) {
    // Current subdivision remaining stars
    const currentMaxStars = currentRank.subdivisions[currentSubdivision]?.stars || 0;
    totalStars += currentMaxStars - currentStars;
    
    // Add stars for higher subdivisions in current rank
    for (let i = currentSubdivision - 1; i >= 0; i--) {
      totalStars += currentRank.subdivisions[i]?.stars || 0;
    }
  }
  
  // 2. Stars for ranks in between
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
  
  // 3. Stars for target rank
  if (targetRank.subdivisions) {
    // Add stars for lower subdivisions in target rank
    for (let i = targetRank.subdivisions.length - 1; i > targetSubdivision; i--) {
      totalStars += targetRank.subdivisions[i]?.stars || 0;
    }
    
    // Add stars for target subdivision
    totalStars += targetStars;
  }
  
  return totalStars;
};

export const calculatePrice = (
  currentRank: Rank, 
  targetRank: Rank, 
  currentSubdivision: number = 0,
  targetSubdivision: number = 0,
  currentStars: number = 0,
  targetStars: number = 0,
  currentMythicPoints: number = 0,
  targetMythicPoints: number = 0
): number => {
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
  
  // Check if there's a custom price for this specific combination
  const combinations = getRankCombinations();
  const customCombination = combinations.find(combo => 
    combo.fromRankId === currentRank.id && 
    combo.toRankId === targetRank.id &&
    (combo.fromSubdivision === undefined || combo.fromSubdivision === currentSubdivision) &&
    (combo.toSubdivision === undefined || combo.toSubdivision === targetSubdivision)
  );
  
  if (customCombination) {
    return customCombination.price;
  }
  
  // Get the admin-configured ranks
  const adminRanks = getAdminRanks();
  
  let updatedCurrentRank = currentRank;
  let updatedTargetRank = targetRank;
  
  const foundCurrentRank = adminRanks.find((rank: Rank) => rank.id === currentRank.id);
  const foundTargetRank = adminRanks.find((rank: Rank) => rank.id === targetRank.id);
  
  if (foundCurrentRank) updatedCurrentRank = foundCurrentRank;
  if (foundTargetRank) updatedTargetRank = foundTargetRank;
  
  let price = 0;
  
  // 1. Add base price of current tier
  price += updatedCurrentRank.basePrice || 0;
  
  // 2. Calculate stars based pricing
  if (!rankHasPoints(currentRank) && !rankHasPoints(targetRank)) {
    // Regular star-based ranks
    const totalStars = calculateTotalStars(
      updatedCurrentRank, 
      updatedTargetRank, 
      currentSubdivision, 
      targetSubdivision,
      currentStars,
      targetStars
    );
    
    // Use the cost per star of the current rank
    price += totalStars * (updatedCurrentRank.costPerStar || 0);
  } else {
    // Handle mythic points
    if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      if (currentRank.tier === targetRank.tier) {
        const pointsDifference = targetMythicPoints - currentMythicPoints;
        if (pointsDifference > 0) {
          price += 3 * pointsDifference; // $3 per mythic point
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
  
  // 3. Add base price of target tier
  price += updatedTargetRank.basePrice || 0;
  
  return price;
};

export const getRankPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238B5CF6' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%238B5CF6' fill-opacity='0.3'/%3E%3C/svg%3E";
};
