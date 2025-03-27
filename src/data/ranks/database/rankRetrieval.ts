
import { supabase } from "@/integrations/supabase/client";
import { Rank } from "../types";
import { originalRanks } from "../constants";

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
