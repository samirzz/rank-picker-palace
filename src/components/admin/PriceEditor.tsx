
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRankPlaceholderImage, getBasePrice } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";

interface PriceEditorProps {
  ranks: any[];
  onSave: (updatedRanks: any[]) => void;
}

const PriceEditor: React.FC<PriceEditorProps> = ({ ranks, onSave }) => {
  const [editedRanks, setEditedRanks] = useState([...ranks]);
  const [basePrice, setBasePrice] = useState(getBasePrice());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePriceModifierChange = (rankId: string, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue <= 0) return;

    setEditedRanks(
      editedRanks.map(rank => 
        rank.id === rankId ? { ...rank, priceModifier: newValue } : rank
      )
    );
  };

  const handleBasePriceChange = (value: string) => {
    const newBasePrice = parseFloat(value);
    if (isNaN(newBasePrice) || newBasePrice <= 0) return;
    
    setBasePrice(newBasePrice);
  };

  const handleSave = () => {
    setLoading(true);
    
    // Save base price to localStorage
    localStorage.setItem("basePricePerTier", basePrice.toString());
    
    // Save ranks to localStorage
    localStorage.setItem("adminRanks", JSON.stringify(editedRanks));
    
    // Trigger a custom event to notify other components of the price change
    const priceChangeEvent = new CustomEvent('adminPriceChange', {
      detail: { ranks: editedRanks, basePrice }
    });
    window.dispatchEvent(priceChangeEvent);
    
    // Call the onSave prop
    onSave(editedRanks);
    
    toast({
      title: "Changes saved",
      description: "Rank price modifications have been saved successfully.",
    });
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Base Price Settings</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-300 mb-1">
              Base Price Per Tier ($)
            </label>
            <input
              id="basePrice"
              type="number"
              min="1"
              step="0.5"
              value={basePrice}
              onChange={(e) => handleBasePriceChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
            />
          </div>
          <div className="w-28">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="w-full mt-7 bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple"
            >
              {loading ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rank Price Modifiers</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-12 text-xs text-gray-400 pb-2 border-b border-white/10">
            <div className="col-span-1">#</div>
            <div className="col-span-5 md:col-span-4">Rank</div>
            <div className="col-span-3 md:col-span-2">Tier</div>
            <div className="col-span-3 md:col-span-5">Price Modifier</div>
          </div>
          
          {editedRanks.map((rank, index) => (
            <div key={rank.id} className="grid grid-cols-12 items-center py-2 border-b border-white/5 last:border-0">
              <div className="col-span-1 text-sm text-gray-500">{index + 1}</div>
              <div className="col-span-5 md:col-span-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 overflow-hidden flex items-center justify-center">
                  <img
                    src={rank.image}
                    alt={rank.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getRankPlaceholderImage();
                    }}
                  />
                </div>
                <span className="text-sm text-white">{rank.name}</span>
              </div>
              <div className="col-span-3 md:col-span-2">
                <span className="text-sm text-gray-300">Tier {rank.tier}</span>
              </div>
              <div className="col-span-3 md:col-span-5">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={rank.priceModifier}
                  onChange={(e) => handlePriceModifierChange(rank.id, e.target.value)}
                  className="w-full md:w-1/2 px-3 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceEditor;
