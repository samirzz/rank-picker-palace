
import { useState, useEffect } from "react";
import { getBasePrice, saveBasePrice, saveAdminRanks } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";

export interface UsePriceEditorProps {
  ranks: any[];
  onSave: (updatedRanks: any[]) => void;
}

export const usePriceEditor = ({ ranks, onSave }: UsePriceEditorProps) => {
  const [editedRanks, setEditedRanks] = useState<any[]>([]);
  const [basePrice, setBasePrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBasePrice = async () => {
      try {
        const price = await getBasePrice();
        setBasePrice(price);
      } catch (error) {
        console.error("Error fetching base price:", error);
        toast({
          title: "Error",
          description: "Failed to load base price. Using default value.",
          variant: "destructive",
        });
      }
    };

    fetchBasePrice();
  }, [toast]);

  useEffect(() => {
    if (ranks && ranks.length > 0) {
      console.log("Setting edited ranks from props:", ranks);
      setEditedRanks([...ranks]);
    } else {
      console.warn("Received empty ranks array in PriceEditor");
    }
  }, [ranks]);

  const handleBasePriceChange = (rankId: string, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue < 0) return;

    setEditedRanks(
      editedRanks.map(rank => 
        rank.id === rankId ? { ...rank, basePrice: newValue } : rank
      )
    );
  };

  const handleCostPerStarChange = (rankId: string, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue < 0) return;

    setEditedRanks(
      editedRanks.map(rank => 
        rank.id === rankId ? { ...rank, costPerStar: newValue } : rank
      )
    );
  };

  const handleGlobalBasePriceChange = (value: string) => {
    const newBasePrice = parseFloat(value);
    if (isNaN(newBasePrice) || newBasePrice <= 0) return;
    
    setBasePrice(newBasePrice);
  };

  const handleSave = async () => {
    if (!editedRanks || editedRanks.length === 0) {
      toast({
        title: "Error",
        description: "No ranks to save. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await saveBasePrice(basePrice);
      
      await saveAdminRanks(editedRanks);
      
      const priceChangeEvent = new CustomEvent('adminPriceChange', {
        detail: { ranks: editedRanks, basePrice }
      });
      window.dispatchEvent(priceChangeEvent);
      
      onSave(editedRanks);
      
      toast({
        title: "Changes saved",
        description: "Rank price modifications have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    editedRanks,
    basePrice,
    loading,
    handleBasePriceChange,
    handleCostPerStarChange,
    handleGlobalBasePriceChange,
    handleSave
  };
};
