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

const comparisonItems = [
  { item: 'Pizzas', emoji: '🍕', price: 15 },
  { item: 'iPhones', emoji: '📱', price: 1199 },
  { item: 'Tesla Model 3s', emoji: '🚗', price: 42990 },
  { item: 'Houses (US avg)', emoji: '🏠', price: 420000 },
  { item: 'Cups of Coffee', emoji: '☕', price: 5 },
  { item: 'Movie Tickets', emoji: '🎟️', price: 15 },
  { item: 'College Tuitions', emoji: '🎓', price: 50000 },
  { item: 'Private Jets', emoji: '✈️', price: 65000000 },
  { item: 'Yachts', emoji: '🛥️', price: 10000000 },
  { item: 'Lamborghinis', emoji: '🏎️', price: 250000 },
  { item: 'Rolexes', emoji: '⌚', price: 12000 },
  { item: 'Minimum Wage Years', emoji: '💼', price: 15080 }
];

export const generateComparisons = (annualEarnings: number): Comparison[] => {
  const breakdown = calculateEarningsBreakdown(annualEarnings);
  
  return comparisonItems.map(item => {
    const perMinute = breakdown.perMinute;
    const perHour = breakdown.perHour;
    const perDay = breakdown.perDay;
    
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
    } else {
      quantity = Math.floor(annualEarnings / item.price);
      timeframe = 'every year';
    }

    return {
      ...item,
      quantity: Math.max(1, quantity),
      timeframe
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
