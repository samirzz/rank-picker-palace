
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import PriceEditor from "./PriceEditor";
import { ranks as initialRanks } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const [ranks, setRanks] = useState(initialRanks);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load ranks from localStorage if available
    const savedRanks = localStorage.getItem("adminRanks");
    if (savedRanks) {
      setRanks(JSON.parse(savedRanks));
    }
  }, []);

  const handleSaveRanks = (updatedRanks: any[]) => {
    setRanks(updatedRanks);
    localStorage.setItem("adminRanks", JSON.stringify(updatedRanks));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
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
          <p className="text-gray-400 text-sm">Adjust the price modifiers for each rank and set the base price per tier.</p>
        </div>

        <PriceEditor ranks={ranks} onSave={handleSaveRanks} />

        <div className="mt-8 glass-panel p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Admin Information</h3>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
