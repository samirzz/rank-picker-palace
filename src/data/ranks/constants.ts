
import { Rank } from './types';

export const DEFAULT_BASE_PRICE_PER_TIER = 10;

export const originalRanks: Rank[] = [
  {
    id: "warrior",
    name: "Warrior",
    image: "/warrior.png",
    tier: 1,
    priceModifier: 1,
    basePrice: 5,
    costPerStar: 0.5,
    subdivisions: [
      { name: "Warrior I", stars: 3 },
      { name: "Warrior II", stars: 3 },
      { name: "Warrior III", stars: 3 }
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
      { name: "Elite I", stars: 3 },
      { name: "Elite II", stars: 3 },
      { name: "Elite III", stars: 3 },
      { name: "Elite IV", stars: 3 }
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
      { name: "Master I", stars: 4 },
      { name: "Master II", stars: 4 },
      { name: "Master III", stars: 4 },
      { name: "Master IV", stars: 4 }
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

export let ranks = originalRanks;

export const getRankPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238B5CF6' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%238B5CF6' fill-opacity='0.3'/%3E%3C/svg%3E";
};
