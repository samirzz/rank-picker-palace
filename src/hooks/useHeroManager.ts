
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

  const handleAddHero = () => {
    const newId = Math.random().toString(36).substring(7);
    setHeroes([...heroes, { 
      id: newId, 
      name: "New Hero", 
      image: getHeroPlaceholderImage(), 
      difficulty: 1, 
      priceModifier: 1 
    }]);
    toast({
      title: "Hero added",
      description: "New hero has been added. Remember to save changes to update the database.",
    });
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
        title: "Database updated",
        description: "Hero list has been saved to the database successfully.",
      });
      onSave?.();
    } catch (error) {
      console.error("Error saving heroes to database:", error);
      toast({
        title: "Database Error",
        description: "Failed to save changes to the database. Please try again.",
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
