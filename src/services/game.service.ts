
import { supabase } from "@/integrations/supabase/client";
import { Game } from "@/types/game.types";

export const fetchGames = async (): Promise<Game[]> => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error("Error fetching games:", error);
    throw error;
  }

  // Transform the data to match our Game interface
  return data.map(game => ({
    id: game.id,
    slug: game.slug,
    name: game.name,
    description: game.description,
    icon: game.icon,
    isActive: game.is_active,
  }));
};
