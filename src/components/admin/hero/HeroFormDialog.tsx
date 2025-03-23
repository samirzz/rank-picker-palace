
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { Hero } from "@/data/heroes";

interface HeroFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (hero: Omit<Hero, "id">) => void;
  initialHero?: Omit<Hero, "id">;
}

const HeroFormDialog: React.FC<HeroFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialHero = {
    name: "New Hero",
    image: "",
    difficulty: 1,
    priceModifier: 1
  }
}) => {
  const [heroData, setHeroData] = useState<Omit<Hero, "id">>(initialHero);

  const handleSave = () => {
    onSave(heroData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border-mlbb-purple/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Hero</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="hero-name" className="text-sm font-medium text-gray-300">Hero Name</label>
            <Input
              id="hero-name"
              value={heroData.name}
              onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
              className="bg-black/30 border-mlbb-purple/30 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="hero-image" className="text-sm font-medium text-gray-300">Hero Image URL</label>
            <Input
              id="hero-image"
              value={heroData.image}
              onChange={(e) => setHeroData({ ...heroData, image: e.target.value })}
              className="bg-black/30 border-mlbb-purple/30 text-white"
              placeholder="Enter image URL or leave empty for placeholder"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="hero-difficulty" className="text-sm font-medium text-gray-300">
              Difficulty: {heroData.difficulty}
            </label>
            <div className="flex items-center space-x-2">
              <Slider
                id="hero-difficulty"
                value={[heroData.difficulty]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setHeroData({ ...heroData, difficulty: value[0] })}
              />
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`diff-stars-${index}`}
                    className={`h-4 w-4 ${
                      index < heroData.difficulty
                        ? "text-mlbb-gold fill-mlbb-gold"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="hero-price" className="text-sm font-medium text-gray-300">
              Price Modifier: {heroData.priceModifier}x
            </label>
            <Input
              id="hero-price"
              type="number"
              value={heroData.priceModifier}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setHeroData({ ...heroData, priceModifier: value });
                }
              }}
              min={0.1}
              step={0.1}
              className="bg-black/30 border-mlbb-purple/30 text-white"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-mlbb-purple/30 text-white hover:bg-black/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:from-mlbb-darkpurple hover:to-mlbb-purple"
          >
            Add Hero
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HeroFormDialog;
