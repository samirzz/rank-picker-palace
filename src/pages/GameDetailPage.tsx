
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Clock, MessageCircle, Shield, Star, Users, User } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Game types
interface Game {
  id: string;
  name: string;
  image: string;
  description: string;
}

// PUBG Rank interface
interface PUBGRank {
  id: string;
  name: string;
  image: string;
  tier: number;
}

// Temporary PUBG ranks data
const pubgRanks: PUBGRank[] = [
  { id: "bronze", name: "Bronze", image: "/placeholder.svg", tier: 1 },
  { id: "silver", name: "Silver", image: "/placeholder.svg", tier: 2 },
  { id: "gold", name: "Gold", image: "/placeholder.svg", tier: 3 },
  { id: "platinum", name: "Platinum", image: "/placeholder.svg", tier: 4 },
  { id: "diamond", name: "Diamond", image: "/placeholder.svg", tier: 5 },
  { id: "crown", name: "Crown", image: "/placeholder.svg", tier: 6 },
  { id: "ace", name: "Ace", image: "/placeholder.svg", tier: 7 },
  { id: "conqueror", name: "Conqueror", image: "/placeholder.svg", tier: 8 },
];

// Game data
const games: Record<string, Game> = {
  "pubg": {
    id: "pubg",
    name: "PUBG Mobile",
    image: "https://images.unsplash.com/photo-1614294149528-cc5eff90511a?q=80&w=1000&auto=format&fit=crop",
    description: "Rank boosting for PlayerUnknown's Battlegrounds Mobile"
  },
  "mlbb": {
    id: "mlbb",
    name: "Mobile Legends",
    image: "https://images.unsplash.com/photo-1627396184389-b4414ae2062a?q=80&w=1000&auto=format&fit=crop",
    description: "Rank boosting for Mobile Legends: Bang Bang"
  },
  "coc": {
    id: "coc",
    name: "Clash of Clans",
    image: "https://images.unsplash.com/photo-1640245539773-4c1a4a3a5be7?q=80&w=1000&auto=format&fit=crop",
    description: "Base development and trophy pushing for Clash of Clans"
  },
  "codm": {
    id: "codm",
    name: "Call of Duty Mobile",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=1000&auto=format&fit=crop",
    description: "Rank boosting for Call of Duty Mobile"
  }
};

const GameDetailPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [game, setGame] = useState<Game | null>(null);
  const [currentRank, setCurrentRank] = useState<PUBGRank | null>(null);
  const [targetRank, setTargetRank] = useState<PUBGRank | null>(null);
  const [boostMode, setBoostMode] = useState<"solo" | "duo">("solo");
  const [addOns, setAddOns] = useState({
    priority: false,
    streaming: false,
  });
  
  // Estimated price calculation
  const calculatePrice = () => {
    if (!currentRank || !targetRank) return 0;
    
    const basePricePerTier = 15; // $15 per tier difference
    const tierDifference = targetRank.tier - currentRank.tier;
    
    if (tierDifference <= 0) return 0;
    
    let price = basePricePerTier * tierDifference;
    
    // Add duo mode premium (30% more)
    if (boostMode === "duo") {
      price = price * 1.3;
    }
    
    // Add priority service (20% more)
    if (addOns.priority) {
      price = price * 1.2;
    }
    
    // Add streaming option (10% more)
    if (addOns.streaming) {
      price = price * 1.1;
    }
    
    return Math.round(price);
  };
  
  // Estimated time calculation (in days)
  const calculateTime = () => {
    if (!currentRank || !targetRank) return 0;
    
    const tierDifference = targetRank.tier - currentRank.tier;
    if (tierDifference <= 0) return 0;
    
    // Base: 1 day per tier
    let time = tierDifference;
    
    // Duo mode is 20% faster
    if (boostMode === "duo") {
      time = time * 0.8;
    }
    
    // Priority service is 30% faster
    if (addOns.priority) {
      time = time * 0.7;
    }
    
    return Math.max(1, Math.round(time));
  };

  useEffect(() => {
    // Set the game based on the route parameter
    if (gameId && games[gameId]) {
      setGame(games[gameId]);
    } else {
      // Redirect to game selection if game not found
      navigate("/games");
      toast({
        title: "Game not found",
        description: "Please select a valid game.",
        variant: "destructive"
      });
    }
  }, [gameId, navigate, toast]);

  // Handle rank selection
  const handleCurrentRankSelect = (rank: PUBGRank) => {
    setCurrentRank(rank);
    
    // Reset target rank if it's lower than current rank
    if (targetRank && targetRank.tier <= rank.tier) {
      setTargetRank(null);
    }
  };
  
  const handleTargetRankSelect = (rank: PUBGRank) => {
    if (currentRank && rank.tier > currentRank.tier) {
      setTargetRank(rank);
    }
  };
  
  // Toggle boost mode
  const toggleBoostMode = (mode: "solo" | "duo") => {
    setBoostMode(mode);
  };
  
  // Toggle add-ons
  const toggleAddOn = (addon: "priority" | "streaming") => {
    setAddOns(prev => ({
      ...prev,
      [addon]: !prev[addon]
    }));
  };
  
  // Handle order submission
  const handleOrderSubmit = () => {
    if (!currentRank || !targetRank) {
      toast({
        title: "Incomplete selection",
        description: "Please select both current and target ranks.",
        variant: "destructive"
      });
      return;
    }
    
    // For demo: Just show success toast
    toast({
      title: "Order Submitted",
      description: "Your boosting order has been received!",
    });
    
    // In a real app, you would redirect to checkout
    // navigate("/checkout");
  };

  if (!game) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mlbb-blue to-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          {/* Game info header */}
          <div className="w-full md:w-1/3 rounded-xl overflow-hidden">
            <img 
              src={game.image} 
              alt={game.name} 
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.name}</h1>
            <p className="text-gray-400 mb-4">{game.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-mlbb-purple/20 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-mlbb-purple" />
                <span className="text-sm">Secure Boosting</span>
              </div>
              <div className="flex items-center gap-2 bg-mlbb-purple/20 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-mlbb-purple" />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-mlbb-purple/20 rounded-full px-4 py-2">
                <MessageCircle className="w-4 h-4 text-mlbb-purple" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 bg-mlbb-purple/20 rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-mlbb-purple" />
                <span className="text-sm">Pro Boosters</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-black/40 border border-mlbb-purple/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Select Your Ranks</h2>
              
              {/* Current Rank Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Current Rank</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pubgRanks.map((rank) => (
                    <div
                      key={`current-${rank.id}`}
                      className={`relative rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        currentRank?.id === rank.id
                          ? "border-mlbb-purple ring-2 ring-mlbb-purple"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                      onClick={() => handleCurrentRankSelect(rank)}
                    >
                      <div className="aspect-square w-full bg-gray-800 flex items-center justify-center">
                        <img 
                          src={rank.image} 
                          alt={rank.name} 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div className="p-2 text-center">
                        <span className={`text-sm font-medium ${
                          currentRank?.id === rank.id ? "text-mlbb-purple" : "text-gray-300"
                        }`}>
                          {rank.name}
                        </span>
                      </div>
                      {currentRank?.id === rank.id && (
                        <div className="absolute top-2 right-2 bg-mlbb-purple rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Target Rank Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Target Rank</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pubgRanks.map((rank) => (
                    <div
                      key={`target-${rank.id}`}
                      className={`relative rounded-lg overflow-hidden border transition-all ${
                        targetRank?.id === rank.id
                          ? "border-mlbb-purple ring-2 ring-mlbb-purple"
                          : "border-gray-700 hover:border-gray-500"
                      } ${
                        !currentRank || rank.tier <= currentRank.tier
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (currentRank && rank.tier > currentRank.tier) {
                          handleTargetRankSelect(rank);
                        }
                      }}
                    >
                      <div className="aspect-square w-full bg-gray-800 flex items-center justify-center">
                        <img 
                          src={rank.image} 
                          alt={rank.name} 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div className="p-2 text-center">
                        <span className={`text-sm font-medium ${
                          targetRank?.id === rank.id ? "text-mlbb-purple" : "text-gray-300"
                        }`}>
                          {rank.name}
                        </span>
                      </div>
                      {targetRank?.id === rank.id && (
                        <div className="absolute top-2 right-2 bg-mlbb-purple rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 border border-mlbb-purple/20 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Boost Options</h2>
              
              {/* Boost Mode Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Boost Mode</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      boostMode === "solo"
                        ? "border-mlbb-purple bg-mlbb-purple/10"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                    onClick={() => toggleBoostMode("solo")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-mlbb-purple" />
                        <span className="font-semibold">Solo Boost</span>
                      </div>
                      {boostMode === "solo" && (
                        <div className="bg-mlbb-purple rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Our pro booster plays on your account to achieve your target rank
                    </p>
                  </div>
                  
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      boostMode === "duo"
                        ? "border-mlbb-purple bg-mlbb-purple/10"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                    onClick={() => toggleBoostMode("duo")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-mlbb-purple" />
                        <span className="font-semibold">Duo Boost (+30%)</span>
                      </div>
                      {boostMode === "duo" && (
                        <div className="bg-mlbb-purple rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Play together with our pro booster to reach your desired rank
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Optional Add-ons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Add-ons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      addOns.priority
                        ? "border-mlbb-purple bg-mlbb-purple/10"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                    onClick={() => toggleAddOn("priority")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-mlbb-purple" />
                        <span className="font-semibold">Priority Service (+20%)</span>
                      </div>
                      {addOns.priority && (
                        <div className="bg-mlbb-purple rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Get your boost completed 30% faster with our most experienced boosters
                    </p>
                  </div>
                  
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      addOns.streaming
                        ? "border-mlbb-purple bg-mlbb-purple/10"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                    onClick={() => toggleAddOn("streaming")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-mlbb-purple" />
                        <span className="font-semibold">Streaming Option (+10%)</span>
                      </div>
                      {addOns.streaming && (
                        <div className="bg-mlbb-purple rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Watch your booster play in real-time and communicate directly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-black/40 border border-mlbb-purple/20 rounded-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Rank:</span>
                  <span className="font-medium">
                    {currentRank ? currentRank.name : "Not selected"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Rank:</span>
                  <span className="font-medium">
                    {targetRank ? targetRank.name : "Not selected"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Boost Mode:</span>
                  <span className="font-medium">
                    {boostMode === "solo" ? "Solo Boost" : "Duo Boost"}
                  </span>
                </div>
                
                {(addOns.priority || addOns.streaming) && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Add-ons:</span>
                    <div className="text-right">
                      {addOns.priority && <div className="font-medium">Priority Service</div>}
                      {addOns.streaming && <div className="font-medium">Streaming Option</div>}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span className="font-medium">
                    {calculateTime()} {calculateTime() === 1 ? "day" : "days"}
                  </span>
                </div>
                
                <div className="border-t border-gray-700 pt-4 flex justify-between text-lg">
                  <span className="font-semibold">Total Price:</span>
                  <span className="font-bold text-mlbb-gold">
                    ${calculatePrice()}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleOrderSubmit}
                className="w-full bg-mlbb-purple hover:bg-mlbb-purple/90 text-white py-2 rounded-lg"
                disabled={!currentRank || !targetRank}
              >
                Place Order
              </Button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                By placing an order, you agree to our Terms of Service
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameDetailPage;
