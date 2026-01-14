import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, PieChart, DollarSign } from 'lucide-react';
import { GoldBars } from './GoldBars';
import { MogulMascot } from './MogulMascot';
import { cn } from '@/lib/utils';

interface PortfolioSummaryProps {
  cashBalance: number;
  portfolioValue: number;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export function PortfolioSummary({
  cashBalance,
  portfolioValue,
  totalValue,
  totalGainLoss,
  totalGainLossPercent,
}: PortfolioSummaryProps) {
  const isPositive = totalGainLoss >= 0;
  const mascotMood = totalGainLoss > 1000 
    ? 'excited' 
    : totalGainLoss > 0 
      ? 'happy' 
      : totalGainLoss < -1000 
        ? 'worried' 
        : 'neutral';

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-3xl">🎩</span>
            Mogul Markets Dashboard
          </CardTitle>
          <MogulMascot mood={mascotMood} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total Portfolio Value */}
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
          <p className="text-4xl md:text-5xl font-bold gradient-gold-text">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className={cn(
            "inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full",
            isPositive ? "bg-emerald-500/20" : "bg-red-500/20"
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={cn(
              "font-semibold",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}>
              {isPositive ? '+' : ''}${totalGainLoss.toFixed(2)} ({totalGainLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="h-4 w-4" />
              <span className="text-xs">Cash Balance</span>
            </div>
            <p className="text-xl font-bold text-emerald-400">
              ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PieChart className="h-4 w-4" />
              <span className="text-xs">Invested</span>
            </div>
            <p className="text-xl font-bold text-primary">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Gold Bars Visualization */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-card/30">
          <p className="text-sm text-muted-foreground mb-3">
            {isPositive ? '📈 Profit Stacks' : '📉 Loss Meter'}
          </p>
          <GoldBars amount={totalGainLoss} barValue={500} maxBars={25} />
        </div>

        {/* Starting Balance Reference */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <DollarSign className="h-3 w-3" />
          <span>Started with $10,000</span>
        </div>
      </CardContent>
    </Card>
  );
}
