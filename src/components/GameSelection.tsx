
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad } from "lucide-react";
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
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Select Your Game
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose your game to get started with our professional boosting services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Gamepad className="h-6 w-6 text-mlbb-purple" />
                <div className={`h-3 w-3 rounded-full ${selectedGame?.id === game.id ? "bg-mlbb-purple" : "bg-gray-700"}`}></div>
              </div>
              <CardTitle className="text-lg md:text-xl mt-2">{game.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">{game.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedGame?.id === game.id ? "gradient" : "outline"} 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGameSelect(game);
                }}
              >
                {selectedGame?.id === game.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameSelection;
