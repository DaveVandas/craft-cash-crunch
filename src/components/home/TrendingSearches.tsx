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

// Curated fallback celebrities by category for rotating spotlight
const categorySpotlights: Record<string, { name: string; hot?: boolean }[]> = {
  Athletes: [
    { name: 'LeBron James', hot: true },
    { name: 'Cristiano Ronaldo' },
    { name: 'Lionel Messi' },
    { name: 'Serena Williams' },
    { name: 'Patrick Mahomes', hot: true },
  ],
  Musicians: [
    { name: 'Taylor Swift', hot: true },
    { name: 'Drake' },
    { name: 'Beyoncé' },
    { name: 'The Weeknd' },
    { name: 'Bad Bunny', hot: true },
  ],
  'Tech Billionaires': [
    { name: 'Elon Musk', hot: true },
    { name: 'Jeff Bezos' },
    { name: 'Mark Zuckerberg' },
    { name: 'Jensen Huang', hot: true },
    { name: 'Larry Ellison' },
  ],
  Hollywood: [
    { name: 'Dwayne Johnson' },
    { name: 'Ryan Reynolds' },
    { name: 'Margot Robbie' },
    { name: 'Tom Cruise', hot: true },
    { name: 'Zendaya', hot: true },
  ],
  Influencers: [
    { name: 'MrBeast', hot: true },
    { name: 'Kylie Jenner' },
    { name: 'PewDiePie' },
    { name: 'Charli D\'Amelio' },
    { name: 'Logan Paul', hot: true },
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

    // Get spotlight items for this category
    const items = categorySpotlights[currentCategory].slice(0, 2).map((item) => ({
      name: item.name,
      searches: 'Featured',
      hot: item.hot || false,
      category: currentCategory,
    }));
    setSpotlightItems(items);

    // Fetch real trends from database
    const fetchTrends = async () => {
      try {
        const { data, error } = await supabase
          .from('search_trends')
          .select('celebrity_name, search_count, category')
          .order('search_count', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          const trends: TrendingItem[] = data.map((item, index) => ({
            name: item.celebrity_name,
            searches: formatSearchCount(item.search_count),
            hot: index < 2, // Top 2 are "hot"
            category: item.category || undefined,
          }));
          setRealTrends(trends);
        }
      } catch (err) {
        console.error('Failed to fetch trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Combine real trends with spotlight, prioritizing real data
  const displayItems: TrendingItem[] = realTrends.length > 0 
    ? realTrends.slice(0, 3).concat(spotlightItems.slice(0, 2))
    : spotlightItems.concat(
        categorySpotlights[categories[(new Date().getHours() + 1) % categories.length]]
          .slice(0, 3)
          .map((item) => ({
            name: item.name,
            searches: 'Popular',
            hot: item.hot || false,
          }))
      );

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Now
        </CardTitle>
        {spotlightCategory && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Spotlight: {spotlightCategory}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-secondary/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          displayItems.slice(0, 5).map((person, index) => (
            <Link
              key={`${person.name}-${index}`}
              to={`/profile/${nameToSlug(person.name)}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono text-sm w-4">
                  {index + 1}
                </span>
                <span className="font-medium group-hover:text-primary transition-colors">
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
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingSearches;
