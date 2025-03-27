
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCombinationEditor } from "./useCombinationEditor";
import CombinationsTable from "./CombinationsTable";
import { CombinationPriceEditorProps } from "./types";

const CombinationPriceEditor: React.FC<CombinationPriceEditorProps> = ({ onSave }) => {
  const {
    combinations,
    ranks,
    loading,
    handleAddCombination,
    handleRemoveCombination,
    handleCombinationChange,
    handleSave
  } = useCombinationEditor(onSave);

  return (
    <div className="glass-panel p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Custom Rank Combinations</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddCombination}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Combination
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple"
            size="sm"
          >
            {loading ? "Saving..." : "Save Combinations"}
          </Button>
        </div>
      </div>
      
      <CombinationsTable
        combinations={combinations}
        ranks={ranks}
        onCombinationChange={handleCombinationChange}
        onRemoveCombination={handleRemoveCombination}
      />
      
      <div className="mt-4 p-3 bg-black/40 border border-mlbb-purple/20 rounded-md">
        <p className="text-xs text-gray-300">
          <span className="text-mlbb-lightpurple font-medium">Note:</span> Custom combinations override the default pricing formula. If a combination isn't found, the system will fall back to the default formula.
        </p>
      </div>
    </div>
  );
};

export default CombinationPriceEditor;
