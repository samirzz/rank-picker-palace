
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Package, LayoutDashboard, Users, BarChart } from "lucide-react";
import PriceEditor from "./PriceEditor";
import CombinationPriceEditor from "./CombinationPriceEditor";
import { ranks as initialRanks, getAdminRanks } from "@/data/ranks";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const [ranks, setRanks] = useState(initialRanks);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Games data
  const games = [
    {
      id: "mlbb",
      name: "Mobile Legends",
      image: "https://images.unsplash.com/photo-1627396184389-b4414ae2062a?q=80&w=1000&auto=format&fit=crop",
      pendingOrders: 5,
    },
    {
      id: "pubg",
      name: "PUBG Mobile",
      image: "https://images.unsplash.com/photo-1614294149528-cc5eff90511a?q=80&w=1000&auto=format&fit=crop",
      pendingOrders: 12,
    },
    {
      id: "coc",
      name: "Clash of Clans",
      image: "https://images.unsplash.com/photo-1640245539773-4c1a4a3a5be7?q=80&w=1000&auto=format&fit=crop",
      pendingOrders: 3,
    },
    {
      id: "codm",
      name: "Call of Duty Mobile",
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=1000&auto=format&fit=crop",
      pendingOrders: 8,
    },
  ];

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
        <Tabs defaultValue="games" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="games">Game Management</TabsTrigger>
            <TabsTrigger value="tier-pricing">Pricing Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Game Dashboards</h2>
              <p className="text-gray-400 text-sm">Select a game to manage orders and settings.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <Link 
                  key={game.id}
                  to={`/admin/games/${game.id}`}
                  className="bg-black/20 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-mlbb-purple hover:shadow-lg hover:shadow-mlbb-purple/20"
                >
                  <div className="aspect-video w-full relative">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    {game.pendingOrders > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {game.pendingOrders}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg mb-1">{game.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {game.pendingOrders} pending orders
                      </span>
                      <div className="flex items-center text-mlbb-purple text-sm">
                        <LayoutDashboard className="w-4 h-4 mr-1" />
                        <span>Dashboard</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Quick Actions</h2>
                <p className="text-gray-400 text-sm">Common management tasks across all games.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/admin/orders"
                  className="bg-black/20 border border-gray-700 rounded-lg p-4 flex items-start gap-4 hover:border-mlbb-purple transition-all duration-200"
                >
                  <div className="bg-mlbb-purple/20 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-mlbb-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">All Orders</h3>
                    <p className="text-sm text-gray-400">View and manage orders across all games</p>
                  </div>
                </Link>
                
                <button 
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon."
                  })}
                  className="bg-black/20 border border-gray-700 rounded-lg p-4 flex items-start gap-4 hover:border-mlbb-purple transition-all duration-200 text-left"
                >
                  <div className="bg-mlbb-purple/20 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-mlbb-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Booster Accounts</h3>
                    <p className="text-sm text-gray-400">Manage your team of boosters</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon."
                  })}
                  className="bg-black/20 border border-gray-700 rounded-lg p-4 flex items-start gap-4 hover:border-mlbb-purple transition-all duration-200 text-left"
                >
                  <div className="bg-mlbb-purple/20 p-3 rounded-lg">
                    <BarChart className="h-6 w-6 text-mlbb-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Analytics</h3>
                    <p className="text-sm text-gray-400">View performance metrics and reports</p>
                  </div>
                </button>
              </div>
            </div>
          </TabsContent>
          
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
      </main>
    </div>
  );
};

export default AdminDashboard;
