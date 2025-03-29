
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, ArrowRight } from "lucide-react";
import { fetchGames } from "@/services/game.service";
import { Game } from "@/types/game.types";

interface GameSelectionProps {
  className?: string;
}

const GameSelection: React.FC<GameSelectionProps> = ({ className }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const gamesData = await fetchGames();
        setGames(gamesData);
        
        // Set the first game as selected by default
        if (gamesData.length > 0) {
          setSelectedGame(gamesData[0]);
        }
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGames();
  }, []);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    // Navigate to the game-specific page
    navigate(`/${game.slug}`);
  };

  if (loading) {
    return (
      <div className={`w-full max-w-6xl mx-auto px-4 py-8 ${className || ""}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-mlbb-purple border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 py-8 ${className || ""}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Choose Your <span className="text-mlbb-purple">Game</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Select your game to get started with our professional boosting services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {games.map((game) => (
          <Card 
            key={game.id}
            className={`glass-panel border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedGame?.id === game.id 
                ? "border-mlbb-purple shadow-lg shadow-mlbb-purple/20" 
                : "border-gray-800 hover:border-mlbb-purple/50"
            }`}
            onClick={() => handleGameSelect(game)}
          >
            <div className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-mlbb-purple/10 border border-mlbb-purple/30 flex items-center justify-center mx-auto mb-4">
                <Gamepad className="h-8 w-8 text-mlbb-purple" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{game.name}</h3>
              <Button 
                variant={selectedGame?.id === game.id ? "gradient" : "outline"} 
                className="w-full mt-4"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGameSelect(game);
                }}
              >
                Select
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          className="bg-gradient-to-r from-mlbb-purple to-mlbb-gold text-white hover:opacity-90 px-8"
          size="lg"
          asChild
        >
          <a href="/game-selection">View All Games</a>
        </Button>
      </div>
    </div>
  );
}

export default GameSelection;
