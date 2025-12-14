import { useRef } from 'react';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, generateComparisons } from '@/lib/earnings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';

interface ShareCardProps {
  celebrity: Celebrity;
  userSalary?: number;
}

const ShareCard = ({ celebrity, userSalary }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const comparisons = generateComparisons(celebrity.annualEarnings);
  const topComparison = comparisons[0];

  const handleShare = async (platform: 'twitter' | 'facebook' | 'copy') => {
    const text = `Did you know? ${celebrity.name} earns ${formatCompactCurrency(celebrity.annualEarnings)} per year - that's ${topComparison.quantity.toLocaleString()} ${topComparison.item} ${topComparison.timeframe}! 🤯`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`, '_blank');
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-card to-primary/10 p-8 border border-primary/30"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">💎</span>
            <span className="font-serif text-lg font-semibold gradient-gold-text">
              Wealth Perspective
            </span>
          </div>

          <div className="mb-6">
            <h2 className="font-serif text-3xl font-bold mb-2">
              {celebrity.name}
            </h2>
            <p className="text-muted-foreground">{celebrity.profession}</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">Annual Earnings</p>
              <p className="text-3xl font-bold gradient-gold-text">
                {formatCompactCurrency(celebrity.annualEarnings)}
              </p>
            </div>

            {topComparison && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">That's enough to buy</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{topComparison.emoji}</span>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {topComparison.quantity.toLocaleString()}
                    </p>
                    <p className="font-medium">
                      {topComparison.item} {topComparison.timeframe}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {userSalary && userSalary > 0 && (
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  Makes your yearly salary ({formatCompactCurrency(userSalary)}) in just{' '}
                  <span className="text-primary font-semibold">
                    {((userSalary / celebrity.annualEarnings) * 365 * 24 * 60).toFixed(1)} minutes
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-4">Share this card</p>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleShare('twitter')}
              variant="outline"
              className="flex-1"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button 
              onClick={() => handleShare('facebook')}
              variant="outline"
              className="flex-1"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button 
              onClick={() => handleShare('copy')}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareCard;
