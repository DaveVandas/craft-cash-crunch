import { generateComparisons } from '@/lib/earnings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface ComparisonGridProps {
  annualEarnings: number;
  name: string;
}

const ComparisonGrid = ({ annualEarnings, name }: ComparisonGridProps) => {
  const comparisons = generateComparisons(annualEarnings);

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Fun Comparisons
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What {name}'s earnings could buy
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.slice(0, 9).map((comparison, index) => (
            <div
              key={comparison.item}
              className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{comparison.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">
                    Could buy
                  </p>
                  <p className="font-semibold text-lg text-primary">
                    {comparison.quantity.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium truncate">
                    {comparison.item}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {comparison.timeframe}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonGrid;
