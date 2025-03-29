
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Settings } from "lucide-react";

export interface AdminGame {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  adminRoute: string;
}

const adminGames: AdminGame[] = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    description: "Manage boosting services for Mobile Legends: Bang Bang",
    icon: <Gamepad className="h-6 w-6 text-mlbb-purple" />,
    adminRoute: "/admin/dashboard",
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    description: "Manage professional PUBG Mobile boosting services",
    icon: <Gamepad className="h-6 w-6 text-amber-500" />,
    adminRoute: "/admin/pubg",
  },
  {
    id: "honor-of-kings",
    name: "Honor of Kings",
    description: "Manage Honor of Kings boosting services",
    icon: <Gamepad className="h-6 w-6 text-blue-500" />,
    adminRoute: "/admin/honor-of-kings",
  },
  {
    id: "clash-of-clans",
    name: "Clash of Clans",
    description: "Manage Clash of Clans boosting services",
    icon: <Gamepad className="h-6 w-6 text-yellow-500" />,
    adminRoute: "/admin/clash-of-clans",
  },
  {
    id: "clash-royale",
    name: "Clash Royale",
    description: "Manage Clash Royale boosting services",
    icon: <Gamepad className="h-6 w-6 text-red-500" />,
    adminRoute: "/admin/clash-royale",
  }
];

const AdminGameSelection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<AdminGame | null>(adminGames[0]);
  const navigate = useNavigate();

  const handleGameSelect = (game: AdminGame) => {
    setSelectedGame(game);
    navigate(game.adminRoute);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Game Dashboard Selection</h1>
        <p className="text-gray-400">Select which game dashboard you want to manage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {adminGames.map((game) => (
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
