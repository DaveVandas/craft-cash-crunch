import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import { NumericInput } from '@/components/ui/numeric-input';
import { cn } from '@/lib/utils';

interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TradeModalProps {
  stock: StockData | null;
  isOpen: boolean;
  onClose: () => void;
  cashBalance: number;
  currentShares: number;
  onBuy: (shares: number, price: number) => Promise<boolean>;
  onSell: (shares: number, price: number) => Promise<boolean>;
}

export function TradeModal({
  stock,
  isOpen,
  onClose,
  cashBalance,
  currentShares,
  onBuy,
  onSell,
}: TradeModalProps) {
  const [shares, setShares] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  if (!stock) return null;

  const totalCost = shares * stock.price;
  const canAfford = totalCost <= cashBalance;
  const canSell = shares <= currentShares;
  
  const maxAffordableShares = Math.floor(cashBalance / stock.price);

  const handleTrade = async () => {
    if (shares <= 0) return;
    
    setIsExecuting(true);
    try {
      let success = false;
      
      if (activeTab === 'buy') {
        success = await onBuy(shares, stock.price);
      } else {
        success = await onSell(shares, stock.price);
      }
      
      if (success) {
        setShares(1);
        onClose();
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const setQuickAmount = (percent: number) => {
    if (activeTab === 'buy') {
      const maxShares = Math.floor((cashBalance * percent) / stock.price);
      setShares(Math.max(1, maxShares));
    } else {
      const sellShares = Math.floor(currentShares * percent);
      setShares(Math.max(1, sellShares));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl font-bold">{stock.ticker}</span>
            <span className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
              stock.change >= 0 
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            )}>
              {stock.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </DialogTitle>
          <DialogDescription>{stock.name}</DialogDescription>
        </DialogHeader>

        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-muted-foreground">Current Price</p>
          <p className="text-3xl font-bold">${stock.price.toFixed(2)}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="gap-2" disabled={currentShares === 0}>
              <TrendingDown className="h-4 w-4" />
              Sell {currentShares > 0 && `(${currentShares})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="buy-shares">Number of Shares</Label>
              <NumericInput
                id="buy-shares"
                value={shares}
                onChange={setShares}
                allowDecimals={false}
                min={1}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max affordable: {maxAffordableShares} shares
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(0.25)}>25%</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(0.5)}>50%</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(0.75)}>75%</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(1)}>Max</Button>
            </div>

            <div className="bg-card rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-medium">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cash Available</span>
                <span className="font-medium">${cashBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Remaining Cash</span>
                <span className={cn(
                  "font-medium",
                  !canAfford && "text-red-400"
                )}>
                  ${(cashBalance - totalCost).toFixed(2)}
                </span>
              </div>
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg"
              disabled={!canAfford || shares <= 0 || isExecuting}
              onClick={handleTrade}
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              {canAfford ? `Buy ${shares} Shares` : 'Insufficient Funds'}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="sell-shares">Number of Shares</Label>
              <NumericInput
                id="sell-shares"
                value={shares}
                onChange={setShares}
                allowDecimals={false}
                min={1}
                max={currentShares}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You own: {currentShares} shares
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(0.25)}>25%</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(0.5)}>50%</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(0.75)}>75%</Button>
              <Button variant="outline" size="sm" onClick={() => setQuickAmount(1)}>All</Button>
            </div>

            <div className="bg-card rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Proceeds</span>
                <span className="font-medium text-emerald-400">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Shares</span>
                <span className="font-medium">{currentShares - shares}</span>
              </div>
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg"
              variant="destructive"
              disabled={!canSell || shares <= 0 || isExecuting}
              onClick={handleTrade}
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {canSell ? `Sell ${shares} Shares` : 'Insufficient Shares'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
