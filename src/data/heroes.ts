import { supabase } from "@/integrations/supabase/client";

export interface Hero {
  id: string;
  name: string;
  image: string;
  difficulty: number;
  priceModifier: number;
}

export interface MMRRange {
  min: number;
  max: number;
}

// Default hero base price
const DEFAULT_BASE_PRICE_PER_MMR = 0.1;

// Sample heroes to use as fallback if database is empty
const defaultHeroes: Hero[] = [
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

// Fetch heroes from Supabase
export const getAdminHeroes = async (): Promise<Hero[]> => {
  try {
    const { data, error } = await supabase
      .from('heroes')
      .select('*');
    
    if (error) {
      console.error('Error fetching heroes from database:', error);
      return defaultHeroes; // Return default heroes on error
    }
    
    if (data && data.length > 0) {
      return data.map(hero => ({
        id: hero.id,
        name: hero.name,
        image: hero.image,
        difficulty: hero.difficulty,
        priceModifier: Number(hero.price_modifier)
      }));
    }
    
    // If no data found, insert default heroes and return them
    console.log("No heroes found in database, initializing with defaults");
    try {
      const heroesForDb = defaultHeroes.map(hero => ({
        id: hero.id,
        name: hero.name,
        image: hero.image,
        difficulty: hero.difficulty,
        price_modifier: hero.priceModifier
      }));
      
      await supabase.from('heroes').insert(heroesForDb);
      console.log("Default heroes added to database");
    } catch (error) {
      console.error("Error initializing default heroes in database:", error);
    }
    
    return defaultHeroes;
  } catch (error) {
    console.error("Unexpected error while accessing the heroes database:", error);
    return defaultHeroes;
  }
};

// Get heroes for public use
export const getHeroes = async (): Promise<Hero[]> => {
  return getAdminHeroes();
};

// Get hero base price from configuration table
export const getHeroBasePrice = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('configuration')
      .select('value')
      .eq('id', 'heroBasePricePerMMR')
      .single();
    
    if (error) {
      console.error('Error fetching hero base price from database:', error);
      return DEFAULT_BASE_PRICE_PER_MMR;
    }
    
    return parseFloat(data.value);
  } catch (error) {
    console.error("Unexpected error while accessing the configuration database:", error);
    return DEFAULT_BASE_PRICE_PER_MMR;
  }
};

// Save hero base price to configuration table
export const saveHeroBasePrice = async (price: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('configuration')
      .upsert({ id: 'heroBasePricePerMMR', value: price.toString() });
    
    if (error) {
      console.error('Error saving hero base price to database:', error);
      throw error;
    }
    
    // Dispatch an event to notify components that the base price has changed
    window.dispatchEvent(new Event('adminBasePriceChange'));
  } catch (error) {
    console.error("Unexpected error while saving to the configuration database:", error);
    throw error;
  }
};

// Save heroes to Supabase
export const saveHeroes = async (heroes: Hero[]): Promise<void> => {
  if (!heroes || heroes.length === 0) {
    console.warn("No heroes to save to database");
    return;
  }
  
  try {
    // First, convert heroes to the format expected by Supabase
    const heroesForDb = heroes.map(hero => ({
      id: hero.id,
      name: hero.name,
      image: hero.image,
      difficulty: hero.difficulty,
      price_modifier: hero.priceModifier
    }));
    
    // Use upsert instead of delete+insert to preserve existing records
    for (const hero of heroesForDb) {
      const { error } = await supabase
        .from('heroes')
        .upsert(hero, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error upserting hero ${hero.id} to database:`, error);
        throw error;
      }
    }
    
    // Check for heroes to delete (heroes in DB that aren't in the current list)
    const { data: existingHeroes, error: fetchError } = await supabase
      .from('heroes')
      .select('id');
    
    if (fetchError) {
      console.error('Error fetching existing heroes from database:', fetchError);
      throw fetchError;
    }
    
    const heroIds = new Set(heroes.map(h => h.id));
    const heroesToDelete = existingHeroes
      .filter(h => !heroIds.has(h.id))
      .map(h => h.id);
    
    if (heroesToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('heroes')
        .delete()
        .in('id', heroesToDelete);
      
      if (deleteError) {
        console.error('Error deleting unused heroes from database:', deleteError);
        throw deleteError;
      }
    }
    
    // Dispatch an event to notify components that the hero list has changed
    window.dispatchEvent(new Event('adminHeroesChange'));
  } catch (error) {
    console.error("Unexpected error during database operation:", error);
    throw error;
  }
};

export const getHeroPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23F97316' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%23F97316' fill-opacity='0.3'/%3E%3C/svg%3E";
};

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
