import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatLargeCurrency } from '@/lib/earnings';

interface SpotlightCelebrity {
  name: string;
  slug: string;
  category: string;
  shockingStat: string;
}

// Pre-defined spotlight celebrities with shocking stats
const spotlightCelebrities: SpotlightCelebrity[] = [
  { name: 'Elon Musk', slug: 'elon-musk', category: 'Tech', shockingStat: 'Made $36 billion in a single day' },
  { name: 'Taylor Swift', slug: 'taylor-swift', category: 'Music', shockingStat: 'Earns $1.1M per concert performance' },
  { name: 'LeBron James', slug: 'lebron-james', category: 'Sports', shockingStat: 'Makes $125,000 per game played' },
  { name: 'Kylie Jenner', slug: 'kylie-jenner', category: 'Influencer', shockingStat: 'Earns $1.8M per Instagram post' },
  { name: 'Cristiano Ronaldo', slug: 'cristiano-ronaldo', category: 'Sports', shockingStat: 'Makes $3.2M per sponsored post' },
  { name: 'Jeff Bezos', slug: 'jeff-bezos', category: 'Tech', shockingStat: 'Made $13B in one day during pandemic' },
  { name: 'Beyoncé', slug: 'beyonce', category: 'Music', shockingStat: 'Earns $320K per hour she works' },
];

const DailyCelebritySpotlight = () => {
  const [spotlight, setSpotlight] = useState<SpotlightCelebrity | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem('spotlight_dismissed');
    if (dismissed === 'true') {
      setDismissed(true);
      return;
    }

    // Select random celebrity on each page load
    const randomIndex = Math.floor(Math.random() * spotlightCelebrities.length);
    setSpotlight(spotlightCelebrities[randomIndex]);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('spotlight_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed || !spotlight) return null;

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5 animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-50 hover:opacity-100"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      <Link to={`/profile/${spotlight.slug}`} className="block p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-gold">
              <Star className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Featured
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{spotlight.category}</span>
            </div>
            
            <h3 className="font-serif text-lg font-bold truncate">
              {spotlight.name}
            </h3>
            
            <p className="text-sm text-primary font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {spotlight.shockingStat}
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
