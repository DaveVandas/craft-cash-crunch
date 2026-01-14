import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerStock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isHot?: boolean;
}

// Simulated hot stocks data - in production this would come from the API
const generateHotStocks = (): TickerStock[] => {
  const baseStocks = [
    { ticker: 'NVDA', name: 'NVIDIA', basePrice: 875 },
    { ticker: 'TSLA', name: 'Tesla', basePrice: 248 },
    { ticker: 'AAPL', name: 'Apple', basePrice: 189 },
    { ticker: 'AMD', name: 'AMD', basePrice: 156 },
    { ticker: 'META', name: 'Meta', basePrice: 485 },
    { ticker: 'MSFT', name: 'Microsoft', basePrice: 425 },
    { ticker: 'GOOGL', name: 'Alphabet', basePrice: 175 },
    { ticker: 'AMZN', name: 'Amazon', basePrice: 186 },
    { ticker: 'NFLX', name: 'Netflix', basePrice: 628 },
    { ticker: 'SPY', name: 'S&P 500', basePrice: 523 },
    { ticker: 'QQQ', name: 'NASDAQ', basePrice: 445 },
    { ticker: 'PLTR', name: 'Palantir', basePrice: 24 },
  ];

  return baseStocks.map((stock, index) => {
    // Generate realistic-looking changes
    const volatility = Math.random() * 0.08 - 0.04; // -4% to +4%
    const change = stock.basePrice * volatility;
    const changePercent = volatility * 100;
    
    return {
      ticker: stock.ticker,
      name: stock.name,
      price: stock.basePrice + change,
      change: change,
      changePercent: changePercent,
      isHot: index < 3 || Math.abs(changePercent) > 2.5,
    };
  });
};

export function MarketTicker() {
  const [stocks, setStocks] = useState<TickerStock[]>(generateHotStocks());

  // Update prices periodically to simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => 
        prev.map(stock => {
          // Small random price movement
          const microChange = stock.price * (Math.random() * 0.002 - 0.001);
          const newPrice = stock.price + microChange;
          const newChange = stock.change + microChange;
          const newPercent = (newChange / (stock.price - stock.change)) * 100;
          
          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate stocks for seamless loop
  const tickerStocks = [...stocks, ...stocks];

  return (
    <div className="w-full bg-card/50 border-y border-border overflow-hidden">
      <div className="relative flex">
        <div className="animate-ticker flex gap-8 py-2 px-4">
          {tickerStocks.map((stock, index) => (
            <div 
              key={`${stock.ticker}-${index}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {stock.isHot && (
                <Flame className="h-3 w-3 text-orange-500 animate-pulse" />
              )}
              <span className="font-semibold text-foreground">
                {stock.ticker}
              </span>
              <span className="text-muted-foreground text-sm">
                ${stock.price.toFixed(2)}
              </span>
              <span 
                className={cn(
                  "flex items-center gap-0.5 text-sm font-medium",
                  stock.change >= 0 ? "text-emerald-500" : "text-red-500"
                )}
              >
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
