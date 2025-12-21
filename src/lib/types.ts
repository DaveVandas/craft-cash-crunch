export interface Celebrity {
  id: string;
  name: string;
  profession: string;
  category: Category;
  imageUrl?: string;
  emoji?: string;
  netWorth: number;
  annualEarnings: number;
  biggestDeal?: string;
  source?: string;
  funFacts?: string[];
}

export type Category = 
  | 'athletes'
  | 'hollywood'
  | 'musicians'
  | 'tech-billionaires'
  | 'politicians'
  | 'influencers'
  | 'historical'
  | 'royalty'
  | 'business-titans';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
  gradient: string;
}

export interface Comparison {
  item: string;
  emoji: string;
  price: number;
  quantity: number;
  timeframe: string;
}

export interface EarningsBreakdown {
  perSecond: number;
  perMinute: number;
  perHour: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
}

export interface PersonalComparison {
  celebrityName: string;
  userSalary: number;
  timeToEarnUserSalary: string;
  yearsToCatchUp: number;
  ratio: number;
}
