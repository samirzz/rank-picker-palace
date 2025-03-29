
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Settings } from "lucide-react";
import { fetchGames } from "@/services/game.service";
import { Game } from "@/types/game.types";

interface AdminGameProps extends Game {
  adminRoute: string;
}

const AdminGameSelection: React.FC = () => {
  const [games, setGames] = useState<AdminGameProps[]>([]);
  const [selectedGame, setSelectedGame] = useState<AdminGameProps | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const gamesData = await fetchGames();
        
        // Map the games to include adminRoute
        const adminGames = gamesData.map(game => ({
          ...game,
          adminRoute: `/admin/${game.slug}`
        }));
        
        setGames(adminGames);
        
        // Set the first game as selected by default
        if (adminGames.length > 0) {
          setSelectedGame(adminGames[0]);
        }
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGames();
  }, []);

  const handleGameSelect = (game: AdminGameProps) => {
    setSelectedGame(game);
    navigate(game.adminRoute);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-mlbb-purple border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Game Dashboard Selection</h1>
        <p className="text-gray-400">Select which game dashboard you want to manage</p>
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
                <Settings className="h-4 w-4 text-gray-400" />
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
                {selectedGame?.id === game.id ? "Manage" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGameSelection;
