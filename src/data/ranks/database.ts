
import { supabase } from "@/integrations/supabase/client";
import { Rank, RankCombination } from "./types";
import { DEFAULT_BASE_PRICE_PER_TIER, originalRanks } from "./constants";

export const getAdminRanks = async (): Promise<Rank[]> => {
  try {
    const { data: ranksData, error: ranksError } = await supabase
      .from('ranks')
      .select('*')
      .order('tier', { ascending: true });
    
    if (ranksError) {
      console.error('Error fetching ranks:', ranksError);
      return originalRanks;
    }
    
    if (!ranksData || ranksData.length === 0) {
      console.log("No ranks found in database, initializing with defaults");
      try {
        const ranksForDb = originalRanks.map(rank => ({
          id: rank.id,
          name: rank.name,
          image: rank.image,
          tier: rank.tier,
          price_modifier: rank.priceModifier,
          base_price: rank.basePrice || 0,
          cost_per_star: rank.costPerStar || 0
        }));
        
        await supabase.from('ranks').insert(ranksForDb);
        console.log("Default ranks added to database");
        
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
          await supabase.from('rank_subdivisions').insert(subdivisionsForDb);
          console.log("Default rank subdivisions added to database");
        }
        
        return originalRanks;
      } catch (initError) {
        console.error("Error initializing default ranks:", initError);
        return originalRanks;
      }
    }
    
    const { data: subdivisionsData, error: subdivisionsError } = await supabase
      .from('rank_subdivisions')
      .select('*');
    
    if (subdivisionsError) {
      console.error('Error fetching rank subdivisions:', subdivisionsError);
      return ranksData.map(rank => ({
        id: rank.id,
        name: rank.name,
        image: rank.image,
        tier: rank.tier,
        priceModifier: Number(rank.price_modifier),
        basePrice: Number(rank.base_price),
        costPerStar: Number(rank.cost_per_star)
      }));
    }
    
    const ranks = ranksData.map(rank => {
      const rankSubdivisions = subdivisionsData
        .filter(sub => sub.rank_id === rank.id)
        .map(sub => ({
          name: sub.name,
          stars: sub.stars,
          points: sub.min_points !== null && sub.max_points !== null ? {
            min: sub.min_points,
            max: sub.max_points
          } : undefined
        }));
      
      const isMythicRank = rank.id.includes('mythic') || rank.id === 'immortal';
      const hasPointsInSubdivision = rankSubdivisions.some(sub => sub.points);
      
      let pointsRange;
      if (isMythicRank && !hasPointsInSubdivision) {
        const mythicSub = subdivisionsData.find(
          sub => sub.rank_id === rank.id && sub.min_points !== null && sub.max_points !== null
        );
        if (mythicSub) {
          pointsRange = {
            min: mythicSub.min_points,
            max: mythicSub.max_points
          };
        }
      }
      
      return {
        id: rank.id,
        name: rank.name,
        image: rank.image,
        tier: rank.tier,
        priceModifier: Number(rank.price_modifier),
        basePrice: Number(rank.base_price),
        costPerStar: Number(rank.cost_per_star),
        subdivisions: rankSubdivisions.length > 0 ? rankSubdivisions : undefined,
        points: pointsRange || (rank.id.includes('mythic') || rank.id === 'immortal' ? 
          findPointsForMythicRank(rank.id) : undefined)
      };
    });
    
    return ranks;
  } catch (error) {
    console.error('Unexpected error in getAdminRanks:', error);
    return originalRanks; 
  }
};

const findPointsForMythicRank = (rankId: string): { min: number, max: number } | undefined => {
  const rank = originalRanks.find(r => r.id === rankId);
  return rank?.points;
};

export const getBasePrice = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('configuration')
    .select('value')
    .eq('id', 'basePricePerTier')
    .single();
  
  if (error) {
    console.error('Error fetching base price per tier:', error);
    return DEFAULT_BASE_PRICE_PER_TIER;
  }
  
  return parseFloat(data.value);
};

export const saveBasePrice = async (price: number): Promise<void> => {
  const { error } = await supabase
    .from('configuration')
    .upsert({ id: 'basePricePerTier', value: price.toString() });
  
  if (error) {
    console.error('Error saving base price per tier:', error);
  }
};

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

export const getRankCombinations = async (): Promise<RankCombination[]> => {
  const { data, error } = await supabase
    .from('rank_combinations')
    .select('*');
  
  if (error) {
    console.error('Error fetching rank combinations:', error);
    return [];
  }
  
  return data.map(combo => ({
    fromRankId: combo.from_rank_id,
    fromSubdivision: combo.from_subdivision,
    toRankId: combo.to_rank_id,
    toSubdivision: combo.to_subdivision,
    price: Number(combo.price)
  }));
};

export const saveRankCombinations = async (combinations: RankCombination[]): Promise<void> => {
  const combosForDb = combinations.map(combo => ({
    from_rank_id: combo.fromRankId,
    from_subdivision: combo.fromSubdivision,
    to_rank_id: combo.toRankId,
    to_subdivision: combo.toSubdivision,
    price: combo.price
  }));
  
  const { error: deleteError } = await supabase
    .from('rank_combinations')
    .delete()
    .neq('id', 0);
  
  if (deleteError) {
    console.error('Error deleting rank combinations:', deleteError);
    return;
  }
  
  if (combosForDb.length > 0) {
    const { error: insertError } = await supabase
      .from('rank_combinations')
      .insert(combosForDb);
    
    if (insertError) {
      console.error('Error inserting rank combinations:', insertError);
    }
  }
};
