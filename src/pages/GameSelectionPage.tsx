
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import GameSelectionDropdown from "@/components/game-selection/GameSelectionDropdown";
import LiveChat from "@/components/LiveChat";

const GameSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameSlug: string) => {
    navigate(`/${gameSlug}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
            Select Your Game
          </h1>
          
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Choose your game from the dropdown below to get started with our professional boosting services
          </p>
          
          <div className="glass-panel p-8 rounded-xl border border-mlbb-purple/30">
            <GameSelectionDropdown onGameSelect={handleGameSelect} />
          </div>
        </div>
      </main>
      
      <LiveChat />
      <Footer />
    </div>
  );
};

export default GameSelectionPage;
