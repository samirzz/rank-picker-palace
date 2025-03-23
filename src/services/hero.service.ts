
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/types/hero.types";
import { getHeroPlaceholderImage, defaultHeroes, DEFAULT_BASE_PRICE_PER_MMR } from "@/utils/hero.utils";

// Fetch heroes from Supabase
export const getAdminHeroes = async (): Promise<Hero[]> => {
  try {
    console.log("Fetching heroes from database...");
    const { data, error } = await supabase
      .from('heroes')
      .select('*');
    
    if (error) {
      console.error('Error fetching heroes from database:', error);
      return defaultHeroes; // Return default heroes on error
    }
    
    if (data && data.length > 0) {
      console.log(`Found ${data.length} heroes in database`);
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
    console.log("Fetching hero base price from database...");
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
    console.log(`Saving hero base price to database: ${price}`);
    const { error } = await supabase
      .from('configuration')
      .upsert({ id: 'heroBasePricePerMMR', value: price.toString() });
    
    if (error) {
      console.error('Error saving hero base price to database:', error);
      throw error;
    }
    
    console.log("Hero base price saved successfully");
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
    console.log(`Saving ${heroes.length} heroes to database...`);
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
      console.log(`Upserting hero: ${hero.id} - ${hero.name}`);
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
      console.log(`Deleting ${heroesToDelete.length} unused heroes from database`);
      const { error: deleteError } = await supabase
        .from('heroes')
        .delete()
        .in('id', heroesToDelete);
      
      if (deleteError) {
        console.error('Error deleting unused heroes from database:', deleteError);
        throw deleteError;
      }
    }
    
    console.log("Heroes saved successfully to database");
    // Dispatch an event to notify components that the hero list has changed
    window.dispatchEvent(new Event('adminHeroesChange'));
  } catch (error) {
    console.error("Unexpected error during database operation:", error);
    throw error;
  }
};
