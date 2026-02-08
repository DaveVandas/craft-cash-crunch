import { useNavigate } from 'react-router-dom';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Share2, GitCompareArrows, ArrowLeft, Search, Trophy, Scale, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { HowWeCalculateModal } from '@/components/info/HowWeCalculateModal';

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
  const isBillionaire = celebrity.netWorth >= 1_000_000_000;

  return (
    <div className="relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <div className="relative container py-10 md:py-14">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="group hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Link to="/search">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:border-primary/50">
              <Search className="h-4 w-4 mr-2" />
              Search Another
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10">
          {/* Avatar with premium styling */}
          <div className="relative">
            <Avatar className="h-36 w-36 md:h-44 md:w-44 rounded-2xl shadow-2xl shadow-primary/15 ring-4 ring-primary/20 border-2 border-card">
              <AvatarImage
                src={celebrity.imageUrl}
                alt={celebrity.name}
                className="object-cover rounded-2xl"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '';
                }}
              />
              <AvatarFallback className={cn("rounded-2xl bg-gradient-to-br text-5xl md:text-6xl", config.bgGradient)}>
                {getAvatarEmoji(celebrity.profession)}
              </AvatarFallback>
            </Avatar>
            {/* Crown badge for billionaires */}
            {isBillionaire && (
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-card">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 animate-fade-in">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 px-3 py-1">
                {celebrity.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              {isBillionaire && (
                <Badge className="bg-gradient-to-r from-primary to-amber-500 text-primary-foreground border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Billionaire
                </Badge>
              )}
              {isLoading && (
                <Badge variant="secondary" className="animate-pulse">
                  Loading full profile...
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
              {celebrity.name}
            </h1>
            
            <p className={cn("text-xl md:text-2xl text-muted-foreground mb-8", isLoading && "animate-pulse")}>
              {celebrity.profession}
            </p>

            {/* Stats cards */}
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="px-5 py-3 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20">
                <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">Net Worth</p>
                <p className="text-2xl md:text-3xl font-bold gradient-gold-text">
                  {formatCompactCurrency(celebrity.netWorth)}
                </p>
              </div>
              <div className="px-5 py-3 rounded-xl bg-card/80 border border-border/50">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Annual Earnings</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {formatCompactCurrency(celebrity.annualEarnings)}
                </p>
              </div>
              <div className="flex items-end pb-1">
                <HowWeCalculateModal variant="link" />
              </div>
            </div>
            
            {celebrity.source && (
              <p className="text-xs text-muted-foreground/60 mb-6">
                Source: {celebrity.source.split(' - http')[0].split(' - https')[0]}
              </p>
            )}

            {celebrity.biggestDeal && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 border border-primary/20 shadow-sm">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Biggest Deal</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{celebrity.biggestDeal}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <FavoriteButton 
                content={{ type: 'profile', celebrity }} 
                className="border border-border/50 hover:border-primary/50 hover:bg-primary/5"
              />
              <Button 
                variant="outline" 
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => navigate('/compare', { state: { person1: celebrity } })}
              >
                <GitCompareArrows className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Button 
                variant="outline" 
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => navigate('/calculator', { state: { celebrity } })}
              >
                <Scale className="h-4 w-4 mr-2" />
                Reality Check
              </Button>
              <Button 
                variant="outline" 
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5"
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
