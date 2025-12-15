import { useState, useEffect, useCallback } from 'react';
import { calculateEarningsBreakdown } from '@/lib/earnings';

interface UseEarningsTickerOptions {
  annualEarnings: number;
  updateInterval?: number;
}

export const useEarningsTicker = ({ annualEarnings, updateInterval = 10000 }: UseEarningsTickerOptions) => {
  const breakdown = calculateEarningsBreakdown(annualEarnings);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [startTime] = useState(() => Date.now());

  const perMillisecond = breakdown.perSecond / 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setCurrentEarnings(elapsed * perMillisecond);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [startTime, perMillisecond, updateInterval]);

  const reset = useCallback(() => {
    setCurrentEarnings(0);
  }, []);

  return {
    currentEarnings,
    breakdown,
    reset
  };
};
