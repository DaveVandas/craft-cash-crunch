import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pluralize item names properly for mogul-level luxury items
export function pluralizeItem(item: string, quantity: number): string {
  if (quantity <= 1) return item;
  
  // Comprehensive luxury item plurals
  const irregulars: Record<string, string> = {
    // Watches
    'Rolex': 'Rolexes',
    'Rolex Daytona': 'Rolex Daytonas',
    'Patek Philippe': 'Patek Philippes',
    'Audemars Piguet': 'Audemars Piguets',
    'Richard Mille': 'Richard Milles',
    'Omega Speedmaster': 'Omega Speedmasters',
    
    // Cars - Italian
    'Ferrari': 'Ferraris',
    'Ferrari Roma': 'Ferrari Romas',
    'Ferrari California': 'Ferrari Californias',
    'Ferrari LaFerrari': 'Ferrari LaFerraris',
    'Lamborghini': 'Lamborghinis',
    'Lamborghini Huracán': 'Lamborghini Huracáns',
    'Lamborghini Aventador': 'Lamborghini Aventadors',
    'Lamborghini Urus': 'Lamborghini Uruses',
    'Pagani Huayra': 'Pagani Huayras',
    
    // Cars - German
    'Porsche 911': 'Porsche 911s',
    'Porsche 911 Turbo': 'Porsche 911 Turbos',
    'Mercedes-AMG GT': 'Mercedes-AMG GTs',
    'G-Wagon': 'G-Wagons',
    'Range Rover SVA': 'Range Rover SVAs',
    
    // Cars - British
    'Bentley Continental': 'Bentley Continentals',
    'McLaren 720S': 'McLaren 720Ss',
    'Aston Martin DB11': 'Aston Martin DB11s',
    'Rolls-Royce Ghost': 'Rolls-Royce Ghosts',
    'Rolls-Royce Phantom': 'Rolls-Royce Phantoms',
    'Rolls-Royce Cullinan': 'Rolls-Royce Cullinans',
    
    // Hypercars
    'Bugatti Chiron': 'Bugatti Chirons',
    'Koenigsegg Jesko': 'Koenigsegg Jeskos',
    
    // Electric
    'Tesla Model S': 'Tesla Model Ss',
    'Tesla Model X': 'Tesla Model Xs',
    
    // Bags & Fashion
    'Hermès Birkin': 'Hermès Birkins',
    'Chanel Handbag': 'Chanel Handbags',
    'Louis Vuitton Trunk': 'Louis Vuitton Trunks',
    'Cartier Love Bracelet': 'Cartier Love Bracelets',
    
    // Property
    'Penthouse': 'Penthouses',
    'Mansion': 'Mansions',
    'Beach House': 'Beach Houses',
    'Beach Condo': 'Beach Condos',
    'Condo': 'Condos',
    'Lake House': 'Lake Houses',
    'Mountain Chalet': 'Mountain Chalets',
    'Mountain Cabin': 'Mountain Cabins',
    'Ranch': 'Ranches',
    'Malibu Compound': 'Malibu Compounds',
    'Malibu Estate': 'Malibu Estates',
    'Beverly Hills Mansion': 'Beverly Hills Mansions',
    'Beverly Hills Estate': 'Beverly Hills Estates',
    'Bel Air Estate': 'Bel Air Estates',
    'Miami Mansion': 'Miami Mansions',
    'Dubai Penthouse': 'Dubai Penthouses',
    'Private Island': 'Private Islands',
    'Historic Castle': 'Historic Castles',
    'Private Mountain': 'Private Mountains',
    
    // Boats & Aircraft
    'Yacht': 'Yachts',
    'Superyacht': 'Superyachts',
    'Mega Yacht': 'Mega Yachts',
    'Boat': 'Boats',
    'Jet Ski': 'Jet Skis',
    'Helicopter': 'Helicopters',
    'Private Jet': 'Private Jets',
    'Gulfstream Jet': 'Gulfstream Jets',
    'Gulfstream G650': 'Gulfstream G650s',
    'G650 Jet': 'G650 Jets',
    'Small Plane': 'Small Planes',
    'Airbus Private Jet': 'Airbus Private Jets',
    
    // Other Luxury
    'Vineyard': 'Vineyards',
    'Winery': 'Wineries',
    'Classic Ferrari': 'Classic Ferraris',
    'Rare Car Collection': 'Rare Car Collections',
    'Racing Stable': 'Racing Stables',
    'Fashion House': 'Fashion Houses',
    'Art Collection': 'Art Collections',
    'Golf Course Empire': 'Golf Course Empires',
    'Film Studio': 'Film Studios',
    'Casino Resort': 'Casino Resorts',
    'Ski Resort': 'Ski Resorts',
    'Private Jet Fleet': 'Private Jet Fleets',
    'Airline': 'Airlines',
    'NHL Team': 'NHL Teams',
    'Soccer Club': 'Soccer Clubs',
    'Space Station Module': 'Space Station Modules',
    'Theme Park': 'Theme Parks',
    'F1 Racing Team': 'F1 Racing Teams',
    'Skyscraper': 'Skyscrapers',
    'MLB Team': 'MLB Teams',
    'NBA Team': 'NBA Teams',
    'NFL Team': 'NFL Teams',
  };
  
  // Check for exact match first
  if (irregulars[item]) return irregulars[item];
  
  // Check for partial matches
  for (const [singular, plural] of Object.entries(irregulars)) {
    if (item.includes(singular)) {
      return item.replace(singular, plural);
    }
  }
  
  // Default pluralization rules
  if (item.endsWith('y') && !['ey', 'ay', 'oy', 'uy'].some(v => item.endsWith(v))) {
    return item.slice(0, -1) + 'ies';
  }
  if (item.endsWith('s') || item.endsWith('x') || item.endsWith('ch') || item.endsWith('sh')) {
    return item + 'es';
  }
  return item + 's';
}
