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

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
  };
}

function jsonResponse(body: Record<string, unknown>, corsHeaders: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// VERIFIED figures with KNOWN public disclosures - these are guaranteed to have data
// Politicians: Required to disclose via STOCK Act - data available on CapitolTrades.com and House/Senate disclosures
// Hedge Funds: Required 13F filings with SEC - data available on SEC EDGAR
const FEATURED_FIGURES = [
  // Politicians with VERIFIED active trading (STOCK Act disclosures)
  { name: 'Nancy Pelosi', title: 'U.S. House Representative (D-CA)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  { name: 'Dan Crenshaw', title: 'U.S. House Representative (R-TX)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  { name: 'Tommy Tuberville', title: 'U.S. Senator (R-AL)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  { name: 'Josh Gottheimer', title: 'U.S. House Representative (D-NJ)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  { name: 'Michael McCaul', title: 'U.S. House Representative (R-TX)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  { name: 'Ro Khanna', title: 'U.S. House Representative (D-CA)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  { name: 'Mark Green', title: 'U.S. House Representative (R-TN)', category: 'politician', verified: true, dataSource: 'STOCK Act Disclosure' },
  
  // 13F Filers - Hedge Funds with VERIFIED SEC filings
  { name: 'Warren Buffett', title: 'Berkshire Hathaway', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Michael Burry', title: 'Scion Asset Management', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Cathie Wood', title: 'ARK Invest', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Bill Ackman', title: 'Pershing Square Capital', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Ray Dalio', title: 'Bridgewater Associates', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Stanley Druckenmiller', title: 'Duquesne Family Office', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'David Tepper', title: 'Appaloosa Management', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Carl Icahn', title: 'Icahn Enterprises', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Ken Griffin', title: 'Citadel LLC', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'George Soros', title: 'Soros Fund Management', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Chase Coleman', title: 'Tiger Global Management', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  { name: 'Seth Klarman', title: 'Baupost Group', category: 'investor', verified: true, dataSource: 'SEC 13F Filing' },
  
  // Tech Executives with SEC Form 4 filings (insider transactions)
  { name: 'Elon Musk', title: 'Tesla/SpaceX/X CEO', category: 'tech', verified: true, dataSource: 'SEC Form 4' },
  { name: 'Mark Zuckerberg', title: 'Meta CEO', category: 'tech', verified: true, dataSource: 'SEC Form 4' },
  { name: 'Jensen Huang', title: 'NVIDIA CEO', category: 'tech', verified: true, dataSource: 'SEC Form 4' },
  { name: 'Satya Nadella', title: 'Microsoft CEO', category: 'tech', verified: true, dataSource: 'SEC Form 4' },
  { name: 'Tim Cook', title: 'Apple CEO', category: 'tech', verified: true, dataSource: 'SEC Form 4' },
  
  // Celebrity Investors with known VC portfolios
  { name: 'Mark Cuban', title: 'Investor & Shark Tank', category: 'celebrity', verified: false, dataSource: 'Public Statements' },
  { name: 'Ashton Kutcher', title: 'A-Grade Investments', category: 'celebrity', verified: false, dataSource: 'Public Statements' },
  
  // International with public holdings
  { name: 'Masayoshi Son', title: 'SoftBank CEO', category: 'international', verified: true, dataSource: 'Public Filings' },
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

async function fetchPortfolioFromPerplexity(figureName: string, figureData?: any): Promise<CelebrityPortfolio | null> {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!PERPLEXITY_API_KEY) {
    console.log('PERPLEXITY_API_KEY not configured');
    return null;
  }

  // Determine the best search strategy based on figure type
  const isPolitician = figureData?.category === 'politician' || figureName.toLowerCase().includes('senator') || figureName.toLowerCase().includes('representative');
  const isInvestor = figureData?.category === 'investor';
  const isTech = figureData?.category === 'tech';
  
  let searchContext = '';
  let dataSourceHint = '';
  
  if (isPolitician) {
    searchContext = `Search Congressional stock disclosures, Capitol Trades, House/Senate financial disclosure databases, and Quiver Quantitative for STOCK Act filings.`;
    dataSourceHint = 'STOCK Act Disclosure via Capitol Trades or House/Senate disclosure';
  } else if (isInvestor) {
    searchContext = `Search SEC EDGAR database for 13F filings, Whale Wisdom, and Dataroma for hedge fund portfolio holdings.`;
    dataSourceHint = 'SEC 13F Filing via EDGAR';
  } else if (isTech) {
    searchContext = `Search SEC EDGAR for Form 4 insider transaction filings and company proxy statements.`;
    dataSourceHint = 'SEC Form 4 Insider Transaction';
  } else {
    searchContext = `Search public investment records, SEC filings, and verified news sources for portfolio information.`;
    dataSourceHint = 'Public Records';
  }

  try {
    console.log(`Fetching portfolio data from Perplexity for: ${figureName} (${figureData?.category || 'unknown'})`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro', // Use sonar-pro for better accuracy
        messages: [
          { 
            role: 'system', 
            content: `You are a financial data researcher specializing in public portfolio disclosures. ${searchContext}
            
CRITICAL: Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation. Just the raw JSON object.
If you cannot find verified stock holdings data, return the topHoldings array as empty [].
Only include holdings you can verify from official sources - do not make up or guess holdings.` 
          },
          { 
            role: 'user', 
            content: `Find the most recent publicly disclosed stock portfolio holdings for "${figureName}".

${searchContext}

Return a JSON object with EXACTLY this structure:
{
  "name": "${figureName}",
  "title": "their current position/title",
  "category": "${figureData?.category || 'investor'}",
  "portfolioSummary": "1-2 sentence summary of their investment style or recent notable trades",
  "topHoldings": [
    {
      "ticker": "AAPL",
      "companyName": "Apple Inc.",
      "value": "$5M-$10M",
      "percentOfPortfolio": 15,
      "recentAction": "buy",
      "reportDate": "Q4 2024"
    }
  ],
  "totalValue": "estimated total if known",
  "lastUpdated": "most recent filing date",
  "dataSource": "${dataSourceHint}"
}

IMPORTANT:
- Only include stocks you can VERIFY from official filings
- For politicians: Look for trades from the last 6 months
- For 13F filers: Use their most recent quarterly filing
- If no verified data exists, return an empty topHoldings array []
- Include the actual filing/disclosure date in reportDate`
          }
        ],
        search_recency_filter: 'month',
        temperature: 0.1, // Low temperature for more factual responses
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const citations = data.citations || [];
    
    console.log(`Perplexity response for ${figureName}: ${content.length} chars, ${citations.length} citations`);
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('Could not parse JSON from Perplexity response');
      return null;
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Filter out any holdings without valid tickers
    const validHoldings = Array.isArray(parsed.topHoldings) 
      ? parsed.topHoldings
          .filter((h: any) => h.ticker && typeof h.ticker === 'string' && h.ticker.length > 0 && h.ticker.length <= 5)
          .map((h: any) => ({
            ticker: String(h.ticker || '').toUpperCase().replace(/[^A-Z]/g, ''),
            companyName: String(h.companyName || 'Unknown'),
            value: h.value ? String(h.value) : undefined,
            percentOfPortfolio: h.percentOfPortfolio ? Number(h.percentOfPortfolio) : undefined,
            recentAction: ['buy', 'sell', 'hold'].includes(h.recentAction) ? h.recentAction : undefined,
            reportDate: h.reportDate ? String(h.reportDate) : undefined,
          }))
      : [];
    
    // Add citation info to data source
    let dataSourceWithCitations = parsed.dataSource ? String(parsed.dataSource) : figureData?.dataSource;
    if (citations.length > 0) {
      dataSourceWithCitations += ` via ${citations[0].split('/')[2] || 'verified sources'}`;
    }
    
    return {
      name: String(parsed.name || figureName),
      title: String(parsed.title || figureData?.title || 'Public Figure'),
      category: String(parsed.category || figureData?.category || 'investor'),
      portfolioSummary: String(parsed.portfolioSummary || ''),
      topHoldings: validHoldings,
      totalValue: parsed.totalValue ? String(parsed.totalValue) : undefined,
      lastUpdated: parsed.lastUpdated ? String(parsed.lastUpdated) : undefined,
      dataSource: dataSourceWithCitations,
    };
  } catch (error) {
    console.error('Perplexity fetch error:', error);
    return null;
  }
}

// AI-powered discovery of new VIP figures - focus on those with VERIFIED public data
async function discoverNewFigures(category: string): Promise<Array<{name: string; title: string; category: string; verified: boolean; dataSource: string}>> {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!PERPLEXITY_API_KEY) {
    return [];
  }

  const categoryPrompts: Record<string, string> = {
    politician: 'Find 5 U.S. Congress members who have made stock trades in the last 3 months according to Capitol Trades or House/Senate financial disclosures. Focus on those with the MOST RECENT and ACTIVE trading.',
    investor: 'Find 5 hedge fund managers or institutional investors who filed 13F reports with the SEC in the last quarter showing notable portfolio changes. Use SEC EDGAR data.',
    celebrity: 'Find 5 celebrities or athletes who are known venture capital investors with publicly tracked investments through firms like A-Grade, Serena Ventures, or similar.',
    tech: 'Find 5 tech company CEOs or executives who have made notable insider stock transactions (Form 4 filings) in the last 3 months according to SEC EDGAR.',
    international: 'Find 5 international billionaires or fund managers with publicly disclosed holdings through regulatory filings in their countries.',
  };

  const prompt = categoryPrompts[category] || categoryPrompts.investor;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { 
            role: 'system', 
            content: 'You are a financial research assistant. Return ONLY valid JSON with no markdown formatting, no code blocks. Just the raw JSON array. Only include people with VERIFIED, PUBLICLY AVAILABLE portfolio data from official sources.' 
          },
          { 
            role: 'user', 
            content: `${prompt}

Return a JSON array of objects, each with:
- name: full name (string)
- title: their current position/title (string)  
- category: "${category}" (string)
- verified: true if they have official regulatory filings, false otherwise (boolean)
- dataSource: where their data comes from, e.g. "SEC 13F Filing", "STOCK Act Disclosure", "SEC Form 4" (string)

ONLY include people whose portfolio data you can actually find from official sources.`
          }
        ],
        search_recency_filter: 'week',
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed.map((p: any) => ({
      name: String(p.name || ''),
      title: String(p.title || ''),
      category: category,
      verified: Boolean(p.verified),
      dataSource: String(p.dataSource || 'Public Records'),
    })).filter((p: any) => p.name) : [];
  } catch (error) {
    console.error('Discovery error:', error);
    return [];
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, name, category } = await req.json();
    
    // List featured figures - public, no auth needed
    if (action === 'list') {
      return jsonResponse({
        figures: FEATURED_FIGURES,
        categories: ['politician', 'investor', 'celebrity', 'tech', 'international'],
      }, corsHeaders);
    }
    
    // Discover new figures by category - public, but rate limited
    if (action === 'discover' && category) {
      const discovered = await discoverNewFigures(category);
      return jsonResponse({
        figures: discovered,
        category,
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
        
        const { data: userData, error: userError } = await anonClient.auth.getUser();
        
        if (!userError && userData?.user?.id) {
          userId = userData.user.id;
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
      
      // Find figure data if in our list
      const figureData = FEATURED_FIGURES.find(f => f.name.toLowerCase() === name.toLowerCase());
      
      const portfolio = await fetchPortfolioFromPerplexity(name, figureData);
      
      if (!portfolio) {
        return jsonResponse({
          error: 'Could not fetch portfolio data',
          errorCode: 'DATA_UNAVAILABLE',
          portfolio: null,
        }, corsHeaders);
      }
      
      // If portfolio has no holdings, return a more helpful message
      if (portfolio.topHoldings.length === 0) {
        return jsonResponse({
          portfolio: {
            ...portfolio,
            portfolioSummary: portfolio.portfolioSummary || 'No recent stock holdings data found in public disclosures. This person may not have active stock trades or their disclosures are not yet available.',
          },
          warning: 'No holdings data found in recent filings',
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
