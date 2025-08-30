import { Circle, Mountain, Zap, Rabbit, Flame, Waves, Trophy, Flower, Sparkles, Star, Dog, Circle as Pig } from "lucide-react";
import { FC } from "react";

export interface Zodiac {
  name: string;
  Icon: FC<React.ComponentProps<'svg'>>;
}

// The order is important for the modulo calculation
export const zodiacs: Zodiac[] = [
  { name: 'Rat', Icon: Circle }, 
  { name: 'Ox', Icon: Mountain }, 
  { name: 'Tiger', Icon: Zap }, 
  { name: 'Rabbit', Icon: Rabbit }, 
  { name: 'Dragon', Icon: Flame }, 
  { name: 'Snake', Icon: Waves }, 
  { name: 'Horse', Icon: Trophy }, 
  { name: 'Goat', Icon: Flower }, 
  { name: 'Monkey', Icon: Sparkles }, 
  { name: 'Rooster', Icon: Star }, 
  { name: 'Dog', Icon: Dog }, 
  { name: 'Pig', Icon: Circle }, 
];