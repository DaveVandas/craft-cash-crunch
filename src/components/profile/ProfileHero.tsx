import { Celebrity } from '@/lib/types';
import { formatCompactCurrency } from '@/lib/earnings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, GitCompareArrows } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProfileHeroProps {
  celebrity: Celebrity;
}

const ProfileHero = ({ celebrity }: ProfileHeroProps) => {
  const categoryConfig: Record<string, { emoji: string; animation: string; bgGradient: string }> = {
    'athletes': { emoji: '🏆', animation: 'animate-bounce-wobble', bgGradient: 'from-amber-900/50 to-orange-900/50' },
    'hollywood': { emoji: '🎬', animation: 'animate-pulse-scale', bgGradient: 'from-purple-900/50 to-pink-900/50' },
    'musicians': { emoji: '🎵', animation: 'animate-bounce-wobble', bgGradient: 'from-pink-900/50 to-rose-900/50' },
    'tech-billionaires': { emoji: '🚀', animation: 'animate-float', bgGradient: 'from-blue-900/50 to-indigo-900/50' },
    'politicians': { emoji: '🏛️', animation: 'animate-wiggle', bgGradient: 'from-slate-800/50 to-zinc-900/50' },
    'influencers': { emoji: '📱', animation: 'animate-wiggle', bgGradient: 'from-fuchsia-900/50 to-violet-900/50' },
    'historical': { emoji: '📜', animation: 'animate-float', bgGradient: 'from-amber-900/50 to-yellow-900/50' }
  };

  const config = categoryConfig[celebrity.category] || { emoji: '💰', animation: 'animate-pulse-scale', bgGradient: 'from-yellow-900/50 to-amber-900/50' };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      
      <div className="relative container py-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className={cn(
            "flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl shadow-primary/10 ring-2 ring-primary/30",
            config.bgGradient
          )}>
            <span className={cn("text-6xl md:text-7xl", config.animation)}>
              {config.emoji}
            </span>
          </div>

          <div className="flex-1 animate-fade-in">
            <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
              {celebrity.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">
              {celebrity.name}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {celebrity.profession}
            </p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className="text-2xl font-bold gradient-gold-text">
                  {formatCompactCurrency(celebrity.netWorth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Earnings</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCompactCurrency(celebrity.annualEarnings)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={`/compare?person1=${celebrity.id}`}>
                <Button variant="outline" className="border-border/50">
                  <GitCompareArrows className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-border/50"
                onClick={() => {
                  const shareSection = document.getElementById('share-card');
                  shareSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
