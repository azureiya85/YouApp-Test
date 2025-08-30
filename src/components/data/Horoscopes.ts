import { Sun, Waves, Star, Circle, Mountain, Zap, Scale, Fish, Flame, Trophy, Sparkles } from "lucide-react";
import { FC } from "react";

export interface Horoscope {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  Icon: FC<React.ComponentProps<'svg'>>;
}

export const horoscopes: Horoscope[] = [
  { name: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, Icon: Star }, 
  { name: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, Icon: Mountain }, 
  { name: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, Icon: Zap }, 
  { name: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, Icon: Circle }, 
  { name: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, Icon: Sun },
  { name: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, Icon: Sparkles }, 
  { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, Icon: Scale },
  { name: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, Icon: Flame }, 
  { name: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, Icon: Trophy },
  { name: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, Icon: Mountain },
  { name: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, Icon: Waves },
  { name: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, Icon: Fish }, 
];