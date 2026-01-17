import { useFeaturedCelebrity } from '@/contexts/FeaturedCelebrityContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Celebrity } from '@/lib/types';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency, formatCompactCurrency } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HeroSpotlight = () => {
  const navigate = useNavigate();
  const { featured, isTransitioning, goToIndex, currentIndex, totalCount } = useFeaturedCelebrity();
  const { currentEarnings, breakdown } = useEarningsTicker({ annualEarnings: featured.annualEarnings });

  const prefetchedCelebrity: Celebrity = {
    id: featured.id,
    name: featured.name,
    profession: featured.title,
    category: 'hollywood',
    netWorth: featured.annualEarnings * 10,
    annualEarnings: featured.annualEarnings,
    imageUrl: featured.imageUrl,
    source: 'Featured data',
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/profile/${featured.id}`, { state: { celebrity: prefetchedCelebrity } });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentIndex === 0 ? totalCount - 1 : currentIndex - 1;
    goToIndex(newIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = currentIndex === totalCount - 1 ? 0 : currentIndex + 1;
    goToIndex(newIndex);
  };

  return (
    <Card 
      className="relative overflow-hidden border-primary/40 bg-gradient-to-br from-primary/15 via-card to-primary/5 hover:border-primary/60 transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      
      <div className={`relative p-4 md:p-5 transition-all duration-200 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Header badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/20 px-2 py-0.5 rounded-full">
              Featured Mogul
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-60 hover:opacity-100"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{currentIndex + 1}/{totalCount}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-60 hover:opacity-100"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Avatar and name */}
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary/50 ring-2 ring-primary/20">
            <AvatarImage src={featured.imageUrl} alt={featured.name} />
            <AvatarFallback className="bg-primary/20 text-2xl">
              {getAvatarEmoji(featured.title)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl md:text-2xl font-bold truncate gradient-gold-text">
              {featured.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{featured.title}</p>
          </div>
        </div>

        {/* Earnings ticker */}
        <div className="bg-background/50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span>Earned since you arrived</span>
          </div>
          <div className="relative overflow-hidden font-mono text-2xl md:text-3xl font-bold gradient-gold-text">
            {formatLargeCurrency(currentEarnings)}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Compact earnings breakdown */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/20">
            <div className="text-center flex-1">
              <div className="text-[10px] text-primary/70 uppercase tracking-wider font-semibold">/sec</div>
              <div className="text-sm md:text-base font-mono font-bold gradient-gold-text">{formatCompactCurrency(breakdown.perSecond)}</div>
            </div>
            <div className="w-px h-8 bg-primary/30" />
            <div className="text-center flex-1">
              <div className="text-[10px] text-primary/70 uppercase tracking-wider font-semibold">/min</div>
              <div className="text-sm md:text-base font-mono font-bold gradient-gold-text">{formatCompactCurrency(breakdown.perMinute)}</div>
            </div>
            <div className="w-px h-8 bg-primary/30" />
            <div className="text-center flex-1">
              <div className="text-[10px] text-primary/70 uppercase tracking-wider font-semibold">/hr</div>
              <div className="text-sm md:text-base font-mono font-bold gradient-gold-text">{formatCompactCurrency(breakdown.perHour)}</div>
            </div>
          </div>
        </div>

        {/* Shocking stat */}
        <p className="text-xs text-primary font-medium flex items-center gap-1 mb-3">
          <TrendingUp className="h-3 w-3" />
          {featured.shockingStat}
        </p>

        {/* CTA */}
        <Button 
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
        >
          View Full Profile
        </Button>
      </div>
    </Card>
  );
};

export default HeroSpotlight;
