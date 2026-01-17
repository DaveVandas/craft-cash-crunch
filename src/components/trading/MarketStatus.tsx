import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Moon } from 'lucide-react';

interface MarketStatusInfo {
  isOpen: boolean;
  statusText: string;
  nextEvent: string;
  nextEventTime: string;
}

const getMarketStatus = (): MarketStatusInfo => {
  const now = new Date();
  
  // Convert to Eastern Time
  const etOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  const etDateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    weekday: 'long',
  };
  
  const etTimeStr = now.toLocaleString('en-US', etOptions);
  const [hours, minutes] = etTimeStr.split(':').map(Number);
  const currentMinutes = hours * 60 + minutes;
  const dayOfWeek = now.toLocaleString('en-US', etDateOptions);
  
  const marketOpen = 9 * 60 + 30; // 9:30 AM ET
  const marketClose = 16 * 60; // 4:00 PM ET
  
  const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
  const isMarketHours = currentMinutes >= marketOpen && currentMinutes < marketClose;
  const isOpen = !isWeekend && isMarketHours;
  
  // Calculate next event
  let nextEvent = '';
  let nextEventTime = '';
  
  if (isOpen) {
    // Market is open, show when it closes
    const closeHour = 4;
    const minutesUntilClose = marketClose - currentMinutes;
    const hoursLeft = Math.floor(minutesUntilClose / 60);
    const minsLeft = minutesUntilClose % 60;
    
    nextEvent = 'Closes';
    if (hoursLeft > 0) {
      nextEventTime = `in ${hoursLeft}h ${minsLeft}m`;
    } else {
      nextEventTime = `in ${minsLeft}m`;
    }
  } else {
    // Market is closed, calculate next open
    const now = new Date();
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    let daysUntilOpen = 0;
    
    if (dayOfWeek === 'Saturday') {
      daysUntilOpen = 2;
    } else if (dayOfWeek === 'Sunday') {
      daysUntilOpen = 1;
    } else if (currentMinutes >= marketClose) {
      // After hours on weekday
      daysUntilOpen = dayOfWeek === 'Friday' ? 3 : 1;
    }
    
    nextEvent = 'Opens';
    
    if (daysUntilOpen === 0) {
      // Opens today (pre-market)
      const minutesUntilOpen = marketOpen - currentMinutes;
      const hoursLeft = Math.floor(minutesUntilOpen / 60);
      const minsLeft = minutesUntilOpen % 60;
      
      if (hoursLeft > 0) {
        nextEventTime = `in ${hoursLeft}h ${minsLeft}m`;
      } else {
        nextEventTime = `in ${minsLeft}m`;
      }
    } else if (daysUntilOpen === 1) {
      nextEventTime = 'tomorrow 9:30 AM ET';
    } else {
      nextEventTime = `Monday 9:30 AM ET`;
    }
  }
  
  return {
    isOpen,
    statusText: isOpen ? 'Market Open' : 'Market Closed',
    nextEvent,
    nextEventTime,
  };
};

export const MarketStatus = () => {
  const [status, setStatus] = useState<MarketStatusInfo>(getMarketStatus);
  
  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/50">
      {status.isOpen ? (
        <TrendingUp className="h-4 w-4 text-green-500 animate-pulse" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" />
      )}
      
      <Badge 
        variant={status.isOpen ? "default" : "secondary"}
        className={status.isOpen 
          ? "bg-green-500/20 text-green-500 border-green-500/30 hover:bg-green-500/20" 
          : "bg-muted text-muted-foreground"
        }
      >
        {status.statusText}
      </Badge>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{status.nextEvent} {status.nextEventTime}</span>
      </div>
    </div>
  );
};
