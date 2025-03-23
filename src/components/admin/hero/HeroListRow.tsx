import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Trash2, Star } from "lucide-react";
import { Hero } from "@/types/hero.types";

interface HeroListRowProps {
  hero: Hero;
  onNameChange: (id: string, name: string) => void;
  onImageChange: (id: string, image: string) => void;
  onDifficultyChange: (id: string, difficulty: number) => void;
  onPriceModifierChange: (id: string, priceModifier: number) => void;
  onDelete: (id: string) => void;
}

const HeroListRow: React.FC<HeroListRowProps> = ({
  hero,
  onNameChange,
  onImageChange,
  onDifficultyChange,
  onPriceModifierChange,
  onDelete
}) => {
  return (
    <TableRow key={hero.id}>
      <TableCell>
        <Input
          type="text"
          value={hero.name}
          onChange={(e) => onNameChange(hero.id, e.target.value)}
          className="bg-black/30 border-mlbb-purple/30 text-white"
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={hero.image}
          onChange={(e) => onImageChange(hero.id, e.target.value)}
          className="bg-black/30 border-mlbb-purple/30 text-white"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Slider
            defaultValue={[hero.difficulty]}
            max={5}
            step={1}
            onValueChange={(value) => onDifficultyChange(hero.id, value[0])}
            className="w-24"
          />
          <span className="text-gray-400">{hero.difficulty}</span>
          <Star className="text-mlbb-gold h-4 w-4" />
        </div>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={hero.priceModifier}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              onPriceModifierChange(hero.id, value);
            }
          }}
          className="bg-black/30 border-mlbb-purple/30 text-white"
        />
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          onClick={() => onDelete(hero.id)}
          className="text-gray-300 hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default HeroListRow;
