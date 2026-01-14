import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Position {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost_per_share: number;
  current_price: number | null;
}

interface PositionsListProps {
  positions: Position[];
  onSelectPosition: (ticker: string, currentPrice: number) => void;
}

export function PositionsList({ positions, onSelectPosition }: PositionsListProps) {
  if (positions.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No positions yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Search for a stock above to make your first trade!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Your Positions ({positions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {positions.map((position) => {
          const currentPrice = position.current_price || position.avg_cost_per_share;
          const marketValue = position.shares * currentPrice;
          const costBasis = position.shares * position.avg_cost_per_share;
          const gainLoss = marketValue - costBasis;
          const gainLossPercent = ((currentPrice - position.avg_cost_per_share) / position.avg_cost_per_share) * 100;
          const isPositive = gainLoss >= 0;

          return (
            <div
              key={position.id}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer hover:scale-[1.01]",
                isPositive 
                  ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                  : "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
              )}
              onClick={() => onSelectPosition(position.ticker, currentPrice)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{position.ticker}</span>
                    <span className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                      isPositive 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    )}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {position.company_name}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-emerald-400" : "text-red-400"
                  )}>
                    {isPositive ? '+' : ''}${gainLoss.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Shares</p>
                  <p className="text-sm font-medium">{position.shares.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Cost</p>
                  <p className="text-sm font-medium">${position.avg_cost_per_share.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-sm font-medium">${currentPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
