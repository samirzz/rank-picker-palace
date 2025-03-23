
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getHeroBasePrice, saveHeroBasePrice } from "@/services/hero.service";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

const HeroEditor: React.FC = () => {
  const [basePrice, setBasePrice] = useState<number>(0.1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const price = await getHeroBasePrice();
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

    fetchData();
  }, [toast]);

  const handleBasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBasePrice(value);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    
    try {
      // Save base price
      await saveHeroBasePrice(basePrice);
      
      toast({
        title: "Changes saved",
        description: "Hero settings have been updated successfully.",
      });
      
      // Dispatch events to notify other components
      window.dispatchEvent(new Event('adminHeroesChange'));
      window.dispatchEvent(new Event('adminBasePriceChange'));
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

  return (
    <Card className="glass-panel border-mlbb-purple/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white">Base Price Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <FormLabel htmlFor="basePrice" className="text-white">Base Price per MMR Point ($)</FormLabel>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0.01"
                value={basePrice}
                onChange={handleBasePriceChange}
                className="bg-black/30 border-mlbb-purple/30 text-white"
              />
            </div>
            <Button 
              onClick={handleSaveChanges} 
              className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:from-mlbb-darkpurple hover:to-mlbb-purple"
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            This is the base price per MMR point that will be multiplied by the hero's price modifier.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroEditor;
