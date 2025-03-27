
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Rank, 
  RankCombination,
  getAdminRanks, 
  getRankCombinations,
  saveRankCombinations
} from "@/data/ranks";

export const useCombinationEditor = (onSave: () => void) => {
  const [combinations, setCombinations] = useState<RankCombination[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load saved combinations
        const savedCombinations = await getRankCombinations();
        setCombinations(savedCombinations);
        
        // Load ranks
        const loadedRanks = await getAdminRanks();
        setRanks(loadedRanks);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load rank data. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchData();
  }, [toast]);

  const handleAddCombination = () => {
    if (ranks.length < 2) return;
    
    const newCombination: RankCombination = {
      fromRankId: ranks[0].id,
      toRankId: ranks[ranks.length > 1 ? 1 : 0].id,
      price: 0
    };
    
    setCombinations([...combinations, newCombination]);
  };

  const handleRemoveCombination = (index: number) => {
    const updatedCombinations = [...combinations];
    updatedCombinations.splice(index, 1);
    setCombinations(updatedCombinations);
  };

  const handleCombinationChange = (index: number, field: keyof RankCombination, value: string | number) => {
    const updatedCombinations = [...combinations];
    
    if (field === 'price') {
      updatedCombinations[index][field] = Number(value);
    } else if (field === 'fromRankId' || field === 'toRankId') {
      updatedCombinations[index][field] = value as string;
    } else if (field === 'fromSubdivision' || field === 'toSubdivision') {
      updatedCombinations[index][field] = Number(value);
    }
    
    setCombinations(updatedCombinations);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Remove any invalid combinations
      const validCombinations = combinations.filter(c => 
        c.fromRankId && c.toRankId && c.price !== undefined && c.price >= 0
      );
      
      // Save to database
      await saveRankCombinations(validCombinations);
      
      // Trigger a custom event to notify other components
      const combinationsChangeEvent = new CustomEvent('adminCombinationsChange', {
        detail: { combinations: validCombinations }
      });
      window.dispatchEvent(combinationsChangeEvent);
      
      toast({
        title: "Combinations saved",
        description: "Custom rank combinations have been saved successfully.",
      });
      
      // Call the onSave callback
      onSave();
    } catch (error) {
      console.error("Error saving combinations:", error);
      toast({
        title: "Error",
        description: "Failed to save combinations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    combinations,
    ranks,
    loading,
    handleAddCombination,
    handleRemoveCombination,
    handleCombinationChange,
    handleSave
  };
};
