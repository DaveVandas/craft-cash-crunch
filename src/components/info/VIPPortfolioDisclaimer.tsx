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

interface VIPPortfolioDisclaimerProps {
  variant?: 'icon' | 'text' | 'link';
  className?: string;
}

export function VIPPortfolioDisclaimer({ variant = 'icon', className }: VIPPortfolioDisclaimerProps) {
  const [open, setOpen] = useState(false);

  const trigger = {
    icon: (
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-6 w-6 p-0 text-muted-foreground hover:text-foreground", className)}
      >
        <Info className="h-3.5 w-3.5" />
        <span className="sr-only">About VIP Portfolios</span>
      </Button>
    ),
    text: (
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-xs text-muted-foreground hover:text-foreground gap-1 h-auto p-1", className)}
      >
        <Info className="h-3 w-3" />
        Data Sources
      </Button>
    ),
    link: (
      <button
        className={cn("text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline inline-flex items-center gap-1", className)}
      >
        <Info className="h-3 w-3" />
        Data Sources
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
            About VIP Portfolio Data
          </DialogTitle>
          <DialogDescription>
            Understanding our portfolio data sources
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-1">Data Sources</h4>
            <p className="text-muted-foreground">
              Portfolio holdings are aggregated from publicly available sources including 
              SEC filings (13F reports), congressional disclosure reports, and verified 
              financial news publications.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Reporting Delays</h4>
            <p className="text-muted-foreground">
              SEC filings are reported quarterly with a 45-day delay. Congressional 
              disclosures may also have reporting windows. Holdings shown may not 
              reflect current positions.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Important Disclaimers</h4>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Holdings may have changed since last disclosure</li>
              <li>This is not investment advice or a recommendation</li>
              <li>Past trades don't indicate future performance</li>
              <li>Always do your own research before investing</li>
            </ul>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              VIP Portfolios is for educational and entertainment purposes. 
              Do not base investment decisions solely on this information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
