
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import PriceEditor from "./PriceEditor";
import CombinationPriceEditor from "./CombinationPriceEditor";
import { ranks as initialRanks, getAdminRanks } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const [ranks, setRanks] = useState(initialRanks);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load ranks from localStorage if available
    setRanks(getAdminRanks());
  }, []);

  const handleSaveRanks = (updatedRanks: any[]) => {
    setRanks(updatedRanks);
    // Note: The actual localStorage save happens in the PriceEditor component
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const handleCombinationsSave = () => {
    // This function will be called when combinations are saved
    toast({
      title: "Combinations updated",
      description: "Custom rank combinations have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-mlbb-purple/20">
      <header className="bg-black/60 border-b border-mlbb-purple/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-mlbb-purple">Admin Dashboard</h1>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-300 hover:text-white hover:bg-red-500/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Rank Price Management</h2>
          <p className="text-gray-400 text-sm">Configure pricing for rank boosting services.</p>
        </div>

        <Tabs defaultValue="tier-pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tier-pricing">Tier Pricing</TabsTrigger>
            <TabsTrigger value="custom-combinations">Custom Combinations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tier-pricing">
            <PriceEditor ranks={ranks} onSave={handleSaveRanks} />
            
            <div className="mt-8 glass-panel p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tier Pricing Information</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <span className="font-medium text-mlbb-lightpurple">Base Price Per Tier:</span> This is the base amount charged per tier difference.
                </p>
                <p>
                  <span className="font-medium text-mlbb-lightpurple">Price Modifier:</span> This multiplier adjusts the final price based on rank difficulty.
                </p>
                <p>
                  <span className="font-medium text-mlbb-lightpurple">Formula:</span> Final Price = Base Price × Tier Difference × Target Rank Modifier
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom-combinations">
            <CombinationPriceEditor onSave={handleCombinationsSave} />
            
            <div className="mt-8 glass-panel p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Custom Combinations Information</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <span className="font-medium text-mlbb-lightpurple">Custom Combinations:</span> Set exact prices for specific rank-to-rank combinations.
                </p>
                <p>
                  <span className="font-medium text-mlbb-lightpurple">Priority:</span> Custom combinations take precedence over the formula-based pricing.
                </p>
                <p>
                  <span className="font-medium text-mlbb-lightpurple">Subdivisions:</span> You can set prices for rank subdivisions or leave them as "Any" to apply to all subdivisions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center text-green-400 text-sm">
          Changes you make here will be immediately visible to clients on the main page.
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
