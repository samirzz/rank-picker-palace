
import { RankCombination } from "@/data/ranks";

export interface CombinationPriceEditorProps {
  onSave: () => void;
}

export interface CombinationRowProps {
  combo: RankCombination;
  index: number;
  ranks: any[];
  onCombinationChange: (index: number, field: keyof RankCombination, value: string | number) => void;
  onRemoveCombination: (index: number) => void;
}

export interface SubdivisionOption {
  value: number;
  label: string;
}
