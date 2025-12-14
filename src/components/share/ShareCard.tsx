import { useRef } from 'react';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, formatCurrency, calculateEarningsBreakdown, generateComparisons } from '@/lib/earnings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Twitter, Facebook, DollarSign, Clock, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ShareCardProps {
  celebrity: Celebrity;
  userSalary?: number;
}

const ShareCard = ({ celebrity, userSalary }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const breakdown = calculateEarningsBreakdown(celebrity.annualEarnings);
  const comparisons = generateComparisons(celebrity.annualEarnings);
  
  // Get diverse comparisons for visual appeal
  const topComparisons = comparisons.slice(0, 4);

  const handleShare = async (platform: 'twitter' | 'facebook' | 'copy') => {
    const text = `💰 ${celebrity.name} Stats:\n• Earns ${formatCompactCurrency(breakdown.perSecond)}/second\n• ${formatCompactCurrency(breakdown.perHour)}/hour\n• ${formatCompactCurrency(celebrity.annualEarnings)}/year\n\nThat's ${topComparisons[0]?.quantity.toLocaleString()} ${topComparisons[0]?.item} ${topComparisons[0]?.timeframe}! 🤯`;
    
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
    <div id="share-card" className="space-y-6">
      {/* Baseball Card Style */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-card to-primary/20 border-2 border-primary/40 shadow-2xl"
      >
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-primary/80 to-primary/60 px-6 py-3 flex items-center justify-between">
          <span className="font-serif text-sm font-semibold text-primary-foreground tracking-wide uppercase">
            Wealth Card
          </span>
          <span className="text-2xl">💎</span>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Header with Name */}
          <div className="text-center border-b border-border/30 pb-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold gradient-gold-text mb-1">
              {celebrity.name}
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">
              {celebrity.profession}
            </p>
          </div>

          {/* Annual Earnings - Hero Stat */}
          <div className="text-center py-4 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Annual Earnings</p>
            <p className="text-4xl md:text-5xl font-bold gradient-gold-text">
              {formatCompactCurrency(celebrity.annualEarnings)}
            </p>
          </div>

          {/* Stats Grid - Like a Baseball Card */}
          <div className="grid grid-cols-2 gap-3">
            <StatBox 
              icon={<Zap className="h-4 w-4" />}
              label="Per Second" 
              value={formatCurrency(breakdown.perSecond)} 
            />
            <StatBox 
              icon={<Clock className="h-4 w-4" />}
              label="Per Minute" 
              value={formatCurrency(breakdown.perMinute)} 
            />
            <StatBox 
              icon={<TrendingUp className="h-4 w-4" />}
              label="Per Hour" 
              value={formatCurrency(breakdown.perHour)} 
            />
            <StatBox 
              icon={<DollarSign className="h-4 w-4" />}
              label="Per Day" 
              value={formatCurrency(breakdown.perDay)} 
            />
          </div>

          {/* Fun Comparisons */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">
              What This Buys
            </p>
            <div className="grid grid-cols-2 gap-2">
              {topComparisons.map((comparison, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/30"
                >
                  <span className="text-2xl">{comparison.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate">
                      {comparison.quantity.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {comparison.item}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {comparison.timeframe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Salary Comparison */}
          {userSalary && userSalary > 0 && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Your Reality Check</p>
              <p className="text-sm">
                Makes your yearly salary ({formatCompactCurrency(userSalary)}) in just{' '}
                <span className="text-primary font-bold">
                  {((userSalary / celebrity.annualEarnings) * 365 * 24 * 60).toFixed(1)} minutes
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-secondary/80 to-secondary/50 px-6 py-2 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Wealth Perspective</span>
          <span className="text-xs">•</span>
          <span className="text-xs text-muted-foreground">{new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Share Buttons */}
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

// Stat Box Component
const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-secondary/30 border border-border/20 text-center">
    <div className="flex items-center justify-center gap-1 text-primary mb-1">
      {icon}
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default ShareCard;
