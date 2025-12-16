import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
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
    totalCount,
  } = useFeaturedCelebrity();

  const { currentEarnings, breakdown } = useEarningsTicker({
    annualEarnings: featured.annualEarnings,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToNext() : goToPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative select-none"
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="p-0">
          <div className="relative">

            {/* Main content */}
            <div
              className={`p-8 md:p-10 transition-all duration-200 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar and info */}
                <Link
                  to={`/profile/${featured.id}`}
                  className="flex flex-col md:flex-row items-center gap-5 group"
                >
                  <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-primary/30 shadow-xl shadow-primary/20">
                    <AvatarImage
                      src={featured.imageUrl}
                      alt={featured.name}
                      className="object-cover"
                    />
                    <AvatarFallback
                      className={`bg-gradient-to-br ${featured.bgGradient} text-2xl font-bold`}
                    >
                      {featured.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">Featured</p>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                      {featured.name}
                    </h3>
                    <p className="text-muted-foreground">{featured.title}</p>
                  </div>
                </Link>

                {/* Live earnings counter */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Earned since you opened this page</span>
                  </div>
                  <div className="font-mono text-4xl md:text-5xl font-bold gradient-gold-text ticker-number tabular-nums">
                    {formatLargeCurrency(currentEarnings)}
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    <span>
                      <span className="text-primary font-semibold">
                        {formatLargeCurrency(breakdown.perSecond)}
                      </span>
                      /sec
                    </span>
                    <span>
                      <span className="text-primary font-semibold">
                        {formatLargeCurrency(breakdown.perMinute)}
                      </span>
                      /min
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={`/profile/${featured.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  View Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation controls below the card */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={goToPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background hover:bg-primary/20 border border-border/50 transition-all hover:scale-110"
          aria-label="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">
            {currentIndex + 1} / {totalCount}
          </span>
          <div className="flex gap-2">
            {featuredPeople.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-muted hover:bg-muted-foreground w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={goToNext}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background hover:bg-primary/20 border border-border/50 transition-all hover:scale-110"
          aria-label="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedTicker;
