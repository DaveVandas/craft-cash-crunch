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

// MOGUL ELITE - Pure status symbols, no mundane items
// Jets, yachts, supercars, mansions, islands - real flex material
const mogulItems = {
  week: [
    // === LUXURY ESSENTIALS ($1,000 - $25,000) ===
    { item: 'Rolex', emoji: '⌚', price: 15000, context: 'Iconic timepiece' },
    { item: 'Hermès Birkin', emoji: '👜', price: 25000, context: 'The ultimate bag' },
    { item: 'Omega Speedmaster', emoji: '⌚', price: 8000, context: 'Moonwatch legend' },
    { item: 'Louis Vuitton Trunk', emoji: '🧳', price: 20000, context: 'Travel in style' },
    { item: 'Cartier Love Bracelet', emoji: '💎', price: 10000, context: 'Locked-in luxury' },
    { item: 'Chanel Handbag', emoji: '👛', price: 12000, context: 'Timeless elegance' },
    { item: 'Jet Ski', emoji: '🌊', price: 18000, context: 'Wave runner' },
    
    // === SERIOUS FLEX ($25,000 - $100,000) ===
    { item: 'Rolex Daytona', emoji: '🏆', price: 50000, context: 'Racing legend' },
    { item: 'Patek Philippe', emoji: '💎', price: 80000, context: 'Generational wealth' },
    { item: 'Tesla Model S', emoji: '⚡', price: 90000, context: 'Plaid performance' },
    { item: 'Audemars Piguet', emoji: '⏱️', price: 75000, context: 'Royal Oak prestige' },
    { item: 'Richard Mille', emoji: '⌚', price: 95000, context: 'Worn by champions' },
    
    // === SUPERCAR TIER ($100,000 - $500,000) ===
    { item: 'Porsche 911 Turbo', emoji: '🏎️', price: 200000, context: 'German perfection' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 250000, context: 'Italian thunder' },
    { item: 'Ferrari Roma', emoji: '🐎', price: 275000, context: 'Prancing horse' },
    { item: 'Bentley Continental', emoji: '🎩', price: 250000, context: 'Old money energy' },
    { item: 'McLaren 720S', emoji: '🏎️', price: 300000, context: 'British engineering' },
    { item: 'Aston Martin DB11', emoji: '🔥', price: 220000, context: 'Bond-approved' },
    { item: 'Rolls-Royce Ghost', emoji: '👻', price: 350000, context: 'Silent power' },
    { item: 'Mercedes-AMG GT', emoji: '🌟', price: 180000, context: 'German muscle' },
    { item: 'G-Wagon', emoji: '💪', price: 180000, context: 'Street authority' },
    { item: 'Range Rover SVA', emoji: '🦁', price: 200000, context: 'Blacked out power' },
    
    // === HYPERCAR TIER ($500,000+) ===
    { item: 'Rolls-Royce Phantom', emoji: '👑', price: 500000, context: 'Ultimate status' },
    { item: 'Lamborghini Aventador', emoji: '🐂', price: 500000, context: 'Raging bull' },
    { item: 'Ferrari SF90', emoji: '🏎️', price: 625000, context: 'Hybrid beast' },
    { item: 'Ferrari LaFerrari', emoji: '🐎', price: 2000000, context: 'Prancing perfection' },
    { item: 'Pagani Huayra', emoji: '🌪️', price: 2800000, context: 'Italian wind god' },
    { item: 'Bugatti Chiron', emoji: '🚀', price: 3300000, context: '$3.3M hypercar' },
    { item: 'Koenigsegg Jesko', emoji: '🔥', price: 3000000, context: 'Swedish art' },
  ],
  month: [
    // === ENTRY MOGUL ($50,000 - $250,000) ===
    { item: 'Porsche 911', emoji: '🏎️', price: 120000, context: 'Icon achieved' },
    { item: 'Tesla Model X', emoji: '⚡', price: 100000, context: 'Family hauler' },
    { item: 'Boat', emoji: '🛥️', price: 150000, context: 'Weekend cruiser' },
    { item: 'Ferrari California', emoji: '🐎', price: 220000, context: 'Grand touring' },
    { item: 'Lamborghini Urus', emoji: '🦁', price: 230000, context: 'Super SUV' },
    
    // === MID MOGUL ($250,000 - $1,000,000) ===
    { item: 'Condo', emoji: '🏢', price: 450000, context: 'City living' },
    { item: 'Beach Condo', emoji: '🏖️', price: 500000, context: 'Ocean views' },
    { item: 'Yacht', emoji: '⛵', price: 750000, context: '50-foot cruiser' },
    { item: 'Classic Ferrari', emoji: '🏎️', price: 800000, context: 'Vintage power' },
    { item: 'Lake House', emoji: '🏞️', price: 600000, context: 'Waterfront escape' },
    { item: 'Mountain Chalet', emoji: '🏔️', price: 700000, context: 'Ski-in access' },
    
    // === SERIOUS MOGUL ($1M - $10M) ===
    { item: 'Beach House', emoji: '🏖️', price: 1500000, context: 'Oceanfront retreat' },
    { item: 'Ranch', emoji: '🤠', price: 2000000, context: '100-acre spread' },
    { item: 'Penthouse', emoji: '🏙️', price: 3000000, context: 'Skyline views' },
    { item: 'Yacht', emoji: '🛥️', price: 3000000, context: '80-foot luxury' },
    { item: 'Helicopter', emoji: '🚁', price: 3500000, context: 'Skip traffic' },
    { item: 'Private Island', emoji: '🏝️', price: 5000000, context: 'Your paradise' },
    { item: 'Small Plane', emoji: '🛩️', price: 5000000, context: 'Cessna Citation' },
    { item: 'Vineyard', emoji: '🍇', price: 8000000, context: 'Wine country' },
    { item: 'Winery', emoji: '🍷', price: 8000000, context: 'Napa estate' },
    
    // === ELITE MOGUL ($10M - $50M) ===
    { item: 'Mansion', emoji: '🏛️', price: 12000000, context: 'Gated estate' },
    { item: 'Superyacht', emoji: '🛥️', price: 15000000, context: '150-foot vessel' },
    { item: 'Malibu Compound', emoji: '🌊', price: 25000000, context: 'Pacific paradise' },
    { item: 'Private Jet', emoji: '✈️', price: 25000000, context: 'Bombardier Global' },
    { item: 'Miami Mansion', emoji: '🌴', price: 30000000, context: 'Star Island vibes' },
    { item: 'Dubai Penthouse', emoji: '🏗️', price: 35000000, context: 'Burj views' },
    { item: 'Gulfstream Jet', emoji: '✈️', price: 45000000, context: 'G550 luxury' },
    
    // === ULTRA MOGUL ($50M+) ===
    { item: 'Beverly Hills Mansion', emoji: '🌟', price: 50000000, context: 'Hollywood royalty' },
    { item: 'Bel Air Estate', emoji: '🌴', price: 60000000, context: 'Gates of paradise' },
    { item: 'Gulfstream G650', emoji: '✈️', price: 65000000, context: 'Ultimate jet' },
    { item: 'Mega Yacht', emoji: '🛥️', price: 75000000, context: '200ft palace' },
    { item: 'Airbus Private Jet', emoji: '✈️', price: 80000000, context: 'Flying mansion' },
  ],
  year: [
    // === SUPERCAR TIER ($100,000 - $500,000) ===
    { item: 'Porsche 911 Turbo', emoji: '🏎️', price: 200000, context: 'German legend' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 280000, context: 'Italian stallion' },
    { item: 'Ferrari Roma', emoji: '🐎', price: 250000, context: 'Prancing horse' },
    { item: 'Bentley Continental', emoji: '🎩', price: 250000, context: 'British royalty' },
    { item: 'McLaren 720S', emoji: '🏎️', price: 300000, context: 'Track weapon' },
    { item: 'Rolls-Royce Ghost', emoji: '👻', price: 350000, context: 'Silent luxury' },
    { item: 'Rolls-Royce Cullinan', emoji: '👑', price: 400000, context: 'King of SUVs' },
    
    // === PROPERTY TIER ($500,000 - $5,000,000) ===
    { item: 'Beach Condo', emoji: '🏖️', price: 600000, context: 'Ocean retreat' },
    { item: 'Mountain Cabin', emoji: '⛰️', price: 800000, context: 'Ski property' },
    { item: 'Yacht', emoji: '⛵', price: 1000000, context: '50-foot cruiser' },
    { item: 'Classic Ferrari', emoji: '🏎️', price: 900000, context: 'Vintage gold' },
    { item: 'Ranch', emoji: '🤠', price: 1500000, context: 'Cowboy empire' },
    { item: 'Penthouse', emoji: '🏙️', price: 4000000, context: 'Top floor views' },
    { item: 'Superyacht', emoji: '🛥️', price: 5000000, context: '100-foot vessel' },
    
    // === ELITE TIER ($5M - $50M) ===
    { item: 'Mansion', emoji: '🏛️', price: 8000000, context: 'Gated estate' },
    { item: 'Private Jet', emoji: '🛩️', price: 10000000, context: 'Fly private' },
    { item: 'Vineyard', emoji: '🍇', price: 15000000, context: 'Wine empire' },
    { item: 'Malibu Estate', emoji: '🌊', price: 20000000, context: 'Pacific power' },
    { item: 'Private Island', emoji: '🏝️', price: 25000000, context: 'Your paradise' },
    { item: 'G650 Jet', emoji: '✈️', price: 50000000, context: 'Long-range luxury' },
    { item: 'Superyacht', emoji: '🛥️', price: 40000000, context: '200-foot palace' },
    
    // === ULTRA TIER ($50M - $500M) ===
    { item: 'Beverly Hills Estate', emoji: '🌴', price: 60000000, context: 'A-list address' },
    { item: 'Mega Yacht', emoji: '🛥️', price: 75000000, context: 'Floating mansion' },
    { item: 'Historic Castle', emoji: '🏰', price: 80000000, context: 'Medieval grandeur' },
    { item: 'Private Mountain', emoji: '🏔️', price: 100000000, context: 'Peak ownership' },
    { item: 'Rare Car Collection', emoji: '🚗', price: 150000000, context: 'Pebble Beach garage' },
    { item: 'Racing Stable', emoji: '🏇', price: 150000000, context: 'Derby winners' },
    { item: 'Fashion House', emoji: '👗', price: 200000000, context: 'Own the runway' },
    { item: 'Art Collection', emoji: '🎨', price: 200000000, context: 'Museum-worthy' },
    { item: 'Golf Course Empire', emoji: '⛳', price: 200000000, context: 'Links worldwide' },
    { item: 'Film Studio', emoji: '🎬', price: 300000000, context: 'Make blockbusters' },
    { item: 'Casino Resort', emoji: '🎰', price: 400000000, context: 'House always wins' },
    { item: 'Ski Resort', emoji: '🎿', price: 500000000, context: 'Mountain empire' },
    
    // === BILLIONAIRE TIER ($500M+) ===
    { item: 'Private Jet Fleet', emoji: '✈️', price: 500000000, context: 'Jets for every mood' },
    { item: 'Airline', emoji: '🛫', price: 600000000, context: 'Your own fleet' },
    { item: 'NHL Team', emoji: '🏒', price: 750000000, context: 'Ice kings' },
    { item: 'Soccer Club', emoji: '⚽', price: 800000000, context: 'European royalty' },
    { item: 'Space Station Module', emoji: '🛰️', price: 1000000000, context: 'Orbital real estate' },
    { item: 'Theme Park', emoji: '🎢', price: 1000000000, context: 'Your own Disney' },
    { item: 'F1 Racing Team', emoji: '🏎️', price: 1200000000, context: 'Grand Prix glory' },
    { item: 'Skyscraper', emoji: '🏗️', price: 1500000000, context: 'Name on skyline' },
    { item: 'MLB Team', emoji: '⚾', price: 2000000000, context: 'Baseball empire' },
    { item: 'NBA Team', emoji: '🏀', price: 2500000000, context: 'Courtside forever' },
    { item: 'NFL Team', emoji: '🏈', price: 4000000000, context: 'Own the game' },
  ],
};

// Shuffle array using Fisher-Yates algorithm for variety
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface EnhancedComparison extends Comparison {
  context: string;
  period: 'week' | 'month' | 'year';
}

export const generateMogulComparisons = (annualEarnings: number): EnhancedComparison[] => {
  const breakdown = calculateEarningsBreakdown(annualEarnings);
  const results: EnhancedComparison[] = [];

  const timeframes: { period: 'week' | 'month' | 'year'; earnings: number; label: string }[] = [
    { period: 'week', earnings: breakdown.perWeek, label: 'In a week' },
    { period: 'month', earnings: breakdown.perMonth, label: 'In a month' },
    { period: 'year', earnings: breakdown.perYear, label: 'In a year' },
  ];

  for (const tf of timeframes) {
    // Shuffle items each time for variety
    const items = shuffleArray(mogulItems[tf.period]);
    
    // Find affordable items and pick one with good drama score
    const affordable = items
      .map(item => ({
        ...item,
        quantity: Math.floor(tf.earnings / item.price),
        score: Math.min(Math.floor(tf.earnings / item.price), 50) * (item.price / 1000000)
      }))
      .filter(item => item.quantity >= 1)
      .sort((a, b) => b.score - a.score);
    
    // Pick from top 5 randomly for variety instead of always #1
    if (affordable.length > 0) {
      const topItems = affordable.slice(0, Math.min(5, affordable.length));
      const selected = topItems[Math.floor(Math.random() * topItems.length)];
      results.push({
        ...selected,
        timeframe: tf.label,
        period: tf.period,
      });
    } else {
      // If can't afford any, use cheapest with quantity 1
      const cheapest = items.reduce((a, b) => a.price < b.price ? a : b);
      const quantity = Math.floor(tf.earnings / cheapest.price);
      if (quantity >= 1) {
        results.push({
          ...cheapest,
          quantity,
          timeframe: tf.label,
          period: tf.period,
        });
      }
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
  
  // Shuffle for variety each time
  const eliteItems = shuffleArray(mogulItems.year);
  
  // Find affordable items with good drama scores
  const affordable = eliteItems
    .map(item => ({
      ...item,
      quantity: Math.floor(fiveYearEarnings / item.price),
      score: Math.min(Math.floor(fiveYearEarnings / item.price), 20) * (item.price / 1000000)
    }))
    .filter(item => item.quantity >= 1)
    .sort((a, b) => b.score - a.score);
  
  if (affordable.length === 0) return null;
  
  // Pick from top 5 randomly for variety
  const topItems = affordable.slice(0, Math.min(5, affordable.length));
  const selected = topItems[Math.floor(Math.random() * topItems.length)];
  
  return {
    ...selected,
    timeframe: 'In 5 years',
    period: 'year' as const,
  };
};
