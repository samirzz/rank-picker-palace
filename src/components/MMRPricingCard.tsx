
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Hero } from "@/data/heroes";

interface MMRPricingCardProps {
  hero: Hero | null;
  currentMMR: number;
  targetMMR: number;
  price: number;
}

const MMRPricingCard: React.FC<MMRPricingCardProps> = ({ 
  hero,
  currentMMR,
  targetMMR,
  price
}) => {
  const isComplete = hero && currentMMR < targetMMR;
  
  return (
    <Card className="bg-mlbb-darkpurple/40 border-mlbb-purple/20 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-white">Boost Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Selected Hero</div>
            <div className="text-white font-medium">
              {hero ? hero.name : "No hero selected"}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Current MMR</div>
            <div className="text-white font-medium">{currentMMR}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Target MMR</div>
            <div className="text-white font-medium">{targetMMR}</div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Price</span>
              <span className="text-mlbb-gold text-xl font-bold">${price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-mlbb-gold hover:bg-mlbb-gold/80 text-black"
          disabled={!isComplete}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MMRPricingCard;
