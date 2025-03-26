
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface BasePriceSettingsProps {
  basePrice: number;
  loading: boolean;
  onBasePriceChange: (value: string) => void;
  onSave: () => void;
}

const BasePriceSettings: React.FC<BasePriceSettingsProps> = ({
  basePrice,
  loading,
  onBasePriceChange,
  onSave,
}) => {
  return (
    <div className="glass-panel p-4 md:p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Base Price Settings</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-300 mb-1">
            Global Base Price Per Tier ($)
          </label>
          <input
            id="basePrice"
            type="number"
            min="1"
            step="0.5"
            value={basePrice}
            onChange={(e) => onBasePriceChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
          />
        </div>
        <div className="w-28">
          <Button 
            onClick={onSave}
            disabled={loading}
            className="w-full mt-7 bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple"
          >
            {loading ? "Saving..." : <><Save className="mr-2 h-4 w-4" />Save All</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasePriceSettings;
