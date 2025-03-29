
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad } from "lucide-react";

export interface Game {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  route: string;
}

interface GameSelectionProps {
  className?: string;
}

const games: Game[] = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    description: "Boost your rank in Mobile Legends: Bang Bang",
    icon: <Gamepad className="h-6 w-6 text-mlbb-purple" />,
    route: "/",
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    description: "Professional PUBG Mobile boosting services",
    icon: <Gamepad className="h-6 w-6 text-amber-500" />,
    route: "/pubg", // These routes would need to be created
  },
  {
    id: "honor-of-kings",
    name: "Honor of Kings",
    description: "Rank up in Honor of Kings with pro boosters",
    icon: <Gamepad className="h-6 w-6 text-blue-500" />,
    route: "/honor-of-kings",
  },
  {
    id: "clash-of-clans",
    name: "Clash of Clans",
    description: "Level up your Clash of Clans account faster",
    icon: <Gamepad className="h-6 w-6 text-yellow-500" />,
    route: "/clash-of-clans",
  },
  {
    id: "clash-royale",
    name: "Clash Royale",
    description: "Reach higher arenas with our boosting service",
    icon: <Gamepad className="h-6 w-6 text-red-500" />,
    route: "/clash-royale",
  }
];

const GameSelection: React.FC<GameSelectionProps> = ({ className }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(games[0]);
  const navigate = useNavigate();

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    // Navigate to the game-specific page
    navigate(game.route);
  };

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
                {game.icon}
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
