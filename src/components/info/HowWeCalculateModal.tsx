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

interface HowWeCalculateModalProps {
  variant?: 'icon' | 'text' | 'link';
  className?: string;
}

export function HowWeCalculateModal({ variant = 'icon', className }: HowWeCalculateModalProps) {
  const [open, setOpen] = useState(false);

  const trigger = {
    icon: (
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-6 w-6 p-0 text-muted-foreground hover:text-foreground", className)}
      >
        <Info className="h-3.5 w-3.5" />
        <span className="sr-only">How we calculate</span>
      </Button>
    ),
    text: (
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-xs text-muted-foreground hover:text-foreground gap-1 h-auto p-1", className)}
      >
        <Info className="h-3 w-3" />
        How we calculate
      </Button>
    ),
    link: (
      <button
        className={cn("text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline inline-flex items-center gap-1", className)}
      >
        <Info className="h-3 w-3" />
        How we calculate
      </button>
    ),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger[variant]}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            How We Calculate Earnings
          </DialogTitle>
          <DialogDescription>
            Understanding our wealth estimation methodology
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-1">Data Sources</h4>
            <p className="text-muted-foreground">
              Our figures are AI-aggregated estimates based on publicly available information 
              from sources like Forbes, Bloomberg, and major financial publications.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Estimation Method</h4>
            <p className="text-muted-foreground">
              For individuals whose wealth comes from investments, we calculate annual 
              earnings from stock appreciation, dividends, and business income—not just 
              salary. Historical figures are adjusted for inflation to 2024 USD.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Important Notes</h4>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>All figures are estimates, not verified financials</li>
              <li>Actual wealth can vary significantly due to private holdings</li>
              <li>Data is refreshed regularly but may not reflect real-time changes</li>
            </ul>
          </div>
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              This app is for entertainment and educational purposes. 
              Do not use these figures for financial decisions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
