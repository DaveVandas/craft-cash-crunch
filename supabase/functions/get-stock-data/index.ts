import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

async function fetchStockDataFromPerplexity(query: string): Promise<{
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
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!PERPLEXITY_API_KEY) {
    console.log('PERPLEXITY_API_KEY not configured');
    return null;
  }

  try {
    console.log(`Fetching stock data from Perplexity for: ${query}`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { 
            role: 'system', 
            content: 'You are a stock market data assistant. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation. Just the raw JSON object. Always use the most recent real-time stock price data available.' 
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
        search_recency_filter: 'day',
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log(`Perplexity raw response: ${content.substring(0, 500)}`);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('Could not parse JSON from Perplexity response');
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
    console.error('Perplexity fetch error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, tickers } = await req.json();
    
    if (action === 'popular') {
      // Return popular stocks and index ETFs
      return new Response(JSON.stringify({
        popular: POPULAR_STOCKS,
        indices: INDEX_ETFS,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (action === 'search' && query) {
      // Search for a specific stock
      const stockData = await fetchStockDataFromPerplexity(query);
      
      if (!stockData) {
        return new Response(JSON.stringify({ 
          error: 'Could not fetch stock data', 
          stock: null 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ stock: stockData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (action === 'batch' && tickers && Array.isArray(tickers)) {
      // Batch fetch multiple stocks (for portfolio refresh)
      const results: Record<string, any> = {};
      
      // Limit to 10 stocks per batch to avoid rate limits
      const limitedTickers = tickers.slice(0, 10);
      
      for (const ticker of limitedTickers) {
        const stockData = await fetchStockDataFromPerplexity(ticker);
        if (stockData) {
          results[ticker] = stockData;
        }
      }
      
      return new Response(JSON.stringify({ stocks: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('get-stock-data error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
