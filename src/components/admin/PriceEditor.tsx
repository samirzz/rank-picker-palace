
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRankPlaceholderImage, getBasePrice } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

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

  const handleBasePriceChange = (rankId: string, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue < 0) return;

    setEditedRanks(
      editedRanks.map(rank => 
        rank.id === rankId ? { ...rank, basePrice: newValue } : rank
      )
    );
  };

  const handleCostPerStarChange = (rankId: string, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue) || newValue < 0) return;

    setEditedRanks(
      editedRanks.map(rank => 
        rank.id === rankId ? { ...rank, costPerStar: newValue } : rank
      )
    );
  };

  const handleGlobalBasePriceChange = (value: string) => {
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
              Global Base Price Per Tier ($)
            </label>
            <input
              id="basePrice"
              type="number"
              min="1"
              step="0.5"
              value={basePrice}
              onChange={(e) => handleGlobalBasePriceChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
            />
          </div>
          <div className="w-28">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="w-full mt-7 bg-gradient-to-r from-mlbb-purple to-mlbb-darkpurple"
            >
              {loading ? "Saving..." : <><Save className="mr-2 h-4 w-4" />Save All</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rank Price Settings</h3>
        <p className="text-sm text-gray-400 mb-4">Define base prices and costs per star for each rank</p>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-white/10">
                <th className="pb-2 text-left font-medium">#</th>
                <th className="pb-2 text-left font-medium">Rank</th>
                <th className="pb-2 text-left font-medium">Tier</th>
                <th className="pb-2 text-left font-medium">Price Modifier</th>
                <th className="pb-2 text-left font-medium">Base Price ($)</th>
                <th className="pb-2 text-left font-medium">Cost per Star ($)</th>
              </tr>
            </thead>
            <tbody>
              {editedRanks.map((rank, index) => (
                <tr key={rank.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
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
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-300">Tier {rank.tier}</span>
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={rank.priceModifier}
                      onChange={(e) => handlePriceModifierChange(rank.id, e.target.value)}
                      className="w-20 px-3 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={rank.basePrice || 0}
                      onChange={(e) => handleBasePriceChange(rank.id, e.target.value)}
                      className="w-20 px-3 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={rank.costPerStar || 0}
                      onChange={(e) => handleCostPerStarChange(rank.id, e.target.value)}
                      className="w-20 px-3 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceEditor;
