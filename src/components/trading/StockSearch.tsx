import { useState, useCallback, useMemo } from 'react';
import { Search, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
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

interface StockSearchProps {
  onSelectStock: (stock: StockData) => void;
  className?: string;
}

export function StockSearch({ onSelectStock, className }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Use session-aware client for guests, standard client for authenticated users
  const db = useMemo(() => {
    if (user) return supabase;
    const sessionId = getOrCreateGuestSession();
    return createSupabaseWithSession(sessionId);
  }, [user]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setSearchResult(null);
    
    try {
      const { data, error: fnError } = await db.functions.invoke('get-stock-data', {
        body: { action: 'search', query: query.trim() },
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ticker or company (e.g., AAPL, Tesla)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch} 
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
