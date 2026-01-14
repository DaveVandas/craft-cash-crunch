import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Crown,
  Loader2,
  Plus,
  Coins,
  Zap,
  GraduationCap
} from 'lucide-react';
import { useTradingPortfolio } from '@/hooks/useTradingPortfolio';
import { TradeModal } from '@/components/trading/TradeModal';
import { MogulMascot } from '@/components/trading/MogulMascot';
import { MarketTicker } from '@/components/trading/MarketTicker';
import { TradingCockpit } from '@/components/trading/TradingCockpit';
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
            <p className="text-lg text-muted-foreground">Initializing trading console...</p>
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
      
      <main className="flex-1 container py-6 md:py-8">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                Mogul <span className="gradient-gold-text">Markets</span>
              </h1>
            </div>
            <MogulMascot 
              mood={totalGainLoss > 0 ? 'happy' : totalGainLoss < 0 ? 'worried' : 'neutral'} 
              size="sm" 
            />
          </div>
          
          <div className="flex items-center gap-3">
            {!user && (
              <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400">
                  Guest mode • <a href="/auth" className="underline font-semibold">Sign in</a>
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleBuyCash}
              disabled={isBuyingCash || !portfolio}
              size="sm"
              className="gap-2 bg-gradient-to-r from-amber-500 to-primary hover:from-amber-600 hover:to-primary/90"
            >
              {isBuyingCash ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Coins className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Buy Cash</span>
              <span className="sm:hidden">+$</span>
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5">
          <CardContent className="py-2 px-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-muted-foreground">Markets Open</span>
                </div>
                <span className="text-muted-foreground hidden sm:inline">|</span>
                <span className="text-muted-foreground hidden sm:inline">Paper Trading Mode</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <Zap className="h-3 w-3" />
                <span className="font-medium">Real-time AI Data</span>
              </div>
              <Link to="/mogul-academy" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors">
                <GraduationCap className="h-3 w-3" />
                <span className="font-medium">Learn Trading</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trading Cockpit */}
        <TradingCockpit
          cashBalance={portfolio?.cash_balance || 10000}
          portfolioValue={portfolioValue}
          totalValue={totalValue}
          totalGainLoss={totalGainLoss}
          totalGainLossPercent={totalGainLossPercent}
          positions={portfolio?.positions || []}
          orders={portfolio?.orders || []}
          isRefreshing={isRefreshing}
          onSelectStock={handleSelectStock}
          onSelectPosition={handleSelectPosition}
          onSelectTicker={handleSelectTicker}
          onRefreshPrices={handleRefreshPrices}
        />
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
