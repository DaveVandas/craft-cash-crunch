import { useState, useEffect } from 'react';
import { formatLargeCurrency } from '@/lib/earnings';
import { Clock, X } from 'lucide-react';

interface TimeOnPageCounterProps {
  annualEarnings: number;
  name: string;
}

const TimeOnPageCounter = ({ annualEarnings, name }: TimeOnPageCounterProps) => {
  const [seconds, setSeconds] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const perSecond = annualEarnings / 365 / 24 / 60 / 60;
  
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const earned = seconds * perSecond;
  
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-gold-lg relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-muted hover:bg-destructive/80 flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Clock className="h-3 w-3" />
          <span>While you&apos;ve been here ({formatTime(seconds)})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{name.split(' ')[0]} earned</span>
          <span className="font-mono text-lg font-bold gradient-gold-text">
            {formatLargeCurrency(earned)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeOnPageCounter;
