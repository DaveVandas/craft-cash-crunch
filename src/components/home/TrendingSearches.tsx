import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { nameToSlug } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';

// Category to gradient and emoji mapping
const categoryStyles: Record<string, { gradient: string; emoji: string }> = {
  Athletes: { gradient: 'from-emerald-500 to-teal-600', emoji: '🏆' },
  Musicians: { gradient: 'from-purple-500 to-pink-600', emoji: '🎵' },
  'Tech Billionaires': { gradient: 'from-blue-500 to-cyan-600', emoji: '💻' },
  Hollywood: { gradient: 'from-amber-500 to-orange-600', emoji: '🎬' },
  Influencers: { gradient: 'from-rose-500 to-red-600', emoji: '📱' },
  Historical: { gradient: 'from-yellow-500 to-amber-600', emoji: '👑' },
};

interface TrendingItem {
  name: string;
  searches: string;
  hot: boolean;
  category?: string;
  netWorth?: string;
  hourlyEarnings?: string;
}

interface CelebrityData {
  name: string;
  hot?: boolean;
  netWorth: string;
  hourlyEarnings: string;
}

// Expanded curated featured celebrities by category with earnings data
const categorySpotlights: Record<string, CelebrityData[]> = {
  Athletes: [
    { name: 'LeBron James', hot: true, netWorth: '$1.2B', hourlyEarnings: '$14,000/hr' },
    { name: 'Cristiano Ronaldo', hot: true, netWorth: '$600M', hourlyEarnings: '$17,000/hr' },
    { name: 'Lionel Messi', netWorth: '$650M', hourlyEarnings: '$18,000/hr' },
    { name: 'Serena Williams', netWorth: '$300M', hourlyEarnings: '$2,300/hr' },
    { name: 'Patrick Mahomes', hot: true, netWorth: '$70M', hourlyEarnings: '$5,100/hr' },
    { name: 'Stephen Curry', netWorth: '$200M', hourlyEarnings: '$6,500/hr' },
    { name: 'Kevin Durant', netWorth: '$300M', hourlyEarnings: '$5,700/hr' },
    { name: 'Tom Brady', netWorth: '$300M', hourlyEarnings: '$3,400/hr' },
    { name: 'Shohei Ohtani', hot: true, netWorth: '$85M', hourlyEarnings: '$39,000/hr' },
    { name: 'Lewis Hamilton', netWorth: '$300M', hourlyEarnings: '$6,800/hr' },
    { name: 'Tiger Woods', netWorth: '$800M', hourlyEarnings: '$9,100/hr' },
    { name: 'Kylian Mbappé', hot: true, netWorth: '$180M', hourlyEarnings: '$12,000/hr' },
  ],
  Musicians: [
    { name: 'Taylor Swift', hot: true, netWorth: '$1.6B', hourlyEarnings: '$45,000/hr' },
    { name: 'Drake', netWorth: '$250M', hourlyEarnings: '$8,500/hr' },
    { name: 'Beyoncé', hot: true, netWorth: '$800M', hourlyEarnings: '$22,000/hr' },
    { name: 'The Weeknd', netWorth: '$300M', hourlyEarnings: '$11,400/hr' },
    { name: 'Bad Bunny', hot: true, netWorth: '$80M', hourlyEarnings: '$9,100/hr' },
    { name: 'Rihanna', netWorth: '$1.4B', hourlyEarnings: '$28,500/hr' },
    { name: 'Ed Sheeran', netWorth: '$200M', hourlyEarnings: '$9,100/hr' },
    { name: 'Travis Scott', netWorth: '$80M', hourlyEarnings: '$6,800/hr' },
    { name: 'Billie Eilish', netWorth: '$50M', hourlyEarnings: '$3,400/hr' },
    { name: 'Post Malone', netWorth: '$45M', hourlyEarnings: '$2,850/hr' },
    { name: 'Kanye West', netWorth: '$500M', hourlyEarnings: '$11,400/hr' },
    { name: 'Jay-Z', netWorth: '$2.5B', hourlyEarnings: '$34,000/hr' },
  ],
  'Tech Billionaires': [
    { name: 'Elon Musk', hot: true, netWorth: '$230B', hourlyEarnings: '$7.5M/hr' },
    { name: 'Jeff Bezos', netWorth: '$200B', hourlyEarnings: '$4.5M/hr' },
    { name: 'Mark Zuckerberg', hot: true, netWorth: '$180B', hourlyEarnings: '$5.1M/hr' },
    { name: 'Jensen Huang', hot: true, netWorth: '$110B', hourlyEarnings: '$3.2M/hr' },
    { name: 'Larry Ellison', netWorth: '$150B', hourlyEarnings: '$2.8M/hr' },
    { name: 'Bill Gates', netWorth: '$130B', hourlyEarnings: '$1.1M/hr' },
    { name: 'Tim Cook', netWorth: '$2B', hourlyEarnings: '$17,000/hr' },
    { name: 'Satya Nadella', netWorth: '$1B', hourlyEarnings: '$5,700/hr' },
    { name: 'Larry Page', netWorth: '$130B', hourlyEarnings: '$2.1M/hr' },
    { name: 'Sam Altman', hot: true, netWorth: '$2B', hourlyEarnings: '$57,000/hr' },
  ],
  Hollywood: [
    { name: 'Dwayne Johnson', hot: true, netWorth: '$800M', hourlyEarnings: '$17,000/hr' },
    { name: 'Ryan Reynolds', netWorth: '$350M', hourlyEarnings: '$5,700/hr' },
    { name: 'Margot Robbie', netWorth: '$40M', hourlyEarnings: '$2,850/hr' },
    { name: 'Tom Cruise', hot: true, netWorth: '$600M', hourlyEarnings: '$11,400/hr' },
    { name: 'Zendaya', hot: true, netWorth: '$20M', hourlyEarnings: '$1,700/hr' },
    { name: 'Leonardo DiCaprio', netWorth: '$300M', hourlyEarnings: '$3,400/hr' },
    { name: 'Scarlett Johansson', netWorth: '$200M', hourlyEarnings: '$4,500/hr' },
    { name: 'Robert Downey Jr', netWorth: '$300M', hourlyEarnings: '$5,700/hr' },
    { name: 'Chris Hemsworth', netWorth: '$130M', hourlyEarnings: '$4,000/hr' },
    { name: 'Jennifer Lawrence', netWorth: '$160M', hourlyEarnings: '$2,850/hr' },
  ],
  Influencers: [
    { name: 'MrBeast', hot: true, netWorth: '$500M', hourlyEarnings: '$28,500/hr' },
    { name: 'Kylie Jenner', netWorth: '$750M', hourlyEarnings: '$17,000/hr' },
    { name: 'PewDiePie', netWorth: '$40M', hourlyEarnings: '$2,280/hr' },
    { name: "Charli D'Amelio", netWorth: '$20M', hourlyEarnings: '$2,280/hr' },
    { name: 'Logan Paul', hot: true, netWorth: '$150M', hourlyEarnings: '$5,700/hr' },
    { name: 'Kim Kardashian', hot: true, netWorth: '$1.7B', hourlyEarnings: '$22,800/hr' },
    { name: 'Jake Paul', netWorth: '$80M', hourlyEarnings: '$4,560/hr' },
    { name: 'KSI', netWorth: '$25M', hourlyEarnings: '$2,280/hr' },
    { name: 'Addison Rae', netWorth: '$15M', hourlyEarnings: '$1,140/hr' },
    { name: 'Emma Chamberlain', netWorth: '$22M', hourlyEarnings: '$1,370/hr' },
  ],
  Historical: [
    { name: 'Mansa Musa', hot: true, netWorth: '$400B+', hourlyEarnings: 'Immeasurable' },
    { name: 'John D. Rockefeller', netWorth: '$340B', hourlyEarnings: '$4.3M/hr' },
    { name: 'Andrew Carnegie', netWorth: '$310B', hourlyEarnings: '$3.9M/hr' },
    { name: 'Cleopatra', netWorth: '$95B', hourlyEarnings: 'Ancient wealth' },
    { name: 'Genghis Khan', netWorth: '$120T', hourlyEarnings: 'Conquered lands' },
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect for desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || loading || isPaused) return;

    const scrollSpeed = 1; // pixels per frame
    let animationId: number;

    const scroll = () => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling after a short delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [loading, isPaused]);

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
    const featuredItems = shuffledSpotlight.slice(0, 10).map((item) => ({
      name: item.name,
      searches: 'Featured',
      hot: item.hot || false,
      category: currentCategory,
      netWorth: item.netWorth,
      hourlyEarnings: item.hourlyEarnings,
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

  // Display featured celebrities (10 on desktop, 5 on mobile)
  const displayItems: TrendingItem[] = spotlightItems;

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
          
          <div 
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-secondary/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/60"
          >
            <div className="flex items-center gap-3">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 w-52 bg-secondary/30 rounded-xl animate-pulse shrink-0" />
                ))
              ) : (
                displayItems.map((person, index) => (
                  <Link
                    key={`${person.name}-${index}`}
                    to={`/profile/${nameToSlug(person.name)}`}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 hover:from-primary/20 hover:to-primary/10 border border-border/50 transition-all group shrink-0 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] overflow-hidden"
                  >
                    {/* Gold shimmer border on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl border-2 border-primary/60" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </div>
                    
                    {/* Avatar with shimmer effect */}
                    <div className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${categoryStyles[person.category || '']?.gradient || 'from-primary to-accent'} flex items-center justify-center text-xl shrink-0 shadow-lg ring-2 ring-primary/30 overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      <span className="relative z-10">{categoryStyles[person.category || '']?.emoji || '💰'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold group-hover:text-primary transition-colors whitespace-nowrap">
                          {person.name}
                        </span>
                        {person.hot && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                            <Flame className="h-3 w-3 text-orange-500 animate-pulse" />
                            <span className="text-[10px] font-medium text-orange-400">HOT</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="text-primary/80 font-medium">{person.netWorth}</span>
                        <span className="text-foreground/60">{person.hourlyEarnings}</span>
                      </div>
                    </div>
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
