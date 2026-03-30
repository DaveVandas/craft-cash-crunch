import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    // Allow preview and staging domains
    return hostname.endsWith('.lovable.app') || hostname.endsWith('.lovableproject.com');
  } catch {
    return false;
  }
}

// NOTE: The app can run inside a sandboxed iframe (Origin can be `null`).
// Use origin validation with fallback for security.
function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    // Include x-session-id so guest users can access stock search/batch without auth.
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

function jsonResponse(body: Record<string, unknown>, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    // IMPORTANT: Return 200 with an error payload (instead of 4xx/5xx) so the client
    // can show a friendly message without triggering generic transport errors.
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Popular stocks for suggestions
const POPULAR_STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financial' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financial' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
  { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'PYPL', name: 'PayPal Holdings', sector: 'Financial' },
  { ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
];

// Index ETFs
const INDEX_ETFS = [
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'Index Fund' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust (NASDAQ)', sector: 'Index Fund' },
  { ticker: 'DIA', name: 'SPDR Dow Jones ETF', sector: 'Index Fund' },
  { ticker: 'IWM', name: 'iShares Russell 2000 ETF', sector: 'Index Fund' },
  { ticker: 'VTI', name: 'Vanguard Total Stock Market', sector: 'Index Fund' },
];

async function fetchStockDataFromAI(query: string): Promise<{
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  sector: string;
  dayHigh: number;
  dayLow: number;
  volume: string;
  peRatio: number | null;
} | null> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  if (!LOVABLE_API_KEY) {
    console.log('LOVABLE_API_KEY not configured');
    return null;
  }

  try {
    console.log(`Fetching stock data via Lovable AI for: ${query}`);
    
    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a stock market data assistant. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation. Just the raw JSON object. Use your best knowledge of current stock prices.' 
          },
          { 
            role: 'user', 
            content: `Get the current stock data for "${query}". Return a JSON object with these exact fields:
- ticker: the stock ticker symbol (string, uppercase)
- name: full company name (string)
- price: current stock price in USD (number, e.g., 150.25)
- change: price change today in USD (number, can be negative)
- changePercent: percentage change today (number, e.g., 1.5 for +1.5%)
- marketCap: market capitalization (string, e.g., "2.5T" or "150B")
- sector: industry sector (string)
- dayHigh: today's high price (number)
- dayLow: today's low price (number)
- volume: trading volume (string, e.g., "45.2M")
- peRatio: price-to-earnings ratio (number or null if not applicable)

Return ONLY the JSON object, no other text.`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('Lovable AI API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log(`Lovable AI response: ${content.substring(0, 500)}`);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('Could not parse JSON from AI response');
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      ticker: String(parsed.ticker || '').toUpperCase(),
      name: String(parsed.name || 'Unknown'),
      price: Number(parsed.price) || 0,
      change: Number(parsed.change) || 0,
      changePercent: Number(parsed.changePercent) || 0,
      marketCap: String(parsed.marketCap || 'N/A'),
      sector: String(parsed.sector || 'Unknown'),
      dayHigh: Number(parsed.dayHigh) || 0,
      dayLow: Number(parsed.dayLow) || 0,
      volume: String(parsed.volume || 'N/A'),
      peRatio: parsed.peRatio ? Number(parsed.peRatio) : null,
    };
  } catch (error) {
    console.error('AI fetch error:', error);
    return null;
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, tickers } = await req.json();
    
    // Popular stocks are public - no auth needed for this action
    if (action === 'popular') {
      // Return popular stocks and index ETFs
      return new Response(JSON.stringify({
        popular: POPULAR_STOCKS,
        indices: INDEX_ETFS,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // For actions that call external APIs (search, batch), require authentication OR guest session
    const authHeader = req.headers.get('Authorization');
    const sessionId = req.headers.get('x-session-id');
    
    let userId: string | null = null;
    let isGuest = false;
    
    // Create Supabase client with service role for guest operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Try to authenticate via JWT first
    if (authHeader?.startsWith('Bearer ')) {
      const anonClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );
      
      const { data: userData, error: userError } = await anonClient.auth.getUser();
      
      if (!userError && userData?.user?.id) {
        userId = userData.user.id;
      }
    }
    
    // If no authenticated user, check for guest session
    if (!userId && sessionId && sessionId.startsWith('guest_')) {
      isGuest = true;
      userId = sessionId;
      console.log(`Guest session detected: ${sessionId}`);
    }
    
     // Require either authenticated user or guest session
     if (!userId) {
       return jsonResponse(
         {
           error: 'Unauthorized - please sign in or use guest mode',
           errorCode: 'AUTH_REQUIRED',
         },
         corsHeaders,
       );
     }
    
    console.log(`Stock data requested by ${isGuest ? 'guest' : 'user'}: ${userId}, action: ${action}`);

    // Rate limiting - max 20 stock requests per minute per user/session
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const rateLimitKey = `stock_${userId}_${clientIp}`;
    
    const { data: isRateLimited } = await supabaseClient.rpc('check_rate_limit', {
      p_ip_address: rateLimitKey,
      p_max_requests: 20,
      p_window_seconds: 60
    });
    
     if (isRateLimited) {
       return jsonResponse(
         {
           error: 'Rate limit exceeded. Please try again later.',
           errorCode: 'RATE_LIMIT',
         },
         corsHeaders,
       );
     }
    
    if (action === 'search' && query) {
      // Search for a specific stock
      const stockData = await fetchStockDataFromAI(query);
      
      if (!stockData) {
        return jsonResponse(
          {
            error: 'Could not fetch stock data',
            errorCode: 'DATA_UNAVAILABLE',
            stock: null,
          },
          corsHeaders,
        );
      }
      
      return jsonResponse({ stock: stockData }, corsHeaders);
    }
    
    if (action === 'batch' && tickers && Array.isArray(tickers)) {
      // Batch fetch multiple stocks (for portfolio refresh)
      const results: Record<string, any> = {};
      
      // Limit to 10 stocks per batch to avoid rate limits
      const limitedTickers = tickers.slice(0, 10);
      
      for (const ticker of limitedTickers) {
        const stockData = await fetchStockDataFromAI(ticker);
        if (stockData) {
          results[ticker] = stockData;
        }
      }
      
      return jsonResponse({ stocks: results }, corsHeaders);
    }
    
    return jsonResponse(
      {
        error: 'Invalid action',
        errorCode: 'BAD_REQUEST',
      },
      corsHeaders,
    );
    
  } catch (error) {
    console.error('get-stock-data error:', error);
    return jsonResponse(
      {
        error: 'Data service temporarily unavailable. Please try again later.',
        errorCode: 'SERVICE_UNAVAILABLE',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      corsHeaders,
    );
  }
});
