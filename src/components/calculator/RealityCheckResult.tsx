import { calculateTimeToEarn, formatCompactCurrency, formatLargeCurrency } from '@/lib/earnings';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, TrendingUp, Calendar, DollarSign, Info } from 'lucide-react';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';

interface RealityCheckResultProps {
  userSalary: number;
  celebrityName: string;
  celebrityAnnualEarnings: number;
}

const RealityCheckResult = ({ 
  userSalary, 
  celebrityName, 
  celebrityAnnualEarnings 
}: RealityCheckResultProps) => {
  const { currentEarnings, breakdown } = useEarningsTicker({ 
    annualEarnings: userSalary 
  });

  if (!userSalary || userSalary <= 0) return null;

  const timeToEarnUserSalary = calculateTimeToEarn(userSalary, celebrityAnnualEarnings);
  const ratio = Math.round(celebrityAnnualEarnings / userSalary);
  const yearsToCatchUp = Math.round(celebrityAnnualEarnings / userSalary);

  const stats = [
    {
      icon: Clock,
      label: `${celebrityName} earns your yearly salary in`,
      value: timeToEarnUserSalary,
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      label: 'They make',
      value: `${ratio.toLocaleString()}x`,
      suffix: 'what you make',
      color: 'text-emerald-400'
    },
    {
      icon: Calendar,
      label: 'It would take you',
      value: `${yearsToCatchUp.toLocaleString()} years`,
      suffix: 'to earn what they make in 1 year',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-primary">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">Reality Check Results</span>
      </div>

      {/* User's Live Earnings Ticker */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-card to-emerald-900/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-emerald-400">Your Live Earnings</span>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              You've earned since opening this page
            </p>
            <div className="font-mono text-4xl md:text-5xl font-bold text-emerald-400 ticker-number">
              {formatLargeCurrency(currentEarnings)}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Per Second</p>
              <p className="font-mono text-sm font-semibold text-emerald-400">
                ${breakdown.perSecond.toFixed(4)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Per Minute</p>
              <p className="font-mono text-sm font-semibold text-emerald-400">
                ${breakdown.perMinute.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Per Hour</p>
              <p className="font-mono text-sm font-semibold text-emerald-400">
                ${breakdown.perHour.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Per Day</p>
              <p className="font-mono text-sm font-semibold text-emerald-400">
                ${breakdown.perDay.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">How we calculate this:</span> Your annual salary divided across 24 hours a day, 7 days a week, 365 days a year. This gives you a real perspective on how your earnings break down over time.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label}
            className="border-border/50 bg-card/50 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.suffix && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {stat.suffix}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-lg mb-2">
            💡 While {celebrityName} makes{' '}
            <span className="font-bold text-primary">
              {formatCompactCurrency(celebrityAnnualEarnings)}
            </span>{' '}
            per year...
          </p>
          <p className="text-muted-foreground">
            Remember: wealth isn't everything. But it sure makes for some wild comparisons! 🎉
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealityCheckResult;
