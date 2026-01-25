import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Crown } from 'lucide-react';

interface MirrorTradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickers: string[];
  onSelectTicker: (ticker: string) => Promise<boolean>;
}

export const MirrorTradesModal = ({
  isOpen,
  onClose,
  tickers,
  onSelectTicker,
}: MirrorTradesModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Reset index when modal opens with new tickers
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, tickers]);

  const handleTrade = async (ticker: string) => {
    setIsLoading(true);
    const ok = await onSelectTicker(ticker);
    setIsLoading(false);

    // If we couldn't load the stock/trade modal, keep this modal open.
    if (!ok) return;
    
    // Move to next ticker or close if done
    if (currentIndex < tickers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    if (currentIndex < tickers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  if (tickers.length === 0) return null;

  const currentTicker = tickers[currentIndex];

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-primary" />
            <AlertDialogTitle className="text-xl">
              Mirror VIP Trades
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>
              You've selected <span className="font-semibold text-foreground">{tickers.length} stocks</span> from a celebrity portfolio.
            </p>
            
            <div className="flex flex-wrap gap-2 py-3">
              {tickers.map((ticker, idx) => (
                <Badge
                  key={ticker}
                  variant={idx === currentIndex ? "default" : idx < currentIndex ? "secondary" : "outline"}
                  className={idx === currentIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                >
                  {ticker}
                  {idx < currentIndex && " ✓"}
                </Badge>
              ))}
            </div>

            {tickers.length > 1 ? (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Trading stock {currentIndex + 1} of {tickers.length}
                </p>
                <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {currentTicker}
                </p>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {currentTicker}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Paper trading is available 24/7 — no market hours restrictions!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="sm:mr-auto">
            Cancel
          </AlertDialogCancel>
          
          {tickers.length > 1 && (
            <Button variant="ghost" onClick={handleSkip} disabled={isLoading}>
              Skip
            </Button>
          )}
          
          <Button
            onClick={() => handleTrade(currentTicker)}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            Trade {currentTicker}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
