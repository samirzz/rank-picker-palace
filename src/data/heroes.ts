
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

// Fetch heroes from Supabase
export const getAdminHeroes = async (): Promise<Hero[]> => {
  const { data, error } = await supabase
    .from('heroes')
    .select('*');
  
  if (error) {
    console.error('Error fetching heroes:', error);
    return [];
  }
  
  return data.map(hero => ({
    id: hero.id,
    name: hero.name,
    image: hero.image,
    difficulty: hero.difficulty,
    priceModifier: Number(hero.price_modifier)
  }));
};

// Get heroes for public use
export const getHeroes = async (): Promise<Hero[]> => {
  return getAdminHeroes();
};

// Get hero base price from configuration table
export const getHeroBasePrice = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('configuration')
    .select('value')
    .eq('id', 'heroBasePricePerMMR')
    .single();
  
  if (error) {
    console.error('Error fetching hero base price:', error);
    return DEFAULT_BASE_PRICE_PER_MMR;
  }
  
  return parseFloat(data.value);
};

// Save hero base price to configuration table
export const saveHeroBasePrice = async (price: number): Promise<void> => {
  const { error } = await supabase
    .from('configuration')
    .upsert({ id: 'heroBasePricePerMMR', value: price.toString() });
  
  if (error) {
    console.error('Error saving hero base price:', error);
  }
  
  // Dispatch an event to notify components that the base price has changed
  window.dispatchEvent(new Event('adminBasePriceChange'));
};

// Save heroes to Supabase
export const saveHeroes = async (heroes: Hero[]): Promise<void> => {
  // First, convert heroes to the format expected by Supabase
  const heroesForDb = heroes.map(hero => ({
    id: hero.id,
    name: hero.name,
    image: hero.image,
    difficulty: hero.difficulty,
    price_modifier: hero.priceModifier
  }));
  
  // Delete all heroes and insert new ones
  // This is a simple approach - in a production app, you might want to use transactions
  // and only update/insert/delete the necessary records
  const { error: deleteError } = await supabase
    .from('heroes')
    .delete()
    .neq('id', 'placeholder'); // This is a trick to delete all records
  
  if (deleteError) {
    console.error('Error deleting heroes:', deleteError);
    return;
  }
  
  const { error: insertError } = await supabase
    .from('heroes')
    .insert(heroesForDb);
  
  if (insertError) {
    console.error('Error inserting heroes:', insertError);
    return;
  }
  
  // Dispatch an event to notify components that the hero list has changed
  window.dispatchEvent(new Event('adminHeroesChange'));
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
