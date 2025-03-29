
export interface Game {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
}
