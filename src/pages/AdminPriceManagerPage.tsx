
import React, { useState, useEffect } from "react";
import HeroEditor from "@/components/admin/HeroEditor";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminNavigation from "@/components/admin/AdminNavigation";
import DiscordLinkEditor from "@/components/admin/DiscordLinkEditor";
import PriceEditor from "@/components/admin/PriceEditor";
import CombinationPriceEditor from "@/components/admin/CombinationPriceEditor";
import { getAdminRanks } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";

const AdminPriceManagerPage: React.FC = () => {
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        setLoading(true);
        const loadedRanks = await getAdminRanks();
        if (loadedRanks && loadedRanks.length > 0) {
          console.log("Loaded ranks:", loadedRanks);
          setRanks(loadedRanks);
        } else {
          console.warn("No ranks loaded from database");
          toast({
            title: "Warning",
            description: "No rank data found. Using default values.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error loading ranks:", error);
        toast({
          title: "Error",
          description: "Failed to load rank data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRanks();
  }, [toast]);

  const handleSaveRanks = (updatedRanks: any[]) => {
    // This function will be called when PriceEditor saves its changes
    if (updatedRanks && updatedRanks.length > 0) {
      setRanks(updatedRanks);
    }
  };

  const handleSaveCombinations = () => {
    // This function will be called when CombinationPriceEditor saves its changes
    console.log("Combinations saved");
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-6">Pricing & Community Management</h1>
          <AdminNavigation />
          <div className="flex justify-center items-center h-64">
            <div className="text-white">Loading pricing data...</div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  // Only render the PriceEditor if we have ranks
  const renderPriceEditor = () => {
    if (ranks && ranks.length > 0) {
      return <PriceEditor ranks={ranks} onSave={handleSaveRanks} />;
    }
    return (
      <div className="glass-panel p-4 md:p-6">
        <p className="text-white text-center">No rank data available. Please refresh the page.</p>
      </div>
    );
  };

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-6">Pricing & Community Management</h1>
        <AdminNavigation />
        <div className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Rank Pricing Configuration</h2>
            {renderPriceEditor()}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Custom Rank Combinations</h2>
            <CombinationPriceEditor onSave={handleSaveCombinations} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Hero Settings</h2>
              <HeroEditor />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Discord Community</h2>
              <DiscordLinkEditor />
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPriceManagerPage;
