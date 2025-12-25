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

// Ultra-mogul luxury items - MASSIVE library for maximum variety
const mogulItems = {
  week: [
    // Hypercars & Supercars
    { item: 'Bugatti Chiron', emoji: '🚀', price: 3300000, context: 'The $3.3M hypercar' },
    { item: 'Ferrari SF90', emoji: '🏎️', price: 625000, context: 'Hybrid supercar perfection' },
    { item: 'Rolls-Royce Phantom', emoji: '👑', price: 500000, context: 'The ultimate status symbol' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 250000, context: 'Italian excellence' },
    { item: 'McLaren 720S', emoji: '🏎️', price: 300000, context: 'British engineering perfection' },
    { item: 'Aston Martin DBS', emoji: '🔥', price: 320000, context: 'James Bond approved' },
    { item: 'Bentley Continental', emoji: '🎩', price: 250000, context: 'Old money energy' },
    { item: 'Porsche 911 GT3 RS', emoji: '⚡', price: 225000, context: 'Track-ready beast' },
    { item: 'Mercedes-AMG GT', emoji: '🌟', price: 180000, context: 'German precision' },
    { item: 'Tesla Roadster', emoji: '⚡', price: 200000, context: '0-60 in 1.9 seconds' },
    { item: 'Maybach S-Class', emoji: '🖤', price: 185000, context: 'Executive luxury' },
    { item: 'Range Rover SVA', emoji: '🦁', price: 250000, context: 'Blacked out power' },
    { item: 'G-Wagon Brabus', emoji: '💪', price: 400000, context: 'Military meets luxury' },
    { item: 'Koenigsegg Jesko', emoji: '🔥', price: 3000000, context: 'Swedish hypercar art' },
    { item: 'Pagani Huayra', emoji: '🌪️', price: 2800000, context: 'Italian wind god' },
    { item: 'Ferrari LaFerrari', emoji: '🐎', price: 2000000, context: 'Prancing horse perfection' },
    { item: 'Lamborghini Aventador', emoji: '🐂', price: 500000, context: 'Raging bull power' },
    { item: 'Aston Martin Valkyrie', emoji: '⚔️', price: 3200000, context: 'F1 for the road' },
    { item: 'Rimac Nevera', emoji: '⚡', price: 2400000, context: 'Electric hypercar king' },
    { item: 'Ford GT', emoji: '🇺🇸', price: 500000, context: 'American Le Mans legend' },
    // Watches
    { item: 'Richard Mille Watch', emoji: '⌚', price: 250000, context: 'Worn by champions' },
    { item: 'Patek Philippe', emoji: '💎', price: 80000, context: 'Generational wealth on wrist' },
    { item: 'Audemars Piguet', emoji: '⏱️', price: 150000, context: 'Royal Oak prestige' },
    { item: 'Rolex Daytona', emoji: '🏆', price: 75000, context: 'The racing legend' },
    { item: 'Patek Nautilus', emoji: '⚓', price: 200000, context: 'Waitlist only' },
    { item: 'Jacob & Co Astronomia', emoji: '🌌', price: 500000, context: 'Watch as art' },
    { item: 'Graff Diamonds Watch', emoji: '💠', price: 1200000, context: 'Jeweled time' },
    { item: 'Rolex Rainbow Daytona', emoji: '🌈', price: 450000, context: 'Gem-set legend' },
    { item: 'RM 27-04 Tourbillon', emoji: '⌚', price: 1000000, context: 'Rafael Nadal edition' },
    { item: 'Chopard L.U.C', emoji: '🎯', price: 95000, context: 'Swiss precision' },
    // Jewelry & Fashion
    { item: 'Hermès Birkin', emoji: '👜', price: 120000, context: 'Rarer than gold' },
    { item: 'Cartier Necklace', emoji: '💎', price: 100000, context: 'Timeless elegance' },
    { item: 'Van Cleef Set', emoji: '✨', price: 200000, context: 'Alhambra collection' },
    { item: 'Graff Pink Diamond', emoji: '💗', price: 500000, context: 'Rarest pink stone' },
    { item: 'Harry Winston Ring', emoji: '💍', price: 300000, context: 'King of diamonds' },
    { item: 'Bvlgari Serpenti', emoji: '🐍', price: 150000, context: 'Iconic snake design' },
    { item: 'Chanel Haute Couture', emoji: '👗', price: 100000, context: 'Custom runway piece' },
    { item: 'Louis Vuitton Trunk', emoji: '🧳', price: 80000, context: 'Bespoke luxury' },
    { item: 'Tiffany Yellow Diamond', emoji: '💛', price: 750000, context: 'Legendary stone' },
    { item: 'Chopard Earrings', emoji: '✨', price: 180000, context: 'Red carpet ready' },
    // Lifestyle Luxury
    { item: 'Steinway Grand Piano', emoji: '🎹', price: 200000, context: 'Concert quality' },
    { item: 'Wine Cellar Collection', emoji: '🍷', price: 150000, context: '1000 rare bottles' },
    { item: 'Home Theater', emoji: '🎬', price: 250000, context: 'IMAX at home' },
    { item: 'Infinity Pool', emoji: '🏊', price: 180000, context: 'Vanishing edge luxury' },
    { item: 'Smart Home System', emoji: '🏠', price: 100000, context: 'AI-powered living' },
    { item: 'Luxury Bathroom', emoji: '🛁', price: 120000, context: 'Spa-level retreat' },
    { item: 'Chef Kitchen', emoji: '👨‍🍳', price: 200000, context: 'Michelin-ready setup' },
    { item: 'Indoor Basketball Court', emoji: '🏀', price: 300000, context: 'Pro training at home' },
    { item: 'Tennis Court', emoji: '🎾', price: 150000, context: 'Grand slam surface' },
    { item: 'Bowling Alley', emoji: '🎳', price: 175000, context: 'In-home lanes' },
  ],
  month: [
    // Mega Properties
    { item: 'Mega Yacht', emoji: '🛥️', price: 75000000, context: '200ft floating palace' },
    { item: 'Penthouse NYC', emoji: '🏙️', price: 50000000, context: 'Billionaire\'s Row views' },
    { item: 'Private Island', emoji: '🏝️', price: 15000000, context: 'Your own paradise' },
    { item: 'Beach Mansion', emoji: '🏖️', price: 25000000, context: 'Oceanfront estate' },
    { item: 'Luxury Penthouse', emoji: '🌃', price: 10000000, context: 'Top floor living' },
    { item: 'Vineyard Estate', emoji: '🍷', price: 5000000, context: 'Make your own wine' },
    { item: 'Miami Mansion', emoji: '🌴', price: 35000000, context: 'Star Island vibes' },
    { item: 'Aspen Ski Chalet', emoji: '⛷️', price: 20000000, context: 'Mountain luxury' },
    { item: 'Monaco Apartment', emoji: '🎰', price: 40000000, context: 'Tax haven living' },
    { item: 'Malibu Compound', emoji: '🌊', price: 30000000, context: 'Pacific paradise' },
    { item: 'Hamptons Estate', emoji: '🏡', price: 45000000, context: 'Summer retreat' },
    { item: 'Beverly Hills Mansion', emoji: '🌟', price: 55000000, context: 'Hollywood royalty' },
    { item: 'Lake Como Villa', emoji: '🏔️', price: 25000000, context: 'Italian lakefront' },
    { item: 'London Townhouse', emoji: '🇬🇧', price: 40000000, context: 'Kensington luxury' },
    { item: 'Dubai Penthouse', emoji: '🏗️', price: 35000000, context: 'Burj views' },
    { item: 'St. Tropez Villa', emoji: '☀️', price: 20000000, context: 'Riviera glamour' },
    { item: 'Bel Air Estate', emoji: '🌴', price: 60000000, context: 'Gates of paradise' },
    { item: 'Park Avenue Duplex', emoji: '🗽', price: 45000000, context: 'Upper East Side' },
    { item: 'Palm Beach Mansion', emoji: '🌺', price: 35000000, context: 'Florida gold coast' },
    { item: 'Santorini Retreat', emoji: '🇬🇷', price: 8000000, context: 'Aegean sunsets' },
    // Aircraft & Marine
    { item: 'Gulfstream G650', emoji: '✈️', price: 65000000, context: 'Ultimate private jet' },
    { item: 'Helicopter', emoji: '🚁', price: 3000000, context: 'Skip the traffic' },
    { item: 'Private Jet', emoji: '✈️', price: 25000000, context: 'Bombardier Global' },
    { item: 'Bombardier Jet', emoji: '🛩️', price: 35000000, context: 'Global 7500' },
    { item: 'Yacht Club Membership', emoji: '⛵', price: 15000000, context: 'Lifetime access' },
    { item: 'Luxury Submarine', emoji: '🛟', price: 40000000, context: 'Ocean explorer' },
    { item: 'Amphibious Plane', emoji: '🛩️', price: 5000000, context: 'Land anywhere' },
    { item: 'Racing Yacht', emoji: '⛵', price: 12000000, context: 'Americas Cup ready' },
    { item: 'Expedition Yacht', emoji: '🚢', price: 30000000, context: 'Arctic-ready vessel' },
    { item: 'Airbus ACJ320', emoji: '✈️', price: 80000000, context: 'Flying mansion' },
    // Businesses & Experiences
    { item: 'Horse Ranch', emoji: '🐎', price: 12000000, context: 'Kentucky bluegrass' },
    { item: 'Art Masterpiece', emoji: '🖼️', price: 20000000, context: 'Museum-worthy piece' },
    { item: 'Winery', emoji: '🍇', price: 8000000, context: 'Napa Valley estate' },
    { item: 'Recording Studio', emoji: '🎵', price: 5000000, context: 'Grammy-winning setup' },
    { item: 'Nightclub', emoji: '🪩', price: 10000000, context: 'Own the night' },
    { item: 'Restaurant Empire', emoji: '🍽️', price: 7000000, context: 'Michelin-star chain' },
    { item: 'Car Collection', emoji: '🚗', price: 15000000, context: '50 exotic cars' },
    { item: 'Watch Collection', emoji: '⌚', price: 8000000, context: '100 rare timepieces' },
    { item: 'Art Gallery', emoji: '🎨', price: 10000000, context: 'Private museum' },
    { item: 'Exotic Zoo', emoji: '🦁', price: 5000000, context: 'Personal wildlife' },
    { item: 'Luxury Spa', emoji: '💆', price: 6000000, context: 'Wellness empire' },
    { item: 'Polo Club', emoji: '🐴', price: 15000000, context: 'Royal sport' },
    { item: 'Golf Simulator Complex', emoji: '⛳', price: 3000000, context: 'Indoor 18 holes' },
    { item: 'Diamond Mine Stake', emoji: '💎', price: 20000000, context: 'Rock solid investment' },
    { item: 'Truffle Farm', emoji: '🍄', price: 4000000, context: 'Black gold agriculture' },
    { item: 'Whiskey Distillery', emoji: '🥃', price: 10000000, context: 'Aged to perfection' },
    { item: 'Champagne House', emoji: '🍾', price: 15000000, context: 'French bubbles empire' },
    { item: 'Safari Lodge', emoji: '🦒', price: 8000000, context: 'African luxury' },
  ],
  year: [
    // Sports Teams
    { item: 'NFL Team', emoji: '🏈', price: 4000000000, context: 'Own the game' },
    { item: 'NBA Team', emoji: '🏀', price: 2500000000, context: 'Courtside forever' },
    { item: 'MLB Team', emoji: '⚾', price: 2000000000, context: 'America\'s pastime' },
    { item: 'Soccer Club', emoji: '⚽', price: 800000000, context: 'European football royalty' },
    { item: 'NHL Team', emoji: '🏒', price: 750000000, context: 'Ice kings' },
    { item: 'MLS Team', emoji: '⚽', price: 400000000, context: 'American soccer rise' },
    { item: 'F1 Racing Team', emoji: '🏎️', price: 1200000000, context: 'Grand Prix glory' },
    { item: 'Cricket Team IPL', emoji: '🏏', price: 500000000, context: 'Billion viewers' },
    { item: 'Rugby Team', emoji: '🏉', price: 200000000, context: 'Championship contender' },
    { item: 'Esports Organization', emoji: '🎮', price: 150000000, context: 'Digital dynasty' },
    // Real Estate & Infrastructure
    { item: 'Skyscraper', emoji: '🏗️', price: 1500000000, context: 'Your name on the skyline' },
    { item: 'Theme Park', emoji: '🎢', price: 1000000000, context: 'Your own Disney' },
    { item: 'Casino Resort', emoji: '🎰', price: 500000000, context: 'The house always wins' },
    { item: 'Luxury Hotel Chain', emoji: '🏨', price: 400000000, context: 'Global hospitality empire' },
    { item: 'Shopping Mall', emoji: '🛍️', price: 300000000, context: 'Retail paradise' },
    { item: 'Private Airport', emoji: '✈️', price: 250000000, context: 'Your own runway' },
    { item: 'Marina Complex', emoji: '⚓', price: 200000000, context: 'Yachts welcome' },
    { item: 'Ski Resort', emoji: '🎿', price: 500000000, context: 'Mountain empire' },
    { item: 'Beach Resort', emoji: '🏖️', price: 350000000, context: 'Tropical kingdom' },
    { item: 'Urban Development', emoji: '🏘️', price: 800000000, context: 'Build a neighborhood' },
    // Media & Entertainment
    { item: 'Film Studio', emoji: '🎬', price: 300000000, context: 'Make blockbusters' },
    { item: 'Record Label', emoji: '🎤', price: 150000000, context: 'Sign the next stars' },
    { item: 'Fashion House', emoji: '👗', price: 200000000, context: 'Own the runway' },
    { item: 'Media Empire', emoji: '📺', price: 400000000, context: 'Control the narrative' },
    { item: 'News Network', emoji: '📰', price: 500000000, context: 'Shape public opinion' },
    { item: 'Streaming Platform', emoji: '📱', price: 1000000000, context: 'Next Netflix' },
    { item: 'Video Game Studio', emoji: '🕹️', price: 200000000, context: 'AAA game maker' },
    { item: 'Music Venue Chain', emoji: '🎸', price: 150000000, context: 'Concert empire' },
    { item: 'Podcast Network', emoji: '🎙️', price: 100000000, context: 'Audio empire' },
    { item: 'Social Media App', emoji: '📲', price: 500000000, context: 'Build the platform' },
    // Tech & Innovation
    { item: 'Space Mission', emoji: '🚀', price: 500000000, context: 'Fund your own rocket' },
    { item: 'Tech Startup Portfolio', emoji: '💻', price: 100000000, context: 'Fund the future' },
    { item: 'AI Company', emoji: '🤖', price: 300000000, context: 'Build intelligence' },
    { item: 'Crypto Exchange', emoji: '🪙', price: 300000000, context: 'Own the blockchain' },
    { item: 'Satellite Network', emoji: '📡', price: 700000000, context: 'Space infrastructure' },
    { item: 'Biotech Firm', emoji: '🧬', price: 400000000, context: 'Cure diseases' },
    { item: 'Quantum Computer Lab', emoji: '⚛️', price: 200000000, context: 'Next-gen computing' },
    { item: 'Electric Car Company', emoji: '🔋', price: 500000000, context: 'Future of transport' },
    { item: 'Drone Delivery Fleet', emoji: '🛸', price: 150000000, context: 'Sky logistics' },
    { item: 'VR/AR Platform', emoji: '🥽', price: 250000000, context: 'Build the metaverse' },
    // Business & Finance
    { item: 'Hedge Fund', emoji: '📈', price: 200000000, context: 'Move markets' },
    { item: 'Venture Capital Firm', emoji: '💰', price: 300000000, context: 'Back unicorns' },
    { item: 'Private Bank', emoji: '🏦', price: 500000000, context: 'Manage wealth' },
    { item: 'Insurance Company', emoji: '📋', price: 400000000, context: 'Risk empire' },
    { item: 'Shipping Fleet', emoji: '🚢', price: 500000000, context: 'Global logistics' },
    { item: 'Pharmaceutical Company', emoji: '💊', price: 800000000, context: 'Life-saving empire' },
    { item: 'Airline', emoji: '🛫', price: 600000000, context: 'Your own fleet' },
    { item: 'Telecom Company', emoji: '📶', price: 1000000000, context: 'Connect millions' },
    { item: 'Energy Company', emoji: '⚡', price: 700000000, context: 'Power the world' },
    { item: 'Mining Operation', emoji: '⛏️', price: 400000000, context: 'Earth\'s treasures' },
    // Luxury & Lifestyle Empires
    { item: 'Luxury Car Brand', emoji: '🚘', price: 1500000000, context: 'Your own marque' },
    { item: 'Watch Manufacture', emoji: '⌚', price: 300000000, context: 'Swiss precision yours' },
    { item: 'Jewelry Empire', emoji: '💎', price: 400000000, context: 'Diamonds forever' },
    { item: 'Wine Empire', emoji: '🍷', price: 200000000, context: 'Global vineyards' },
    { item: 'Art Collection', emoji: '🎨', price: 200000000, context: 'Museum-worthy pieces' },
    { item: 'Rare Car Collection', emoji: '🚗', price: 150000000, context: 'Pebble Beach winners' },
    { item: 'Private Jet Fleet', emoji: '✈️', price: 500000000, context: 'Jets for every mood' },
    { item: 'Superyacht Fleet', emoji: '⛵', price: 300000000, context: 'Sail the world' },
    { item: 'Polo Team', emoji: '🐴', price: 100000000, context: 'Sport of kings' },
    { item: 'Racing Stable', emoji: '🏇', price: 150000000, context: 'Kentucky Derby winners' },
    // Unique & Exclusive
    { item: 'Space Station Module', emoji: '🛰️', price: 1000000000, context: 'Orbital real estate' },
    { item: 'Underwater Hotel', emoji: '🐠', price: 300000000, context: 'Ocean living' },
    { item: 'Private Mountain', emoji: '🏔️', price: 100000000, context: 'Peak ownership' },
    { item: 'Historic Castle', emoji: '🏰', price: 75000000, context: 'Medieval grandeur' },
    { item: 'Golf Course Empire', emoji: '⛳', price: 200000000, context: 'Links worldwide' },
    { item: 'Desert Oasis Resort', emoji: '🏜️', price: 250000000, context: 'Mirage luxury' },
    { item: 'Arctic Research Base', emoji: '❄️', price: 150000000, context: 'Polar exploration' },
    { item: 'Tropical Island Chain', emoji: '🌴', price: 500000000, context: 'Archipelago owner' },
    { item: 'Concert Hall', emoji: '🎻', price: 200000000, context: 'World-class acoustics' },
    { item: 'University Endowment', emoji: '🎓', price: 300000000, context: 'Education legacy' },
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
