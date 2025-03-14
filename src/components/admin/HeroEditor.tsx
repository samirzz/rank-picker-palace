
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getHeroBasePrice, getAdminHeroes, saveHeroes, saveHeroBasePrice } from "@/data/heroes";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

const HeroEditor: React.FC = () => {
  const [basePrice, setBasePrice] = useState(getHeroBasePrice());
  const [heroes, setHeroes] = useState(getAdminHeroes());
  const { toast } = useToast();

  const handleBasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBasePrice(value);
    }
  };

  const handleSaveChanges = () => {
    // Save base price
    saveHeroBasePrice(basePrice);
    
    // Save heroes data
    saveHeroes(heroes);
    
    toast({
      title: "Changes saved",
      description: "Hero settings have been updated successfully.",
    });
    
    // Dispatch events to notify other components
    window.dispatchEvent(new Event('adminHeroesChange'));
    window.dispatchEvent(new Event('adminBasePriceChange'));
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
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
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
