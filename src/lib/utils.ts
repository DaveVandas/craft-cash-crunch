import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pluralize item names properly
export function pluralizeItem(item: string, quantity: number): string {
  if (quantity <= 1) return item;
  
  // Irregular plurals map
  const irregulars: Record<string, string> = {
    'Rolex': 'Rolexes',
    'Rolex Watch': 'Rolex Watches',
    'MacBook Pro': 'MacBook Pros',
    'Private Island': 'Private Islands',
    'Yacht': 'Yachts',
    'Private Jet': 'Private Jets',
    'Bugatti Chiron': 'Bugatti Chirons',
    'Ferrari': 'Ferraris',
    'Lamborghini': 'Lamborghinis',
    'Tesla Model S': 'Tesla Model S cars',
    'Louis Vuitton Bag': 'Louis Vuitton Bags',
    'Birkin Bag': 'Birkin Bags',
    'Penthouse': 'Penthouses',
    'Mansion': 'Mansions',
    'Beach House': 'Beach Houses',
    'Picasso Painting': 'Picasso Paintings',
  };
  
  // Check for exact match first
  if (irregulars[item]) return irregulars[item];
  
  // Check for partial matches
  for (const [singular, plural] of Object.entries(irregulars)) {
    if (item.includes(singular)) {
      return item.replace(singular, plural);
    }
  }
  
  // Default: add 's' unless already ends in 's'
  if (item.endsWith('s') || item.endsWith('x') || item.endsWith('ch') || item.endsWith('sh')) {
    return item + 'es';
  }
  return item + 's';
}
