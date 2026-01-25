import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
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
  currentShortedShares: number;
  onBuy: (shares: number, price: number) => Promise<boolean>;
  onSell: (shares: number, price: number) => Promise<boolean>;
  onShort: (shares: number, price: number) => Promise<boolean>;
  onCover: (shares: number, price: number) => Promise<boolean>;
}

export function TradeModal({
  stock,
  isOpen,
  onClose,
  cashBalance,
  currentShares,
  currentShortedShares,
  onBuy,
  onSell,
  onShort,
  onCover,
}: TradeModalProps) {
  const [shares, setShares] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'short' | 'cover'>('buy');

  if (!stock) return null;

  // Crypto tickers that support fractional shares
  const CRYPTO_TICKERS = ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK', 'LTC', 'BCH'];
  const isCrypto = CRYPTO_TICKERS.includes(stock.ticker.toUpperCase()) || 
                   stock.ticker.toUpperCase().endsWith('-USD') ||
                   stock.name.toLowerCase().includes('bitcoin') ||
                   stock.name.toLowerCase().includes('ethereum') ||
                   stock.name.toLowerCase().includes('crypto');
  
  const allowDecimals = isCrypto;

  const totalCost = shares * stock.price;
  const canAfford = totalCost <= cashBalance;
  const canSell = shares <= currentShares;
  const canCover = shares <= currentShortedShares;
  
  // Short selling requires 50% margin
  const marginRequired = totalCost * 0.5;
  const canShort = marginRequired <= cashBalance;
  
  // For crypto, allow fractional; for stocks use floor
  const maxAffordableShares = isCrypto 
    ? Math.floor((cashBalance / stock.price) * 10000) / 10000  // 4 decimal places
    : Math.floor(cashBalance / stock.price);
  const maxShortableShares = isCrypto
    ? Math.floor(((cashBalance * 2) / stock.price) * 10000) / 10000
    : Math.floor((cashBalance * 2) / stock.price);

  const handleTrade = async () => {
    if (shares <= 0) return;
    
    setIsExecuting(true);
    try {
      let success = false;
      
      if (activeTab === 'buy') {
        success = await onBuy(shares, stock.price);
      } else if (activeTab === 'sell') {
        success = await onSell(shares, stock.price);
      } else if (activeTab === 'short') {
        success = await onShort(shares, stock.price);
      } else if (activeTab === 'cover') {
        success = await onCover(shares, stock.price);
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
    } else if (activeTab === 'sell') {
      const sellShares = Math.floor(currentShares * percent);
      setShares(Math.max(1, sellShares));
    } else if (activeTab === 'short') {
      const maxShares = Math.floor((cashBalance * 2 * percent) / stock.price);
      setShares(Math.max(1, maxShares));
    } else if (activeTab === 'cover') {
      const coverShares = Math.floor(currentShortedShares * percent);
      setShares(Math.max(1, coverShares));
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell' | 'short' | 'cover')}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buy" className="gap-1 text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Buy</span>
            </TabsTrigger>
            <TabsTrigger value="sell" className="gap-1 text-xs sm:text-sm" disabled={currentShares === 0}>
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sell</span>
            </TabsTrigger>
            <TabsTrigger value="short" className="gap-1 text-xs sm:text-sm">
              <ArrowDownCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Short</span>
            </TabsTrigger>
            <TabsTrigger value="cover" className="gap-1 text-xs sm:text-sm" disabled={currentShortedShares === 0}>
              <ArrowUpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Cover</span>
            </TabsTrigger>
          </TabsList>

          {/* BUY TAB */}
          <TabsContent value="buy" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="buy-shares">{isCrypto ? 'Amount' : 'Number of Shares'}</Label>
              <NumericInput
                id="buy-shares"
                value={shares}
                onChange={setShares}
                allowDecimals={allowDecimals}
                min={allowDecimals ? 0.0001 : 1}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max affordable: {allowDecimals ? maxAffordableShares.toFixed(4) : maxAffordableShares} {isCrypto ? stock.ticker : 'shares'}
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

          {/* SELL TAB */}
          <TabsContent value="sell" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="sell-shares">{isCrypto ? 'Amount' : 'Number of Shares'}</Label>
              <NumericInput
                id="sell-shares"
                value={shares}
                onChange={setShares}
                allowDecimals={allowDecimals}
                min={allowDecimals ? 0.0001 : 1}
                max={currentShares}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You own: {allowDecimals ? currentShares.toFixed(4) : currentShares} {isCrypto ? stock.ticker : 'shares'}
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

          {/* SHORT TAB */}
          <TabsContent value="short" className="space-y-4 mt-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-2">
              <p className="text-xs text-amber-400">
                🐻 <strong>Short selling:</strong> Borrow & sell shares now, buy back later. Profit if price drops. 50% margin required.
              </p>
            </div>
            
            <div>
              <Label htmlFor="short-shares">{isCrypto ? 'Amount to Short' : 'Number of Shares to Short'}</Label>
              <NumericInput
                id="short-shares"
                value={shares}
                onChange={setShares}
                allowDecimals={allowDecimals}
                min={allowDecimals ? 0.0001 : 1}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max shortable: {allowDecimals ? maxShortableShares.toFixed(4) : maxShortableShares} {isCrypto ? stock.ticker : 'shares'} (50% margin)
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
                <span className="text-muted-foreground">You'll Receive</span>
                <span className="font-medium text-emerald-400">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Margin Required (50%)</span>
                <span className="font-medium">${marginRequired.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Cash Available</span>
                <span className={cn(
                  "font-medium",
                  !canShort && "text-red-400"
                )}>
                  ${cashBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <Button 
              className="w-full gap-2 bg-amber-600 hover:bg-amber-700" 
              size="lg"
              disabled={!canShort || shares <= 0 || isExecuting}
              onClick={handleTrade}
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowDownCircle className="h-4 w-4" />
              )}
              {canShort ? `Short ${shares} Shares` : 'Insufficient Margin'}
            </Button>
          </TabsContent>

          {/* COVER TAB */}
          <TabsContent value="cover" className="space-y-4 mt-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-2">
              <p className="text-xs text-blue-400">
                📈 <strong>Cover position:</strong> Buy back shares to close your short. You owe {currentShortedShares} shares.
              </p>
            </div>
            
            <div>
              <Label htmlFor="cover-shares">{isCrypto ? 'Amount to Cover' : 'Number of Shares to Cover'}</Label>
              <NumericInput
                id="cover-shares"
                value={shares}
                onChange={setShares}
                allowDecimals={allowDecimals}
                min={allowDecimals ? 0.0001 : 1}
                max={currentShortedShares}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You owe: {allowDecimals ? currentShortedShares.toFixed(4) : currentShortedShares} {isCrypto ? stock.ticker : 'shares'}
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
                <span className="text-muted-foreground">Cost to Cover</span>
                <span className="font-medium">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Short</span>
                <span className="font-medium">{currentShortedShares - shares} shares</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Cash Available</span>
                <span className={cn(
                  "font-medium",
                  !canAfford && "text-red-400"
                )}>
                  ${cashBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <Button 
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700" 
              size="lg"
              disabled={!canCover || !canAfford || shares <= 0 || isExecuting}
              onClick={handleTrade}
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpCircle className="h-4 w-4" />
              )}
              {canCover && canAfford ? `Cover ${shares} Shares` : !canAfford ? 'Insufficient Funds' : 'Insufficient Short'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
