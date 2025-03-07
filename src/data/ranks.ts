
export interface Rank {
  id: string;
  name: string;
  image: string;
  tier?: number;
  priceModifier: number;
}

// Define rank tiers
export const ranks: Rank[] = [
  {
    id: "warrior",
    name: "Warrior",
    image: "/warrior.png",
    tier: 1,
    priceModifier: 1
  },
  {
    id: "elite",
    name: "Elite",
    image: "/elite.png",
    tier: 2,
    priceModifier: 1.2
  },
  {
    id: "master",
    name: "Master",
    image: "/master.png",
    tier: 3,
    priceModifier: 1.5
  },
  {
    id: "grandmaster",
    name: "Grand Master",
    image: "/grandmaster.png",
    tier: 4,
    priceModifier: 1.8
  },
  {
    id: "epic",
    name: "Epic",
    image: "/epic.png",
    tier: 5,
    priceModifier: 2.2
  },
  {
    id: "legend",
    name: "Legend",
    image: "/legend.png",
    tier: 6,
    priceModifier: 2.8
  },
  {
    id: "mythic",
    name: "Mythic",
    image: "/mythic.png",
    tier: 7,
    priceModifier: 3.5
  },
  {
    id: "mythical-glory",
    name: "Mythical Glory",
    image: "/mythical-glory.png",
    tier: 8,
    priceModifier: 5
  }
];

// Calculate price based on current and target ranks
export const calculatePrice = (currentRank: Rank, targetRank: Rank): number => {
  if (currentRank.tier! >= targetRank.tier!) {
    return 0; // Can't boost to a lower or same rank
  }
  
  const basePricePerTier = 10; // Base price of $10 per tier
  const tierDifference = targetRank.tier! - currentRank.tier!;
  const priceMultiplier = targetRank.priceModifier;
  
  return Math.round(basePricePerTier * tierDifference * priceMultiplier);
};

// Get placeholder rank images
export const getRankPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238B5CF6' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%238B5CF6' fill-opacity='0.3'/%3E%3C/svg%3E";
};
