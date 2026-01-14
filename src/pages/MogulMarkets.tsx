import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Search, 
  BarChart3, 
  History, 
  Crown,
  Sparkles,
  RefreshCw,
  Loader2,
  DollarSign,
  Plus,
  Coins
} from 'lucide-react';
import { useTradingPortfolio } from '@/hooks/useTradingPortfolio';
import { PortfolioSummary } from '@/components/trading/PortfolioSummary';
import { StockSearch } from '@/components/trading/StockSearch';
import { PopularStocks } from '@/components/trading/PopularStocks';
import { PositionsList } from '@/components/trading/PositionsList';
import { OrderHistory } from '@/components/trading/OrderHistory';
import { TradeModal } from '@/components/trading/TradeModal';
import { MogulMascot } from '@/components/trading/MogulMascot';
import { MarketTicker } from '@/components/trading/MarketTicker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  sector?: string;
  dayHigh?: number;
  dayLow?: number;
  volume?: string;
  peRatio?: number | null;
}

const MogulMarkets = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    portfolio,
    isLoading,
    portfolioValue,
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    fetchPortfolio,
    executeBuy,
    executeSell,
  } = useTradingPortfolio();

  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBuyingCash, setIsBuyingCash] = useState(false);

  // Handle successful cash purchase return
  useEffect(() => {
    const purchased = searchParams.get('purchased');
    const portfolioId = searchParams.get('portfolio');
    
    if (purchased === 'true' && portfolioId) {
      // Verify and credit the purchase
      const verifyPurchase = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-mogul-cash', {
            body: { portfolioId },
          });
          
          if (error) throw error;
          
          if (data.success) {
            toast.success('💰 $20,000 added to your account!', {
              description: `New balance: $${data.newBalance.toLocaleString()}`,
            });
            fetchPortfolio();
          }
        } catch (err) {
          console.error('Error verifying purchase:', err);
        }
        
        // Clear URL params
        setSearchParams({});
      };
      
      verifyPurchase();
    }
  }, [searchParams, setSearchParams, fetchPortfolio]);

  const handleBuyCash = async () => {
    if (!portfolio) return;
    
    setIsBuyingCash(true);
    try {
      const { data, error } = await supabase.functions.invoke('buy-mogul-cash', {
        body: { portfolioId: portfolio.id },
      });
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error initiating cash purchase:', err);
      toast.error('Failed to start purchase', {
        description: 'Please try again.',
      });
    } finally {
      setIsBuyingCash(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    setIsTradeModalOpen(true);
  };

  const handleSelectTicker = async (ticker: string) => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-stock-data', {
        body: { action: 'search', query: ticker },
      });
      
      if (!error && data.stock) {
        setSelectedStock(data.stock);
        setIsTradeModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching stock:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectPosition = (ticker: string, currentPrice: number) => {
    const position = portfolio?.positions.find(p => p.ticker === ticker);
    if (position) {
      setSelectedStock({
        ticker: position.ticker,
        name: position.company_name,
        price: currentPrice,
        change: 0,
        changePercent: 0,
      });
      setIsTradeModalOpen(true);
    }
  };

  const handleRefreshPrices = async () => {
    if (!portfolio || portfolio.positions.length === 0) return;
    
    setIsRefreshing(true);
    try {
      const tickers = portfolio.positions.map(p => p.ticker);
      const { data, error } = await supabase.functions.invoke('get-stock-data', {
        body: { action: 'batch', tickers },
      });
      
      if (!error && data.stocks) {
        const prices: Record<string, number> = {};
        for (const [ticker, stockData] of Object.entries(data.stocks)) {
          prices[ticker] = (stockData as any).price;
        }
        // Update would be handled by the hook
        await fetchPortfolio();
      }
    } catch (err) {
      console.error('Error refreshing prices:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentShares = selectedStock 
    ? portfolio?.positions.find(p => p.ticker === selectedStock.ticker)?.shares || 0
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading your portfolio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Live Market Ticker */}
      <MarketTicker />
      
      <main className="flex-1 container py-10 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Paper Trading Simulator</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Mogul <span className="gradient-gold-text">Markets</span>
            </h1>
            <MogulMascot 
              mood={totalGainLoss > 0 ? 'happy' : totalGainLoss < 0 ? 'worried' : 'neutral'} 
              size="md" 
            />
          </div>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Start with $10,000 virtual cash. Trade real stocks. Build your empire.
            <span className="text-primary font-semibold"> No risk, all mogul vibes.</span>
          </p>

          {!user && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 max-w-lg mx-auto">
              <p className="text-sm text-amber-400">
                🎩 Playing as guest. <a href="/auth" className="underline font-semibold">Sign in</a> to save your progress!
              </p>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Portfolio Summary */}
          <div className="mb-8">
            <PortfolioSummary
              cashBalance={portfolio?.cash_balance || 10000}
              portfolioValue={portfolioValue}
              totalValue={totalValue}
              totalGainLoss={totalGainLoss}
              totalGainLossPercent={totalGainLossPercent}
            />
          </div>

          {/* Buy More Cash Upsell */}
          <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-primary/5 to-amber-500/10 mb-8">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <Coins className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Need more trading power?</p>
                    <p className="text-sm text-muted-foreground">Get $20,000 virtual cash for just $4.99</p>
                  </div>
                </div>
                <Button 
                  onClick={handleBuyCash}
                  disabled={isBuyingCash || !portfolio}
                  className="gap-2 bg-gradient-to-r from-amber-500 to-primary hover:from-amber-600 hover:to-primary/90"
                >
                  {isBuyingCash ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Buy Mogul Cash
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Trading Interface */}
          <Tabs defaultValue="trade" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trade" className="gap-2">
                <Search className="h-4 w-4" />
                Trade
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trade" className="space-y-6">
              {/* Stock Search */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="h-5 w-5 text-primary" />
                    Search Stocks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StockSearch onSelectStock={handleSelectStock} />
                </CardContent>
              </Card>

              {/* Popular Stocks */}
              <PopularStocks onSelectTicker={handleSelectTicker} />
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Holdings</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshPrices}
                  disabled={isRefreshing || !portfolio?.positions.length}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Prices
                </Button>
              </div>
              
              <PositionsList 
                positions={portfolio?.positions || []} 
                onSelectPosition={handleSelectPosition}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <OrderHistory orders={portfolio?.orders || []} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Trade Modal */}
      <TradeModal
        stock={selectedStock}
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        cashBalance={portfolio?.cash_balance || 0}
        currentShares={currentShares}
        onBuy={async (shares, price) => {
          if (!selectedStock) return false;
          return executeBuy(selectedStock.ticker, selectedStock.name, shares, price);
        }}
        onSell={async (shares, price) => {
          if (!selectedStock) return false;
          return executeSell(selectedStock.ticker, shares, price);
        }}
      />
    </div>
  );
};

export default MogulMarkets;
