
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_BASE_PRICE_PER_TIER } from "../constants";

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
