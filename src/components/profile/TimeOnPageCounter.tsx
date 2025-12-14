import { useState, useEffect } from 'react';
import { formatLargeCurrency } from '@/lib/earnings';
import { Clock } from 'lucide-react';

interface TimeOnPageCounterProps {
  annualEarnings: number;
  name: string;
}

const TimeOnPageCounter = ({ annualEarnings, name }: TimeOnPageCounterProps) => {
  const [seconds, setSeconds] = useState(0);
  const perSecond = annualEarnings / 365 / 24 / 60 / 60;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const earned = seconds * perSecond;
  
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3 shadow-gold-lg">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Clock className="h-3 w-3" />
          <span>While you've been here ({formatTime(seconds)})</span>
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
