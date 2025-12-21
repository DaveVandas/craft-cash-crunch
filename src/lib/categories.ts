import { CategoryInfo } from './types';

export const categories: CategoryInfo[] = [
  {
    id: 'athletes',
    name: 'Athletes',
    icon: '🏆',
    description: 'NBA, NFL, Soccer & more',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'hollywood',
    name: 'Hollywood',
    icon: '🎬',
    description: 'Actors & Directors',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'musicians',
    name: 'Musicians',
    icon: '🎵',
    description: 'Pop stars & legends',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'tech-billionaires',
    name: 'Tech Billionaires',
    icon: '💻',
    description: 'Silicon Valley elite',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'politicians',
    name: 'Politicians',
    icon: '🏛️',
    description: 'World leaders',
    gradient: 'from-slate-500 to-slate-700'
  },
  {
    id: 'influencers',
    name: 'Influencers',
    icon: '📱',
    description: 'Social media stars',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'historical',
    name: 'Historical',
    icon: '📜',
    description: 'Adjusted for inflation',
    gradient: 'from-amber-600 to-yellow-500'
  },
  {
    id: 'royalty',
    name: 'Royalty',
    icon: '👑',
    description: 'Kings, queens & princes',
    gradient: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'business-titans',
    name: 'Business Titans',
    icon: '💼',
    description: 'CEOs & investors',
    gradient: 'from-indigo-500 to-purple-600'
  }
];

export const getCategoryById = (id: string): CategoryInfo | undefined => {
  return categories.find(cat => cat.id === id);
};
