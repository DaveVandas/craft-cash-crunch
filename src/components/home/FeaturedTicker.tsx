import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedPerson {
  id: string;
  name: string;
  title: string;
  annualEarnings: number;
  imageUrl: string;
  initials: string;
  bgGradient: string;
}

const featuredPeople: FeaturedPerson[] = [
  { id: 'elon-musk', name: 'Elon Musk', title: 'Tech Billionaire', annualEarnings: 23500000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg', initials: 'EM', bgGradient: 'from-blue-900/50 to-purple-900/50' },
  { id: 'taylor-swift', name: 'Taylor Swift', title: 'Pop Icon', annualEarnings: 185000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%284%29.png/220px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%284%29.png', initials: 'TS', bgGradient: 'from-pink-900/50 to-purple-900/50' },
  { id: 'cristiano-ronaldo', name: 'Cristiano Ronaldo', title: 'Soccer Star', annualEarnings: 260000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/220px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg', initials: 'CR', bgGradient: 'from-green-900/50 to-emerald-900/50' },
  { id: 'lebron-james', name: 'LeBron James', title: 'NBA Legend', annualEarnings: 119500000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/LeBron_James_crop.jpg/220px-LeBron_James_crop.jpg', initials: 'LJ', bgGradient: 'from-orange-900/50 to-red-900/50' },
  { id: 'jeff-bezos', name: 'Jeff Bezos', title: 'Amazon Founder', annualEarnings: 8500000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg/220px-Jeff_Bezos_at_Amazon_Spheres_Grand_Opening_in_Seattle_-_2018_%2839074799225%29_%28cropped%29.jpg', initials: 'JB', bgGradient: 'from-amber-900/50 to-orange-900/50' },
  { id: 'beyonce', name: 'Beyoncé', title: 'Music Mogul', annualEarnings: 115000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png/220px-Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png', initials: 'B', bgGradient: 'from-yellow-900/50 to-amber-900/50' },
  { id: 'lionel-messi', name: 'Lionel Messi', title: 'Soccer Legend', annualEarnings: 135000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/220px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg', initials: 'LM', bgGradient: 'from-sky-900/50 to-blue-900/50' },
  { id: 'kim-kardashian', name: 'Kim Kardashian', title: 'Media Personality', annualEarnings: 80000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kim_Kardashian_2023.jpg/220px-Kim_Kardashian_2023.jpg', initials: 'KK', bgGradient: 'from-rose-900/50 to-pink-900/50' },
  { id: 'dwayne-johnson', name: 'Dwayne Johnson', title: 'Hollywood Star', annualEarnings: 87500000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg/220px-Dwayne_Johnson_2014_%28cropped%29.jpg', initials: 'DJ', bgGradient: 'from-stone-800/50 to-zinc-900/50' },
  { id: 'mrbeast', name: 'MrBeast', title: 'YouTube King', annualEarnings: 82000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/MrBeast_2023_%28cropped%29.jpg/220px-MrBeast_2023_%28cropped%29.jpg', initials: 'MB', bgGradient: 'from-red-900/50 to-rose-900/50' },
  { id: 'kylie-jenner', name: 'Kylie Jenner', title: 'Beauty Mogul', annualEarnings: 65000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Kylie_Jenner_%28cropped%29.jpg/220px-Kylie_Jenner_%28cropped%29.jpg', initials: 'KJ', bgGradient: 'from-fuchsia-900/50 to-pink-900/50' },
  { id: 'travis-kelce', name: 'Travis Kelce', title: 'NFL Star', annualEarnings: 34000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Travis_Kelce_2023_%28cropped%29.jpg/220px-Travis_Kelce_2023_%28cropped%29.jpg', initials: 'TK', bgGradient: 'from-red-900/50 to-amber-900/50' },
  { id: 'rihanna', name: 'Rihanna', title: 'Music & Beauty Icon', annualEarnings: 75000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Rihanna_Fenty_2018.png/220px-Rihanna_Fenty_2018.png', initials: 'R', bgGradient: 'from-cyan-900/50 to-teal-900/50' },
  { id: 'mark-zuckerberg', name: 'Mark Zuckerberg', title: 'Meta CEO', annualEarnings: 12000000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/220px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg', initials: 'MZ', bgGradient: 'from-blue-900/50 to-indigo-900/50' },
  { id: 'oprah-winfrey', name: 'Oprah Winfrey', title: 'Media Mogul', annualEarnings: 75000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/220px-Oprah_in_2014.jpg', initials: 'OW', bgGradient: 'from-violet-900/50 to-purple-900/50' },
  { id: 'tiger-woods', name: 'Tiger Woods', title: 'Golf Legend', annualEarnings: 68000000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TigerWoodsOct2011.jpg/220px-TigerWoodsOct2011.jpg', initials: 'TW', bgGradient: 'from-green-900/50 to-lime-900/50' },
];

const FeaturedTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * featuredPeople.length)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const featured = featuredPeople[currentIndex];
  
  const { currentEarnings, breakdown } = useEarningsTicker({ 
    annualEarnings: featured.annualEarnings 
  });

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % featuredPeople.length);
      setIsTransitioning(false);
    }, 150);
  }, []);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + featuredPeople.length) % featuredPeople.length);
      setIsTransitioning(false);
    }, 150);
  }, []);

  // Auto-rotate every 30 seconds
  useEffect(() => {
    const interval = setInterval(goToNext, 30000);
    return () => clearInterval(interval);
  }, [goToNext]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <Card 
      ref={containerRef}
      className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 animate-pulse-gold select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Live Earnings</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div 
          className={`flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-150 ${
            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="flex items-center gap-4">
            <Avatar className={`h-20 w-20 ring-2 ring-primary/30 shadow-lg shadow-primary/20`}>
              <AvatarImage src={featured.imageUrl} alt={featured.name} className="object-cover" />
              <AvatarFallback className={`bg-gradient-to-br ${featured.bgGradient} text-xl font-bold`}>
                {featured.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">
                {featured.name}
              </h2>
              <p className="text-muted-foreground">{featured.title}</p>
            </div>
          </div>

          <div className="flex-1 text-center md:text-right">
            <p className="text-sm text-muted-foreground mb-1">
              Earned since you opened this page
            </p>
            <div className="font-mono text-3xl md:text-4xl font-bold gradient-gold-text ticker-number">
              {formatLargeCurrency(currentEarnings)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              That's <span className="text-primary font-semibold">
                {formatLargeCurrency(breakdown.perSecond)}
              </span> per second
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
              {currentIndex + 1}/{featuredPeople.length}
            </span>
            <div className="flex gap-1">
              {featuredPeople.slice(
                Math.max(0, currentIndex - 2),
                Math.min(featuredPeople.length, currentIndex + 3)
              ).map((_, idx) => {
                const actualIdx = Math.max(0, currentIndex - 2) + idx;
                return (
                  <button
                    key={actualIdx}
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentIndex(actualIdx);
                        setIsTransitioning(false);
                      }, 150);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      actualIdx === currentIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-muted hover:bg-muted-foreground w-2'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-muted-foreground md:hidden ml-2">
              Swipe to explore
            </span>
          </div>
          
          <Link to={`/profile/${featured.id}`}>
            <Button variant="ghost" className="group">
              View Full Profile
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedTicker;
