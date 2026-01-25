import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Crown, Zap, Clock, DollarSign, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { nameToSlug } from '@/lib/validation';
import { Celebrity, Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CelebrityData {
  name: string;
  netWorth: string;
  hourlyEarnings: string;
  hot?: boolean;
  category?: string;
  vibe?: string;
  wealthTier?: string;
  era?: string;
}

// Parse currency strings like "$1.2B" or "$14,000/hr"
const parseCurrencyString = (str: string): number => {
  const cleaned = str.replace(/[^0-9.BMK]/gi, '');
  const num = parseFloat(cleaned) || 0;
  if (str.includes('B')) return num * 1_000_000_000;
  if (str.includes('M')) return num * 1_000_000;
  if (str.includes('K')) return num * 1_000;
  return num;
};

const parseHourlyToAnnual = (str: string): number => {
  const hourly = parseCurrencyString(str.replace('/hr', ''));
  return hourly * 2080;
};

const categoryToType = (cat?: string): Category => {
  if (!cat) return 'hollywood';
  const map: Record<string, Category> = {
    Athletes: 'athletes',
    Musicians: 'musicians',
    'Tech Billionaires': 'tech-billionaires',
    Hollywood: 'hollywood',
    Influencers: 'influencers',
    Historical: 'historical',
    'Business Titans': 'business-titans',
    Royalty: 'royalty',
  };
  return map[cat] || 'hollywood';
};

// Master celebrity database with multi-dimensional tags
const allCelebrities: CelebrityData[] = [
  // Athletes
  { name: 'LeBron James', netWorth: '$1.2B', hourlyEarnings: '$14,000/hr', hot: true, category: 'Athletes', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Cristiano Ronaldo', netWorth: '$600M', hourlyEarnings: '$17,000/hr', hot: true, category: 'Athletes', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Lionel Messi', netWorth: '$650M', hourlyEarnings: '$18,000/hr', category: 'Athletes', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Serena Williams', netWorth: '$300M', hourlyEarnings: '$2,300/hr', category: 'Athletes', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Legends' },
  { name: 'Patrick Mahomes', netWorth: '$70M', hourlyEarnings: '$5,100/hr', hot: true, category: 'Athletes', vibe: 'Hustler', wealthTier: 'Millionaire', era: 'Trending' },
  { name: 'Shohei Ohtani', netWorth: '$85M', hourlyEarnings: '$39,000/hr', hot: true, category: 'Athletes', vibe: 'Hustler', wealthTier: 'Millionaire', era: 'Trending' },
  { name: 'Tiger Woods', netWorth: '$800M', hourlyEarnings: '$9,100/hr', category: 'Athletes', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Legends' },
  { name: 'Michael Jordan', netWorth: '$3.2B', hourlyEarnings: '$45,000/hr', category: 'Athletes', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  
  // Musicians
  { name: 'Taylor Swift', netWorth: '$1.6B', hourlyEarnings: '$45,000/hr', hot: true, category: 'Musicians', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Beyoncé', netWorth: '$800M', hourlyEarnings: '$22,000/hr', hot: true, category: 'Musicians', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Rihanna', netWorth: '$1.4B', hourlyEarnings: '$28,500/hr', category: 'Musicians', vibe: 'Hustler', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Drake', netWorth: '$250M', hourlyEarnings: '$8,500/hr', category: 'Musicians', vibe: 'Hustler', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Jay-Z', netWorth: '$2.5B', hourlyEarnings: '$34,000/hr', category: 'Musicians', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  { name: 'Kanye West', netWorth: '$500M', hourlyEarnings: '$11,400/hr', category: 'Musicians', vibe: 'Hustler', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Bad Bunny', netWorth: '$80M', hourlyEarnings: '$9,100/hr', hot: true, category: 'Musicians', vibe: 'Hustler', wealthTier: 'Millionaire', era: 'Trending' },
  { name: 'The Weeknd', netWorth: '$300M', hourlyEarnings: '$11,400/hr', category: 'Musicians', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Trending' },
  
  // Tech Billionaires
  { name: 'Elon Musk', netWorth: '$230B', hourlyEarnings: '$7.5M/hr', hot: true, category: 'Tech Billionaires', vibe: 'Hustler', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Jeff Bezos', netWorth: '$200B', hourlyEarnings: '$4.5M/hr', category: 'Tech Billionaires', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  { name: 'Mark Zuckerberg', netWorth: '$180B', hourlyEarnings: '$5.1M/hr', hot: true, category: 'Tech Billionaires', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Bill Gates', netWorth: '$130B', hourlyEarnings: '$1.1M/hr', category: 'Tech Billionaires', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  { name: 'Jensen Huang', netWorth: '$110B', hourlyEarnings: '$3.2M/hr', hot: true, category: 'Tech Billionaires', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Sam Altman', netWorth: '$2B', hourlyEarnings: '$57,000/hr', hot: true, category: 'Tech Billionaires', vibe: 'Hustler', wealthTier: 'Billionaire', era: 'Trending' },
  
  // Hollywood
  { name: 'Dwayne Johnson', netWorth: '$800M', hourlyEarnings: '$17,000/hr', hot: true, category: 'Hollywood', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Tom Cruise', netWorth: '$600M', hourlyEarnings: '$11,400/hr', hot: true, category: 'Hollywood', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Legends' },
  { name: 'Ryan Reynolds', netWorth: '$350M', hourlyEarnings: '$5,700/hr', category: 'Hollywood', vibe: 'Hustler', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Leonardo DiCaprio', netWorth: '$300M', hourlyEarnings: '$3,400/hr', category: 'Hollywood', vibe: 'Self-Made', wealthTier: 'Ultra-Rich', era: 'Legends' },
  { name: 'Zendaya', netWorth: '$20M', hourlyEarnings: '$1,700/hr', hot: true, category: 'Hollywood', vibe: 'Hustler', wealthTier: 'Millionaire', era: 'Trending' },
  { name: 'Oprah Winfrey', netWorth: '$2.5B', hourlyEarnings: '$28,500/hr', category: 'Hollywood', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  
  // Influencers
  { name: 'MrBeast', netWorth: '$500M', hourlyEarnings: '$28,500/hr', hot: true, category: 'Influencers', vibe: 'Hustler', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Kylie Jenner', netWorth: '$750M', hourlyEarnings: '$17,000/hr', category: 'Influencers', vibe: 'Inherited', wealthTier: 'Ultra-Rich', era: 'Trending' },
  { name: 'Kim Kardashian', netWorth: '$1.7B', hourlyEarnings: '$22,800/hr', hot: true, category: 'Influencers', vibe: 'Hustler', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Logan Paul', netWorth: '$150M', hourlyEarnings: '$5,700/hr', hot: true, category: 'Influencers', vibe: 'Hustler', wealthTier: 'Millionaire', era: 'Trending' },
  { name: 'PewDiePie', netWorth: '$40M', hourlyEarnings: '$2,280/hr', category: 'Influencers', vibe: 'Self-Made', wealthTier: 'Millionaire', era: 'Legends' },
  
  // Business Titans
  { name: 'Warren Buffett', netWorth: '$130B', hourlyEarnings: '$1.4M/hr', category: 'Business Titans', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  { name: 'Ray Dalio', netWorth: '$19B', hourlyEarnings: '$210K/hr', category: 'Business Titans', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  { name: 'Jamie Dimon', netWorth: '$2B', hourlyEarnings: '$17,000/hr', category: 'Business Titans', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Trending' },
  
  // Royalty
  { name: 'King Charles III', netWorth: '$2B', hourlyEarnings: '$5,700/hr', category: 'Royalty', vibe: 'Old Money', wealthTier: 'Billionaire', era: 'Trending' },
  { name: 'Prince William', netWorth: '$100M', hourlyEarnings: '$1,140/hr', category: 'Royalty', vibe: 'Old Money', wealthTier: 'Millionaire', era: 'Trending' },
  
  // Historical
  { name: 'John D. Rockefeller', netWorth: '$340B', hourlyEarnings: '$4.3M/hr', category: 'Historical', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
  { name: 'Andrew Carnegie', netWorth: '$310B', hourlyEarnings: '$3.9M/hr', category: 'Historical', vibe: 'Self-Made', wealthTier: 'Billionaire', era: 'Legends' },
];

// Carousel configuration
interface CarouselConfig {
  id: string;
  title: string;
  emoji: string;
  icon: React.ReactNode;
  filter: (celeb: CelebrityData) => boolean;
  gradient: string;
  badgeColor: string;
}

const carouselConfigs: CarouselConfig[] = [
  {
    id: 'trending',
    title: 'Hot Right Now',
    emoji: '🔥',
    icon: <TrendingUp className="h-4 w-4" />,
    filter: (c) => c.hot === true || c.era === 'Trending',
    gradient: 'from-orange-500/20 to-red-500/20',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  {
    id: 'billionaires',
    title: 'The Billionaire Club',
    emoji: '💎',
    icon: <DollarSign className="h-4 w-4" />,
    filter: (c) => c.wealthTier === 'Billionaire',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'selfmade',
    title: 'Self-Made Moguls',
    emoji: '💪',
    icon: <Zap className="h-4 w-4" />,
    filter: (c) => c.vibe === 'Self-Made',
    gradient: 'from-green-500/20 to-emerald-500/20',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 'hustlers',
    title: 'The Hustlers',
    emoji: '🚀',
    icon: <Sparkles className="h-4 w-4" />,
    filter: (c) => c.vibe === 'Hustler',
    gradient: 'from-purple-500/20 to-pink-500/20',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'oldmoney',
    title: 'Old Money & Royalty',
    emoji: '👑',
    icon: <Crown className="h-4 w-4" />,
    filter: (c) => c.vibe === 'Old Money' || c.vibe === 'Inherited' || c.category === 'Royalty',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  {
    id: 'legends',
    title: 'All-Time Legends',
    emoji: '🏆',
    icon: <Clock className="h-4 w-4" />,
    filter: (c) => c.era === 'Legends',
    gradient: 'from-amber-500/20 to-orange-500/20',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'athletes',
    title: 'Elite Athletes',
    emoji: '🏆',
    icon: <Zap className="h-4 w-4" />,
    filter: (c) => c.category === 'Athletes',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'tech',
    title: 'Tech Titans',
    emoji: '💻',
    icon: <Building2 className="h-4 w-4" />,
    filter: (c) => c.category === 'Tech Billionaires',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
];

interface CarouselRowProps {
  config: CarouselConfig;
  celebrities: CelebrityData[];
  onNavigate: (celeb: CelebrityData) => void;
}

const CarouselRow = ({ config, celebrities, onNavigate }: CarouselRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (celebrities.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.emoji}</span>
          <h3 className="font-serif text-base font-bold">{config.title}</h3>
          <Badge variant="outline" className={cn("text-xs", config.badgeColor)}>
            {celebrities.length}
          </Badge>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 pb-2"
        >
          {celebrities.map((celeb, index) => (
            <button
              key={`${config.id}-${celeb.name}-${index}`}
              onClick={() => onNavigate(celeb)}
              className={cn(
                "group flex flex-col gap-2 p-3 rounded-xl min-w-[160px] max-w-[160px]",
                "border border-border/50 bg-gradient-to-br",
                config.gradient,
                "hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]",
                "transition-all duration-300 flex-shrink-0 text-left"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {celeb.name}
                </span>
                {celeb.hot && (
                  <Flame className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{celeb.category}</span>
                <span className="text-sm font-bold gradient-gold-text">{celeb.netWorth}</span>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-primary/20 [&>div]:bg-primary/60" />
      </ScrollArea>
    </div>
  );
};

const CategoryCarousels = () => {
  const navigate = useNavigate();

  const handleNavigate = useCallback((celeb: CelebrityData) => {
    const netWorth = parseCurrencyString(celeb.netWorth);
    const annualEarnings = parseHourlyToAnnual(celeb.hourlyEarnings);
    const slug = nameToSlug(celeb.name);

    const celebrity: Celebrity = {
      id: slug,
      name: celeb.name,
      profession: celeb.category || 'Celebrity',
      category: categoryToType(celeb.category),
      netWorth,
      annualEarnings,
      source: 'Featured data',
    };

    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/profile/${slug}`, { state: { celebrity } });
  }, [navigate]);

  // Shuffle celebrities slightly based on hour for variety
  const shuffledCelebrities = [...allCelebrities].sort((a, b) => {
    const hourSeed = new Date().getHours() + new Date().getDate();
    const hashA = (a.name.charCodeAt(0) + a.name.charCodeAt(1)) * hourSeed;
    const hashB = (b.name.charCodeAt(0) + b.name.charCodeAt(1)) * hourSeed;
    return (hashA % 100) - (hashB % 100);
  });

  return (
    <div className="w-full">
      {carouselConfigs.map((config) => {
        const filtered = shuffledCelebrities.filter(config.filter);
        // Remove duplicates
        const unique = filtered.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
        return (
          <CarouselRow
            key={config.id}
            config={config}
            celebrities={unique.slice(0, 12)}
            onNavigate={handleNavigate}
          />
        );
      })}
    </div>
  );
};

export default CategoryCarousels;
