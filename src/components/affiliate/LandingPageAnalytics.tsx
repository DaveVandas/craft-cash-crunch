import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Crown,
  Home,
  Flame,
  Rocket,
  DollarSign
} from 'lucide-react';

interface VariantStats {
  variant: string;
  count: number;
  label: string;
  icon: React.ReactNode;
}

interface LandingPageAnalyticsProps {
  affiliateCode: string;
  referralsByVariant: Record<string, number>;
}

const VARIANT_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  'home': { 
    label: 'Homepage', 
    icon: <Home className="h-4 w-4" />,
    color: 'text-blue-400'
  },
  'ref': { 
    label: 'Your Referral Page', 
    icon: <Crown className="h-4 w-4" />,
    color: 'text-primary'
  },
  'landing-a': { 
    label: 'Landing A (Luxury)', 
    icon: <Crown className="h-4 w-4" />,
    color: 'text-amber-400'
  },
  'landing-b': { 
    label: 'Landing B (Wake Up)', 
    icon: <Flame className="h-4 w-4" />,
    color: 'text-orange-400'
  },
  'landing-c': { 
    label: 'Landing C (Stats)', 
    icon: <Rocket className="h-4 w-4" />,
    color: 'text-purple-400'
  },
  'landing-d': { 
    label: 'Landing D (Affiliate)', 
    icon: <DollarSign className="h-4 w-4" />,
    color: 'text-green-400'
  },
  'direct': { 
    label: 'Direct / Unknown', 
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-muted-foreground'
  },
  'other': { 
    label: 'Other Pages', 
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'text-muted-foreground'
  },
};

export function LandingPageAnalytics({ affiliateCode, referralsByVariant }: LandingPageAnalyticsProps) {
  const totalReferrals = Object.values(referralsByVariant).reduce((sum, count) => sum + count, 0);
  
  // Sort variants by count (highest first)
  const sortedVariants = Object.entries(referralsByVariant)
    .map(([variant, count]) => ({
      variant,
      count,
      ...(VARIANT_CONFIG[variant] || VARIANT_CONFIG['other'])
    }))
    .sort((a, b) => b.count - a.count);

  const topVariant = sortedVariants[0];

  if (totalReferrals === 0) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
            Landing Page Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No referrals yet!</p>
            <p className="text-sm mt-2">
              Share your marketing links to see which landing pages convert best.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Landing Page Performance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          See which landing pages drive the most signups
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Performer Highlight */}
        {topVariant && topVariant.count > 0 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-primary/20 ${topVariant.color}`}>
                  {topVariant.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="font-semibold">{topVariant.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{topVariant.count}</p>
                <p className="text-xs text-muted-foreground">
                  {((topVariant.count / totalReferrals) * 100).toFixed(0)}% of signups
                </p>
              </div>
            </div>
          </div>
        )}

        {/* All Variants Breakdown */}
        <div className="space-y-3">
          {sortedVariants.map(({ variant, count, label, icon, color }) => {
            const percentage = totalReferrals > 0 ? (count / totalReferrals) * 100 : 0;
            
            return (
              <div key={variant} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={color}>{icon}</span>
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{count}</span>
                    <Badge variant="outline" className="text-xs">
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: Focus on promoting your top-performing landing page to maximize conversions!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
