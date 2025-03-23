
// Barrel file to maintain the same exports for backward compatibility
import { getHeroPlaceholderImage, defaultHeroes, DEFAULT_BASE_PRICE_PER_MMR } from "@/utils/hero.utils";
import { 
  getAdminHeroes, 
  getHeroes, 
  getHeroBasePrice, 
  saveHeroBasePrice, 
  saveHeroes 
} from "@/services/hero.service";
import { calculateMMRBoostPrice } from "@/services/price.service";

// Re-export types with 'export type' to fix the TS1205 error
export type { Hero, MMRRange } from "@/types/hero.types";

// Re-export everything else to maintain backward compatibility
export {
  getHeroPlaceholderImage,
  getAdminHeroes,
  getHeroes,
  getHeroBasePrice,
  saveHeroBasePrice,
  saveHeroes,
  calculateMMRBoostPrice
};
