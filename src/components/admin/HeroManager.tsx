
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trash, 
  Edit, 
  Plus, 
  Star, 
  ImagePlus,
  Save,
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import { Hero, getAdminHeroes, saveHeroes, getHeroPlaceholderImage } from "@/data/heroes";
import HeroCard from "@/components/HeroCard";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroManagerProps {
  onSave: () => void;
}

const HeroManager: React.FC<HeroManagerProps> = ({ onSave }) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [deleteHeroId, setDeleteHeroId] = useState<string | null>(null);
  const [heroBasePrice, setHeroBasePrice] = useState<number>(0.1);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Form state
  const [heroName, setHeroName] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroDifficulty, setHeroDifficulty] = useState(1);
  const [heroPriceModifier, setHeroPriceModifier] = useState(1.0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedHeroes = getAdminHeroes();
    setHeroes(savedHeroes);
    
    // Load base price from localStorage
    const storedBasePrice = localStorage.getItem("heroBasePricePerMMR");
    if (storedBasePrice) {
      setHeroBasePrice(parseFloat(storedBasePrice));
    }
  }, []);

  const handleEditHero = (hero: Hero) => {
    setEditingHero(hero);
    setIsAddMode(false);
    setHeroName(hero.name);
    setHeroImage(hero.image);
    setHeroDifficulty(hero.difficulty);
    setHeroPriceModifier(hero.priceModifier);
    setIsDialogOpen(true);
  };

  const handleAddHero = () => {
    setEditingHero(null);
    setIsAddMode(true);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setHeroName("");
    setHeroImage("");
    setHeroDifficulty(1);
    setHeroPriceModifier(1.0);
  };

  const handleCloseDialog = () => {
    setEditingHero(null);
    setIsAddMode(false);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteHero = (id: string) => {
    setDeleteHeroId(id);
  };

  const confirmDeleteHero = () => {
    if (!deleteHeroId) return;
    
    const updatedHeroes = heroes.filter(hero => hero.id !== deleteHeroId);
    setHeroes(updatedHeroes);
    saveHeroes(updatedHeroes);
    setDeleteHeroId(null);
    
    toast({
      title: "Hero deleted",
      description: "The hero has been removed from the list.",
    });
  };

  const handleSaveHero = () => {
    if (!heroName.trim()) {
      toast({
        title: "Error",
        description: "Hero name is required",
        variant: "destructive",
      });
      return;
    }

    // Ensure priceModifier is a valid number
    const priceModifier = parseFloat(heroPriceModifier.toString());
    if (isNaN(priceModifier) || priceModifier <= 0) {
      toast({
        title: "Error",
        description: "Price modifier must be a positive number",
        variant: "destructive",
      });
      return;
    }

    let updatedHeroes: Hero[];

    if (isAddMode) {
      // Add new hero
      const newHero: Hero = {
        id: heroName.toLowerCase().replace(/\s+/g, '-'),
        name: heroName,
        image: heroImage || getHeroPlaceholderImage(),
        difficulty: heroDifficulty,
        priceModifier: priceModifier
      };
      
      // Check if ID already exists
      if (heroes.some(hero => hero.id === newHero.id)) {
        toast({
          title: "Error",
          description: "A hero with a similar name already exists",
          variant: "destructive",
        });
        return;
      }
      
      updatedHeroes = [...heroes, newHero];
    } else if (editingHero) {
      // Update existing hero
      updatedHeroes = heroes.map(hero => {
        if (hero.id === editingHero.id) {
          return {
            ...hero,
            name: heroName,
            image: heroImage || hero.image,
            difficulty: heroDifficulty,
            priceModifier: priceModifier
          };
        }
        return hero;
      });
    } else {
      return;
    }

    setHeroes(updatedHeroes);
    saveHeroes(updatedHeroes);
    handleCloseDialog();
    
    toast({
      title: isAddMode ? "Hero added" : "Hero updated",
      description: isAddMode 
        ? "New hero has been added to the list" 
        : "Hero details have been updated",
    });
    
    onSave();
  };

  const handleBaseHeroPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setHeroBasePrice(value);
    }
  };

  const saveBaseHeroPrice = () => {
    localStorage.setItem("heroBasePricePerMMR", heroBasePrice.toString());
    
    toast({
      title: "Base price updated",
      description: "The base price per MMR point has been updated.",
    });
    
    // Dispatch event to notify other components that the prices have changed
    window.dispatchEvent(new Event('adminBasePriceChange'));
    
    onSave();
  };

  const renderHeroForm = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heroName" className="text-white">Hero Name</Label>
          <Input
            id="heroName"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder="Enter hero name"
            className="bg-black/30 border-mlbb-purple/30 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heroImage" className="text-white">Image URL</Label>
          <Input
            id="heroImage"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="Enter image URL or leave blank for placeholder"
            className="bg-black/30 border-mlbb-purple/30 text-white"
          />
          <p className="text-xs text-gray-400">Leave blank to use a placeholder image</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-white">Difficulty (1-5)</Label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setHeroDifficulty(level)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    level <= heroDifficulty
                      ? "text-mlbb-gold fill-mlbb-gold"
                      : "text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priceModifier" className="text-white">Price Modifier</Label>
          <Input
            id="priceModifier"
            type="number"
            step="0.1"
            min="1"
            max="3"
            value={heroPriceModifier}
            onChange={(e) => setHeroPriceModifier(parseFloat(e.target.value))}
            className="bg-black/30 border-mlbb-purple/30 text-white"
          />
          <p className="text-xs text-gray-400">Higher values make MMR boosting more expensive</p>
        </div>
        
        {heroName && (
          <div className="mt-4 p-3 bg-black/50 rounded-lg border border-mlbb-purple/10">
            <p className="text-sm text-white mb-2">Preview:</p>
            <HeroCard 
              hero={{
                id: "preview",
                name: heroName,
                image: heroImage || getHeroPlaceholderImage(),
                difficulty: heroDifficulty,
                priceModifier: heroPriceModifier,
              }} 
            />
          </div>
        )}
      </div>
      
      <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={handleCloseDialog}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={handleSaveHero} 
          className="w-full sm:w-auto bg-mlbb-purple text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isAddMode ? "Add Hero" : "Save Changes"}
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Hero Management</h3>
          <p className="text-sm text-gray-400 mt-1">
            Manage heroes for MMR boosting service
          </p>
        </div>
        
        <Button onClick={handleAddHero} className="w-full sm:w-auto bg-mlbb-purple text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Hero
        </Button>
      </div>
      
      <div className="glass-panel p-4 md:p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Base MMR Price Settings</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="space-y-2 w-full sm:flex-1">
              <Label htmlFor="basePrice" className="text-white">Base Price per MMR Point ($)</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0.01"
                value={heroBasePrice}
                onChange={handleBaseHeroPriceChange}
                className="bg-black/30 border-mlbb-purple/30 text-white"
              />
            </div>
            <Button 
              onClick={saveBaseHeroPrice} 
              className="w-full sm:w-auto bg-mlbb-purple text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Base Price
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This is the base price per MMR point that will be multiplied by the hero's price modifier.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold text-white mb-3">Hero List</h4>
          {heroes.length > 0 ? (
            <div className="rounded-md border border-mlbb-purple/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-mlbb-purple/20">
                    <TableHead className="text-mlbb-gold">Hero</TableHead>
                    <TableHead className="text-mlbb-gold">Difficulty</TableHead>
                    <TableHead className="text-mlbb-gold">Price Modifier</TableHead>
                    <TableHead className="text-mlbb-gold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heroes.map((hero) => (
                    <TableRow key={hero.id} className="border-b border-mlbb-purple/10">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 overflow-hidden rounded-md">
                            <img
                              src={hero.image || getHeroPlaceholderImage()}
                              alt={hero.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = getHeroPlaceholderImage();
                              }}
                            />
                          </div>
                          <span>{hero.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < hero.difficulty
                                  ? "text-mlbb-gold fill-mlbb-gold"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-mlbb-gold">
                        {hero.priceModifier}x
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-mlbb-purple/30 bg-transparent hover:bg-mlbb-purple/20"
                            onClick={() => handleEditHero(hero)}
                          >
                            <Edit className="h-4 w-4 text-mlbb-gold" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-red-500/30 bg-transparent hover:bg-red-500/20"
                            onClick={() => handleDeleteHero(hero.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-mlbb-purple/30 rounded-lg">
              <ImagePlus className="h-10 w-10 text-mlbb-purple/40 mx-auto mb-3" />
              <p className="text-gray-400">No heroes added yet</p>
              <p className="text-xs text-gray-500 mt-1">Click the "Add Hero" button to get started</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Hero Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/95 border-mlbb-purple/30 text-white sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddMode ? "Add New Hero" : "Edit Hero"}</DialogTitle>
          </DialogHeader>
          {renderHeroForm()}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteHeroId !== null} onOpenChange={() => setDeleteHeroId(null)}>
        <AlertDialogContent className="bg-black/95 border-mlbb-purple/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this hero? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto border-mlbb-purple/30 bg-transparent text-white hover:bg-mlbb-purple/20">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteHero}
              className="w-full sm:w-auto bg-red-500/80 hover:bg-red-500 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeroManager;
