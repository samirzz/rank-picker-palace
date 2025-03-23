
import { useState, useEffect } from "react";
import { Hero, getAdminHeroes, saveHeroes, getHeroPlaceholderImage } from "@/data/heroes";
import { useToast } from "@/hooks/use-toast";

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
        }
      } catch (error) {
        console.error("Error loading heroes:", error);
        toast({
          title: "Error",
          description: "Failed to load hero data. Please refresh the page.",
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
  };

  const handleAddHero = () => {
    const newId = Math.random().toString(36).substring(7);
    setHeroes([...heroes, { 
      id: newId, 
      name: "New Hero", 
      image: getHeroPlaceholderImage(), 
      difficulty: 1, 
      priceModifier: 1 
    }]);
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
    try {
      await saveHeroes(heroes);
      toast({
        title: "Changes saved",
        description: "Hero list has been updated successfully.",
      });
      onSave?.();
    } catch (error) {
      console.error("Error saving heroes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
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
