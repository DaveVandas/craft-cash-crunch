import { Celebrity, Category } from './types';
import { fallbackCelebrities } from './fallbackCelebrities';

export interface CelebritySuggestion {
  name: string;
  profession?: string;
  category?: Category | string;
  netWorth?: number;
  searchCount: number;
}

// Extended list of popular celebrities with professions for autocomplete
// This supplements the fallback data with additional well-known figures
const EXTENDED_CELEBRITIES: CelebritySuggestion[] = [
  // Athletes - NFL
  { name: 'Patrick Mahomes', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Travis Kelce', profession: 'NFL Tight End', category: 'athletes', searchCount: 0 },
  { name: 'Josh Allen', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Jalen Hurts', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Drake Maye', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Lamar Jackson', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Joe Burrow', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'CJ Stroud', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Dak Prescott', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  { name: 'Aaron Rodgers', profession: 'NFL Quarterback', category: 'athletes', searchCount: 0 },
  
  // Athletes - NBA
  { name: 'Stephen Curry', profession: 'NBA Point Guard', category: 'athletes', searchCount: 0 },
  { name: 'Kevin Durant', profession: 'NBA Forward', category: 'athletes', searchCount: 0 },
  { name: 'Giannis Antetokounmpo', profession: 'NBA Forward', category: 'athletes', searchCount: 0 },
  { name: 'Luka Doncic', profession: 'NBA Guard', category: 'athletes', searchCount: 0 },
  { name: 'Jayson Tatum', profession: 'NBA Forward', category: 'athletes', searchCount: 0 },
  { name: 'Anthony Edwards', profession: 'NBA Guard', category: 'athletes', searchCount: 0 },
  { name: 'Shaquille O\'Neal', profession: 'Former NBA Center', category: 'athletes', searchCount: 0 },
  { name: 'Kobe Bryant', profession: 'Former NBA Guard (Estate)', category: 'athletes', searchCount: 0 },
  
  // Athletes - Other
  { name: 'Tiger Woods', profession: 'Professional Golfer', category: 'athletes', searchCount: 0 },
  { name: 'Serena Williams', profession: 'Tennis Champion', category: 'athletes', searchCount: 0 },
  { name: 'Lewis Hamilton', profession: 'Formula 1 Driver', category: 'athletes', searchCount: 0 },
  { name: 'Conor McGregor', profession: 'MMA Fighter', category: 'athletes', searchCount: 0 },
  { name: 'Floyd Mayweather', profession: 'Boxing Champion', category: 'athletes', searchCount: 0 },
  { name: 'Shohei Ohtani', profession: 'MLB Pitcher/Hitter', category: 'athletes', searchCount: 0 },
  { name: 'Neymar Jr', profession: 'Professional Footballer', category: 'athletes', searchCount: 0 },
  { name: 'Kylian Mbappé', profession: 'Professional Footballer', category: 'athletes', searchCount: 0 },
  
  // Hollywood
  { name: 'Tom Cruise', profession: 'Actor & Producer', category: 'hollywood', searchCount: 0 },
  { name: 'Leonardo DiCaprio', profession: 'Actor', category: 'hollywood', searchCount: 0 },
  { name: 'Brad Pitt', profession: 'Actor & Producer', category: 'hollywood', searchCount: 0 },
  { name: 'Margot Robbie', profession: 'Actress & Producer', category: 'hollywood', searchCount: 0 },
  { name: 'Scarlett Johansson', profession: 'Actress', category: 'hollywood', searchCount: 0 },
  { name: 'Robert Downey Jr', profession: 'Actor', category: 'hollywood', searchCount: 0 },
  { name: 'Ryan Reynolds', profession: 'Actor & Businessman', category: 'hollywood', searchCount: 0 },
  { name: 'Jennifer Lawrence', profession: 'Actress', category: 'hollywood', searchCount: 0 },
  { name: 'Chris Hemsworth', profession: 'Actor', category: 'hollywood', searchCount: 0 },
  { name: 'Zendaya', profession: 'Actress & Model', category: 'hollywood', searchCount: 0 },
  { name: 'Timothée Chalamet', profession: 'Actor', category: 'hollywood', searchCount: 0 },
  { name: 'Will Smith', profession: 'Actor & Producer', category: 'hollywood', searchCount: 0 },
  { name: 'Denzel Washington', profession: 'Actor & Director', category: 'hollywood', searchCount: 0 },
  { name: 'Morgan Freeman', profession: 'Actor', category: 'hollywood', searchCount: 0 },
  
  // Musicians
  { name: 'Bad Bunny', profession: 'Reggaeton Artist', category: 'musicians', searchCount: 0 },
  { name: 'Ed Sheeran', profession: 'Singer-Songwriter', category: 'musicians', searchCount: 0 },
  { name: 'The Weeknd', profession: 'R&B Artist', category: 'musicians', searchCount: 0 },
  { name: 'Billie Eilish', profession: 'Singer-Songwriter', category: 'musicians', searchCount: 0 },
  { name: 'Adele', profession: 'Singer', category: 'musicians', searchCount: 0 },
  { name: 'Bruno Mars', profession: 'Singer & Songwriter', category: 'musicians', searchCount: 0 },
  { name: 'Travis Scott', profession: 'Rapper & Producer', category: 'musicians', searchCount: 0 },
  { name: 'Post Malone', profession: 'Rapper & Singer', category: 'musicians', searchCount: 0 },
  { name: 'Dua Lipa', profession: 'Pop Singer', category: 'musicians', searchCount: 0 },
  { name: 'Lady Gaga', profession: 'Singer & Actress', category: 'musicians', searchCount: 0 },
  { name: 'Jay-Z', profession: 'Rapper & Businessman', category: 'musicians', searchCount: 0 },
  { name: 'Kid Rock', profession: 'Rock Musician', category: 'musicians', searchCount: 0 },
  { name: 'Coldplay', profession: 'Rock Band', category: 'musicians', searchCount: 0 },
  { name: 'Justin Bieber', profession: 'Pop Singer', category: 'musicians', searchCount: 0 },
  
  // Tech Billionaires
  { name: 'Tim Cook', profession: 'CEO of Apple', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Sundar Pichai', profession: 'CEO of Google', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Jensen Huang', profession: 'CEO of NVIDIA', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Satya Nadella', profession: 'CEO of Microsoft', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Larry Ellison', profession: 'Co-founder of Oracle', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Sam Altman', profession: 'CEO of OpenAI', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Larry Page', profession: 'Co-founder of Google', category: 'tech-billionaires', searchCount: 0 },
  { name: 'Sergey Brin', profession: 'Co-founder of Google', category: 'tech-billionaires', searchCount: 0 },
  
  // Influencers
  { name: 'MrBeast', profession: 'YouTuber & Philanthropist', category: 'influencers', searchCount: 0 },
  { name: 'Logan Paul', profession: 'YouTuber & Wrestler', category: 'influencers', searchCount: 0 },
  { name: 'Jake Paul', profession: 'YouTuber & Boxer', category: 'influencers', searchCount: 0 },
  { name: 'Kylie Jenner', profession: 'Influencer & Businesswoman', category: 'influencers', searchCount: 0 },
  { name: 'PewDiePie', profession: 'YouTuber', category: 'influencers', searchCount: 0 },
  { name: 'Charli D\'Amelio', profession: 'TikTok Star', category: 'influencers', searchCount: 0 },
  { name: 'KSI', profession: 'YouTuber & Rapper', category: 'influencers', searchCount: 0 },
  { name: 'Addison Rae', profession: 'TikTok Star & Actress', category: 'influencers', searchCount: 0 },
  
  // Politicians
  { name: 'Donald Trump', profession: 'Former US President', category: 'politicians', searchCount: 0 },
  { name: 'Joe Biden', profession: 'US President', category: 'politicians', searchCount: 0 },
  { name: 'Barack Obama', profession: 'Former US President', category: 'politicians', searchCount: 0 },
  { name: 'Nancy Pelosi', profession: 'US Politician', category: 'politicians', searchCount: 0 },
  { name: 'Bernie Sanders', profession: 'US Senator', category: 'politicians', searchCount: 0 },
  { name: 'Alexandria Ocasio-Cortez', profession: 'US Congresswoman', category: 'politicians', searchCount: 0 },
  { name: 'Vladimir Putin', profession: 'President of Russia', category: 'politicians', searchCount: 0 },
  
  // Royalty
  { name: 'King Charles III', profession: 'King of United Kingdom', category: 'royalty', searchCount: 0 },
  { name: 'Prince William', profession: 'Prince of Wales', category: 'royalty', searchCount: 0 },
  { name: 'Prince Harry', profession: 'Duke of Sussex', category: 'royalty', searchCount: 0 },
  { name: 'Queen Elizabeth II', profession: 'Former Queen (Estate)', category: 'royalty', searchCount: 0 },
  { name: 'Princess Diana', profession: 'Former Princess (Estate)', category: 'royalty', searchCount: 0 },
  { name: 'Mohammed bin Salman', profession: 'Crown Prince of Saudi Arabia', category: 'royalty', searchCount: 0 },
  
  // Business Titans
  { name: 'Warren Buffett', profession: 'Investor & CEO of Berkshire Hathaway', category: 'business-titans', searchCount: 0 },
  { name: 'Bernard Arnault', profession: 'CEO of LVMH', category: 'business-titans', searchCount: 0 },
  { name: 'Mukesh Ambani', profession: 'Chairman of Reliance Industries', category: 'business-titans', searchCount: 0 },
  { name: 'Michael Bloomberg', profession: 'Founder of Bloomberg LP', category: 'business-titans', searchCount: 0 },
  { name: 'Ray Dalio', profession: 'Founder of Bridgewater', category: 'business-titans', searchCount: 0 },
  { name: 'Jamie Dimon', profession: 'CEO of JPMorgan Chase', category: 'business-titans', searchCount: 0 },
];

// Build suggestions from fallback celebrities
function getFallbackSuggestions(): CelebritySuggestion[] {
  const seen = new Set<string>();
  const suggestions: CelebritySuggestion[] = [];
  
  for (const celeb of Object.values(fallbackCelebrities)) {
    const nameKey = celeb.name.toLowerCase();
    if (!seen.has(nameKey)) {
      seen.add(nameKey);
      suggestions.push({
        name: celeb.name,
        profession: celeb.profession,
        category: celeb.category,
        netWorth: celeb.netWorth,
        searchCount: 0,
      });
    }
  }
  
  return suggestions;
}

// Get all available celebrities for autocomplete
export function getAllCelebritySuggestions(): CelebritySuggestion[] {
  const fallbackSuggestions = getFallbackSuggestions();
  const seen = new Set(fallbackSuggestions.map(s => s.name.toLowerCase()));
  
  // Add extended celebrities that aren't in fallback
  const additional = EXTENDED_CELEBRITIES.filter(c => !seen.has(c.name.toLowerCase()));
  
  return [...fallbackSuggestions, ...additional];
}

// Simple fuzzy matching for autocomplete
function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  // Direct substring match
  if (t.includes(q)) return true;
  
  // Check if query matches start of any word
  const words = t.split(/\s+/);
  if (words.some(w => w.startsWith(q))) return true;
  
  // Simple typo tolerance: allow 1 character difference for queries 4+ chars
  if (q.length >= 4) {
    // Check if removing any single character from query creates a match
    for (let i = 0; i < q.length; i++) {
      const reduced = q.slice(0, i) + q.slice(i + 1);
      if (t.includes(reduced)) return true;
    }
  }
  
  return false;
}

// Filter and rank celebrity suggestions based on query
export function filterCelebritySuggestions(
  query: string,
  limit: number = 8,
  trendingData?: { name: string; searchCount: number; category?: string }[]
): CelebritySuggestion[] {
  if (query.length < 2) return [];
  
  const allCelebrities = getAllCelebritySuggestions();
  const q = query.toLowerCase();
  
  // Create a map of trending search counts
  const trendingMap = new Map<string, { searchCount: number; category?: string }>();
  if (trendingData) {
    for (const t of trendingData) {
      trendingMap.set(t.name.toLowerCase(), { searchCount: t.searchCount, category: t.category });
    }
  }
  
  // Filter and score matches
  const matches: Array<CelebritySuggestion & { score: number }> = [];
  
  for (const celeb of allCelebrities) {
    if (!fuzzyMatch(query, celeb.name)) continue;
    
    const trending = trendingMap.get(celeb.name.toLowerCase());
    const searchCount = trending?.searchCount || celeb.searchCount || 0;
    
    // Score: exact start match > word start match > contains match
    // Plus boost for trending
    let score = 0;
    const nameLower = celeb.name.toLowerCase();
    
    if (nameLower.startsWith(q)) {
      score = 1000;
    } else if (nameLower.split(/\s+/).some(w => w.startsWith(q))) {
      score = 500;
    } else {
      score = 100;
    }
    
    // Boost by search count
    score += Math.log10(searchCount + 1) * 10;
    
    matches.push({
      ...celeb,
      searchCount,
      category: trending?.category || celeb.category,
      score,
    });
  }
  
  // Also include any trending results not in our static list
  if (trendingData) {
    const staticNames = new Set(allCelebrities.map(c => c.name.toLowerCase()));
    for (const t of trendingData) {
      if (!staticNames.has(t.name.toLowerCase()) && fuzzyMatch(query, t.name)) {
        matches.push({
          name: t.name,
          searchCount: t.searchCount,
          category: t.category,
          score: t.searchCount > 0 ? 200 + Math.log10(t.searchCount) * 10 : 50,
        });
      }
    }
  }
  
  // Sort by score and limit
  matches.sort((a, b) => b.score - a.score);
  
  return matches.slice(0, limit).map(({ score, ...rest }) => rest);
}

// Format net worth for display
export function formatNetWorthShort(netWorth?: number): string {
  if (!netWorth) return '';
  if (netWorth >= 1e9) return `$${(netWorth / 1e9).toFixed(1)}B`;
  if (netWorth >= 1e6) return `$${(netWorth / 1e6).toFixed(0)}M`;
  return `$${netWorth.toLocaleString()}`;
}
