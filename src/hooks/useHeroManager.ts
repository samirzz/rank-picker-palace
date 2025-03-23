
import { useState, useEffect } from "react";
import { Hero, getAdminHeroes, saveHeroes, getHeroPlaceholderImage } from "@/data/heroes";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

export const useHeroManager = (onSave?: () => void) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load heroes on initial render
  useEffect(() => {
    const loadHeroes = async () => {
      try {
        setLoading(true);
        const loadedHeroes = await getAdminHeroes();
        if (loadedHeroes && loadedHeroes.length > 0) {
          setHeroes(loadedHeroes);
        } else {
          console.warn("No heroes found in database, initializing with defaults");
          toast({
            title: "Warning",
            description: "No heroes found in database. Using default heroes.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading heroes:", error);
        toast({
          title: "Database Error",
          description: "Failed to load hero data from database. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadHeroes();
  }, [toast]);

  const handleNameChange = (id: string, name: string) => {
    setHeroes(heroes.map(hero => hero.id === id ? { ...hero, name } : hero));
  };

  const handleImageChange = (id: string, image: string) => {
    setHeroes(heroes.map(hero => hero.id === id ? { ...hero, image } : hero));
  };

  const handleDifficultyChange = (id: string, difficulty: number) => {
    setHeroes(heroes.map(hero => hero.id === id ? { ...hero, difficulty } : hero));
  };

  const handlePriceModifierChange = (id: string, priceModifier: number) => {
    setHeroes(heroes.map(hero => hero.id === id ? { ...hero, priceModifier } : hero));
  };

  const handleDeleteHero = (id: string) => {
    setHeroes(heroes.filter(hero => hero.id !== id));
    toast({
      title: "Hero removed",
      description: "Hero has been removed. Remember to save changes to update the database.",
    });
  };

  const handleAddHero = (heroData: Omit<Hero, "id">) => {
    // Generate a more reliable unique ID using UUID
    const newId = uuidv4();
    
    const newHero: Hero = { 
      id: newId,
      ...heroData,
      // Use the provided image or fallback to placeholder
      image: heroData.image || getHeroPlaceholderImage()
    };
    
    // Make sure we're adding to the current state
    setHeroes(currentHeroes => [...currentHeroes, newHero]);
    
    toast({
      title: "Hero added",
      description: "New hero has been added. Remember to save changes to update the database.",
    });
    
    // Log to console for debugging
    console.log("Added new hero:", newHero);
    console.log("Current heroes count:", heroes.length + 1);
  };

  const handleSaveChanges = async () => {
    if (heroes.length === 0) {
      toast({
        title: "Warning",
        description: "No heroes to save. Please add at least one hero.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    // Log authentication status
    const { data: authData } = await supabase.auth.getSession();
    console.log("Authentication status:", authData?.session ? "Authenticated" : "Not authenticated");
    
    try {
      console.log("Attempting to save heroes:", heroes);
      await saveHeroes(heroes);
      toast({
        title: "Database updated",
        description: "Hero list has been saved to the database successfully.",
      });
      onSave?.();
    } catch (error) {
      console.error("Error saving heroes to database:", error);
      toast({
        title: "Database Error",
        description: "Failed to save changes to the database. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    heroes,
    loading,
    saving,
    handleNameChange,
    handleImageChange,
    handleDifficultyChange,
    handlePriceModifierChange,
    handleDeleteHero,
    handleAddHero,
    handleSaveChanges
  };
};
