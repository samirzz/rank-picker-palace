
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchGames } from "@/services/game.service";
import { Game } from "@/types/game.types";
import { ArrowRight, Gamepad, Info, Shield, Star, Trophy } from "lucide-react";

const GameSelectionPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const gamesData = await fetchGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleGameSelect = (gameSlug: string) => {
    if (gameSlug === "mobile-legends") {
      navigate(`/${gameSlug}`);
    } else {
      // For now, redirect to the mobile-legends page for all other games
      navigate("/mobile-legends");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-mlbb-purple to-mlbb-gold bg-clip-text text-transparent">
              Select Your Game
            </h1>
            
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
              Choose your game from our selection of professional boosting services
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-12 w-12 border-4 border-mlbb-purple border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {games.length > 0 ? (
                  games.map((game) => (
                    <Card 
                      key={game.id}
                      className="glass-panel border border-mlbb-purple/30 overflow-hidden hover:shadow-lg hover:shadow-mlbb-purple/20 transition-all duration-300"
                    >
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-mlbb-purple/30 to-black flex items-center justify-center">
                          <Gamepad className="h-24 w-24 text-mlbb-purple opacity-60" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3">{game.name}</h3>
                        <p className="text-gray-400 mb-6">{game.description || `Professional ${game.name} boosting services for all ranks and game modes.`}</p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-300">
                            <Trophy className="h-5 w-5 text-mlbb-gold mr-3" />
                            <span>Rank & MMR Boosting</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Star className="h-5 w-5 text-mlbb-gold mr-3" />
                            <span>Professional Boosters</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Shield className="h-5 w-5 text-mlbb-gold mr-3" />
                            <span>Secure & Fast Delivery</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-mlbb-purple to-mlbb-gold text-white"
                          onClick={() => handleGameSelect(game.slug)}
                        >
                          Select {game.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  // Fallback content when no games are found
                  <Card className="glass-panel border border-mlbb-purple/30 overflow-hidden col-span-full max-w-xl mx-auto">
                    <div className="p-6 text-center">
                      <Gamepad className="h-16 w-16 text-mlbb-purple opacity-60 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-3">Mobile Legends: Bang Bang</h3>
                      <p className="text-gray-400 mb-6">Professional Mobile Legends boosting services for all ranks and game modes.</p>
                      
                      <Button 
                        className="bg-gradient-to-r from-mlbb-purple to-mlbb-gold text-white"
                        onClick={() => navigate("/mobile-legends")}
                      >
                        Select Mobile Legends
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
              
              <div className="mt-16 max-w-4xl mx-auto bg-mlbb-purple/10 border border-mlbb-purple/30 rounded-xl p-6 md:p-8">
                <div className="flex items-start md:items-center">
                  <div className="bg-mlbb-purple/20 rounded-full p-3 mr-4">
                    <Info className="h-6 w-6 text-mlbb-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Can't find your game?</h3>
                    <p className="text-gray-400">
                      We're constantly expanding our services. Contact us if you need boosting for a game not listed here.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <LiveChat />
      <Footer />
    </div>
  );
};

export default GameSelectionPage;
