import { useNavigate } from 'react-router-dom';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Share2, GitCompareArrows, ArrowLeft, Search, Trophy, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import FavoriteButton from '@/components/favorites/FavoriteButton';

interface ProfileHeroProps {
  celebrity: Celebrity;
  isLoading?: boolean;
}

const ProfileHero = ({ celebrity, isLoading }: ProfileHeroProps) => {
  const navigate = useNavigate();
  
  const categoryConfig: Record<string, { bgGradient: string }> = {
    'athletes': { bgGradient: 'from-amber-900/50 to-orange-900/50' },
    'hollywood': { bgGradient: 'from-purple-900/50 to-pink-900/50' },
    'musicians': { bgGradient: 'from-pink-900/50 to-rose-900/50' },
    'tech-billionaires': { bgGradient: 'from-blue-900/50 to-indigo-900/50' },
    'politicians': { bgGradient: 'from-slate-800/50 to-zinc-900/50' },
    'influencers': { bgGradient: 'from-fuchsia-900/50 to-violet-900/50' },
    'historical': { bgGradient: 'from-amber-900/50 to-yellow-900/50' }
  };

  const config = categoryConfig[celebrity.category] || { bgGradient: 'from-yellow-900/50 to-amber-900/50' };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      
      <div className="relative container py-12">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Link to="/search">
            <Button variant="outline" className="border-primary/30">
              <Search className="h-4 w-4 mr-2" />
              Search Another
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-2xl shadow-xl shadow-primary/10 ring-2 ring-primary/30">
            <AvatarImage
              src={celebrity.imageUrl}
              alt={celebrity.name}
              className="object-cover rounded-2xl"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '';
              }}
            />
            <AvatarFallback className={cn("rounded-2xl bg-gradient-to-br text-4xl md:text-5xl", config.bgGradient)}>
              {getAvatarEmoji(celebrity.profession)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {celebrity.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              {isLoading && (
                <Badge variant="secondary" className="animate-pulse">
                  Loading full profile...
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">
              {celebrity.name}
            </h1>
            
            <p className={cn("text-xl text-muted-foreground mb-6", isLoading && "animate-pulse")}>
              {celebrity.profession}
            </p>

            <div className="flex flex-wrap gap-6 mb-2">
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
            
            {celebrity.source && (
              <p className="text-xs text-muted-foreground/60 mb-4">
                Source: {celebrity.source.split(' - http')[0].split(' - https')[0]}
              </p>
            )}

            {celebrity.biggestDeal && (
              <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Biggest Deal</span>
                </div>
                <p className="text-sm text-foreground/90">{celebrity.biggestDeal}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <FavoriteButton 
                content={{ type: 'profile', celebrity }} 
                className="border border-border/50"
              />
              <Button 
                variant="outline" 
                className="border-border/50"
                onClick={() => navigate('/compare', { state: { person1: celebrity } })}
              >
                <GitCompareArrows className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Button 
                variant="outline" 
                className="border-border/50"
                onClick={() => navigate('/calculator', { state: { celebrity } })}
              >
                <Scale className="h-4 w-4 mr-2" />
                Reality Check
              </Button>
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
