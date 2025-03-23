
import { supabase } from "@/integrations/supabase/client";
import { originalRanks } from "./ranks";

export const initializeRanksWithCorrectStars = async (): Promise<void> => {
  try {
    console.log("Initializing ranks with correct stars...");
    
    // First check if ranks already exist
    const { data: existingRanks, error: fetchError } = await supabase
      .from('ranks')
      .select('id')
      .limit(1);
    
    if (fetchError) {
      console.error("Error checking existing ranks:", fetchError);
      return;
    }
    
    // If ranks already exist, we'll update them
    if (existingRanks && existingRanks.length > 0) {
      // Delete existing subdivisions first
      const { error: deleteSubdivisionsError } = await supabase
        .from('rank_subdivisions')
        .delete()
        .neq('id', 0);
      
      if (deleteSubdivisionsError) {
        console.error('Error deleting existing subdivisions:', deleteSubdivisionsError);
        return;
      }
    } else {
      // Insert ranks if they don't exist
      const ranksForDb = originalRanks.map(rank => ({
        id: rank.id,
        name: rank.name,
        image: rank.image,
        tier: rank.tier,
        price_modifier: rank.priceModifier,
        base_price: rank.basePrice || 0,
        cost_per_star: rank.costPerStar || 0
      }));
      
      const { error: insertRanksError } = await supabase
        .from('ranks')
        .insert(ranksForDb);
      
      if (insertRanksError) {
        console.error('Error inserting ranks:', insertRanksError);
        return;
      }
      
      console.log("Default ranks added to database");
    }
    
    // Now insert all subdivisions with correct star counts
    let subdivisionsForDb: any[] = [];
    originalRanks.forEach(rank => {
      if (rank.subdivisions) {
        rank.subdivisions.forEach((sub) => {
          subdivisionsForDb.push({
            rank_id: rank.id,
            name: sub.name,
            stars: sub.stars,
            min_points: sub.points?.min,
            max_points: sub.points?.max
          });
        });
      } else if (rank.points) {
        // For ranks with points directly (no subdivisions)
        subdivisionsForDb.push({
          rank_id: rank.id,
          name: rank.name,
          stars: null,
          min_points: rank.points.min,
          max_points: rank.points.max
        });
      }
    });
    
    if (subdivisionsForDb.length > 0) {
      const { error: insertSubdivisionsError } = await supabase
        .from('rank_subdivisions')
        .insert(subdivisionsForDb);
      
      if (insertSubdivisionsError) {
        console.error('Error inserting subdivisions:', insertSubdivisionsError);
        return;
      }
      
      console.log("Rank subdivisions with correct star counts added to database");
    }
    
    // Dispatch an event to notify components that ranks have been updated
    window.dispatchEvent(new Event('adminRanksChange'));
    
  } catch (error) {
    console.error('Error initializing ranks:', error);
  }
};
