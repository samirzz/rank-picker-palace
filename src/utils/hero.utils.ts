
export const getHeroPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23F97316' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%23F97316' fill-opacity='0.3'/%3E%3C/svg%3E";
};

// Default hero base price
export const DEFAULT_BASE_PRICE_PER_MMR = 0.1;

// Sample heroes to use as fallback if database is empty
export const defaultHeroes = [
  {
    id: "lancelot",
    name: "Lancelot",
    image: "/heroes/lancelot.png",
    difficulty: 3,
    priceModifier: 1.2
  },
  {
    id: "fanny",
    name: "Fanny",
    image: "/heroes/fanny.png",
    difficulty: 5,
    priceModifier: 1.5
  },
  {
    id: "chou",
    name: "Chou",
    image: "/heroes/chou.png",
    difficulty: 4,
    priceModifier: 1.3
  },
  {
    id: "gusion",
    name: "Gusion",
    image: "/heroes/gusion.png",
    difficulty: 4,
    priceModifier: 1.3
  },
  {
    id: "alucard",
    name: "Alucard", 
    image: "/heroes/alucard.png",
    difficulty: 2,
    priceModifier: 1.1
  }
];
