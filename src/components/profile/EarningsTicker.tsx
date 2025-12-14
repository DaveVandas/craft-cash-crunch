import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { formatLargeCurrency, formatCompactCurrency } from '@/lib/earnings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock } from 'lucide-react';

interface EarningsTickerProps {
  annualEarnings: number;
  name: string;
}

const EarningsTicker = ({ annualEarnings, name }: EarningsTickerProps) => {
  const { currentEarnings, breakdown } = useEarningsTicker({ annualEarnings });

  const timeBreakdowns = [
    { label: 'Per Second', value: breakdown.perSecond },
    { label: 'Per Minute', value: breakdown.perMinute },
    { label: 'Per Hour', value: breakdown.perHour },
    { label: 'Per Day', value: breakdown.perDay },
    { label: 'Per Week', value: breakdown.perWeek },
    { label: 'Per Month', value: breakdown.perMonth },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 animate-pulse-gold overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Live Earnings Counter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {name} has earned since you opened this page:
          </p>
          <div className="font-mono text-4xl md:text-5xl font-bold gradient-gold-text ticker-number animate-count-up">
            {formatLargeCurrency(currentEarnings)}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            That's <span className="text-primary font-semibold">{formatLargeCurrency(breakdown.perSecond)}</span> every second
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {timeBreakdowns.map((item, index) => (
              <div 
                key={item.label} 
                className="p-4 rounded-lg bg-secondary/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="font-mono text-lg font-semibold text-foreground">
                  {formatCompactCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsTicker;
