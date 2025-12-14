import { useState, useEffect } from 'react';
import { generateComparisons, EnhancedComparison } from '@/lib/earnings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComparisonGridProps {
  annualEarnings: number;
  name: string;
}

const ComparisonGrid = ({ annualEarnings, name }: ComparisonGridProps) => {
  const allComparisons = generateComparisons(annualEarnings);
  const [displayedComparisons, setDisplayedComparisons] = useState<EnhancedComparison[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);

  // Shuffle and pick 9 comparisons for display
  useEffect(() => {
    const shuffled = [...allComparisons].sort(() => Math.random() - 0.5);
    setDisplayedComparisons(shuffled.slice(0, 9));
  }, [annualEarnings, shuffleKey]);

  const handleShuffle = () => {
    setShuffleKey(prev => prev + 1);
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Mind-Blowing Comparisons
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            What {name}'s earnings could buy — prepare to feel humbled
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShuffle}
          className="text-muted-foreground hover:text-primary"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Shuffle
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedComparisons.map((comparison, index) => (
            <div
              key={`${comparison.item}-${shuffleKey}`}
              className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{comparison.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-2xl text-primary">
                    {comparison.quantity.toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold">
                    {comparison.item}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {comparison.context}
                  </p>
                  <p className="text-xs font-medium text-primary/80 mt-2 italic">
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
