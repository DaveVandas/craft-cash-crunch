import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFeaturedCelebrity, featuredPeople } from '@/contexts/FeaturedCelebrityContext';

const FeaturedTicker = () => {
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentIndex, 
    featured, 
    isTransitioning, 
    goToNext, 
    goToPrev, 
    goToIndex,
    totalCount 
  } = useFeaturedCelebrity();
  
  const { currentEarnings, breakdown } = useEarningsTicker({ 
    annualEarnings: featured.annualEarnings 
  });

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
              {currentIndex + 1}/{totalCount}
            </span>
            <div className="flex gap-1">
              {featuredPeople.slice(
                Math.max(0, currentIndex - 2),
                Math.min(totalCount, currentIndex + 3)
              ).map((_, idx) => {
                const actualIdx = Math.max(0, currentIndex - 2) + idx;
                return (
                  <button
                    key={actualIdx}
                    onClick={() => goToIndex(actualIdx)}
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
