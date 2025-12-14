import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { nameToSlug } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';

interface TrendingItem {
  name: string;
  searches: string;
  hot: boolean;
  category?: string;
}

// Expanded curated featured celebrities by category
const categorySpotlights: Record<string, { name: string; hot?: boolean }[]> = {
  Athletes: [
    { name: 'LeBron James', hot: true },
    { name: 'Cristiano Ronaldo', hot: true },
    { name: 'Lionel Messi' },
    { name: 'Serena Williams' },
    { name: 'Patrick Mahomes', hot: true },
    { name: 'Stephen Curry' },
    { name: 'Kevin Durant' },
    { name: 'Tom Brady' },
    { name: 'Shohei Ohtani', hot: true },
    { name: 'Lewis Hamilton' },
    { name: 'Tiger Woods' },
    { name: 'Kylian Mbappé', hot: true },
  ],
  Musicians: [
    { name: 'Taylor Swift', hot: true },
    { name: 'Drake' },
    { name: 'Beyoncé', hot: true },
    { name: 'The Weeknd' },
    { name: 'Bad Bunny', hot: true },
    { name: 'Rihanna' },
    { name: 'Ed Sheeran' },
    { name: 'Travis Scott' },
    { name: 'Billie Eilish' },
    { name: 'Post Malone' },
    { name: 'Kanye West' },
    { name: 'Jay-Z' },
  ],
  'Tech Billionaires': [
    { name: 'Elon Musk', hot: true },
    { name: 'Jeff Bezos' },
    { name: 'Mark Zuckerberg', hot: true },
    { name: 'Jensen Huang', hot: true },
    { name: 'Larry Ellison' },
    { name: 'Bill Gates' },
    { name: 'Tim Cook' },
    { name: 'Satya Nadella' },
    { name: 'Larry Page' },
    { name: 'Sam Altman', hot: true },
  ],
  Hollywood: [
    { name: 'Dwayne Johnson', hot: true },
    { name: 'Ryan Reynolds' },
    { name: 'Margot Robbie' },
    { name: 'Tom Cruise', hot: true },
    { name: 'Zendaya', hot: true },
    { name: 'Leonardo DiCaprio' },
    { name: 'Scarlett Johansson' },
    { name: 'Robert Downey Jr' },
    { name: 'Chris Hemsworth' },
    { name: 'Jennifer Lawrence' },
  ],
  Influencers: [
    { name: 'MrBeast', hot: true },
    { name: 'Kylie Jenner' },
    { name: 'PewDiePie' },
    { name: "Charli D'Amelio" },
    { name: 'Logan Paul', hot: true },
    { name: 'Kim Kardashian', hot: true },
    { name: 'Jake Paul' },
    { name: 'KSI' },
    { name: 'Addison Rae' },
    { name: 'Emma Chamberlain' },
  ],
  Historical: [
    { name: 'Mansa Musa', hot: true },
    { name: 'John D. Rockefeller' },
    { name: 'Andrew Carnegie' },
    { name: 'Cleopatra' },
    { name: 'Genghis Khan' },
  ],
};

const categories = Object.keys(categorySpotlights);

function formatSearchCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

const TrendingSearches = () => {
  const [realTrends, setRealTrends] = useState<TrendingItem[]>([]);
  const [spotlightCategory, setSpotlightCategory] = useState<string>('');
  const [spotlightItems, setSpotlightItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rotate category based on current hour
    const hourIndex = new Date().getHours() % categories.length;
    const currentCategory = categories[hourIndex];
    setSpotlightCategory(currentCategory);

    // Get 5 featured items from spotlight category (shuffled by hour)
    const allSpotlight = categorySpotlights[currentCategory];
    const hourSeed = new Date().getHours() + new Date().getDate();
    const shuffledSpotlight = [...allSpotlight].sort((a, b) => {
      const hashA = a.name.charCodeAt(0) * hourSeed;
      const hashB = b.name.charCodeAt(0) * hourSeed;
      return (hashA % 100) - (hashB % 100);
    });
    const featuredItems = shuffledSpotlight.slice(0, 5).map((item) => ({
      name: item.name,
      searches: 'Featured',
      hot: item.hot || false,
      category: currentCategory,
    }));
    setSpotlightItems(featuredItems);
    setLoading(false);

    // Optionally fetch top 1 real trend (but we won't prioritize it)
    const fetchTrends = async () => {
      try {
        const { data, error } = await supabase
          .from('search_trends')
          .select('celebrity_name, search_count, category')
          .order('search_count', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const trends: TrendingItem[] = data.map((item) => ({
            name: item.celebrity_name,
            searches: formatSearchCount(item.search_count),
            hot: true,
            category: item.category || undefined,
          }));
          setRealTrends(trends);
        }
      } catch (err) {
        console.error('Failed to fetch trends:', err);
      }
    };

    fetchTrends();
  }, []);

  // Display only featured celebrities (5 total)
  const displayItems: TrendingItem[] = spotlightItems.slice(0, 5);

  return (
    <div className="w-full">
      {/* Mobile: Card layout */}
      <div className="md:hidden">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Now
              </CardTitle>
              {spotlightCategory && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {spotlightCategory}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-secondary/30 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {displayItems.map((person, index) => (
                  <Link
                    key={`${person.name}-${index}`}
                    to={`/profile/${nameToSlug(person.name)}`}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-border/30 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-sm w-4">
                        {index + 1}
                      </span>
                      <span className="font-medium group-hover:text-primary transition-colors text-sm">
                        {person.name}
                      </span>
                      {person.hot && (
                        <Flame className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {person.searches}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Horizontal scrolling bar */}
      <div className="hidden md:block">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-gradient-to-r from-card/80 via-card/50 to-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 pr-4 border-r border-border/50 shrink-0">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm whitespace-nowrap">Trending Now</span>
          </div>
          
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-40 bg-secondary/30 rounded-full animate-pulse shrink-0" />
                ))
              ) : (
                displayItems.map((person, index) => (
                  <Link
                    key={`${person.name}-${index}`}
                    to={`/profile/${nameToSlug(person.name)}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/40 hover:bg-primary/20 border border-border/50 hover:border-primary/50 transition-all group shrink-0 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors whitespace-nowrap">
                      {person.name}
                    </span>
                    {person.hot && (
                      <Flame className="h-4 w-4 text-orange-500" />
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {spotlightCategory && (
            <div className="flex items-center gap-1.5 pl-4 border-l border-border/50 shrink-0">
              <Sparkles className="h-4 w-4 text-primary/70" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{spotlightCategory}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingSearches;
