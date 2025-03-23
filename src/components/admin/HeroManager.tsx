
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Save } from "lucide-react";
import HeroListTable from "./hero/HeroListTable";
import LoadingPanel from "./hero/LoadingPanel";
import HeroFormDialog from "./hero/HeroFormDialog";
import { useHeroManager } from "@/hooks/useHeroManager";

interface HeroManagerProps {
  onSave?: () => void;
}

const HeroManager: React.FC<HeroManagerProps> = ({ onSave }) => {
  const [isAddHeroDialogOpen, setIsAddHeroDialogOpen] = useState(false);
  
  const {
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
  } = useHeroManager(onSave);

  if (loading) {
    return <LoadingPanel />;
  }

  return (
    <Card className="glass-panel border-mlbb-purple/20">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Hero Management</h2>
          <Button 
            onClick={() => {
              console.log("Add Hero button clicked");
              setIsAddHeroDialogOpen(true);
            }} 
            variant="outline" 
            className="bg-black/30 border-mlbb-purple/30 text-white hover:bg-black/50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hero
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <HeroListTable
            heroes={heroes}
            onNameChange={handleNameChange}
            onImageChange={handleImageChange}
            onDifficultyChange={handleDifficultyChange}
            onPriceModifierChange={handlePriceModifierChange}
            onDelete={handleDeleteHero}
          />
        </div>

        <div className="mt-6 flex flex-col space-y-2">
          <Button 
            onClick={handleSaveChanges} 
            className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple hover:from-mlbb-darkpurple hover:to-mlbb-purple"
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving to Database..." : "Save Changes to Database"}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Changes are not saved to the database until you click the button above.
          </p>
        </div>
        
        <HeroFormDialog
          open={isAddHeroDialogOpen}
          onOpenChange={setIsAddHeroDialogOpen}
          onSave={handleAddHero}
        />
      </CardContent>
    </Card>
  );
};

export default HeroManager;
