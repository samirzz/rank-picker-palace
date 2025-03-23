
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Save } from "lucide-react";
import HeroListTable from "./hero/HeroListTable";
import LoadingPanel from "./hero/LoadingPanel";
import { useHeroManager } from "@/hooks/useHeroManager";

interface HeroManagerProps {
  onSave?: () => void;
}

const HeroManager: React.FC<HeroManagerProps> = ({ onSave }) => {
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
            onClick={handleAddHero} 
            variant="outline" 
            className="bg-black/30 border-mlbb-purple/30 text-white hover:bg-black/50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Hero
          </Button>
        </div>
        
        <HeroListTable
          heroes={heroes}
          onNameChange={handleNameChange}
          onImageChange={handleImageChange}
          onDifficultyChange={handleDifficultyChange}
          onPriceModifierChange={handlePriceModifierChange}
          onDelete={handleDeleteHero}
        />

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
