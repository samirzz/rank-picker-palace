
import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchGames } from "@/services/game.service";
import { Game } from "@/types/game.types";
import { Gamepad } from "lucide-react";

interface GameSelectionDropdownProps {
  onGameSelect: (gameSlug: string) => void;
}

const GameSelectionDropdown: React.FC<GameSelectionDropdownProps> = ({ onGameSelect }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const gamesData = await fetchGames();
        setGames(gamesData);
        if (gamesData.length > 0) {
          setSelectedGame(gamesData[0].slug);
        }
      } catch (err) {
        setError("Failed to load games. Please try again later.");
        console.error("Error loading games:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleSelect = (value: string) => {
    setSelectedGame(value);
  };

  const handleSubmit = () => {
    if (selectedGame) {
      onGameSelect(selectedGame);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-mlbb-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="game-select" className="block text-sm font-medium text-gray-300">
          Select Game
        </label>
        <Select value={selectedGame || ""} onValueChange={handleSelect}>
          <SelectTrigger id="game-select" className="w-full bg-gray-900 border-gray-700">
            <SelectValue placeholder="Select a game" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-white">
            {games.map((game) => (
              <SelectItem key={game.id} value={game.slug} className="hover:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Gamepad className="h-4 w-4 text-mlbb-purple" />
                  <span>{game.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedGame && (
        <div className="flex justify-center">
          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full md:w-auto" 
            onClick={handleSubmit}
          >
            <Gamepad className="mr-2" />
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameSelectionDropdown;
