import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  DollarSign,
  BarChart3,
  History,
  Search,
  RefreshCw,
  Zap,
  Crown,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { GoldBars } from './GoldBars';
import { MogulMascot } from './MogulMascot';
import { StockSearch } from './StockSearch';

interface Position {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost_per_share: number;
  current_price: number | null;
}

interface Order {
  id: string;
  ticker: string;
  company_name: string;
  order_type: 'buy' | 'sell' | 'short' | 'cover';
  shares: number;
  price_per_share: number;
  total_amount: number;
  executed_at: string;
}

interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TradingCockpitProps {
  cashBalance: number;
  portfolioValue: number;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  positions: Position[];
  orders: Order[];
  isRefreshing: boolean;
  onSelectStock: (stock: StockData) => void;
  onSelectPosition: (ticker: string, currentPrice: number) => void;
  onSelectTicker: (ticker: string) => void;
  onRefreshPrices: () => void;
}

export function TradingCockpit({
  cashBalance,
  portfolioValue,
  totalValue,
  totalGainLoss,
  totalGainLossPercent,
  positions,
  orders,
  isRefreshing,
  onSelectStock,
  onSelectPosition,
  onSelectTicker,
  onRefreshPrices,
}: TradingCockpitProps) {
  const isPositive = totalGainLoss >= 0;
  const mascotMood = totalGainLoss > 1000 
    ? 'excited' 
    : totalGainLoss > 0 
      ? 'happy' 
      : totalGainLoss < -1000 
        ? 'worried' 
        : 'neutral';

  // Quick access tickers
  const quickTickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'META', 'GOOGL', 'AMZN', 'SPY'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left Panel - Portfolio Overview */}
      <div className="lg:col-span-4 space-y-4">
        {/* Main Portfolio Card */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm text-muted-foreground">NET WORTH</span>
              </div>
              <MogulMascot mood={mascotMood} size="sm" />
            </div>
            
            <p className="text-3xl md:text-4xl font-bold gradient-gold-text mb-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm",
              isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            )}>
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </span>
              <span className="text-xs opacity-75">
                ({isPositive ? '+' : ''}${totalGainLoss.toFixed(2)})
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span className="text-xs">CASH</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <PieChart className="h-4 w-4 text-primary" />
                <span className="text-xs">INVESTED</span>
              </div>
              <p className="text-lg font-bold text-primary">
                ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gold Bars */}
        <Card className="border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {isPositive ? '📈 Profit Stack' : '📉 Loss Meter'}
              </span>
              <span className={cn(
                "text-xs font-medium",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}>
                {isPositive ? '+' : ''}${Math.abs(totalGainLoss).toFixed(0)}
              </span>
            </div>
            <GoldBars amount={totalGainLoss} barValue={250} maxBars={20} />
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Trading Console */}
      <div className="lg:col-span-5 space-y-4">
        {/* Search & Quick Trade */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary" />
              Quick Trade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StockSearch onSelectStock={onSelectStock} />
            
            {/* Quick Access Tickers */}
            <div className="flex flex-wrap gap-1.5">
              {quickTickers.map((ticker) => (
                <Button
                  key={ticker}
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTicker(ticker)}
                  className="h-7 px-2 text-xs hover:bg-primary/20 hover:border-primary/50"
                >
                  {ticker}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Positions */}
        <Card className="border-border/30">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-primary" />
                Holdings
                {positions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {positions.length}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefreshPrices}
                disabled={isRefreshing || positions.length === 0}
                className="h-7 px-2"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <div className="text-center py-6">
                <Activity className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No positions yet</p>
                <p className="text-xs text-muted-foreground/60">Make your first trade above!</p>
              </div>
            ) : (
              <ScrollArea className="h-[240px]">
                <div className="space-y-2 pr-2">
                  {positions.map((position) => {
                    const currentPrice = position.current_price || position.avg_cost_per_share;
                    const marketValue = position.shares * currentPrice;
                    const costBasis = position.shares * position.avg_cost_per_share;
                    const gainLoss = marketValue - costBasis;
                    const gainLossPercent = ((currentPrice - position.avg_cost_per_share) / position.avg_cost_per_share) * 100;
                    const isPosPositive = gainLoss >= 0;

                    return (
                      <div
                        key={position.id}
                        onClick={() => onSelectPosition(position.ticker, currentPrice)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]",
                          isPosPositive 
                            ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
                            : "border-red-500/20 bg-red-500/5 hover:border-red-500/40"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{position.ticker}</span>
                            <span className={cn(
                              "text-xs font-medium px-1.5 py-0.5 rounded",
                              isPosPositive 
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            )}>
                              {isPosPositive ? '+' : ''}{gainLossPercent.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">${marketValue.toFixed(0)}</p>
                            <p className={cn(
                              "text-xs",
                              isPosPositive ? "text-emerald-400" : "text-red-400"
                            )}>
                              {isPosPositive ? '+' : ''}${gainLoss.toFixed(0)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                          <span>{position.shares.toFixed(1)} shares</span>
                          <span>@ ${position.avg_cost_per_share.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Activity Feed */}
      <div className="lg:col-span-3 space-y-4">
        {/* Recent Trades */}
        <Card className="border-border/30 h-full">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-primary" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-6">
                <Zap className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No trades yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-2">
                  {orders.slice(0, 15).map((order) => {
                    const isBuy = order.order_type === 'buy';
                    
                    return (
                      <div
                        key={order.id}
                        className={cn(
                          "p-2.5 rounded-lg border",
                          isBuy 
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {isBuy ? (
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                            )}
                            <span className="font-bold text-sm">{order.ticker}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] h-5",
                              isBuy ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"
                            )}
                          >
                            {order.order_type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {order.shares} @ ${order.price_per_share.toFixed(2)}
                          </span>
                          <span className={cn(
                            "font-medium",
                            isBuy ? "text-foreground" : "text-emerald-400"
                          )}>
                            {isBuy ? '-' : '+'}${order.total_amount.toFixed(0)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {formatDistanceToNow(new Date(order.executed_at), { addSuffix: true })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
