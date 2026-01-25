import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, Loader2, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getOrCreateGuestSession, createSupabaseWithSession } from '@/lib/supabaseWithSession';

interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  sector: string;
  dayHigh: number;
  dayLow: number;
  volume: string;
  peRatio: number | null;
}

interface StockSuggestion {
  ticker: string;
  name: string;
  sector?: string;
  isHot?: boolean;
}

interface StockSearchWithAutocompleteProps {
  onSelectStock: (stock: StockData) => void;
  className?: string;
}

// Popular stocks for suggestions
const POPULAR_STOCKS: StockSuggestion[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', isHot: true },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', isHot: true },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', isHot: true },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financial' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financial' },
  { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Financial' },
  { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'Index Fund' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust (NASDAQ)', sector: 'Index Fund' },
  // Crypto
  { ticker: 'BTC', name: 'Bitcoin', sector: 'Crypto', isHot: true },
  { ticker: 'ETH', name: 'Ethereum', sector: 'Crypto' },
  { ticker: 'SOL', name: 'Solana', sector: 'Crypto' },
  { ticker: 'DOGE', name: 'Dogecoin', sector: 'Crypto' },
];

export function StockSearchWithAutocomplete({ onSelectStock, className }: StockSearchWithAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { user } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use session-aware client for guests, standard client for authenticated users
  const db = useMemo(() => {
    if (user) return supabase;
    const sessionId = getOrCreateGuestSession();
    return createSupabaseWithSession(sessionId);
  }, [user]);

  // Filter suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim()) {
      // Show hot stocks when no query
      return POPULAR_STOCKS.filter(s => s.isHot).slice(0, 5);
    }
    
    const q = query.toLowerCase();
    return POPULAR_STOCKS
      .filter(s => 
        s.ticker.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setSearchResult(null);
    setShowSuggestions(false);
    
    try {
      const { data, error: fnError } = await db.functions.invoke('get-stock-data', {
        body: { action: 'search', query: finalQuery.trim() },
      });
      
      if (fnError) throw fnError;
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      if (data.stock) {
        setSearchResult(data.stock);
      } else {
        setError('Stock not found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [query, db]);

  const handleSelectSuggestion = (suggestion: StockSuggestion) => {
    setQuery(suggestion.ticker);
    handleSearch(suggestion.ticker);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search ticker or company (e.g., AAPL, Tesla, BTC)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoComplete="off"
            />
          </div>
          <Button 
            onClick={() => handleSearch()} 
            disabled={isSearching || !query.trim()}
            className="gap-2"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && !searchResult && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
            <div className="p-2 border-b border-border/50">
              <span className="text-xs text-muted-foreground px-2">
                {query.trim() ? 'Matching stocks' : '🔥 Hot stocks'}
              </span>
            </div>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.ticker}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={cn(
                    "px-4 py-3 cursor-pointer flex items-center justify-between transition-colors",
                    index === selectedIndex ? "bg-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm w-14">{suggestion.ticker}</span>
                    <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                      {suggestion.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {suggestion.isHot && (
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                    )}
                    {suggestion.sector && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {suggestion.sector}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      {searchResult && (
        <Card 
          className="border-primary/30 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => onSelectStock(searchResult)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{searchResult.ticker}</span>
                  <span className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
                    searchResult.change >= 0 
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {searchResult.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {searchResult.change >= 0 ? '+' : ''}{searchResult.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{searchResult.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{searchResult.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${searchResult.price.toFixed(2)}</p>
                <p className={cn(
                  "text-sm",
                  searchResult.change >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {searchResult.change >= 0 ? '+' : ''}${searchResult.change.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Day High</p>
                <p className="text-sm font-medium">${searchResult.dayHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Day Low</p>
                <p className="text-sm font-medium">${searchResult.dayLow.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Market Cap</p>
                <p className="text-sm font-medium">{searchResult.marketCap}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Volume</p>
                <p className="text-sm font-medium">{searchResult.volume}</p>
              </div>
            </div>
            
            <p className="text-xs text-primary mt-3 text-center">
              Click to trade this stock →
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
