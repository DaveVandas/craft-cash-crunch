import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface GoldBarsProps {
  amount: number; // Total dollar amount
  barValue?: number; // Value each bar represents (default $1000)
  maxBars?: number; // Maximum bars to show
  className?: string;
}

export function GoldBars({ 
  amount, 
  barValue = 1000, 
  maxBars = 20,
  className 
}: GoldBarsProps) {
  const bars = useMemo(() => {
    const count = Math.min(Math.floor(amount / barValue), maxBars);
    return Array.from({ length: count }, (_, i) => i);
  }, [amount, barValue, maxBars]);

  const isPositive = amount >= 0;
  const displayAmount = Math.abs(amount);

  if (bars.length === 0 && displayAmount >= barValue) {
    // Show at least one bar if we have enough value
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <div className="flex items-end gap-0.5 h-12">
          <div 
            className={cn(
              "w-6 rounded-t transition-all duration-500",
              isPositive 
                ? "bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 shadow-lg shadow-amber-500/30" 
                : "bg-gradient-to-t from-red-700 via-red-500 to-red-400 shadow-lg shadow-red-500/30"
            )}
            style={{ height: '24px' }}
          />
        </div>
        <p className={cn(
          "text-xs font-medium",
          isPositive ? "text-amber-400" : "text-red-400"
        )}>
          {isPositive ? '+' : '-'}${(displayAmount / 1000).toFixed(1)}K
        </p>
      </div>
    );
  }

  if (bars.length === 0) {
    return (
      <div className={cn("flex flex-col items-center gap-2 opacity-50", className)}>
        <div className="flex items-end gap-0.5 h-12">
          <div className="w-6 h-4 rounded-t bg-muted border border-dashed border-muted-foreground/30" />
        </div>
        <p className="text-xs text-muted-foreground">$0</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-end gap-0.5 h-16 overflow-hidden">
        {bars.map((i) => {
          // Create staggered heights for visual interest
          const heightPercent = 50 + (i % 3) * 20 + Math.random() * 10;
          return (
            <div
              key={i}
              className={cn(
                "w-4 md:w-5 rounded-t transition-all duration-500",
                isPositive 
                  ? "bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 shadow-md shadow-amber-500/30" 
                  : "bg-gradient-to-t from-red-700 via-red-500 to-red-400 shadow-md shadow-red-500/30",
                "animate-in slide-in-from-bottom duration-500"
              )}
              style={{ 
                height: `${heightPercent}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          );
        })}
      </div>
      <p className={cn(
        "text-sm font-bold",
        isPositive ? "text-amber-400" : "text-red-400"
      )}>
        {isPositive ? '+' : '-'}${(displayAmount / 1000).toFixed(1)}K
      </p>
      {amount >= barValue && (
        <p className="text-xs text-muted-foreground">
          {bars.length} × ${(barValue / 1000).toFixed(0)}K
        </p>
      )}
    </div>
  );
}
