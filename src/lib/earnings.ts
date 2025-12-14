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
  { item: 'Pizzas', emoji: '🍕', price: 15, context: 'Large pepperoni pizzas' },
  { item: 'iPhones', emoji: '📱', price: 1199, context: 'iPhone 16 Pro Max' },
  { item: 'Tesla Model 3s', emoji: '🚗', price: 42990, context: 'Long Range edition' },
  { item: 'Houses (US avg)', emoji: '🏠', price: 420000, context: 'Median US home price' },
  { item: 'Cups of Coffee', emoji: '☕', price: 5, context: 'Starbucks grande lattes' },
  { item: 'Movie Tickets', emoji: '🎟️', price: 15, context: 'IMAX screenings' },
  { item: 'College Tuitions', emoji: '🎓', price: 50000, context: 'One year at a private university' },
  { item: 'Private Jets', emoji: '✈️', price: 65000000, context: 'Gulfstream G650' },
  { item: 'Yachts', emoji: '🛥️', price: 10000000, context: 'Luxury superyacht' },
  { item: 'Lamborghinis', emoji: '🏎️', price: 250000, context: 'Huracán' },
  { item: 'Rolexes', emoji: '⌚', price: 12000, context: 'Submariner' },
  { item: 'Minimum Wage Years', emoji: '💼', price: 15080, context: 'US federal minimum wage' },
  { item: 'Super Bowl Ads', emoji: '📺', price: 7000000, context: '30-second spot' },
  { item: 'Disney World Trips', emoji: '🏰', price: 5000, context: 'Family of 4, week-long' },
  { item: 'Avocado Toasts', emoji: '🥑', price: 12, context: 'Hipster brunch special' },
  { item: 'Therapy Sessions', emoji: '🛋️', price: 200, context: 'One hour with a licensed therapist' },
  { item: 'Taylor Swift Tickets', emoji: '🎤', price: 1500, context: 'Eras Tour resale' },
  { item: 'NYC Apartments (month)', emoji: '🗽', price: 4500, context: 'Average Manhattan rent' },
  { item: 'Gucci Bags', emoji: '👜', price: 2800, context: 'Jackie 1961 shoulder bag' },
  { item: 'SpaceX Rocket Launches', emoji: '🚀', price: 67000000, context: 'Falcon 9 mission' },
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
