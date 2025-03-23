
// Barrel file to maintain the same exports for backward compatibility
import { Hero, MMRRange } from "@/types/hero.types";
import { getHeroPlaceholderImage, defaultHeroes, DEFAULT_BASE_PRICE_PER_MMR } from "@/utils/hero.utils";
import { 
  getAdminHeroes, 
  getHeroes, 
  getHeroBasePrice, 
  saveHeroBasePrice, 
  saveHeroes 
} from "@/services/hero.service";
import { calculateMMRBoostPrice } from "@/services/price.service";

// Re-export everything to maintain backward compatibility
export {
  Hero,
  MMRRange,
  getHeroPlaceholderImage,
  getAdminHeroes,
  getHeroes,
  getHeroBasePrice,
  saveHeroBasePrice,
  saveHeroes,
  calculateMMRBoostPrice
};
