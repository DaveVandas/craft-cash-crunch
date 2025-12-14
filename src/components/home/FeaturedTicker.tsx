import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency } from '@/lib/earnings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface FeaturedPerson {
  id: string;
  name: string;
  title: string;
  annualEarnings: number;
  imageEmoji: string;
}

const featuredPeople: FeaturedPerson[] = [
  { id: 'elon-musk', name: 'Elon Musk', title: 'Tech Billionaire', annualEarnings: 23500000000, imageEmoji: '🚀' },
  { id: 'lebron-james', name: 'LeBron James', title: 'NBA Legend', annualEarnings: 119500000, imageEmoji: '🏀' },
  { id: 'taylor-swift', name: 'Taylor Swift', title: 'Pop Icon', annualEarnings: 185000000, imageEmoji: '🎤' },
  { id: 'cristiano-ronaldo', name: 'Cristiano Ronaldo', title: 'Soccer Star', annualEarnings: 260000000, imageEmoji: '⚽' },
];

const FeaturedTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = featuredPeople[currentIndex];
  
  const { currentEarnings, breakdown } = useEarningsTicker({ 
    annualEarnings: featured.annualEarnings 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredPeople.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 animate-pulse-gold">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Live Earnings</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-4xl shadow-lg shadow-primary/20">
              {featured.imageEmoji}
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">
                {featured.name}
              </h2>
              <p className="text-muted-foreground">{featured.title}</p>
            </div>
          </div>

          <div className="flex-1 text-center md:text-right">
            <p className="text-sm text-muted-foreground mb-1">
              Earned since you opened this page
            </p>
            <div className="font-mono text-3xl md:text-4xl font-bold gradient-gold-text ticker-number">
              {formatLargeCurrency(currentEarnings)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              That's <span className="text-primary font-semibold">
                {formatLargeCurrency(breakdown.perSecond)}
              </span> per second
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
          <div className="flex gap-2">
            {featuredPeople.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
          
          <Link to={`/profile/${featured.id}`}>
            <Button variant="ghost" className="group">
              View Full Profile
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedTicker;
