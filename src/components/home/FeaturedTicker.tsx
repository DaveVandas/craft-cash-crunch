import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
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
      {/* Compact horizontal ticker */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-primary/5 backdrop-blur-sm">
        {/* Nav button - left */}
        <button
          onClick={goToPrev}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary transition-colors shrink-0"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Main content row */}
        <div
          className={`flex-1 flex items-center gap-4 transition-all duration-150 ${
            isTransitioning ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Avatar + Name */}
          <Link
            to={`/profile/${featured.id}`}
            className="flex items-center gap-3 group shrink-0"
          >
            <Avatar className="h-11 w-11 ring-2 ring-primary/30 shadow-md shadow-primary/10">
              <AvatarImage src={featured.imageUrl} alt={featured.name} className="object-cover" />
              <AvatarFallback className={`bg-gradient-to-br ${featured.bgGradient} text-sm font-bold`}>
                {featured.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="font-semibold text-sm group-hover:text-primary transition-colors leading-tight">
                {featured.name}
              </p>
              <p className="text-xs text-muted-foreground">{featured.title}</p>
            </div>
          </Link>

          {/* Live counter - centered */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="hidden xs:inline">Earned since page load</span>
              <span className="xs:hidden">Live</span>
            </div>
            <div className="font-mono text-xl md:text-2xl font-bold gradient-gold-text ticker-number tabular-nums">
              {formatLargeCurrency(currentEarnings)}
            </div>
          </div>

          {/* Per-second stat + CTA */}
          <div className="hidden md:flex flex-col items-end shrink-0">
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-semibold">{formatLargeCurrency(breakdown.perSecond)}</span>/sec
            </p>
            <Link
              to={`/profile/${featured.id}`}
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
            >
              Explore <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Nav button - right */}
        <button
          onClick={goToNext}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary transition-colors shrink-0"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Dots (mobile: below, desktop: inline) */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-border/50 shrink-0">
          {featuredPeople.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary w-4' : 'bg-muted hover:bg-muted-foreground w-1.5'
              }`}
            />
          ))}
          {totalCount > 5 && (
            <span className="text-[10px] text-muted-foreground ml-1">+{totalCount - 5}</span>
          )}
        </div>
      </div>

      {/* Mobile: swipe hint + dots below */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-2">
        <div className="flex gap-1">
          {featuredPeople.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary w-4' : 'bg-muted w-1.5'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">Swipe</span>
      </div>
    </div>
  );
};

export default FeaturedTicker;

