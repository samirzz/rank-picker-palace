
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Check, ChevronRight } from "lucide-react";

interface Game {
  id: string;
  name: string;
  image: string;
  description: string;
  selected: boolean;
}

const GameSelectionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([
    {
      id: "mlbb",
      name: "Mobile Legends",
      image: "https://via.placeholder.com/300x200?text=Mobile+Legends",
      description: "Rank boosting for Mobile Legends: Bang Bang",
      selected: true,
    },
    {
      id: "pubg",
      name: "PUBG Mobile",
      image: "https://via.placeholder.com/300x200?text=PUBG+Mobile",
      description: "Rank boosting for PlayerUnknown's Battlegrounds Mobile",
      selected: false,
    },
    {
      id: "coc",
      name: "Clash of Clans",
      image: "https://via.placeholder.com/300x200?text=Clash+of+Clans",
      description: "Base development and trophy pushing for Clash of Clans",
      selected: false,
    },
    {
      id: "codm",
      name: "Call of Duty Mobile",
      image: "https://via.placeholder.com/300x200?text=CoD+Mobile",
      description: "Rank boosting for Call of Duty Mobile",
      selected: false,
    },
  ]);

  const toggleGameSelection = (gameId: string) => {
    setGames(
      games.map((game) =>
        game.id === gameId ? { ...game, selected: !game.selected } : game
      )
    );
  };

  const handleContinue = () => {
    const selectedGames = games.filter((game) => game.selected);
    if (selectedGames.length === 0) {
      return;
    }
    
    // If Mobile Legends is selected, go to the main page
    if (selectedGames.some(game => game.id === "mlbb")) {
      navigate("/");
    } else {
      // For now, we'll just navigate to the first selected game
      // In a real implementation, you might navigate to different pages based on the game
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mlbb-blue to-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Select Your Games</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the games you want boosting services for. You can select multiple games and we'll prepare a custom boosting experience for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {games.map((game) => (
            <div 
              key={game.id}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 cursor-pointer ${
                game.selected 
                  ? "ring-4 ring-mlbb-purple" 
                  : "ring-1 ring-gray-700"
              }`}
              onClick={() => toggleGameSelection(game.id)}
            >
              <div className="aspect-[3/2] w-full">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 bg-gradient-to-b from-transparent to-black/80">
                <h3 className="font-bold text-xl mb-1">{game.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                  game.selected 
                    ? "bg-mlbb-purple" 
                    : "bg-gray-700/50"
                }`}>
                  {game.selected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            className="bg-mlbb-purple hover:bg-mlbb-purple/80 text-white px-8 py-2 rounded-full text-lg"
            disabled={!games.some(game => game.selected)}
          >
            Continue
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameSelectionDashboard;
