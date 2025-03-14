export interface Rank {
  id: string;
  name: string;
  image: string;
  tier: number;
  priceModifier: number;
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
    points: { min: 25, max: 49 }
  },
  {
    id: "mythical-glory",
    name: "Mythical Glory",
    image: "/mythical-glory.png",
    tier: 9,
    priceModifier: 5,
    points: { min: 50, max: 99 }
  },
  {
    id: "immortal",
    name: "Immortal",
    image: "/mythical-glory.png",
    tier: 10,
    priceModifier: 6,
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

const rankHasPoints = (rank: Rank): boolean => {
  return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions?.[0]?.points);
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
  
  const basePricePerTier = getBasePrice();
  const adminRanks = getAdminRanks();
  
  let updatedCurrentRank = currentRank;
  let updatedTargetRank = targetRank;
  
  const foundCurrentRank = adminRanks.find((rank: Rank) => rank.id === currentRank.id);
  const foundTargetRank = adminRanks.find((rank: Rank) => rank.id === targetRank.id);
  
  if (foundCurrentRank) updatedCurrentRank = foundCurrentRank;
  if (foundTargetRank) updatedTargetRank = foundTargetRank;
  
  const tierDifference = updatedTargetRank.tier - updatedCurrentRank.tier;
  const priceMultiplier = updatedTargetRank.priceModifier;
  
  let price = Math.round(basePricePerTier * tierDifference * priceMultiplier);
  
  if (currentRank.tier === targetRank.tier && 
      currentRank.subdivisions && 
      targetRank.subdivisions && 
      currentSubdivision !== undefined && 
      targetSubdivision !== undefined) {
    if (targetSubdivision < currentSubdivision) {
      const subdivisionDiff = currentSubdivision - targetSubdivision;
      price = 5 * subdivisionDiff;
    }
  }
  
  if (currentRank.id === "legend" && targetRank.id === "legend" && 
      currentSubdivision === targetSubdivision) {
    const starDifference = targetStars - currentStars;
    if (starDifference > 0) {
      price = 2 * starDifference;
    }
  }
  
  if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
    if (currentRank.tier === targetRank.tier) {
      const pointsDifference = targetMythicPoints - currentMythicPoints;
      if (pointsDifference > 0) {
        price = 3 * pointsDifference;
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
  
  return price;
};

export const getRankPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238B5CF6' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%238B5CF6' fill-opacity='0.3'/%3E%3C/svg%3E";
};
