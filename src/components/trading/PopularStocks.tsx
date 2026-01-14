import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface PopularStock {
  ticker: string;
  name: string;
  sector: string;
}

interface PopularStocksProps {
  onSelectTicker: (ticker: string) => void;
}

export function PopularStocks({ onSelectTicker }: PopularStocksProps) {
  const [popular, setPopular] = useState<PopularStock[]>([]);
  const [indices, setIndices] = useState<PopularStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const { data, error } = await supabase.functions.invoke('get-stock-data', {
          body: { action: 'popular' },
        });
        
        if (error) throw error;
        
        if (data.popular) {
          setPopular(data.popular);
        }
        if (data.indices) {
          setIndices(data.indices);
        }
      } catch (err) {
        console.error('Error fetching popular stocks:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPopular();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-card/50 rounded-lg animate-pulse" />
        <div className="h-32 bg-card/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Index Funds */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            Index Funds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {indices.map((stock) => (
              <Button
                key={stock.ticker}
                variant="outline"
                size="sm"
                onClick={() => onSelectTicker(stock.ticker)}
                className="gap-2"
              >
                <span className="font-bold">{stock.ticker}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {stock.name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Stocks */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-orange-400" />
            Popular Stocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {popular.slice(0, 12).map((stock) => (
              <Button
                key={stock.ticker}
                variant="ghost"
                size="sm"
                onClick={() => onSelectTicker(stock.ticker)}
                className="justify-start gap-2 h-auto py-2"
              >
                <span className="font-bold text-primary">{stock.ticker}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {stock.name.split(' ')[0]}
                </span>
              </Button>
            ))}
          </div>
          
          {popular.length > 12 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">More stocks:</p>
              <div className="flex flex-wrap gap-1">
                {popular.slice(12).map((stock) => (
                  <Badge
                    key={stock.ticker}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => onSelectTicker(stock.ticker)}
                  >
                    {stock.ticker}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
