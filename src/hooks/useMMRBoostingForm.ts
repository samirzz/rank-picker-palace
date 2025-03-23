import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Hero } from "@/types/hero.types";
import { getHeroes } from "@/services/hero.service";
import { calculateMMRBoostPrice } from "@/services/price.service";

// Form schema definition with increased MMR limit to 6000
const formSchema = z.object({
  hero: z.string().min(1, "Please select a hero"),
  currentMMR: z
    .number()
    .min(0, "MMR cannot be negative")
    .max(6000, "Maximum MMR is 6000"),
  targetMMR: z
    .number()
    .min(0, "MMR cannot be negative")
    .max(6000, "Maximum MMR is 6000"),
});

export type MMRFormValues = z.infer<typeof formSchema>;

export const useMMRBoostingForm = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initialize form with higher limit
  const form = useForm<MMRFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero: "",
      currentMMR: 1000,
      targetMMR: 1500,
    },
  });

  const watchedValues = form.watch();
  
  // Load heroes on initial render and when they change
  useEffect(() => {
    const loadHeroes = async () => {
      setLoading(true);
      try {
        const latestHeroes = await getHeroes();
        setHeroes(latestHeroes);
        
        // If the selected hero was deleted, reset selection
        if (selectedHero && !latestHeroes.some(h => h.id === selectedHero.id)) {
          setSelectedHero(null);
          form.setValue("hero", "");
        }
      } catch (error) {
        console.error("Error loading heroes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadHeroes();
    
    // Listen for hero list changes from admin panel
    const handleHeroListChange = async () => {
      await loadHeroes();
    };
    
    const handleBasePriceChange = async () => {
      // Recalculate price when base price changes
      if (selectedHero) {
        try {
          const currentMMR = watchedValues.currentMMR ?? 0;
          const targetMMR = watchedValues.targetMMR ?? 0;
          const newPrice = await calculateMMRBoostPrice(
            currentMMR,
            targetMMR,
            selectedHero
          );
          setPrice(newPrice);
        } catch (error) {
          console.error("Error calculating price:", error);
        }
      }
    };
    
    window.addEventListener('adminHeroesChange', handleHeroListChange);
    window.addEventListener('adminBasePriceChange', handleBasePriceChange);
    
    return () => {
      window.removeEventListener('adminHeroesChange', handleHeroListChange);
      window.removeEventListener('adminBasePriceChange', handleBasePriceChange);
    };
  }, [selectedHero, form.setValue, watchedValues.currentMMR, watchedValues.targetMMR]);
  
  // Update pricing and hero selection when form values change
  useEffect(() => {
    if (watchedValues.hero) {
      const hero = heroes.find(h => h.id === watchedValues.hero) || null;
      setSelectedHero(hero);
    } else {
      setSelectedHero(null);
    }
    
    // Ensure target MMR is always >= current MMR
    const currentMMR = watchedValues.currentMMR ?? 0;
    const targetMMR = watchedValues.targetMMR ?? 0;
    
    if (currentMMR > targetMMR) {
      form.setValue("targetMMR", currentMMR);
    }
    
    // Calculate price
    const updatePrice = async () => {
      if (selectedHero) {
        try {
          const newPrice = await calculateMMRBoostPrice(
            currentMMR,
            targetMMR,
            selectedHero
          );
          setPrice(newPrice);
        } catch (error) {
          console.error("Error calculating price:", error);
          setPrice(0);
        }
      } else {
        setPrice(0);
      }
    };
    
    updatePrice();
  }, [watchedValues, heroes, selectedHero, form.setValue]);

  return {
    form,
    watchedValues,
    heroes,
    selectedHero,
    price,
    searchOpen,
    setSearchOpen,
    loading
  };
};
