import { Category } from './types';

interface SimilarCelebrity {
  name: string;
  netWorth: string;
  hourlyEarnings: string;
}

// Similar celebrities by category
const categorySpotlights: Record<string, SimilarCelebrity[]> = {
  athletes: [
    { name: 'LeBron James', netWorth: '$1.2B', hourlyEarnings: '$14,000/hr' },
    { name: 'Cristiano Ronaldo', netWorth: '$600M', hourlyEarnings: '$17,000/hr' },
    { name: 'Lionel Messi', netWorth: '$650M', hourlyEarnings: '$18,000/hr' },
    { name: 'Stephen Curry', netWorth: '$200M', hourlyEarnings: '$6,500/hr' },
    { name: 'Patrick Mahomes', netWorth: '$70M', hourlyEarnings: '$5,100/hr' },
    { name: 'Shohei Ohtani', netWorth: '$85M', hourlyEarnings: '$39,000/hr' },
  ],
  musicians: [
    { name: 'Taylor Swift', netWorth: '$1.6B', hourlyEarnings: '$45,000/hr' },
    { name: 'Drake', netWorth: '$250M', hourlyEarnings: '$8,500/hr' },
    { name: 'Beyoncé', netWorth: '$800M', hourlyEarnings: '$22,000/hr' },
    { name: 'Rihanna', netWorth: '$1.4B', hourlyEarnings: '$28,500/hr' },
    { name: 'The Weeknd', netWorth: '$300M', hourlyEarnings: '$11,400/hr' },
    { name: 'Jay-Z', netWorth: '$2.5B', hourlyEarnings: '$34,000/hr' },
  ],
  'tech-billionaires': [
    { name: 'Elon Musk', netWorth: '$230B', hourlyEarnings: '$7.5M/hr' },
    { name: 'Jeff Bezos', netWorth: '$200B', hourlyEarnings: '$4.5M/hr' },
    { name: 'Mark Zuckerberg', netWorth: '$180B', hourlyEarnings: '$5.1M/hr' },
    { name: 'Bill Gates', netWorth: '$130B', hourlyEarnings: '$1.1M/hr' },
    { name: 'Jensen Huang', netWorth: '$110B', hourlyEarnings: '$3.2M/hr' },
    { name: 'Sam Altman', netWorth: '$2B', hourlyEarnings: '$57,000/hr' },
  ],
  hollywood: [
    { name: 'Dwayne Johnson', netWorth: '$800M', hourlyEarnings: '$17,000/hr' },
    { name: 'Tom Cruise', netWorth: '$600M', hourlyEarnings: '$11,400/hr' },
    { name: 'Leonardo DiCaprio', netWorth: '$300M', hourlyEarnings: '$3,400/hr' },
    { name: 'Ryan Reynolds', netWorth: '$350M', hourlyEarnings: '$5,700/hr' },
    { name: 'Scarlett Johansson', netWorth: '$200M', hourlyEarnings: '$4,500/hr' },
    { name: 'Robert Downey Jr', netWorth: '$300M', hourlyEarnings: '$5,700/hr' },
  ],
  influencers: [
    { name: 'MrBeast', netWorth: '$500M', hourlyEarnings: '$28,500/hr' },
    { name: 'Kylie Jenner', netWorth: '$750M', hourlyEarnings: '$17,000/hr' },
    { name: 'Kim Kardashian', netWorth: '$1.7B', hourlyEarnings: '$22,800/hr' },
    { name: 'Logan Paul', netWorth: '$150M', hourlyEarnings: '$5,700/hr' },
    { name: 'PewDiePie', netWorth: '$40M', hourlyEarnings: '$2,280/hr' },
    { name: 'Emma Chamberlain', netWorth: '$22M', hourlyEarnings: '$1,370/hr' },
  ],
  politicians: [
    { name: 'Donald Trump', netWorth: '$2.5B', hourlyEarnings: '$28,500/hr' },
    { name: 'Michael Bloomberg', netWorth: '$106B', hourlyEarnings: '$1.2M/hr' },
    { name: 'Barack Obama', netWorth: '$70M', hourlyEarnings: '$11,400/hr' },
    { name: 'Joe Biden', netWorth: '$10M', hourlyEarnings: '$1,140/hr' },
  ],
  historical: [
    { name: 'Mansa Musa', netWorth: '$400B+', hourlyEarnings: 'Immeasurable' },
    { name: 'John D. Rockefeller', netWorth: '$340B', hourlyEarnings: '$4.3M/hr' },
    { name: 'Andrew Carnegie', netWorth: '$310B', hourlyEarnings: '$3.9M/hr' },
    { name: 'Cleopatra', netWorth: '$95B', hourlyEarnings: 'Ancient wealth' },
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

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
