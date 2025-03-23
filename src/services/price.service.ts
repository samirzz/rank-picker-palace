
import { Hero } from "@/types/hero.types";
import { getHeroBasePrice } from "./hero.service";

export const calculateMMRBoostPrice = async (
  currentMMR: number,
  targetMMR: number,
  selectedHero: Hero | null
): Promise<number> => {
  if (currentMMR >= targetMMR || !selectedHero) {
    return 0;
  }
  
  const mmrDifference = targetMMR - currentMMR;
  const basePrice = await getHeroBasePrice();
  const heroModifier = selectedHero.priceModifier;
  
  // Apply a progressive scaling based on MMR range
  let scalingFactor = 1;
  if (currentMMR >= 3000) scalingFactor = 1.5;
  else if (currentMMR >= 2000) scalingFactor = 1.25;
  
  return Math.round(mmrDifference * basePrice * heroModifier * scalingFactor);
};
