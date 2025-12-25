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

// Ultra-mogul luxury items - dramatic flex pieces by tier
const mogulItems = {
  week: [
    { item: 'Bugatti Chiron', emoji: '🚀', price: 3300000, context: 'The $3.3M hypercar' },
    { item: 'Ferrari SF90', emoji: '🏎️', price: 625000, context: 'Hybrid supercar perfection' },
    { item: 'Rolls-Royce Phantom', emoji: '👑', price: 500000, context: 'The ultimate status symbol' },
    { item: 'Richard Mille Watch', emoji: '⌚', price: 250000, context: 'Worn by champions' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 250000, context: 'Italian excellence' },
    { item: 'Patek Philippe', emoji: '💎', price: 80000, context: 'Generational wealth on wrist' },
  ],
  month: [
    { item: 'Mega Yacht', emoji: '🛥️', price: 75000000, context: '200ft floating palace' },
    { item: 'Penthouse NYC', emoji: '🏙️', price: 50000000, context: 'Billionaire\'s Row views' },
    { item: 'Private Island', emoji: '🏝️', price: 15000000, context: 'Your own paradise' },
    { item: 'Gulfstream G650', emoji: '✈️', price: 65000000, context: 'Ultimate private jet' },
    { item: 'Beach Mansion', emoji: '🏖️', price: 25000000, context: 'Oceanfront estate' },
    { item: 'Luxury Penthouse', emoji: '🌃', price: 10000000, context: 'Top floor living' },
    { item: 'Vineyard Estate', emoji: '🍷', price: 5000000, context: 'Make your own wine' },
    { item: 'Helicopter', emoji: '🚁', price: 3000000, context: 'Skip the traffic' },
  ],
  year: [
    { item: 'NFL Team', emoji: '🏈', price: 4000000000, context: 'Own the game' },
    { item: 'Skyscraper', emoji: '🏗️', price: 1500000000, context: 'Your name on the skyline' },
    { item: 'Space Mission', emoji: '🚀', price: 500000000, context: 'Fund your own rocket' },
    { item: 'Art Collection', emoji: '🎨', price: 200000000, context: 'Museum-worthy pieces' },
    { item: 'Sports Franchise', emoji: '🏆', price: 100000000, context: 'Own a winning team' },
    { item: 'Private Jet Fleet', emoji: '✈️', price: 50000000, context: 'Jets for every mood' },
    { item: 'Superyacht', emoji: '⛵', price: 30000000, context: 'Sail the world in style' },
    { item: 'Hotel', emoji: '🏨', price: 20000000, context: 'Your own luxury resort' },
  ],
};

export interface EnhancedComparison extends Comparison {
  context: string;
  period: 'week' | 'month' | 'year';
}

export const generateMogulComparisons = (annualEarnings: number): EnhancedComparison[] => {
  const breakdown = calculateEarningsBreakdown(annualEarnings);
  const results: EnhancedComparison[] = [];

  // Pick best item for each timeframe
  const timeframes: { period: 'week' | 'month' | 'year'; earnings: number; label: string }[] = [
    { period: 'week', earnings: breakdown.perWeek, label: 'In a week' },
    { period: 'month', earnings: breakdown.perMonth, label: 'In a month' },
    { period: 'year', earnings: breakdown.perYear, label: 'In a year' },
  ];

  for (const tf of timeframes) {
    const items = mogulItems[tf.period];
    // Find the most dramatic item they can afford multiple of, or at least 1
    let bestItem = null;
    let bestScore = 0;

    for (const item of items) {
      const quantity = Math.floor(tf.earnings / item.price);
      if (quantity >= 1) {
        // Score: prefer items where quantity is impressive but not absurd
        const score = Math.min(quantity, 50) * (item.price / 1000000);
        if (score > bestScore) {
          bestScore = score;
          bestItem = { ...item, quantity, timeframe: tf.label };
        }
      }
    }

    // If can't afford any, show what fraction of the most expensive they could get
    if (!bestItem) {
      const cheapest = items.reduce((a, b) => a.price < b.price ? a : b);
      const quantity = Math.floor(tf.earnings / cheapest.price);
      if (quantity >= 1) {
        bestItem = { ...cheapest, quantity, timeframe: tf.label };
      }
    }

    if (bestItem) {
      results.push({
        ...bestItem,
        period: tf.period,
      });
    }
  }

  return results;
};

// Legacy function for backwards compatibility
export const generateComparisons = generateMogulComparisons;

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

// Get the single most dramatic comparison for Flex Mode
export const getMostDramaticComparison = (annualEarnings: number): EnhancedComparison | null => {
  const comparisons = generateMogulComparisons(annualEarnings);
  if (comparisons.length === 0) return null;
  
  // Pick the yearly one for max drama, or the highest quantity available
  return comparisons.find(c => c.period === 'year') || comparisons[comparisons.length - 1];
};
