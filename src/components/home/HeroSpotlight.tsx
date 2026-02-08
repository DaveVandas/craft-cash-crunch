import { useFeaturedCelebrity } from '@/contexts/FeaturedCelebrityContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
      className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 hover:border-primary/50 transition-all duration-500 cursor-pointer group shadow-xl shadow-primary/5"
      onClick={handleClick}
    >
      {/* Premium corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent" />
      
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-xl border border-primary/40" />
      </div>
      
      <div className={`relative p-5 md:p-6 transition-all duration-300 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Featured
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-background/50 rounded-full px-1 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 hover:bg-primary/10"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground font-medium px-1">{currentIndex + 1}/{totalCount}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full opacity-70 hover:opacity-100 hover:bg-primary/10"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Avatar and name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-18 w-18 md:h-20 md:w-20 border-2 border-primary/40 ring-4 ring-primary/10 shadow-xl">
              <AvatarImage src={featured.imageUrl} alt={featured.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-2xl">
                {getAvatarEmoji(featured.title)}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator style accent */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary border-2 border-card flex items-center justify-center">
              <span className="text-[10px]">👑</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl md:text-2xl font-bold truncate gradient-gold-text leading-tight">
              {featured.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-0.5">{featured.title}</p>
          </div>
        </div>

        {/* Earnings ticker - Premium card */}
        <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm rounded-xl p-4 mb-4 border border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-primary" />
            </div>
            <span>Earned since you arrived</span>
          </div>
          <div className="relative overflow-hidden font-mono text-2xl md:text-3xl font-bold gradient-gold-text">
            {formatLargeCurrency(currentEarnings)}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Compact earnings breakdown */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/20">
            {[
              { label: '/sec', value: breakdown.perSecond },
              { label: '/min', value: breakdown.perMinute },
              { label: '/hr', value: breakdown.perHour },
            ].map((item, idx) => (
              <div key={item.label} className="text-center flex-1">
                {idx > 0 && <div className="absolute left-0 w-px h-8 bg-primary/20" />}
                <div className="text-[10px] text-primary/60 uppercase tracking-wider font-semibold">{item.label}</div>
                <div className="text-sm md:text-base font-mono font-bold gradient-gold-text">{formatCompactCurrency(item.value)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shocking stat */}
        <p className="text-xs text-primary font-medium flex items-center gap-1.5 mb-4 bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
          <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-2">{featured.shockingStat}</span>
        </p>

        {/* CTA */}
        <Button 
          className="w-full bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary hover:to-primary/80 text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary transition-all duration-300 shadow-lg shadow-primary/10 group-hover:shadow-primary/20"
        >
          <span>View Full Profile</span>
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};

export default HeroSpotlight;
