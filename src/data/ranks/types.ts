
export interface Rank {
  id: string;
  name: string;
  image: string;
  tier: number;
  priceModifier: number;
  basePrice?: number;
  costPerStar?: number;
  subdivisions?: RankSubdivision[];
  points?: PointsRange;
}

export interface RankSubdivision {
  name: string;
  stars?: number;
  points?: PointsRange;
}

export interface PointsRange {
  min: number;
  max: number;
}

export interface RankCombination {
  fromRankId: string;
  fromSubdivision?: number;
  toRankId: string;
  toSubdivision?: number;
  price: number;
}
