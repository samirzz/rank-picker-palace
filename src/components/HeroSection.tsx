import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gamepad } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
          Professional Game Boosting Service
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Reach your desired rank with our elite team of professional boosters. Fast, reliable, and secure.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="gradient" asChild>
            <Link to="/#ranks">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/game-selection">
              Choose Your Game
              <Gamepad className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-12">
          <img
            src="/mlbb-hero-banner.png"
            alt="Mobile Legends Hero Banner"
            className="rounded-2xl shadow-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
