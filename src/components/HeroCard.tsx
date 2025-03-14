
import React from "react";
import { Hero, getHeroPlaceholderImage } from "@/data/heroes";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface HeroCardProps {
  hero: Hero;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero }) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-mlbb-purple/20 bg-gradient-to-br from-mlbb-darkpurple/60 to-black/40 p-2">
      <div className="flex items-center space-x-3">
        <div className="h-16 w-16 overflow-hidden rounded-md">
          <img
            src={hero.image || getHeroPlaceholderImage()}
            alt={hero.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = getHeroPlaceholderImage();
            }}
          />
        </div>
        <div>
          <h3 className="font-medium text-white">{hero.name}</h3>
          <div className="mt-1 flex items-center">
            <span className="text-xs text-gray-400 mr-2">Difficulty:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-3 w-3 ${
                    index < hero.difficulty
                      ? "text-mlbb-gold fill-mlbb-gold"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            <span>
              Price Modifier: <span className="text-mlbb-gold">{hero.priceModifier}x</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
