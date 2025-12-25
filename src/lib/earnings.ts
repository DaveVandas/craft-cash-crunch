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
    // === ACCESSIBLE TIER ($500 - $10,000) ===
    // Great for $50K-$500K earners
    { item: 'iPhone Pro Max', emoji: '📱', price: 1200, context: 'Latest flagship' },
    { item: 'MacBook Pro', emoji: '💻', price: 2500, context: 'M3 Max power' },
    { item: 'Designer Sneakers', emoji: '👟', price: 800, context: 'Limited edition kicks' },
    { item: 'Weekend Spa Retreat', emoji: '💆', price: 1500, context: 'Luxury wellness escape' },
    { item: 'Fine Dining Experience', emoji: '🍽️', price: 500, context: 'Michelin-star meal' },
    { item: 'Concert VIP Package', emoji: '🎤', price: 2000, context: 'Front row seats + backstage' },
    { item: 'Designer Sunglasses', emoji: '🕶️', price: 600, context: 'Tom Ford or Gucci' },
    { item: 'AirPods Max', emoji: '🎧', price: 550, context: 'Premium audio' },
    { item: 'Weekend Vegas Trip', emoji: '🎰', price: 3000, context: 'Suite + shows' },
    { item: 'Golf Club Set', emoji: '⛳', price: 4000, context: 'Pro-level irons' },
    { item: 'Home Gym Equipment', emoji: '🏋️', price: 5000, context: 'Peloton + weights' },
    { item: 'Designer Handbag', emoji: '👜', price: 3500, context: 'Louis Vuitton or Chanel' },
    { item: 'Smart Watch', emoji: '⌚', price: 1200, context: 'Apple Watch Ultra' },
    { item: 'Electric Bike', emoji: '🚴', price: 6000, context: 'Premium e-bike' },
    { item: 'Luxury Mattress', emoji: '🛏️', price: 5000, context: 'Best sleep ever' },
    { item: 'Home Office Setup', emoji: '🖥️', price: 4000, context: 'Desk + monitor + chair' },
    { item: 'Ski Trip Weekend', emoji: '⛷️', price: 3500, context: 'Lift tickets + lodge' },
    { item: 'Drone', emoji: '🛸', price: 2000, context: 'DJI Pro model' },
    { item: 'Camera Kit', emoji: '📷', price: 4500, context: 'Sony or Canon pro setup' },
    { item: 'Wine Collection', emoji: '🍷', price: 2500, context: '12 premium bottles' },
    
    // === MID TIER ($10,000 - $50,000) ===
    { item: 'Rolex Submariner', emoji: '⌚', price: 15000, context: 'Iconic diver watch' },
    { item: 'Used Porsche', emoji: '🏎️', price: 45000, context: 'Certified pre-owned' },
    { item: 'Luxury Vacation', emoji: '✈️', price: 15000, context: 'Week in Maldives' },
    { item: 'Home Renovation', emoji: '🏠', price: 30000, context: 'Kitchen remodel' },
    { item: 'Jet Ski', emoji: '🌊', price: 18000, context: 'Personal watercraft' },
    { item: 'Hot Tub', emoji: '🛁', price: 12000, context: 'Backyard luxury' },
    { item: 'Custom Suit Collection', emoji: '🤵', price: 10000, context: 'Bespoke tailoring' },
    { item: 'Engagement Ring', emoji: '💍', price: 25000, context: '1.5 carat diamond' },
    { item: 'ATV', emoji: '🏍️', price: 15000, context: 'Off-road adventure' },
    { item: 'Boat', emoji: '⛵', price: 35000, context: 'Entry-level sailboat' },
    { item: 'Omega Speedmaster', emoji: '⌚', price: 8000, context: 'Moonwatch legacy' },
    { item: 'Private Chef (Month)', emoji: '👨‍🍳', price: 12000, context: 'In-home dining' },
    { item: 'Home Security System', emoji: '🔐', price: 15000, context: 'Full smart security' },
    { item: 'Solar Panels', emoji: '☀️', price: 25000, context: 'Energy independence' },
    { item: 'Pool Installation', emoji: '🏊', price: 45000, context: 'Backyard oasis' },
    
    // === LUXURY TIER ($50,000 - $200,000) ===
    { item: 'Tesla Model S', emoji: '⚡', price: 90000, context: 'Plaid performance' },
    { item: 'Rolex Daytona', emoji: '🏆', price: 75000, context: 'The racing legend' },
    { item: 'Patek Philippe', emoji: '💎', price: 80000, context: 'Generational wealth on wrist' },
    { item: 'Louis Vuitton Trunk', emoji: '🧳', price: 80000, context: 'Bespoke luxury' },
    { item: 'Chopard L.U.C', emoji: '🎯', price: 95000, context: 'Swiss precision' },
    { item: 'Smart Home System', emoji: '🏠', price: 100000, context: 'AI-powered living' },
    { item: 'Chanel Haute Couture', emoji: '👗', price: 100000, context: 'Custom runway piece' },
    { item: 'Cartier Necklace', emoji: '💎', price: 100000, context: 'Timeless elegance' },
    { item: 'Hermès Birkin', emoji: '👜', price: 120000, context: 'Rarer than gold' },
    { item: 'Luxury Bathroom', emoji: '🛁', price: 120000, context: 'Spa-level retreat' },
    { item: 'Audemars Piguet', emoji: '⏱️', price: 150000, context: 'Royal Oak prestige' },
    { item: 'Bvlgari Serpenti', emoji: '🐍', price: 150000, context: 'Iconic snake design' },
    { item: 'Wine Cellar Collection', emoji: '🍷', price: 150000, context: '1000 rare bottles' },
    { item: 'Tennis Court', emoji: '🎾', price: 150000, context: 'Grand slam surface' },
    { item: 'Bowling Alley', emoji: '🎳', price: 175000, context: 'In-home lanes' },
    { item: 'Infinity Pool', emoji: '🏊', price: 180000, context: 'Vanishing edge luxury' },
    { item: 'Mercedes-AMG GT', emoji: '🌟', price: 180000, context: 'German precision' },
    { item: 'Chopard Earrings', emoji: '✨', price: 180000, context: 'Red carpet ready' },
    { item: 'Maybach S-Class', emoji: '🖤', price: 185000, context: 'Executive luxury' },
    
    // === ULTRA LUXURY TIER ($200,000+) ===
    { item: 'Tesla Roadster', emoji: '⚡', price: 200000, context: '0-60 in 1.9 seconds' },
    { item: 'Steinway Grand Piano', emoji: '🎹', price: 200000, context: 'Concert quality' },
    { item: 'Chef Kitchen', emoji: '👨‍🍳', price: 200000, context: 'Michelin-ready setup' },
    { item: 'Patek Nautilus', emoji: '⚓', price: 200000, context: 'Waitlist only' },
    { item: 'Van Cleef Set', emoji: '✨', price: 200000, context: 'Alhambra collection' },
    { item: 'Porsche 911 GT3 RS', emoji: '⚡', price: 225000, context: 'Track-ready beast' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 250000, context: 'Italian excellence' },
    { item: 'Bentley Continental', emoji: '🎩', price: 250000, context: 'Old money energy' },
    { item: 'Range Rover SVA', emoji: '🦁', price: 250000, context: 'Blacked out power' },
    { item: 'Richard Mille Watch', emoji: '⌚', price: 250000, context: 'Worn by champions' },
    { item: 'Home Theater', emoji: '🎬', price: 250000, context: 'IMAX at home' },
    { item: 'McLaren 720S', emoji: '🏎️', price: 300000, context: 'British engineering perfection' },
    { item: 'Harry Winston Ring', emoji: '💍', price: 300000, context: 'King of diamonds' },
    { item: 'Indoor Basketball Court', emoji: '🏀', price: 300000, context: 'Pro training at home' },
    { item: 'Aston Martin DBS', emoji: '🔥', price: 320000, context: 'James Bond approved' },
    { item: 'G-Wagon Brabus', emoji: '💪', price: 400000, context: 'Military meets luxury' },
    { item: 'Rolex Rainbow Daytona', emoji: '🌈', price: 450000, context: 'Gem-set legend' },
    { item: 'Rolls-Royce Phantom', emoji: '👑', price: 500000, context: 'The ultimate status symbol' },
    { item: 'Lamborghini Aventador', emoji: '🐂', price: 500000, context: 'Raging bull power' },
    { item: 'Ford GT', emoji: '🇺🇸', price: 500000, context: 'American Le Mans legend' },
    { item: 'Jacob & Co Astronomia', emoji: '🌌', price: 500000, context: 'Watch as art' },
    { item: 'Graff Pink Diamond', emoji: '💗', price: 500000, context: 'Rarest pink stone' },
    { item: 'Ferrari SF90', emoji: '🏎️', price: 625000, context: 'Hybrid supercar perfection' },
    { item: 'Tiffany Yellow Diamond', emoji: '💛', price: 750000, context: 'Legendary stone' },
    { item: 'RM 27-04 Tourbillon', emoji: '⌚', price: 1000000, context: 'Rafael Nadal edition' },
    { item: 'Graff Diamonds Watch', emoji: '💠', price: 1200000, context: 'Jeweled time' },
    { item: 'Ferrari LaFerrari', emoji: '🐎', price: 2000000, context: 'Prancing horse perfection' },
    { item: 'Rimac Nevera', emoji: '⚡', price: 2400000, context: 'Electric hypercar king' },
    { item: 'Pagani Huayra', emoji: '🌪️', price: 2800000, context: 'Italian wind god' },
    { item: 'Koenigsegg Jesko', emoji: '🔥', price: 3000000, context: 'Swedish hypercar art' },
    { item: 'Aston Martin Valkyrie', emoji: '⚔️', price: 3200000, context: 'F1 for the road' },
    { item: 'Bugatti Chiron', emoji: '🚀', price: 3300000, context: 'The $3.3M hypercar' },
  ],
  month: [
    // === ACCESSIBLE TIER ($5,000 - $50,000) ===
    // Great for $50K-$200K earners (monthly earnings $4K-$17K)
    { item: 'First Class Flight', emoji: '✈️', price: 8000, context: 'International luxury' },
    { item: 'Luxury Watch', emoji: '⌚', price: 5000, context: 'Tag Heuer or Tudor' },
    { item: 'Designer Wardrobe', emoji: '👔', price: 10000, context: 'Complete refresh' },
    { item: 'Home Appliances', emoji: '🏠', price: 8000, context: 'All new everything' },
    { item: 'Caribbean Cruise', emoji: '🚢', price: 6000, context: 'Week at sea' },
    { item: 'Personal Trainer (Year)', emoji: '💪', price: 12000, context: 'Elite coaching' },
    { item: 'Landscaping Project', emoji: '🌳', price: 15000, context: 'Backyard transformation' },
    { item: 'Gaming Setup', emoji: '🎮', price: 8000, context: 'RTX 4090 + ultrawide' },
    { item: 'European Vacation', emoji: '🗼', price: 12000, context: 'Two weeks abroad' },
    { item: 'Used BMW', emoji: '🚗', price: 35000, context: 'Certified pre-owned' },
    { item: 'Jewelry Set', emoji: '💎', price: 15000, context: 'Diamond studs + pendant' },
    { item: 'Home Gym', emoji: '🏋️', price: 20000, context: 'Commercial equipment' },
    { item: 'Private Tutor (Year)', emoji: '📚', price: 25000, context: 'SAT prep or MBA coach' },
    { item: 'Wedding Fund', emoji: '💒', price: 40000, context: 'Dream ceremony' },
    { item: 'Bathroom Remodel', emoji: '🛁', price: 25000, context: 'Spa-inspired upgrade' },
    
    // === MID TIER ($50,000 - $500,000) ===
    // For $200K-$1M earners
    { item: 'Tesla Model X', emoji: '🚗', price: 100000, context: 'Family luxury EV' },
    { item: 'Starter Home', emoji: '🏡', price: 350000, context: 'Your first property' },
    { item: 'Condo Downtown', emoji: '🏢', price: 450000, context: 'City living' },
    { item: 'Rental Property', emoji: '🏘️', price: 300000, context: 'Passive income' },
    { item: 'Used Porsche 911', emoji: '🏎️', price: 120000, context: 'Dream car acquired' },
    { item: 'Yacht Share', emoji: '⛵', price: 150000, context: 'Fractional ownership' },
    { item: 'Home Addition', emoji: '🏠', price: 200000, context: 'Extra bedroom + bath' },
    { item: 'World Tour', emoji: '🌍', price: 75000, context: '6 months of travel' },
    { item: 'Restaurant Franchise', emoji: '🍔', price: 400000, context: 'Fast food empire start' },
    { item: 'Boat', emoji: '🛥️', price: 250000, context: 'Cabin cruiser' },
    { item: 'Ferrari California', emoji: '🏎️', price: 250000, context: 'Grand touring' },
    { item: 'Kids College Fund', emoji: '🎓', price: 300000, context: '4-year tuition covered' },
    { item: 'Beach Condo', emoji: '🏖️', price: 400000, context: 'Vacation property' },
    { item: 'Food Truck Fleet', emoji: '🚚', price: 150000, context: 'Mobile restaurant' },
    
    // === LUXURY TIER ($500,000 - $5,000,000) ===
    { item: 'Luxury SUV Fleet', emoji: '🚙', price: 500000, context: 'His, hers, and backup' },
    { item: 'Beach House', emoji: '🏖️', price: 1500000, context: 'Oceanfront retreat' },
    { item: 'Lamborghini Urus', emoji: '🦁', price: 250000, context: 'Super SUV' },
    { item: 'Lake House', emoji: '🏞️', price: 800000, context: 'Waterfront escape' },
    { item: 'Mountain Cabin', emoji: '🏔️', price: 600000, context: 'Ski-in ski-out' },
    { item: 'Small Plane', emoji: '🛩️', price: 500000, context: 'Cessna Citation' },
    { item: 'Classic Car', emoji: '🚗', price: 750000, context: 'Vintage Ferrari' },
    { item: 'Art Piece', emoji: '🎨', price: 1000000, context: 'Gallery-worthy' },
    { item: 'Ranch', emoji: '🤠', price: 2000000, context: '100-acre spread' },
    { item: 'Franchise Portfolio', emoji: '🏪', price: 1500000, context: '5 locations' },
    { item: 'Yacht', emoji: '⛵', price: 2000000, context: '50-foot cruiser' },
    { item: 'Penthouse', emoji: '🏙️', price: 3000000, context: 'City skyline views' },
    { item: 'Helicopter', emoji: '🚁', price: 3000000, context: 'Skip the traffic' },
    { item: 'Truffle Farm', emoji: '🍄', price: 4000000, context: 'Black gold agriculture' },
    { item: 'Golf Simulator Complex', emoji: '⛳', price: 3000000, context: 'Indoor 18 holes' },
    
    // === ULTRA LUXURY TIER ($5,000,000+) ===
    { item: 'Vineyard Estate', emoji: '🍷', price: 5000000, context: 'Make your own wine' },
    { item: 'Recording Studio', emoji: '🎵', price: 5000000, context: 'Grammy-winning setup' },
    { item: 'Exotic Zoo', emoji: '🦁', price: 5000000, context: 'Personal wildlife' },
    { item: 'Amphibious Plane', emoji: '🛩️', price: 5000000, context: 'Land anywhere' },
    { item: 'Luxury Spa', emoji: '💆', price: 6000000, context: 'Wellness empire' },
    { item: 'Restaurant Empire', emoji: '🍽️', price: 7000000, context: 'Michelin-star chain' },
    { item: 'Winery', emoji: '🍇', price: 8000000, context: 'Napa Valley estate' },
    { item: 'Watch Collection', emoji: '⌚', price: 8000000, context: '100 rare timepieces' },
    { item: 'Safari Lodge', emoji: '🦒', price: 8000000, context: 'African luxury' },
    { item: 'Santorini Retreat', emoji: '🇬🇷', price: 8000000, context: 'Aegean sunsets' },
    { item: 'Luxury Penthouse', emoji: '🌃', price: 10000000, context: 'Top floor living' },
    { item: 'Nightclub', emoji: '🪩', price: 10000000, context: 'Own the night' },
    { item: 'Art Gallery', emoji: '🎨', price: 10000000, context: 'Private museum' },
    { item: 'Whiskey Distillery', emoji: '🥃', price: 10000000, context: 'Aged to perfection' },
    { item: 'Horse Ranch', emoji: '🐎', price: 12000000, context: 'Kentucky bluegrass' },
    { item: 'Racing Yacht', emoji: '⛵', price: 12000000, context: 'Americas Cup ready' },
    { item: 'Private Island', emoji: '🏝️', price: 15000000, context: 'Your own paradise' },
    { item: 'Car Collection', emoji: '🚗', price: 15000000, context: '50 exotic cars' },
    { item: 'Polo Club', emoji: '🐴', price: 15000000, context: 'Royal sport' },
    { item: 'Yacht Club Membership', emoji: '⛵', price: 15000000, context: 'Lifetime access' },
    { item: 'Champagne House', emoji: '🍾', price: 15000000, context: 'French bubbles empire' },
    { item: 'Art Masterpiece', emoji: '🖼️', price: 20000000, context: 'Museum-worthy piece' },
    { item: 'St. Tropez Villa', emoji: '☀️', price: 20000000, context: 'Riviera glamour' },
    { item: 'Aspen Ski Chalet', emoji: '⛷️', price: 20000000, context: 'Mountain luxury' },
    { item: 'Diamond Mine Stake', emoji: '💎', price: 20000000, context: 'Rock solid investment' },
    { item: 'Beach Mansion', emoji: '🏖️', price: 25000000, context: 'Oceanfront estate' },
    { item: 'Lake Como Villa', emoji: '🏔️', price: 25000000, context: 'Italian lakefront' },
    { item: 'Private Jet', emoji: '✈️', price: 25000000, context: 'Bombardier Global' },
    { item: 'Malibu Compound', emoji: '🌊', price: 30000000, context: 'Pacific paradise' },
    { item: 'Expedition Yacht', emoji: '🚢', price: 30000000, context: 'Arctic-ready vessel' },
    { item: 'Miami Mansion', emoji: '🌴', price: 35000000, context: 'Star Island vibes' },
    { item: 'Dubai Penthouse', emoji: '🏗️', price: 35000000, context: 'Burj views' },
    { item: 'Palm Beach Mansion', emoji: '🌺', price: 35000000, context: 'Florida gold coast' },
    { item: 'Bombardier Jet', emoji: '🛩️', price: 35000000, context: 'Global 7500' },
    { item: 'Monaco Apartment', emoji: '🎰', price: 40000000, context: 'Tax haven living' },
    { item: 'London Townhouse', emoji: '🇬🇧', price: 40000000, context: 'Kensington luxury' },
    { item: 'Luxury Submarine', emoji: '🛟', price: 40000000, context: 'Ocean explorer' },
    { item: 'Hamptons Estate', emoji: '🏡', price: 45000000, context: 'Summer retreat' },
    { item: 'Park Avenue Duplex', emoji: '🗽', price: 45000000, context: 'Upper East Side' },
    { item: 'Penthouse NYC', emoji: '🏙️', price: 50000000, context: 'Billionaire\'s Row views' },
    { item: 'Beverly Hills Mansion', emoji: '🌟', price: 55000000, context: 'Hollywood royalty' },
    { item: 'Bel Air Estate', emoji: '🌴', price: 60000000, context: 'Gates of paradise' },
    { item: 'Gulfstream G650', emoji: '✈️', price: 65000000, context: 'Ultimate private jet' },
    { item: 'Mega Yacht', emoji: '🛥️', price: 75000000, context: '200ft floating palace' },
    { item: 'Airbus ACJ320', emoji: '✈️', price: 80000000, context: 'Flying mansion' },
  ],
  year: [
    // === ACCESSIBLE TIER ($50,000 - $500,000) ===
    // For $50K-$500K annual earners
    { item: 'Used Tesla', emoji: '⚡', price: 50000, context: 'Model 3 Long Range' },
    { item: 'Kitchen Remodel', emoji: '🍳', price: 60000, context: 'Dream cooking space' },
    { item: 'Backyard Oasis', emoji: '🌴', price: 75000, context: 'Pool + landscaping' },
    { item: 'New BMW', emoji: '🚗', price: 80000, context: '5 Series luxury' },
    { item: 'Rolex Collection', emoji: '⌚', price: 100000, context: 'Three iconic pieces' },
    { item: 'Mercedes S-Class', emoji: '🌟', price: 120000, context: 'Flagship sedan' },
    { item: 'Home Renovation', emoji: '🏠', price: 150000, context: 'Complete transformation' },
    { item: 'Vacation Home Down Payment', emoji: '🏖️', price: 200000, context: 'Second property start' },
    { item: 'Porsche 911', emoji: '🏎️', price: 180000, context: 'Icon achieved' },
    { item: 'Investment Portfolio', emoji: '📈', price: 250000, context: 'Diversified wealth' },
    { item: 'Home Addition', emoji: '🏗️', price: 300000, context: 'Major expansion' },
    { item: 'Tesla Model S Plaid', emoji: '⚡', price: 130000, context: 'Fastest sedan' },
    { item: 'Luxury RV', emoji: '🚐', price: 250000, context: 'Class A motorhome' },
    { item: 'Small Business', emoji: '🏪', price: 300000, context: 'Your own store' },
    { item: 'Yacht Share', emoji: '⛵', price: 150000, context: 'Fractional ownership' },
    { item: 'Ferrari California', emoji: '🏎️', price: 250000, context: 'Grand touring' },
    { item: 'Kids Education Fund', emoji: '🎓', price: 400000, context: 'K-12 private school' },
    { item: 'Lamborghini Huracán', emoji: '🏁', price: 300000, context: 'Exotic ownership' },
    { item: 'Bentley Bentayga', emoji: '🎩', price: 250000, context: 'Luxury SUV' },
    { item: 'McLaren GT', emoji: '🏎️', price: 250000, context: 'Grand touring' },
    
    // === MID TIER ($500,000 - $5,000,000) ===
    { item: 'Ferrari Roma', emoji: '🐎', price: 250000, context: 'Modern classic' },
    { item: 'Rolls-Royce Ghost', emoji: '👻', price: 350000, context: 'Refined luxury' },
    { item: 'Beach Condo', emoji: '🏖️', price: 500000, context: 'Ocean retreat' },
    { item: 'Mountain Retreat', emoji: '⛰️', price: 800000, context: 'Ski property' },
    { item: 'Small Yacht', emoji: '⛵', price: 1000000, context: '40-foot cruiser' },
    { item: 'Classic Car', emoji: '🚗', price: 750000, context: 'Vintage Ferrari' },
    { item: 'Rolls-Royce Cullinan', emoji: '👑', price: 400000, context: 'King of SUVs' },
    { item: 'Ranch Property', emoji: '🤠', price: 1500000, context: '50 acres' },
    { item: 'Art Collection Start', emoji: '🎨', price: 500000, context: 'Emerging artists' },
    { item: 'Wine Collection', emoji: '🍷', price: 500000, context: 'Investment-grade bottles' },
    { item: 'Private Office', emoji: '🏢', price: 2000000, context: 'Commercial space' },
    { item: 'Exotic Car Collection', emoji: '🚗', price: 2500000, context: '5 supercars' },
    { item: 'Yacht', emoji: '🛥️', price: 3000000, context: '60-foot luxury' },
    { item: 'Penthouse', emoji: '🏙️', price: 4000000, context: 'City skyline living' },
    { item: 'Horse Farm', emoji: '🐴', price: 3500000, context: 'Equestrian estate' },
    
    // === LUXURY TIER ($5,000,000 - $100,000,000) ===
    { item: 'Luxury Yacht', emoji: '🛥️', price: 10000000, context: '80-foot vessel' },
    { item: 'Manhattan Apartment', emoji: '🗽', price: 8000000, context: 'Upper East Side' },
    { item: 'Private Plane', emoji: '🛩️', price: 5000000, context: 'King Air' },
    { item: 'Vineyard', emoji: '🍇', price: 15000000, context: 'Wine country estate' },
    { item: 'Malibu Home', emoji: '🌊', price: 12000000, context: 'Pacific views' },
    { item: 'Art Masterpiece', emoji: '🖼️', price: 20000000, context: 'Blue chip artist' },
    { item: 'Race Horse Stable', emoji: '🏇', price: 25000000, context: 'Derby contenders' },
    { item: 'Private Island', emoji: '🏝️', price: 30000000, context: 'Caribbean paradise' },
    { item: 'G550 Jet', emoji: '✈️', price: 50000000, context: 'Long-range luxury' },
    { item: 'Superyacht', emoji: '🛥️', price: 75000000, context: '150-foot vessel' },
    { item: 'Historic Castle', emoji: '🏰', price: 75000000, context: 'Medieval grandeur' },
    { item: 'Beverly Hills Estate', emoji: '🌴', price: 60000000, context: 'A-list neighbors' },
    { item: 'Private Mountain', emoji: '🏔️', price: 100000000, context: 'Peak ownership' },
    { item: 'Polo Team', emoji: '🐴', price: 100000000, context: 'Sport of kings' },
    { item: 'Podcast Network', emoji: '🎙️', price: 100000000, context: 'Audio empire' },
    
    // === ULTRA LUXURY TIER ($100,000,000+) ===
    { item: 'Esports Organization', emoji: '🎮', price: 150000000, context: 'Digital dynasty' },
    { item: 'Record Label', emoji: '🎤', price: 150000000, context: 'Sign the next stars' },
    { item: 'Music Venue Chain', emoji: '🎸', price: 150000000, context: 'Concert empire' },
    { item: 'Rare Car Collection', emoji: '🚗', price: 150000000, context: 'Pebble Beach winners' },
    { item: 'Racing Stable', emoji: '🏇', price: 150000000, context: 'Kentucky Derby winners' },
    { item: 'Arctic Research Base', emoji: '❄️', price: 150000000, context: 'Polar exploration' },
    { item: 'Drone Delivery Fleet', emoji: '🛸', price: 150000000, context: 'Sky logistics' },
    { item: 'Ruby Team', emoji: '🏉', price: 200000000, context: 'Championship contender' },
    { item: 'Video Game Studio', emoji: '🕹️', price: 200000000, context: 'AAA game maker' },
    { item: 'Fashion House', emoji: '👗', price: 200000000, context: 'Own the runway' },
    { item: 'Wine Empire', emoji: '🍷', price: 200000000, context: 'Global vineyards' },
    { item: 'Art Collection', emoji: '🎨', price: 200000000, context: 'Museum-worthy pieces' },
    { item: 'Golf Course Empire', emoji: '⛳', price: 200000000, context: 'Links worldwide' },
    { item: 'Marina Complex', emoji: '⚓', price: 200000000, context: 'Yachts welcome' },
    { item: 'Hedge Fund', emoji: '📈', price: 200000000, context: 'Move markets' },
    { item: 'Quantum Computer Lab', emoji: '⚛️', price: 200000000, context: 'Next-gen computing' },
    { item: 'Private Airport', emoji: '✈️', price: 250000000, context: 'Your own runway' },
    { item: 'VR/AR Platform', emoji: '🥽', price: 250000000, context: 'Build the metaverse' },
    { item: 'Desert Oasis Resort', emoji: '🏜️', price: 250000000, context: 'Mirage luxury' },
    { item: 'Film Studio', emoji: '🎬', price: 300000000, context: 'Make blockbusters' },
    { item: 'Watch Manufacture', emoji: '⌚', price: 300000000, context: 'Swiss precision yours' },
    { item: 'Venture Capital Firm', emoji: '💰', price: 300000000, context: 'Back unicorns' },
    { item: 'AI Company', emoji: '🤖', price: 300000000, context: 'Build intelligence' },
    { item: 'Crypto Exchange', emoji: '🪙', price: 300000000, context: 'Own the blockchain' },
    { item: 'Underwater Hotel', emoji: '🐠', price: 300000000, context: 'Ocean living' },
    { item: 'Superyacht Fleet', emoji: '⛵', price: 300000000, context: 'Sail the world' },
    { item: 'Shopping Mall', emoji: '🛍️', price: 300000000, context: 'Retail paradise' },
    { item: 'Beach Resort', emoji: '🏖️', price: 350000000, context: 'Tropical kingdom' },
    { item: 'MLS Team', emoji: '⚽', price: 400000000, context: 'American soccer rise' },
    { item: 'Luxury Hotel Chain', emoji: '🏨', price: 400000000, context: 'Global hospitality' },
    { item: 'Media Empire', emoji: '📺', price: 400000000, context: 'Control the narrative' },
    { item: 'Biotech Firm', emoji: '🧬', price: 400000000, context: 'Cure diseases' },
    { item: 'Jewelry Empire', emoji: '💎', price: 400000000, context: 'Diamonds forever' },
    { item: 'Mining Operation', emoji: '⛏️', price: 400000000, context: 'Earth\'s treasures' },
    { item: 'Casino Resort', emoji: '🎰', price: 500000000, context: 'The house always wins' },
    { item: 'Ski Resort', emoji: '🎿', price: 500000000, context: 'Mountain empire' },
    { item: 'Space Mission', emoji: '🚀', price: 500000000, context: 'Fund your own rocket' },
    { item: 'Electric Car Company', emoji: '🔋', price: 500000000, context: 'Future of transport' },
    { item: 'Private Jet Fleet', emoji: '✈️', price: 500000000, context: 'Jets for every mood' },
    { item: 'Private Bank', emoji: '🏦', price: 500000000, context: 'Manage wealth' },
    { item: 'Shipping Fleet', emoji: '🚢', price: 500000000, context: 'Global logistics' },
    { item: 'Social Media App', emoji: '📲', price: 500000000, context: 'Build the platform' },
    { item: 'News Network', emoji: '📰', price: 500000000, context: 'Shape public opinion' },
    { item: 'Cricket Team IPL', emoji: '🏏', price: 500000000, context: 'Billion viewers' },
    { item: 'Tropical Island Chain', emoji: '🌴', price: 500000000, context: 'Archipelago owner' },
    { item: 'Airline', emoji: '🛫', price: 600000000, context: 'Your own fleet' },
    { item: 'Satellite Network', emoji: '📡', price: 700000000, context: 'Space infrastructure' },
    { item: 'Energy Company', emoji: '⚡', price: 700000000, context: 'Power the world' },
    { item: 'NHL Team', emoji: '🏒', price: 750000000, context: 'Ice kings' },
    { item: 'Soccer Club', emoji: '⚽', price: 800000000, context: 'European football royalty' },
    { item: 'Pharmaceutical Company', emoji: '💊', price: 800000000, context: 'Life-saving empire' },
    { item: 'Urban Development', emoji: '🏘️', price: 800000000, context: 'Build a neighborhood' },
    { item: 'Space Station Module', emoji: '🛰️', price: 1000000000, context: 'Orbital real estate' },
    { item: 'Theme Park', emoji: '🎢', price: 1000000000, context: 'Your own Disney' },
    { item: 'Streaming Platform', emoji: '📱', price: 1000000000, context: 'Next Netflix' },
    { item: 'Telecom Company', emoji: '📶', price: 1000000000, context: 'Connect millions' },
    { item: 'F1 Racing Team', emoji: '🏎️', price: 1200000000, context: 'Grand Prix glory' },
    { item: 'Skyscraper', emoji: '🏗️', price: 1500000000, context: 'Your name on the skyline' },
    { item: 'Luxury Car Brand', emoji: '🚘', price: 1500000000, context: 'Your own marque' },
    { item: 'MLB Team', emoji: '⚾', price: 2000000000, context: 'America\'s pastime' },
    { item: 'NBA Team', emoji: '🏀', price: 2500000000, context: 'Courtside forever' },
    { item: 'NFL Team', emoji: '🏈', price: 4000000000, context: 'Own the game' },
    { item: 'University Endowment', emoji: '🎓', price: 300000000, context: 'Education legacy' },
    { item: 'Concert Hall', emoji: '🎻', price: 200000000, context: 'World-class acoustics' },
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
