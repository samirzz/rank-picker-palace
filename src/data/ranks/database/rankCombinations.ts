
import { supabase } from "@/integrations/supabase/client";
import { RankCombination } from "../types";

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
