import { EarningsBreakdown, Comparison } from './types';

export const calculateEarningsBreakdown = (annualEarnings: number): EarningsBreakdown => {
  const perYear = annualEarnings;
  const perMonth = perYear / 12;
  const perWeek = perYear / 52;
  const perDay = perYear / 365;
  const perHour = perDay / 24;
  const perMinute = perHour / 60;
  const perSecond = perMinute / 60;

  return {
    perSecond,
    perMinute,
    perHour,
    perDay,
    perWeek,
    perMonth,
    perYear
  };
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
};

export const formatLargeCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount);
};

// Rich comparison items with context and witty descriptions
const comparisonItems = [
  { item: 'Lamborghinis', emoji: '🏎️', price: 250000, context: 'Brand new Huracán off the lot' },
  { item: 'Ferraris', emoji: '🏁', price: 320000, context: 'Ferrari 812 Superfast' },
  { item: 'Rolexes', emoji: '⌚', price: 12000, context: 'Rolex Submariner in steel' },
  { item: 'Richard Mille Watches', emoji: '💎', price: 250000, context: 'Skeleton tourbillon flex piece' },
  { item: 'Private Jets', emoji: '✈️', price: 65000000, context: 'Gulfstream G650, fully specced' },
  { item: 'Luxury Superyachts', emoji: '🛥️', price: 100000000, context: '200-foot floating mansion' },
  { item: 'Super Bowl Ads', emoji: '📺', price: 7000000, context: '30-second prime-time flex' },
  { item: 'Malibu Beach Mansions', emoji: '🌴', price: 25000000, context: 'Oceanfront, glass walls, infinity pool' },
  { item: 'NYC Penthouses', emoji: '🗽', price: 35000000, context: 'Park-view penthouse in Manhattan' },
  { item: 'Bugatti Chirons', emoji: '🚀', price: 3300000, context: 'Hypercar for when “fast” isn’t enough' },
  { item: 'Full Eras Tour VIP Packages', emoji: '🎤', price: 5000, context: 'Floor seats, VIP lounge, the works' },
  { item: 'First-Class Round-the-World Trips', emoji: '🌍', price: 25000, context: 'First class flights + 5-star hotels' },
  { item: 'Hermès Birkins', emoji: '👜', price: 20000, context: 'The “sorry, there’s a waitlist” bag' },
  { item: 'NYC Luxury Rents (month)', emoji: '🏙️', price: 12000, context: 'High-rise, doorman, skyline views' },
  { item: 'Full-Time Nannies (year)', emoji: '👶', price: 60000, context: '24/7 childcare on payroll' },
  { item: 'Private Island Week Rentals', emoji: '🏝️', price: 150000, context: 'Fly in, disappear, re-emerge tanned' },
];

export interface EnhancedComparison extends Comparison {
  context: string;
}

export const generateComparisons = (annualEarnings: number): EnhancedComparison[] => {
  const breakdown = calculateEarningsBreakdown(annualEarnings);
  
  return comparisonItems.map((item) => {
    const perMinute = breakdown.perMinute;
    const perHour = breakdown.perHour;
    const perDay = breakdown.perDay;
    const perWeek = breakdown.perWeek;
    
    let quantity: number;
    let timeframe: string;
    
    if (item.price <= perMinute) {
      quantity = Math.floor(perMinute / item.price);
      timeframe = 'every minute';
    } else if (item.price <= perHour) {
      quantity = Math.floor(perHour / item.price);
      timeframe = 'every hour';
    } else if (item.price <= perDay) {
      quantity = Math.floor(perDay / item.price);
      timeframe = 'every day';
    } else if (item.price <= perWeek) {
      quantity = Math.floor(perWeek / item.price);
      timeframe = 'every week';
    } else {
      quantity = Math.floor(annualEarnings / item.price);
      timeframe = 'every year';
    }

    return {
      ...item,
      quantity: Math.max(1, quantity),
      timeframe,
      context: item.context,
    };
  }).filter(c => c.quantity >= 1);
};

export const calculateTimeToEarn = (amount: number, annualEarnings: number): string => {
  const perSecond = annualEarnings / (365 * 24 * 60 * 60);
  const seconds = amount / perSecond;
  
  if (seconds < 60) {
    return `${seconds.toFixed(1)} seconds`;
  }
  if (seconds < 3600) {
    return `${(seconds / 60).toFixed(1)} minutes`;
  }
  if (seconds < 86400) {
    return `${(seconds / 3600).toFixed(1)} hours`;
  }
  if (seconds < 2592000) {
    return `${(seconds / 86400).toFixed(1)} days`;
  }
  if (seconds < 31536000) {
    return `${(seconds / 2592000).toFixed(1)} months`;
  }
  return `${(seconds / 31536000).toFixed(1)} years`;
};
