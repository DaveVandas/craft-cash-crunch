import { Category } from './types';

interface SimilarCelebrity {
  name: string;
  netWorth: string;
  hourlyEarnings: string;
  emoji: string;
}

// Category to emoji mapping
const categoryEmojis: Record<string, string> = {
  athletes: '🏆',
  musicians: '🎵',
  'tech-billionaires': '💻',
  hollywood: '🎬',
  influencers: '📱',
  politicians: '🏛️',
  historical: '👑',
};

// Similar celebrities by category
const categorySpotlights: Record<string, SimilarCelebrity[]> = {
  athletes: [
    { name: 'LeBron James', netWorth: '$1.2B', hourlyEarnings: '$14,000/hr', emoji: '🏀' },
    { name: 'Cristiano Ronaldo', netWorth: '$600M', hourlyEarnings: '$17,000/hr', emoji: '⚽' },
    { name: 'Lionel Messi', netWorth: '$650M', hourlyEarnings: '$18,000/hr', emoji: '⚽' },
    { name: 'Stephen Curry', netWorth: '$200M', hourlyEarnings: '$6,500/hr', emoji: '🏀' },
    { name: 'Patrick Mahomes', netWorth: '$70M', hourlyEarnings: '$5,100/hr', emoji: '🏈' },
    { name: 'Shohei Ohtani', netWorth: '$85M', hourlyEarnings: '$39,000/hr', emoji: '⚾' },
  ],
  musicians: [
    { name: 'Taylor Swift', netWorth: '$1.6B', hourlyEarnings: '$45,000/hr', emoji: '🎤' },
    { name: 'Drake', netWorth: '$250M', hourlyEarnings: '$8,500/hr', emoji: '🎧' },
    { name: 'Beyoncé', netWorth: '$800M', hourlyEarnings: '$22,000/hr', emoji: '👑' },
    { name: 'Rihanna', netWorth: '$1.4B', hourlyEarnings: '$28,500/hr', emoji: '💎' },
    { name: 'The Weeknd', netWorth: '$300M', hourlyEarnings: '$11,400/hr', emoji: '🎵' },
    { name: 'Jay-Z', netWorth: '$2.5B', hourlyEarnings: '$34,000/hr', emoji: '🎤' },
  ],
  'tech-billionaires': [
    { name: 'Elon Musk', netWorth: '$230B', hourlyEarnings: '$7.5M/hr', emoji: '🚀' },
    { name: 'Jeff Bezos', netWorth: '$200B', hourlyEarnings: '$4.5M/hr', emoji: '📦' },
    { name: 'Mark Zuckerberg', netWorth: '$180B', hourlyEarnings: '$5.1M/hr', emoji: '👤' },
    { name: 'Bill Gates', netWorth: '$130B', hourlyEarnings: '$1.1M/hr', emoji: '💻' },
    { name: 'Jensen Huang', netWorth: '$110B', hourlyEarnings: '$3.2M/hr', emoji: '🎮' },
    { name: 'Sam Altman', netWorth: '$2B', hourlyEarnings: '$57,000/hr', emoji: '🤖' },
  ],
  hollywood: [
    { name: 'Dwayne Johnson', netWorth: '$800M', hourlyEarnings: '$17,000/hr', emoji: '💪' },
    { name: 'Tom Cruise', netWorth: '$600M', hourlyEarnings: '$11,400/hr', emoji: '🎬' },
    { name: 'Leonardo DiCaprio', netWorth: '$300M', hourlyEarnings: '$3,400/hr', emoji: '🎭' },
    { name: 'Ryan Reynolds', netWorth: '$350M', hourlyEarnings: '$5,700/hr', emoji: '😎' },
    { name: 'Scarlett Johansson', netWorth: '$200M', hourlyEarnings: '$4,500/hr', emoji: '⭐' },
    { name: 'Robert Downey Jr', netWorth: '$300M', hourlyEarnings: '$5,700/hr', emoji: '🦸' },
  ],
  influencers: [
    { name: 'MrBeast', netWorth: '$500M', hourlyEarnings: '$28,500/hr', emoji: '🎥' },
    { name: 'Kylie Jenner', netWorth: '$750M', hourlyEarnings: '$17,000/hr', emoji: '💄' },
    { name: 'Kim Kardashian', netWorth: '$1.7B', hourlyEarnings: '$22,800/hr', emoji: '📸' },
    { name: 'Logan Paul', netWorth: '$150M', hourlyEarnings: '$5,700/hr', emoji: '🥊' },
    { name: 'PewDiePie', netWorth: '$40M', hourlyEarnings: '$2,280/hr', emoji: '🎮' },
    { name: 'Emma Chamberlain', netWorth: '$22M', hourlyEarnings: '$1,370/hr', emoji: '☕' },
  ],
  politicians: [
    { name: 'Donald Trump', netWorth: '$2.5B', hourlyEarnings: '$28,500/hr', emoji: '🏢' },
    { name: 'Michael Bloomberg', netWorth: '$106B', hourlyEarnings: '$1.2M/hr', emoji: '📊' },
    { name: 'Barack Obama', netWorth: '$70M', hourlyEarnings: '$11,400/hr', emoji: '🎤' },
    { name: 'Joe Biden', netWorth: '$10M', hourlyEarnings: '$1,140/hr', emoji: '🏛️' },
  ],
  historical: [
    { name: 'Mansa Musa', netWorth: '$400B+', hourlyEarnings: 'Immeasurable', emoji: '👑' },
    { name: 'John D. Rockefeller', netWorth: '$340B', hourlyEarnings: '$4.3M/hr', emoji: '🛢️' },
    { name: 'Andrew Carnegie', netWorth: '$310B', hourlyEarnings: '$3.9M/hr', emoji: '🏗️' },
    { name: 'Cleopatra', netWorth: '$95B', hourlyEarnings: 'Ancient wealth', emoji: '🐍' },
  ],
};

export function getSimilarCelebrities(
  currentName: string,
  category: Category,
  limit: number = 4
): SimilarCelebrity[] {
  const celebrities = categorySpotlights[category] || categorySpotlights.hollywood;
  
  // Filter out current celebrity and return random selection
  const filtered = celebrities.filter(
    c => c.name.toLowerCase() !== currentName.toLowerCase()
  );
  
  // Shuffle and return limited results
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export function getCategoryEmoji(category: Category): string {
  return categoryEmojis[category] || '💰';
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
