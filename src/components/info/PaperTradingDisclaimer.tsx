import { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaperTradingDisclaimerProps {
  variant?: 'icon' | 'text' | 'link';
  className?: string;
}

export function PaperTradingDisclaimer({ variant = 'icon', className }: PaperTradingDisclaimerProps) {
  const [open, setOpen] = useState(false);

  const trigger = {
    icon: (
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-6 w-6 p-0 text-muted-foreground hover:text-foreground", className)}
      >
        <Info className="h-3.5 w-3.5" />
        <span className="sr-only">About Paper Trading</span>
      </Button>
    ),
    text: (
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-xs text-muted-foreground hover:text-foreground gap-1 h-auto p-1", className)}
      >
        <Info className="h-3 w-3" />
        About Paper Trading
      </Button>
    ),
    link: (
      <button
        className={cn("text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline inline-flex items-center gap-1", className)}
      >
        <Info className="h-3 w-3" />
        About Paper Trading
      </button>
    ),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger[variant]}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md pb-20 md:pb-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            About Mogul Markets
          </DialogTitle>
          <DialogDescription>
            Understanding our paper trading simulator
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-1">Educational Simulation</h4>
            <p className="text-muted-foreground">
              Mogul Markets is a paper trading simulator using virtual currency. 
              No real money is involved, and no actual securities are bought or sold.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Stock Price Data</h4>
            <p className="text-muted-foreground">
              Stock prices are sourced from financial data providers for informational 
              and educational purposes. Prices may be delayed and should not be used 
              for real trading decisions.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Not Financial Advice</h4>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>This is not investment advice</li>
              <li>Past performance doesn't guarantee future results</li>
              <li>Consult a licensed financial advisor for real investments</li>
            </ul>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              Mogul Markets is for entertainment and educational purposes only. 
              Virtual trading results do not reflect real market conditions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
