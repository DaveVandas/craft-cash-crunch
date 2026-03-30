import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, GraduationCap, ShieldCheck } from 'lucide-react';

const DISCLAIMER_KEY = 'wp_paper_trading_acknowledged';

export function PaperTradingDisclaimerSplash() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem(DISCLAIMER_KEY);
    if (!acknowledged) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-amber-500/10 border-2 border-amber-500/30">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-serif text-center">
            Educational Simulation Only
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Please read and acknowledge before continuing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-foreground">Paper Trading Simulation</p>
              <p className="text-xs text-muted-foreground">
                Mogul Markets uses virtual currency only. No real money is involved, and no actual securities are bought or sold.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
            <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-foreground">Not Financial Advice</p>
              <p className="text-xs text-muted-foreground">
                All content is for entertainment and educational purposes. Celebrity net worth figures are estimates from public sources. 
                Do not make real investment decisions based on this app.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-foreground">Data Sources</p>
              <p className="text-xs text-muted-foreground">
                Wealth data is aggregated from Forbes, Bloomberg, SEC filings, and other leading financial publications. 
                Stock prices may be delayed and should not be used for real trading.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full" size="lg">
            I Understand — Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
