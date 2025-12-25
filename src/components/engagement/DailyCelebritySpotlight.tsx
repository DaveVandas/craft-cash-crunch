import { useFeaturedCelebrity } from '@/contexts/FeaturedCelebrityContext';
import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Celebrity } from '@/lib/types';

const DailyCelebritySpotlight = () => {
  const { featured, isTransitioning } = useFeaturedCelebrity();

  // Prefetch minimal celebrity data so Profile can render instantly (no skeleton flash)
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

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5">
      <Link to={`/profile/${featured.id}`} state={{ celebrity: prefetchedCelebrity }} className="block px-4 py-2.5">
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
              <span className="text-[10px] font-medium text-primary uppercase tracking-wide">Featured</span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{featured.title}</span>
            </div>

            <h3 className="font-serif text-base font-bold truncate leading-tight">{featured.name}</h3>

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
