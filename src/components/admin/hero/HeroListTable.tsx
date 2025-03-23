
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Hero } from "@/data/heroes";
import HeroListRow from "./HeroListRow";

interface HeroListTableProps {
  heroes: Hero[];
  onNameChange: (id: string, name: string) => void;
  onImageChange: (id: string, image: string) => void;
  onDifficultyChange: (id: string, difficulty: number) => void;
  onPriceModifierChange: (id: string, priceModifier: number) => void;
  onDelete: (id: string) => void;
}

const HeroListTable: React.FC<HeroListTableProps> = ({
  heroes,
  onNameChange,
  onImageChange,
  onDifficultyChange,
  onPriceModifierChange,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Name</TableHead>
          <TableHead className="text-white">Image URL</TableHead>
          <TableHead className="text-white">Difficulty</TableHead>
          <TableHead className="text-white">Price Modifier</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {heroes.map((hero) => (
          <HeroListRow
            key={hero.id}
            hero={hero}
            onNameChange={onNameChange}
            onImageChange={onImageChange}
            onDifficultyChange={onDifficultyChange}
            onPriceModifierChange={onPriceModifierChange}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default HeroListTable;
