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

// Straightforward luxury comparison items - mogul, swag, beast mode
const comparisonItems = [
  { item: 'Lamborghinis', emoji: '🏎️', price: 250000, context: 'Brand new Huracán' },
  { item: 'Ferraris', emoji: '🏁', price: 320000, context: 'Ferrari 812 Superfast' },
  { item: 'Bugatti Chirons', emoji: '🚀', price: 3300000, context: 'The ultimate hypercar' },
  { item: 'Rolexes', emoji: '⌚', price: 12000, context: 'Submariner on the wrist' },
  { item: 'Rolex Day-Dates', emoji: '💎', price: 40000, context: 'The President watch' },
  { item: 'Private Jets', emoji: '✈️', price: 65000000, context: 'Gulfstream G650' },
  { item: 'Superyachts', emoji: '🛥️', price: 100000000, context: '200-foot floating palace' },
  { item: 'Beach Mansions', emoji: '🏖️', price: 25000000, context: 'Oceanfront paradise' },
  { item: 'Penthouse Suites', emoji: '🏙️', price: 35000000, context: 'Top floor, skyline views' },
  { item: 'Birkin Bags', emoji: '👜', price: 20000, context: 'The iconic flex' },
  { item: 'Teslas', emoji: '⚡', price: 80000, context: 'Model S Plaid' },
  { item: 'Range Rovers', emoji: '🚙', price: 120000, context: 'Blacked out SVR' },
  { item: 'Courtside Seats', emoji: '🏀', price: 5000, context: 'Front row at the game' },
  { item: 'First Class Flights', emoji: '✨', price: 15000, context: 'Round trip anywhere' },
  { item: 'Vacation Villas', emoji: '🏝️', price: 50000, context: 'Week at a private resort' },
  { item: 'Diamond Chains', emoji: '💎', price: 25000, context: 'Iced out drip' },
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

// Get the single most dramatic comparison for Flex Mode
// Prioritizes high-value items with impressive quantities or fast timeframes
export const getMostDramaticComparison = (annualEarnings: number): EnhancedComparison | null => {
  const comparisons = generateComparisons(annualEarnings);
  
  if (comparisons.length === 0) return null;
  
  // Score each comparison by drama factor:
  // - Prefer expensive items (jets, yachts, Bugattis)
  // - Prefer impressive quantities or fast timeframes
  const scored = comparisons.map(c => {
    const item = comparisonItems.find(i => i.item === c.item);
    const price = item?.price || 1;
    
    // Drama score = price tier * quantity factor * timeframe bonus
    const priceTier = price >= 1000000 ? 5 : price >= 100000 ? 4 : price >= 10000 ? 3 : 2;
    const quantityFactor = Math.min(c.quantity, 100); // Cap to avoid boring "1000 watches"
    const timeframeBonus = 
      c.timeframe === 'every minute' ? 10 :
      c.timeframe === 'every hour' ? 8 :
      c.timeframe === 'every day' ? 6 :
      c.timeframe === 'every week' ? 4 : 2;
    
    // Sweet spot: prefer quantity between 1-20 for expensive items
    const sweetSpotBonus = (c.quantity >= 1 && c.quantity <= 20 && priceTier >= 3) ? 3 : 1;
    
    return {
      comparison: c,
      score: priceTier * quantityFactor * timeframeBonus * sweetSpotBonus
    };
  });
  
  // Sort by score and pick randomly from top 5 most dramatic
  scored.sort((a, b) => b.score - a.score);
  const topCandidates = scored.slice(0, 5);
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  return topCandidates[randomIndex]?.comparison || null;
};
