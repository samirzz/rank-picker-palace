import { supabase } from "@/integrations/supabase/client";

export interface Rank {
  id: string;
  name: string;
  image: string;
  tier: number;
  priceModifier: number;
  basePrice?: number;
  costPerStar?: number;
  subdivisions?: RankSubdivision[];
  points?: PointsRange;
}

export interface RankSubdivision {
  name: string;
  stars?: number;
  points?: PointsRange;
}

export interface PointsRange {
  min: number;
  max: number;
}

export interface RankCombination {
  fromRankId: string;
  fromSubdivision?: number;
  toRankId: string;
  toSubdivision?: number;
  price: number;
}

export const originalRanks: Rank[] = [
  {
    id: "warrior",
    name: "Warrior",
    image: "/warrior.png",
    tier: 1,
    priceModifier: 1,
    basePrice: 5,
    costPerStar: 0.5,
    subdivisions: [
      { name: "Warrior I", stars: 3 },
      { name: "Warrior II", stars: 3 },
      { name: "Warrior III", stars: 3 }
    ]
  },
  {
    id: "elite",
    name: "Elite",
    image: "/elite.png",
    tier: 2,
    priceModifier: 1.2,
    basePrice: 10,
    costPerStar: 1,
    subdivisions: [
      { name: "Elite I", stars: 3 },
      { name: "Elite II", stars: 3 },
      { name: "Elite III", stars: 3 },
      { name: "Elite IV", stars: 3 }
    ]
  },
  {
    id: "master",
    name: "Master",
    image: "/master.png",
    tier: 3,
    priceModifier: 1.5,
    basePrice: 15,
    costPerStar: 1.5,
    subdivisions: [
      { name: "Master I", stars: 4 },
      { name: "Master II", stars: 4 },
      { name: "Master III", stars: 4 },
      { name: "Master IV", stars: 4 }
    ]
  },
  {
    id: "grandmaster",
    name: "Grand Master",
    image: "/grandmaster.png",
    tier: 4,
    priceModifier: 1.8,
    basePrice: 20,
    costPerStar: 2,
    subdivisions: [
      { name: "Grandmaster I", stars: 5 },
      { name: "Grandmaster II", stars: 5 },
      { name: "Grandmaster III", stars: 5 },
      { name: "Grandmaster IV", stars: 5 },
      { name: "Grandmaster V", stars: 5 }
    ]
  },
  {
    id: "epic",
    name: "Epic",
    image: "/epic.png",
    tier: 5,
    priceModifier: 2.2,
    basePrice: 25,
    costPerStar: 2.5,
    subdivisions: [
      { name: "Epic I", stars: 5 },
      { name: "Epic II", stars: 5 },
      { name: "Epic III", stars: 5 },
      { name: "Epic IV", stars: 5 },
      { name: "Epic V", stars: 5 }
    ]
  },
  {
    id: "legend",
    name: "Legend",
    image: "/legend.png",
    tier: 6,
    priceModifier: 2.8,
    basePrice: 30,
    costPerStar: 3,
    subdivisions: [
      { name: "Legend I", stars: 5 },
      { name: "Legend II", stars: 5 },
      { name: "Legend III", stars: 5 },
      { name: "Legend IV", stars: 5 },
      { name: "Legend V", stars: 5 }
    ]
  },
  {
    id: "mythic",
    name: "Mythic",
    image: "/mythic.png",
    tier: 7,
    priceModifier: 3.5,
    basePrice: 40,
    costPerStar: 4,
    subdivisions: [
      { name: "Mythic", points: { min: 0, max: 24 } }
    ]
  },
  {
    id: "mythic-honor",
    name: "Mythic Honor",
    image: "/mythic.png",
    tier: 8,
    priceModifier: 4,
    basePrice: 50,
    costPerStar: 5,
    points: { min: 25, max: 49 }
  },
  {
    id: "mythical-glory",
    name: "Mythical Glory",
    image: "/mythical-glory.png",
    tier: 9,
    priceModifier: 5,
    basePrice: 60,
    costPerStar: 6,
    points: { min: 50, max: 99 }
  },
  {
    id: "immortal",
    name: "Immortal",
    image: "/mythical-glory.png",
    tier: 10,
    priceModifier: 6,
    basePrice: 80,
    costPerStar: 8,
    points: { min: 100, max: 9999 }
  }
];

const DEFAULT_BASE_PRICE_PER_TIER = 10;

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

const findPointsForMythicRank = (rankId: string): PointsRange | undefined => {
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

export const saveBasePrice = async (price: number): Promise<void> => {
  const { error } = await supabase
    .from('configuration')
    .upsert({ id: 'basePricePerTier', value: price.toString() });
  
  if (error) {
    console.error('Error saving base price per tier:', error);
  }
};

export let ranks = originalRanks;

getAdminRanks().then(loadedRanks => {
  ranks = loadedRanks;
});

const rankHasPoints = (rank: Rank | null): boolean => {
  if (!rank) return false;
  return Boolean(rank.points) || Boolean(rank.id === "mythic" && rank.subdivisions && rank.subdivisions[0]?.points);
};

const calculateTotalStars = (
  currentRank: Rank,
  targetRank: Rank,
  currentSubdivision: number = 0,
  targetSubdivision: number = 0,
  currentStars: number = 0,
  targetStars: number = 0
): number => {
  let totalStars = 0;
  
  if (currentRank.id === targetRank.id && currentSubdivision === targetSubdivision) {
    return targetStars - currentStars;
  }
  
  if (currentRank.id === targetRank.id) {
    if (currentRank.subdivisions && currentRank.subdivisions[currentSubdivision]) {
      const maxStars = currentRank.subdivisions[currentSubdivision].stars || 0;
      totalStars += maxStars - currentStars;
    }
    
    for (let i = currentSubdivision - 1; i > targetSubdivision; i--) {
      if (currentRank.subdivisions && currentRank.subdivisions[i]) {
        totalStars += currentRank.subdivisions[i].stars || 0;
      }
    }
    
    if (targetRank.subdivisions && targetRank.subdivisions[targetSubdivision]) {
      totalStars += targetStars;
    }
    
    return totalStars;
  }
  
  if (currentRank.subdivisions) {
    const currentMaxStars = currentRank.subdivisions[currentSubdivision]?.stars || 0;
    totalStars += currentMaxStars - currentStars;
    
    for (let i = currentSubdivision - 1; i >= 0; i--) {
      totalStars += currentRank.subdivisions[i]?.stars || 0;
    }
  }
  
  const ranksInBetween = ranks.filter(r => 
    r.tier > currentRank.tier && r.tier < targetRank.tier
  );
  
  for (const rank of ranksInBetween) {
    if (rank.subdivisions) {
      for (const subdivision of rank.subdivisions) {
        totalStars += subdivision.stars || 0;
      }
    }
  }
  
  if (targetRank.subdivisions) {
    for (let i = targetRank.subdivisions.length - 1; i > targetSubdivision; i--) {
      totalStars += targetRank.subdivisions[i]?.stars || 0;
    }
    
    totalStars += targetStars;
  }
  
  return totalStars;
};

export const calculatePrice = async (
  currentRank: Rank, 
  targetRank: Rank, 
  currentSubdivision: number = 0,
  targetSubdivision: number = 0,
  currentStars: number = 0,
  targetStars: number = 0,
  currentMythicPoints: number = 0,
  targetMythicPoints: number = 0
): Promise<number> => {
  if (currentRank.tier > targetRank.tier) {
    return 0;
  }
  
  if (currentRank.tier === targetRank.tier && currentRank.id === targetRank.id) {
    if (currentRank.id === "legend") {
      if (currentSubdivision < targetSubdivision) {
        return 0;
      }
      
      if (currentSubdivision === targetSubdivision && currentStars >= targetStars) {
        return 0;
      }
    } 
    else if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      if (currentMythicPoints >= targetMythicPoints) {
        return 0;
      }
    }
    else if (currentSubdivision <= targetSubdivision) {
      return 0;
    }
  }
  
  const combinations = await getRankCombinations();
  const customCombination = combinations.find(combo => 
    combo.fromRankId === currentRank.id && 
    combo.toRankId === targetRank.id &&
    (combo.fromSubdivision === undefined || combo.fromSubdivision === currentSubdivision) &&
    (combo.toSubdivision === undefined || combo.toSubdivision === targetSubdivision)
  );
  
  if (customCombination) {
    return customCombination.price;
  }
  
  const adminRanks = await getAdminRanks();
  
  let updatedCurrentRank = currentRank;
  let updatedTargetRank = targetRank;
  
  const foundCurrentRank = adminRanks.find((rank: Rank) => rank.id === currentRank.id);
  const foundTargetRank = adminRanks.find((rank: Rank) => rank.id === targetRank.id);
  
  if (foundCurrentRank) updatedCurrentRank = foundCurrentRank;
  if (foundTargetRank) updatedTargetRank = foundTargetRank;
  
  let price = 0;
  
  price += updatedCurrentRank.basePrice || 0;
  
  if (!rankHasPoints(currentRank) && !rankHasPoints(targetRank)) {
    const totalStars = calculateTotalStars(
      updatedCurrentRank, 
      updatedTargetRank, 
      currentSubdivision, 
      targetSubdivision,
      currentStars,
      targetStars
    );
    
    price += totalStars * (updatedCurrentRank.costPerStar || 0);
  } else {
    if (rankHasPoints(currentRank) && rankHasPoints(targetRank)) {
      if (currentRank.tier === targetRank.tier) {
        const pointsDifference = targetMythicPoints - currentMythicPoints;
        if (pointsDifference > 0) {
          price += 3 * pointsDifference;
        }
      } else {
        if (targetMythicPoints > 0) {
          const minPoints = targetRank.points?.min || 0;
          const pointsAboveMin = targetMythicPoints - minPoints;
          if (pointsAboveMin > 0) {
            price += 3 * pointsAboveMin;
          }
        }
      }
    }
    else if (!rankHasPoints(currentRank) && rankHasPoints(targetRank) && targetMythicPoints > 0) {
      const minPoints = targetRank.points?.min || 0;
      const pointsAboveMin = targetMythicPoints - minPoints;
      if (pointsAboveMin > 0) {
        price += 3 * pointsAboveMin;
      }
    }
  }
  
  price += updatedTargetRank.basePrice || 0;
  
  return price;
};

export const getRankPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%238B5CF6' fill-opacity='0.2'/%3E%3Cpath d='M50 20 L65 45 L85 50 L65 55 L50 80 L35 55 L15 50 L35 45 Z' fill='%238B5CF6' fill-opacity='0.3'/%3E%3C/svg%3E";
};
