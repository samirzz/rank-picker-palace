
import { supabase } from "@/integrations/supabase/client";
import { Rank } from "../types";

export const saveAdminRanks = async (ranks: Rank[]): Promise<void> => {
  if (!ranks || ranks.length === 0) {
    console.warn("No ranks to save");
    return;
  }
  
  const ranksForDb = ranks.map(rank => ({
    id: rank.id,
    name: rank.name,
    image: rank.image,
    tier: rank.tier,
    price_modifier: rank.priceModifier,
    base_price: rank.basePrice || 0,
    cost_per_star: rank.costPerStar || 0
  }));
  
  let subdivisionsForDb: any[] = [];
  ranks.forEach(rank => {
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
    }
  });
  
  try {
    for (const rank of ranksForDb) {
      const { error } = await supabase
        .from('ranks')
        .upsert(rank, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error upserting rank ${rank.id}:`, error);
        throw error;
      }
    }
    
    const { data: existingRanks, error: fetchError } = await supabase
      .from('ranks')
      .select('id');
    
    if (fetchError) {
      console.error('Error fetching existing ranks:', fetchError);
    } else {
      const rankIds = new Set(ranks.map(r => r.id));
      const ranksToDelete = existingRanks
        .filter(r => !rankIds.has(r.id))
        .map(r => r.id);
      
      if (ranksToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('ranks')
          .delete()
          .in('id', ranksToDelete);
        
        if (deleteError) {
          console.error('Error deleting unused ranks:', deleteError);
        }
      }
    }
    
    const { error: deleteSubdivisionsError } = await supabase
      .from('rank_subdivisions')
      .delete()
      .in('rank_id', ranks.map(r => r.id));
    
    if (deleteSubdivisionsError) {
      console.error('Error deleting subdivisions:', deleteSubdivisionsError);
    }
    
    if (subdivisionsForDb.length > 0) {
      const { error: insertSubdivisionsError } = await supabase
        .from('rank_subdivisions')
        .insert(subdivisionsForDb);
      
      if (insertSubdivisionsError) {
        console.error('Error inserting subdivisions:', insertSubdivisionsError);
      }
    }
  } catch (error) {
    console.error('Error in saveAdminRanks:', error);
    throw error;
  }
};
