import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredPeople, FeaturedPerson, useFeaturedCelebrity } from '@/contexts/FeaturedCelebrityContext';
import { Celebrity } from '@/lib/types';

// Convert FeaturedPerson to Celebrity for prefetching
const toCelebrity = (p: FeaturedPerson): Celebrity => ({
  id: p.id,
  name: p.name,
  profession: p.title,
  category: 'hollywood', // Default category
  netWorth: p.annualEarnings * 10,
  annualEarnings: p.annualEarnings,
  imageUrl: p.imageUrl,
  source: 'Featured data',
});

const FeaturedSlide = ({ person, onNavigate }: { person: FeaturedPerson; onNavigate: (p: FeaturedPerson) => void }) => {
  const { currentEarnings, breakdown } = useEarningsTicker({
    annualEarnings: person.annualEarnings,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(person);
  };

  return (
    <div className="flex-[0_0_100%] min-w-0">
      <Card className="mx-2 overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="p-0">
          <div className="p-5 md:p-8 lg:p-10">
            {/* Mobile: Stacked compact layout */}
            <div className="flex flex-col gap-5 md:hidden">
              {/* Top row: Avatar + Name + CTA */}
              <div className="flex items-center gap-4">
                <a href={`/profile/${person.id}`} onClick={handleClick} className="shrink-0">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/30 shadow-lg shadow-primary/20">
                    <AvatarImage
                      src={person.imageUrl}
                      alt={person.name}
                      className="object-cover"
                    />
                    <AvatarFallback
                      className={`bg-gradient-to-br ${person.bgGradient} text-lg font-bold`}
                    >
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                </a>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Featured</p>
                  <a href={`/profile/${person.id}`} onClick={handleClick}>
                    <h3 className="font-serif text-lg font-bold truncate hover:text-primary transition-colors">
                      {person.name}
                    </h3>
                  </a>
                  <p className="text-sm text-muted-foreground truncate">{person.title}</p>
                </div>
                <a
                  href={`/profile/${person.id}`}
                  onClick={handleClick}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Earnings ticker */}
              <div className="text-center py-3 bg-background/50 rounded-lg">
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span>Earned since page opened</span>
                </div>
                <div className="font-mono text-2xl font-bold gradient-gold-text ticker-number tabular-nums">
                  {formatLargeCurrency(currentEarnings)}
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>
                    <span className="text-primary font-semibold">{formatLargeCurrency(breakdown.perSecond)}</span>/sec
                  </span>
                  <span>
                    <span className="text-primary font-semibold">{formatLargeCurrency(breakdown.perMinute)}</span>/min
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href={`/profile/${person.id}`}
                onClick={handleClick}
                className="flex items-center gap-5 group shrink-0"
              >
                <Avatar className="h-24 w-24 lg:h-28 lg:w-28 ring-4 ring-primary/30 shadow-xl shadow-primary/20">
                  <AvatarImage
                    src={person.imageUrl}
                    alt={person.name}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={`bg-gradient-to-br ${person.bgGradient} text-2xl font-bold`}
                  >
                    {person.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Featured</p>
                  <h3 className="font-serif text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-muted-foreground">{person.title}</p>
                </div>
              </a>

              {/* Live earnings counter */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Earned since you opened this page</span>
                </div>
                <div className="font-mono text-4xl lg:text-5xl font-bold gradient-gold-text ticker-number tabular-nums">
                  {formatLargeCurrency(currentEarnings)}
                </div>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <span>
                    <span className="text-primary font-semibold">{formatLargeCurrency(breakdown.perSecond)}</span>/sec
                  </span>
                  <span>
                    <span className="text-primary font-semibold">{formatLargeCurrency(breakdown.perMinute)}</span>/min
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href={`/profile/${person.id}`}
                onClick={handleClick}
                className="shrink-0 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                View Profile
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeaturedTicker = () => {
  const navigate = useNavigate();
  const { currentIndex, goToIndex } = useFeaturedCelebrity();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navTimeoutRef = useRef<number | null>(null);

  // Navigate to profile with prefetched data for instant loading
  const handleNavigate = useCallback((person: FeaturedPerson) => {
    const celebrity = toCelebrity(person);
    navigate(`/profile/${person.id}`, { state: { celebrity } });
  }, [navigate]);

  // Use currentIndex directly for startIndex - this ensures correct
  // initialization when navigating back to the page
  const emblaOptions = useMemo(
    () => ({
      loop: true,
      skipSnaps: false,
      slidesToScroll: 1,
      startIndex: currentIndex,
      // Keep it smooth but not "floaty"
      duration: 60,
      dragFree: false,
    }),
    // Intentionally only run once on mount to prevent carousel resets during auto-rotation
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  // Mark carousel as ready after initial render to prevent flash
  useEffect(() => {
    // Set ready immediately on mount with a minimal delay for DOM stability
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const clearNavLock = useCallback(() => {
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('settle', clearNavLock);
    emblaApi.on('reInit', clearNavLock);

    return () => {
      emblaApi.off('settle', clearNavLock);
      emblaApi.off('reInit', clearNavLock);
    };
  }, [emblaApi, clearNavLock]);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) window.clearTimeout(navTimeoutRef.current);
    };
  }, []);

  // Keep the top "Featured" spotlight and carousel in sync (user swipes/clicks)
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      if (selected !== currentIndex) {
        goToIndex(selected);
      }
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, currentIndex, goToIndex]);

  // When the spotlight auto-rotates, scroll the carousel to match.
  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== currentIndex) {
      emblaApi.scrollTo(currentIndex);
    }
  }, [emblaApi, currentIndex]);

  const lockWithFailsafe = useCallback(() => {
    setIsNavigating(true);
    if (navTimeoutRef.current) window.clearTimeout(navTimeoutRef.current);

    // Never allow the UI to be stuck disabled if an event doesn't fire.
    navTimeoutRef.current = window.setTimeout(() => {
      navTimeoutRef.current = null;
      setIsNavigating(false);
    }, 900);
  }, []);

  const scrollPrev = useCallback(() => {
    if (!emblaApi || isNavigating) return;
    lockWithFailsafe();
    emblaApi.scrollPrev();
  }, [emblaApi, isNavigating, lockWithFailsafe]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || isNavigating) return;
    lockWithFailsafe();
    emblaApi.scrollNext();
  }, [emblaApi, isNavigating, lockWithFailsafe]);

  // Don't render carousel until it's ready to prevent flashing on back navigation
  if (!isReady) {
    return (
      <div className="relative">
        <div className="mx-2 h-48 md:h-44 bg-card rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {featuredPeople.map((person) => (
            <FeaturedSlide key={person.id} person={person} onNavigate={handleNavigate} />
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={scrollPrev}
          disabled={isNavigating}
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous celebrity"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <button
          onClick={scrollNext}
          disabled={isNavigating}
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next celebrity"
        >
          <span className="text-sm font-medium">Next</span>
          <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedTicker;
