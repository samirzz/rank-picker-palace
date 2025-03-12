
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  getRankPlaceholderImage, 
  getAdminRanks, 
  Rank, 
  RankCombination,
  getRankCombinations,
  saveRankCombinations
} from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface CombinationPriceEditorProps {
  onSave: () => void;
}

const CombinationPriceEditor: React.FC<CombinationPriceEditorProps> = ({ onSave }) => {
  const [combinations, setCombinations] = useState<RankCombination[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved combinations
    const savedCombinations = getRankCombinations();
    setCombinations(savedCombinations);
    
    // Load ranks
    const loadedRanks = getAdminRanks();
    setRanks(loadedRanks);
  }, []);

  const handleAddCombination = () => {
    if (ranks.length < 2) return;
    
    const newCombination: RankCombination = {
      fromRankId: ranks[0].id,
      toRankId: ranks[ranks.length > 1 ? 1 : 0].id,
      price: 0
    };
    
    setCombinations([...combinations, newCombination]);
  };

  const handleRemoveCombination = (index: number) => {
    const updatedCombinations = [...combinations];
    updatedCombinations.splice(index, 1);
    setCombinations(updatedCombinations);
  };

  const handleCombinationChange = (index: number, field: keyof RankCombination, value: string | number) => {
    const updatedCombinations = [...combinations];
    
    if (field === 'price') {
      updatedCombinations[index][field] = Number(value);
    } else if (field === 'fromRankId' || field === 'toRankId') {
      updatedCombinations[index][field] = value as string;
    } else if (field === 'fromSubdivision' || field === 'toSubdivision') {
      updatedCombinations[index][field] = Number(value);
    }
    
    setCombinations(updatedCombinations);
  };

  const handleSave = () => {
    setLoading(true);
    
    // Remove any invalid combinations
    const validCombinations = combinations.filter(c => 
      c.fromRankId && c.toRankId && c.price !== undefined && c.price >= 0
    );
    
    // Save to localStorage
    saveRankCombinations(validCombinations);
    
    // Trigger a custom event to notify other components
    const combinationsChangeEvent = new CustomEvent('adminCombinationsChange', {
      detail: { combinations: validCombinations }
    });
    window.dispatchEvent(combinationsChangeEvent);
    
    toast({
      title: "Combinations saved",
      description: "Custom rank combinations have been saved successfully.",
    });
    
    // Call the onSave callback
    onSave();
    
    setLoading(false);
  };

  // Find a rank by its ID
  const findRank = (rankId: string): Rank | undefined => {
    return ranks.find(rank => rank.id === rankId);
  };

  // Get subdivision options for a specific rank
  const getSubdivisionOptions = (rankId: string): { value: number, label: string }[] => {
    const rank = findRank(rankId);
    if (!rank || !rank.subdivisions) return [];
    
    return rank.subdivisions.map((sub, index) => ({
      value: index,
      label: sub.name
    }));
  };

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
      
      {combinations.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No custom combinations added yet.</p>
          <p className="text-sm mt-2">Click "Add Combination" to create custom rank-to-rank prices.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 text-xs text-gray-400 pb-2 border-b border-white/10 px-2">
            <div className="col-span-4 md:col-span-5">From Rank</div>
            <div className="col-span-4 md:col-span-5">To Rank</div>
            <div className="col-span-3 md:col-span-2">Price ($)</div>
            <div className="col-span-1"></div>
          </div>
          
          {combinations.map((combo, index) => {
            const fromRank = findRank(combo.fromRankId);
            const toRank = findRank(combo.toRankId);
            const fromSubOptions = getSubdivisionOptions(combo.fromRankId);
            const toSubOptions = getSubdivisionOptions(combo.toRankId);
            
            return (
              <div key={index} className="grid grid-cols-12 items-center gap-2 border-b border-white/5 pb-3">
                <div className="col-span-4 md:col-span-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <select
                      value={combo.fromRankId}
                      onChange={(e) => handleCombinationChange(index, 'fromRankId', e.target.value)}
                      className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
                    >
                      {ranks.map(rank => (
                        <option key={rank.id} value={rank.id}>
                          {rank.name}
                        </option>
                      ))}
                    </select>
                    
                    {fromSubOptions.length > 0 && (
                      <select
                        value={combo.fromSubdivision !== undefined ? combo.fromSubdivision : ''}
                        onChange={(e) => handleCombinationChange(
                          index, 
                          'fromSubdivision', 
                          e.target.value === '' ? undefined : Number(e.target.value)
                        )}
                        className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
                      >
                        <option value="">Any subdivision</option>
                        {fromSubOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="col-span-4 md:col-span-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <select
                      value={combo.toRankId}
                      onChange={(e) => handleCombinationChange(index, 'toRankId', e.target.value)}
                      className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
                    >
                      {ranks.map(rank => (
                        <option key={rank.id} value={rank.id}>
                          {rank.name}
                        </option>
                      ))}
                    </select>
                    
                    {toSubOptions.length > 0 && (
                      <select
                        value={combo.toSubdivision !== undefined ? combo.toSubdivision : ''}
                        onChange={(e) => handleCombinationChange(
                          index, 
                          'toSubdivision', 
                          e.target.value === '' ? undefined : Number(e.target.value)
                        )}
                        className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
                      >
                        <option value="">Any subdivision</option>
                        {toSubOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="col-span-3 md:col-span-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={combo.price}
                    onChange={(e) => handleCombinationChange(index, 'price', e.target.value)}
                    className="w-full px-2 py-1 bg-black/60 border border-mlbb-purple/30 rounded-md text-white text-xs md:text-sm"
                  />
                </div>
                
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCombination(index)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-black/40 border border-mlbb-purple/20 rounded-md">
        <p className="text-xs text-gray-300">
          <span className="text-mlbb-lightpurple font-medium">Note:</span> Custom combinations override the default pricing formula. If a combination isn't found, the system will fall back to the default formula.
        </p>
      </div>
    </div>
  );
};

export default CombinationPriceEditor;
