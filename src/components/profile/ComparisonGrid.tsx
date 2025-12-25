import { generateMogulComparisons, EnhancedComparison } from '@/lib/earnings';
import { pluralizeItem } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';

interface ComparisonGridProps {
  annualEarnings: number;
  name: string;
}

const periodLabels = {
  week: { label: 'Weekly Power', gradient: 'from-amber-500/20 to-amber-600/10' },
  month: { label: 'Monthly Empire', gradient: 'from-purple-500/20 to-purple-600/10' },
  year: { label: 'Annual Dynasty', gradient: 'from-emerald-500/20 to-emerald-600/10' },
};

const ComparisonGrid = ({ annualEarnings, name }: ComparisonGridProps) => {
  const comparisons = generateMogulComparisons(annualEarnings);

  if (comparisons.length === 0) return null;

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-primary" />
          Mogul Moves
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What {name} could acquire — real power plays
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisons.map((comparison, index) => {
            const config = periodLabels[comparison.period];
            return (
              <div
                key={comparison.period}
                className={`p-5 rounded-xl bg-gradient-to-br ${config.gradient} border border-border/30 hover:border-primary/40 transition-all duration-300 animate-slide-up group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {config.label}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {comparison.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-3xl text-primary">
                      {comparison.quantity.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {pluralizeItem(comparison.item, comparison.quantity)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comparison.context}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-medium text-primary/80 mt-3 text-right italic">
                  {comparison.timeframe}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonGrid;
