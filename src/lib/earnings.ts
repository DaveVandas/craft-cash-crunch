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

// Ultra-mogul luxury items - massive library for variety
const mogulItems = {
  week: [
    { item: 'Bugatti Chiron', emoji: '🚀', price: 3300000, context: 'The $3.3M hypercar' },
    { item: 'Ferrari SF90', emoji: '🏎️', price: 625000, context: 'Hybrid supercar perfection' },
    { item: 'Rolls-Royce Phantom', emoji: '👑', price: 500000, context: 'The ultimate status symbol' },
    { item: 'Richard Mille Watch', emoji: '⌚', price: 250000, context: 'Worn by champions' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 250000, context: 'Italian excellence' },
    { item: 'Patek Philippe', emoji: '💎', price: 80000, context: 'Generational wealth on wrist' },
    { item: 'McLaren 720S', emoji: '🏎️', price: 300000, context: 'British engineering perfection' },
    { item: 'Aston Martin DBS', emoji: '🔥', price: 320000, context: 'James Bond approved' },
    { item: 'Bentley Continental', emoji: '🎩', price: 250000, context: 'Old money energy' },
    { item: 'Porsche 911 GT3 RS', emoji: '⚡', price: 225000, context: 'Track-ready beast' },
    { item: 'Mercedes-AMG GT', emoji: '🌟', price: 180000, context: 'German precision' },
    { item: 'Audemars Piguet', emoji: '⏱️', price: 150000, context: 'Royal Oak prestige' },
    { item: 'Hermès Birkin', emoji: '👜', price: 120000, context: 'Rarer than gold' },
    { item: 'Tesla Roadster', emoji: '⚡', price: 200000, context: '0-60 in 1.9 seconds' },
    { item: 'Maybach S-Class', emoji: '🖤', price: 185000, context: 'Executive luxury' },
    { item: 'Range Rover SVA', emoji: '🦁', price: 250000, context: 'Blacked out power' },
    { item: 'G-Wagon Brabus', emoji: '💪', price: 400000, context: 'Military meets luxury' },
    { item: 'Cartier Necklace', emoji: '💎', price: 100000, context: 'Timeless elegance' },
    { item: 'Van Cleef Set', emoji: '✨', price: 200000, context: 'Alhambra collection' },
    { item: 'Rolex Daytona', emoji: '🏆', price: 75000, context: 'The racing legend' },
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
    { item: 'Miami Mansion', emoji: '🌴', price: 35000000, context: 'Star Island vibes' },
    { item: 'Aspen Ski Chalet', emoji: '⛷️', price: 20000000, context: 'Mountain luxury' },
    { item: 'Monaco Apartment', emoji: '🎰', price: 40000000, context: 'Tax haven living' },
    { item: 'Malibu Compound', emoji: '🌊', price: 30000000, context: 'Pacific paradise' },
    { item: 'Private Jet', emoji: '✈️', price: 25000000, context: 'Bombardier Global' },
    { item: 'Yacht Club', emoji: '⛵', price: 15000000, context: 'Membership for life' },
    { item: 'Horse Ranch', emoji: '🐎', price: 12000000, context: 'Kentucky bluegrass' },
    { item: 'Art Masterpiece', emoji: '🖼️', price: 20000000, context: 'Museum-worthy piece' },
    { item: 'Winery', emoji: '🍇', price: 8000000, context: 'Napa Valley estate' },
    { item: 'Recording Studio', emoji: '🎵', price: 5000000, context: 'Grammy-winning setup' },
    { item: 'Nightclub', emoji: '🪩', price: 10000000, context: 'Own the night' },
    { item: 'Restaurant Empire', emoji: '🍽️', price: 7000000, context: 'Michelin-star chain' },
    { item: 'Car Collection', emoji: '🚗', price: 15000000, context: '50 exotic cars' },
    { item: 'Bombardier Jet', emoji: '🛩️', price: 35000000, context: 'Global 7500' },
    { item: 'Hamptons Estate', emoji: '🏡', price: 45000000, context: 'Summer retreat' },
    { item: 'Beverly Hills Mansion', emoji: '🌟', price: 55000000, context: 'Hollywood royalty' },
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
    { item: 'NBA Team', emoji: '🏀', price: 2500000000, context: 'Courtside forever' },
    { item: 'Soccer Club', emoji: '⚽', price: 800000000, context: 'European football royalty' },
    { item: 'Casino', emoji: '🎰', price: 500000000, context: 'The house always wins' },
    { item: 'Film Studio', emoji: '🎬', price: 300000000, context: 'Make blockbusters' },
    { item: 'Record Label', emoji: '🎤', price: 150000000, context: 'Sign the next stars' },
    { item: 'Tech Startup', emoji: '💻', price: 100000000, context: 'Fund the future' },
    { item: 'Fashion House', emoji: '👗', price: 200000000, context: 'Own the runway' },
    { item: 'Media Empire', emoji: '📺', price: 400000000, context: 'Control the narrative' },
    { item: 'Airline', emoji: '🛫', price: 600000000, context: 'Your own fleet' },
    { item: 'Racing Team', emoji: '🏎️', price: 250000000, context: 'F1 or NASCAR' },
    { item: 'Golf Course', emoji: '⛳', price: 75000000, context: 'Augusta-level greens' },
    { item: 'Crypto Exchange', emoji: '🪙', price: 300000000, context: 'Own the blockchain' },
    { item: 'Luxury Resort Chain', emoji: '🏝️', price: 400000000, context: 'Global hospitality' },
    { item: 'MLB Team', emoji: '⚾', price: 2000000000, context: 'America\'s pastime' },
    { item: 'Esports League', emoji: '🎮', price: 150000000, context: 'Own gaming' },
    { item: 'Shipping Fleet', emoji: '🚢', price: 500000000, context: 'Global logistics' },
    { item: 'Pharmaceutical Company', emoji: '💊', price: 800000000, context: 'Life-saving empire' },
    { item: 'Theme Park', emoji: '🎢', price: 1000000000, context: 'Your own Disney' },
    { item: 'Satellite Network', emoji: '📡', price: 700000000, context: 'Space infrastructure' },
    { item: 'Hedge Fund', emoji: '📈', price: 200000000, context: 'Move markets' },
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

// Get the single most dramatic comparison for Flex Mode (5-year empire)
export const getMostDramaticComparison = (annualEarnings: number): EnhancedComparison | null => {
  const fiveYearEarnings = annualEarnings * 5;
  const breakdown = calculateEarningsBreakdown(fiveYearEarnings);
  
  // Use the year-tier items but with 5 years of earnings for max drama
  const eliteItems = mogulItems.year;
  
  let bestItem = null;
  let bestScore = 0;
  
  for (const item of eliteItems) {
    const quantity = Math.floor(fiveYearEarnings / item.price);
    if (quantity >= 1) {
      // Prefer impressive but believable quantities
      const score = Math.min(quantity, 20) * (item.price / 1000000);
      if (score > bestScore) {
        bestScore = score;
        bestItem = {
          ...item,
          quantity,
          timeframe: 'In 5 years',
          period: 'year' as const,
        };
      }
    }
  }
  
  return bestItem;
};
