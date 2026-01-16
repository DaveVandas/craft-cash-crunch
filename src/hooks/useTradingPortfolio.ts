import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createSupabaseWithSession, getOrCreateGuestSession } from '@/lib/supabaseWithSession';

interface Position {
  id: string;
  ticker: string;
  company_name: string;
  shares: number;
  avg_cost_per_share: number;
  current_price: number | null;
  last_price_update: string | null;
  is_short?: boolean; // True if this is a short position
}

interface Order {
  id: string;
  ticker: string;
  company_name: string;
  order_type: 'buy' | 'sell' | 'short' | 'cover';
  shares: number;
  price_per_share: number;
  total_amount: number;
  executed_at: string;
}

interface Portfolio {
  id: string;
  cash_balance: number;
  total_invested: number;
  positions: Position[];
  orders: Order[];
}

export function useTradingPortfolio() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the appropriate Supabase client - with session header for guests
  const db = useMemo(() => {
    if (user) {
      return supabase; // Authenticated user uses regular client
    }
    // Guest user needs session header for RLS validation
    const sessionId = getOrCreateGuestSession();
    return createSupabaseWithSession(sessionId);
  }, [user]);

  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching portfolio, user:', user?.id || 'guest');
      
      let portfolioQuery = db
        .from('trading_portfolios')
        .select('*');
      
      if (user) {
        console.log('Querying by user_id:', user.id);
        portfolioQuery = portfolioQuery.eq('user_id', user.id);
      } else {
        const sessionId = getOrCreateGuestSession();
        console.log('Querying by session_id:', sessionId);
        portfolioQuery = portfolioQuery.eq('session_id', sessionId);
      }
      
      const { data: portfolioData, error: portfolioError } = await portfolioQuery.maybeSingle();
      
      console.log('Portfolio query result:', portfolioData, 'error:', portfolioError);
      
      if (portfolioError) {
        throw portfolioError;
      }
      
      // If no portfolio exists, create one
      if (!portfolioData) {
        const newPortfolio = user 
          ? { user_id: user.id }
          : { session_id: getOrCreateGuestSession() };
        
        const { data: created, error: createError } = await db
          .from('trading_portfolios')
          .insert(newPortfolio)
          .select()
          .single();
        
        if (createError) {
          throw createError;
        }
        
        setPortfolio({
          id: created.id,
          cash_balance: Number(created.cash_balance),
          total_invested: Number(created.total_invested),
          positions: [],
          orders: [],
        });
        return;
      }
      
      // Fetch positions
      const { data: positions, error: positionsError } = await db
        .from('trading_positions')
        .select('*')
        .eq('portfolio_id', portfolioData.id);
      
      if (positionsError) {
        throw positionsError;
      }
      
      // Fetch recent orders
      const { data: orders, error: ordersError } = await db
        .from('trading_orders')
        .select('*')
        .eq('portfolio_id', portfolioData.id)
        .order('executed_at', { ascending: false })
        .limit(50);
      
      if (ordersError) {
        throw ordersError;
      }
      
      setPortfolio({
        id: portfolioData.id,
        cash_balance: Number(portfolioData.cash_balance),
        total_invested: Number(portfolioData.total_invested),
        positions: (positions || []).map(p => ({
          id: p.id,
          ticker: p.ticker,
          company_name: p.company_name,
          shares: Number(p.shares),
          avg_cost_per_share: Number(p.avg_cost_per_share),
          current_price: p.current_price ? Number(p.current_price) : null,
          last_price_update: p.last_price_update,
          is_short: Number(p.shares) < 0, // Negative shares = short position
        })),
        orders: (orders || []).map(o => ({
          id: o.id,
          ticker: o.ticker,
          company_name: o.company_name,
          order_type: o.order_type as 'buy' | 'sell' | 'short' | 'cover',
          shares: Number(o.shares),
          price_per_share: Number(o.price_per_share),
          total_amount: Number(o.total_amount),
          executed_at: o.executed_at,
        })),
      });
      
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  }, [user, db]);

  const executeBuy = useCallback(async (
    ticker: string,
    companyName: string,
    shares: number,
    pricePerShare: number
  ) => {
    if (!portfolio) return false;
    
    const totalCost = shares * pricePerShare;
    
    if (totalCost > portfolio.cash_balance) {
      toast.error('Insufficient funds', {
        description: `You need $${totalCost.toFixed(2)} but only have $${portfolio.cash_balance.toFixed(2)}`,
      });
      return false;
    }
    
    try {
      // Update cash balance
      const newCashBalance = portfolio.cash_balance - totalCost;
      const newTotalInvested = portfolio.total_invested + totalCost;
      
      await db
        .from('trading_portfolios')
        .update({ 
          cash_balance: newCashBalance,
          total_invested: newTotalInvested,
        })
        .eq('id', portfolio.id);
      
      // Check if position exists (only long positions, shares > 0)
      const existingPosition = portfolio.positions.find(p => p.ticker === ticker && p.shares > 0);
      
      if (existingPosition) {
        // Update existing position
        const newShares = existingPosition.shares + shares;
        const newAvgCost = (
          (existingPosition.shares * existingPosition.avg_cost_per_share) + 
          (shares * pricePerShare)
        ) / newShares;
        
        await db
          .from('trading_positions')
          .update({
            shares: newShares,
            avg_cost_per_share: newAvgCost,
            current_price: pricePerShare,
            last_price_update: new Date().toISOString(),
          })
          .eq('id', existingPosition.id);
      } else {
        // Create new position
        await db
          .from('trading_positions')
          .insert({
            portfolio_id: portfolio.id,
            ticker,
            company_name: companyName,
            shares,
            avg_cost_per_share: pricePerShare,
            current_price: pricePerShare,
            last_price_update: new Date().toISOString(),
          });
      }
      
      // Record order
      await db
        .from('trading_orders')
        .insert({
          portfolio_id: portfolio.id,
          ticker,
          company_name: companyName,
          order_type: 'buy',
          shares,
          price_per_share: pricePerShare,
          total_amount: totalCost,
        });
      
      toast.success(`Bought ${shares} shares of ${ticker}`, {
        description: `Total: $${totalCost.toFixed(2)}`,
      });
      
      await fetchPortfolio();
      return true;
      
    } catch (err) {
      console.error('Error executing buy:', err);
      toast.error('Trade failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      return false;
    }
  }, [portfolio, fetchPortfolio, db]);

  const executeSell = useCallback(async (
    ticker: string,
    shares: number,
    pricePerShare: number
  ) => {
    if (!portfolio) return false;
    
    // Find long position (shares > 0)
    const position = portfolio.positions.find(p => p.ticker === ticker && p.shares > 0);
    
    if (!position || position.shares < shares) {
      toast.error('Insufficient shares', {
        description: `You only have ${position?.shares || 0} shares of ${ticker}`,
      });
      return false;
    }
    
    try {
      const totalProceeds = shares * pricePerShare;
      const costBasis = shares * position.avg_cost_per_share;
      
      // Update cash balance
      const newCashBalance = portfolio.cash_balance + totalProceeds;
      const newTotalInvested = portfolio.total_invested - costBasis;
      
      await db
        .from('trading_portfolios')
        .update({ 
          cash_balance: newCashBalance,
          total_invested: Math.max(0, newTotalInvested),
        })
        .eq('id', portfolio.id);
      
      // Update or delete position
      const remainingShares = position.shares - shares;
      
      if (remainingShares <= 0) {
        await db
          .from('trading_positions')
          .delete()
          .eq('id', position.id);
      } else {
        await db
          .from('trading_positions')
          .update({ shares: remainingShares })
          .eq('id', position.id);
      }
      
      // Record order
      await db
        .from('trading_orders')
        .insert({
          portfolio_id: portfolio.id,
          ticker,
          company_name: position.company_name,
          order_type: 'sell',
          shares,
          price_per_share: pricePerShare,
          total_amount: totalProceeds,
        });
      
      const profitLoss = totalProceeds - costBasis;
      const profitEmoji = profitLoss >= 0 ? '📈' : '📉';
      
      toast.success(`Sold ${shares} shares of ${ticker}`, {
        description: `${profitEmoji} P/L: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`,
      });
      
      await fetchPortfolio();
      return true;
      
    } catch (err) {
      console.error('Error executing sell:', err);
      toast.error('Trade failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      return false;
    }
  }, [portfolio, fetchPortfolio, db]);

  // Execute a short sale - borrow shares and sell them
  const executeShort = useCallback(async (
    ticker: string,
    companyName: string,
    shares: number,
    pricePerShare: number
  ) => {
    if (!portfolio) return false;
    
    const totalProceeds = shares * pricePerShare;
    
    // Short selling requires margin - we'll require 50% margin requirement
    const marginRequired = totalProceeds * 0.5;
    
    if (marginRequired > portfolio.cash_balance) {
      toast.error('Insufficient margin', {
        description: `You need $${marginRequired.toFixed(2)} margin (50%) but only have $${portfolio.cash_balance.toFixed(2)}`,
      });
      return false;
    }
    
    try {
      // Add proceeds to cash, hold margin
      // Net effect: cash increases by proceeds but margin is reserved
      const newCashBalance = portfolio.cash_balance + totalProceeds;
      
      await db
        .from('trading_portfolios')
        .update({ 
          cash_balance: newCashBalance,
        })
        .eq('id', portfolio.id);
      
      // Check if short position already exists (shares < 0)
      const existingShort = portfolio.positions.find(p => p.ticker === ticker && p.shares < 0);
      
      if (existingShort) {
        // Add to existing short position
        const newShares = existingShort.shares - shares; // More negative
        const existingValue = Math.abs(existingShort.shares) * existingShort.avg_cost_per_share;
        const newValue = shares * pricePerShare;
        const newAvgCost = (existingValue + newValue) / Math.abs(newShares);
        
        await db
          .from('trading_positions')
          .update({
            shares: newShares,
            avg_cost_per_share: newAvgCost,
            current_price: pricePerShare,
            last_price_update: new Date().toISOString(),
          })
          .eq('id', existingShort.id);
      } else {
        // Create new short position (negative shares)
        await db
          .from('trading_positions')
          .insert({
            portfolio_id: portfolio.id,
            ticker,
            company_name: companyName,
            shares: -shares, // Negative for short
            avg_cost_per_share: pricePerShare,
            current_price: pricePerShare,
            last_price_update: new Date().toISOString(),
          });
      }
      
      // Record order
      await db
        .from('trading_orders')
        .insert({
          portfolio_id: portfolio.id,
          ticker,
          company_name: companyName,
          order_type: 'short',
          shares,
          price_per_share: pricePerShare,
          total_amount: totalProceeds,
        });
      
      toast.success(`Shorted ${shares} shares of ${ticker}`, {
        description: `Received: $${totalProceeds.toFixed(2)} 🐻`,
      });
      
      await fetchPortfolio();
      return true;
      
    } catch (err) {
      console.error('Error executing short:', err);
      toast.error('Short trade failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      return false;
    }
  }, [portfolio, fetchPortfolio, db]);

  // Cover a short position - buy back shares to close
  const executeCover = useCallback(async (
    ticker: string,
    shares: number,
    pricePerShare: number
  ) => {
    if (!portfolio) return false;
    
    // Find short position (shares < 0)
    const shortPosition = portfolio.positions.find(p => p.ticker === ticker && p.shares < 0);
    const shortedShares = shortPosition ? Math.abs(shortPosition.shares) : 0;
    
    if (!shortPosition || shortedShares < shares) {
      toast.error('Insufficient short position', {
        description: `You only have ${shortedShares} shares shorted of ${ticker}`,
      });
      return false;
    }
    
    const totalCost = shares * pricePerShare;
    
    if (totalCost > portfolio.cash_balance) {
      toast.error('Insufficient funds to cover', {
        description: `You need $${totalCost.toFixed(2)} but only have $${portfolio.cash_balance.toFixed(2)}`,
      });
      return false;
    }
    
    try {
      // Pay to buy back shares
      const newCashBalance = portfolio.cash_balance - totalCost;
      
      await db
        .from('trading_portfolios')
        .update({ 
          cash_balance: newCashBalance,
        })
        .eq('id', portfolio.id);
      
      // Calculate profit/loss on short
      const shortCostBasis = shares * shortPosition.avg_cost_per_share;
      const profitLoss = shortCostBasis - totalCost; // Profit if bought back lower
      
      // Update or delete short position
      const remainingShorted = shortedShares - shares;
      
      if (remainingShorted <= 0) {
        await db
          .from('trading_positions')
          .delete()
          .eq('id', shortPosition.id);
      } else {
        await db
          .from('trading_positions')
          .update({ shares: -remainingShorted }) // Keep negative
          .eq('id', shortPosition.id);
      }
      
      // Record order
      await db
        .from('trading_orders')
        .insert({
          portfolio_id: portfolio.id,
          ticker,
          company_name: shortPosition.company_name,
          order_type: 'cover',
          shares,
          price_per_share: pricePerShare,
          total_amount: totalCost,
        });
      
      const profitEmoji = profitLoss >= 0 ? '📈' : '📉';
      
      toast.success(`Covered ${shares} shares of ${ticker}`, {
        description: `${profitEmoji} P/L: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`,
      });
      
      await fetchPortfolio();
      return true;
      
    } catch (err) {
      console.error('Error executing cover:', err);
      toast.error('Cover trade failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      return false;
    }
  }, [portfolio, fetchPortfolio, db]);

  const updatePositionPrices = useCallback(async (prices: Record<string, number>) => {
    if (!portfolio) return;
    
    try {
      for (const position of portfolio.positions) {
        if (prices[position.ticker]) {
          await db
            .from('trading_positions')
            .update({
              current_price: prices[position.ticker],
              last_price_update: new Date().toISOString(),
            })
            .eq('id', position.id);
        }
      }
      
      await fetchPortfolio();
    } catch (err) {
      console.error('Error updating prices:', err);
    }
  }, [portfolio, fetchPortfolio, db]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Calculate portfolio stats
  const portfolioValue = portfolio?.positions.reduce((total, pos) => {
    const price = pos.current_price || pos.avg_cost_per_share;
    // For short positions (negative shares), the value is negative
    return total + (pos.shares * price);
  }, 0) || 0;
  
  const totalValue = (portfolio?.cash_balance || 0) + portfolioValue;
  const totalGainLoss = totalValue - 10000; // Starting balance
  const totalGainLossPercent = ((totalValue - 10000) / 10000) * 100;

  // Helper to get long and short positions separately
  const longPositions = portfolio?.positions.filter(p => p.shares > 0) || [];
  const shortPositions = portfolio?.positions.filter(p => p.shares < 0).map(p => ({
    ...p,
    shares: Math.abs(p.shares), // Convert to positive for display
  })) || [];

  return {
    portfolio,
    isLoading,
    error,
    portfolioValue,
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    longPositions,
    shortPositions,
    fetchPortfolio,
    executeBuy,
    executeSell,
    executeShort,
    executeCover,
    updatePositionPrices,
  };
}
