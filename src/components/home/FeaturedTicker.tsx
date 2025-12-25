import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredPeople, FeaturedPerson } from '@/contexts/FeaturedCelebrityContext';

const FeaturedSlide = ({ person }: { person: FeaturedPerson }) => {
  const { currentEarnings, breakdown } = useEarningsTicker({
    annualEarnings: person.annualEarnings,
  });

  return (
    <div className="flex-[0_0_100%] min-w-0">
      <Card className="mx-2 overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="p-0">
          <div className="p-5 md:p-8 lg:p-10">
            {/* Mobile: Stacked compact layout */}
            <div className="flex flex-col gap-5 md:hidden">
              {/* Top row: Avatar + Name + CTA */}
              <div className="flex items-center gap-4">
                <Link to={`/profile/${person.id}`} className="shrink-0">
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
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Featured</p>
                  <Link to={`/profile/${person.id}`}>
                    <h3 className="font-serif text-lg font-bold truncate hover:text-primary transition-colors">
                      {person.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">{person.title}</p>
                </div>
                <Link
                  to={`/profile/${person.id}`}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
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
              <Link
                to={`/profile/${person.id}`}
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
              </Link>

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
              <Link
                to={`/profile/${person.id}`}
                className="shrink-0 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                View Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeaturedTicker = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      skipSnaps: false,
      startIndex: Math.floor(Math.random() * featuredPeople.length),
      duration: 30,
      dragFree: false,
    },
    [Autoplay({ delay: 30000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {featuredPeople.map((person) => (
            <FeaturedSlide key={person.id} person={person} />
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          onClick={scrollPrev}
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors group"
          aria-label="Previous celebrity"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <button
          onClick={scrollNext}
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors group"
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
