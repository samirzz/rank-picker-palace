
import React from "react";
import { usePriceEditor } from "@/hooks/usePriceEditor";
import BasePriceSettings from "./price-editor/BasePriceSettings";
import RankPriceTable from "./price-editor/RankPriceTable";

interface PriceEditorProps {
  ranks: any[];
  onSave: (updatedRanks: any[]) => void;
}

const PriceEditor: React.FC<PriceEditorProps> = ({ ranks, onSave }) => {
  const {
    editedRanks,
    basePrice,
    loading,
    handleBasePriceChange,
    handleCostPerStarChange,
    handleGlobalBasePriceChange,
    handleSave
  } = usePriceEditor({ ranks, onSave });

  if (!editedRanks || editedRanks.length === 0) {
    return (
      <div className="glass-panel p-4 md:p-6">
        <p className="text-white text-center">Loading rank data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BasePriceSettings
        basePrice={basePrice}
        loading={loading}
        onBasePriceChange={handleGlobalBasePriceChange}
        onSave={handleSave}
      />

      <div className="glass-panel p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rank Price Settings</h3>
        <p className="text-sm text-gray-400 mb-4">Define base prices and costs per star for each rank</p>
        
        <RankPriceTable
          editedRanks={editedRanks}
          onBasePriceChange={handleBasePriceChange}
          onCostPerStarChange={handleCostPerStarChange}
        />
      </div>
    </div>
  );
};

export default PriceEditor;
