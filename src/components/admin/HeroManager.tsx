import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Hero, getAdminHeroes, saveHeroes, getHeroPlaceholderImage } from "@/data/heroes";
import { Trash2, Plus, Star, Save, Image } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface HeroManagerProps {
  onSave?: () => void;
}

const HeroManager: React.FC<HeroManagerProps> = ({ onSave }) => {
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
        setHeroes(loadedHeroes);
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

  if (loading) {
    return (
      <Card className="glass-panel border-mlbb-purple/20">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32 text-white">
            Loading hero data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-mlbb-purple/20">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Hero Management</h2>
          <Button 
            onClick={handleAddHero} 
            variant="outline" 
            className="bg-black/30 border-mlbb-purple/30 text-white hover:bg-black/50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hero
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Image URL</TableHead>
              <TableHead className="text-white">Difficulty</TableHead>
              <TableHead className="text-white">Price Modifier</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heroes.map((hero) => (
              <TableRow key={hero.id}>
                <TableCell>
                  <Input
                    type="text"
                    value={hero.name}
                    onChange={(e) => handleNameChange(hero.id, e.target.value)}
                    className="bg-black/30 border-mlbb-purple/30 text-white"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={hero.image}
                    onChange={(e) => handleImageChange(hero.id, e.target.value)}
                    className="bg-black/30 border-mlbb-purple/30 text-white"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Slider
                      defaultValue={[hero.difficulty]}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleDifficultyChange(hero.id, value[0])}
                      className="w-24"
                    />
                    <span className="text-gray-400">{hero.difficulty}</span>
                    <Star className="text-mlbb-gold h-4 w-4" />
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={hero.priceModifier}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        handlePriceModifierChange(hero.id, value);
                      }
                    }}
                    className="bg-black/30 border-mlbb-purple/30 text-white"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeleteHero(hero.id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button 
          onClick={handleSaveChanges} 
          className="mt-6 bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:from-mlbb-darkpurple hover:to-mlbb-purple"
          disabled={saving}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroManager;
