import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://craft-cash-crunch.lovable.app',
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.lovable.app'))
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function jsonResponse(body: Record<string, unknown>, corsHeaders: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Notable public figures with known public portfolios
const FEATURED_FIGURES = [
  { name: 'Nancy Pelosi', title: 'U.S. House Representative', category: 'politician' },
  { name: 'Dan Crenshaw', title: 'U.S. House Representative', category: 'politician' },
  { name: 'Warren Buffett', title: 'Berkshire Hathaway CEO', category: 'investor' },
  { name: 'Michael Burry', title: 'Scion Asset Management', category: 'investor' },
  { name: 'Cathie Wood', title: 'ARK Invest CEO', category: 'investor' },
  { name: 'Bill Ackman', title: 'Pershing Square CEO', category: 'investor' },
  { name: 'Ray Dalio', title: 'Bridgewater Founder', category: 'investor' },
  { name: 'Mark Cuban', title: 'Investor & Shark Tank', category: 'celebrity' },
  { name: 'Elon Musk', title: 'Tesla/SpaceX CEO', category: 'tech' },
  { name: 'Jeff Bezos', title: 'Amazon Founder', category: 'tech' },
];

interface PortfolioHolding {
  ticker: string;
  companyName: string;
  shares?: number;
  value?: string;
  percentOfPortfolio?: number;
  recentAction?: 'buy' | 'sell' | 'hold';
  reportDate?: string;
}

interface CelebrityPortfolio {
  name: string;
  title: string;
  category: string;
  portfolioSummary: string;
  topHoldings: PortfolioHolding[];
  totalValue?: string;
  lastUpdated?: string;
  dataSource?: string;
}

async function fetchPortfolioFromPerplexity(figureName: string): Promise<CelebrityPortfolio | null> {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!PERPLEXITY_API_KEY) {
    console.log('PERPLEXITY_API_KEY not configured');
    return null;
  }

  try {
    console.log(`Fetching portfolio data from Perplexity for: ${figureName}`);
    
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
            content: 'You are a financial data assistant specializing in public portfolio disclosures. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation. Just the raw JSON object.' 
          },
          { 
            role: 'user', 
            content: `Find the most recent publicly disclosed stock portfolio holdings for "${figureName}". For politicians, look at their Congressional stock disclosures. For investors/fund managers, look at their 13F filings or public statements. Return a JSON object with:
- name: full name (string)
- title: their current position/title (string)
- category: one of "politician", "investor", "celebrity", "tech" (string)
- portfolioSummary: 1-2 sentence summary of their investment style or notable trades (string)
- topHoldings: array of their top 5-10 stock holdings, each with:
  - ticker: stock ticker symbol (string)
  - companyName: full company name (string)
  - value: approximate value if known (string like "$1M-$5M" or "Unknown")
  - percentOfPortfolio: rough percentage if known (number or null)
  - recentAction: "buy", "sell", or "hold" based on recent activity (string)
  - reportDate: when this was reported (string like "Q4 2024" or "Jan 2025")
- totalValue: estimated total portfolio value (string)
- lastUpdated: when data was last updated (string)
- dataSource: where this data comes from (string like "Congressional Disclosure" or "13F Filing")

If no public portfolio data is available, return null in the holdings but still include name and title.`
          }
        ],
        search_recency_filter: 'month',
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log(`Perplexity raw response length: ${content.length}`);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('Could not parse JSON from Perplexity response');
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      name: String(parsed.name || figureName),
      title: String(parsed.title || 'Public Figure'),
      category: String(parsed.category || 'other'),
      portfolioSummary: String(parsed.portfolioSummary || ''),
      topHoldings: Array.isArray(parsed.topHoldings) ? parsed.topHoldings.map((h: any) => ({
        ticker: String(h.ticker || '').toUpperCase(),
        companyName: String(h.companyName || 'Unknown'),
        value: h.value ? String(h.value) : undefined,
        percentOfPortfolio: h.percentOfPortfolio ? Number(h.percentOfPortfolio) : undefined,
        recentAction: ['buy', 'sell', 'hold'].includes(h.recentAction) ? h.recentAction : undefined,
        reportDate: h.reportDate ? String(h.reportDate) : undefined,
      })) : [],
      totalValue: parsed.totalValue ? String(parsed.totalValue) : undefined,
      lastUpdated: parsed.lastUpdated ? String(parsed.lastUpdated) : undefined,
      dataSource: parsed.dataSource ? String(parsed.dataSource) : undefined,
    };
  } catch (error) {
    console.error('Perplexity fetch error:', error);
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
    const { action, name } = await req.json();
    
    // List featured figures - public, no auth needed
    if (action === 'list') {
      return jsonResponse({
        figures: FEATURED_FIGURES,
      }, corsHeaders);
    }
    
    // Fetch portfolio for specific person - requires auth or guest session
    if (action === 'fetch' && name) {
      const authHeader = req.headers.get('Authorization');
      const sessionId = req.headers.get('x-session-id');
      
      let userId: string | null = null;
      
      // Create Supabase client for rate limiting
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
        
        const token = authHeader.replace('Bearer ', '');
        const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
        
        if (!claimsError && claimsData?.claims?.sub) {
          userId = claimsData.claims.sub;
        }
      }
      
      // If no authenticated user, check for guest session
      if (!userId && sessionId && sessionId.startsWith('guest_')) {
        userId = sessionId;
        console.log(`Guest session detected: ${sessionId}`);
      }
      
      // Require either authenticated user or guest session
      if (!userId) {
        return jsonResponse({
          error: 'Unauthorized - please sign in or use guest mode',
          errorCode: 'AUTH_REQUIRED',
        }, corsHeaders);
      }
      
      console.log(`Portfolio data requested for: ${name} by user: ${userId}`);
      
      // Rate limiting - max 10 portfolio requests per minute
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                       req.headers.get('x-real-ip') || 
                       'unknown';
      const rateLimitKey = `celeb_portfolio_${userId}_${clientIp}`;
      
      const { data: isRateLimited } = await supabaseClient.rpc('check_rate_limit', {
        p_ip_address: rateLimitKey,
        p_max_requests: 10,
        p_window_seconds: 60
      });
      
      if (isRateLimited) {
        return jsonResponse({
          error: 'Rate limit exceeded. Please try again later.',
          errorCode: 'RATE_LIMIT',
        }, corsHeaders);
      }
      
      const portfolio = await fetchPortfolioFromPerplexity(name);
      
      if (!portfolio) {
        return jsonResponse({
          error: 'Could not fetch portfolio data',
          errorCode: 'DATA_UNAVAILABLE',
          portfolio: null,
        }, corsHeaders);
      }
      
      return jsonResponse({ portfolio }, corsHeaders);
    }
    
    return jsonResponse({
      error: 'Invalid action',
      errorCode: 'BAD_REQUEST',
    }, corsHeaders);
    
  } catch (error) {
    console.error('get-celebrity-portfolio error:', error);
    return jsonResponse({
      error: 'Service temporarily unavailable. Please try again later.',
      errorCode: 'SERVICE_UNAVAILABLE',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, corsHeaders);
  }
});
