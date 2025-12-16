import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFeaturedCelebrity } from '@/contexts/FeaturedCelebrityContext';

const DailyCelebritySpotlight = () => {
  const [dismissed, setDismissed] = useState(false);
  const { featured, isTransitioning } = useFeaturedCelebrity();

  useEffect(() => {
    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem('spotlight_dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('spotlight_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-50 hover:opacity-100 z-10"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      <Link to={`/profile/${featured.id}`} className="block px-4 py-2.5">
        <div 
          className={`flex items-center gap-3 transition-all duration-150 ${
            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-gold">
              <Star className="h-4 w-4 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
                Featured
              </span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{featured.title}</span>
            </div>
            
            <h3 className="font-serif text-base font-bold truncate leading-tight">
              {featured.name}
            </h3>
            
            <p className="text-xs text-primary font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {featured.shockingStat}
            </p>
          </div>

          <div className="flex-shrink-0 hidden sm:block">
            <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
              Explore
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default DailyCelebritySpotlight;
