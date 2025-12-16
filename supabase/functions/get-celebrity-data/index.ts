import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  // Include custom headers used by the client (e.g., X-Anonymous-Search-Count) so browser CORS preflight succeeds
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-anonymous-search-count',
};

// Wikipedia requires a proper User-Agent - using MediaWiki bot format
const WIKI_USER_AGENT = 'WealthPerspectiveBot/1.0 (https://earningsexplorer.shop/; admin@earningsexplorer.shop)';

// Valid categories for validation
const VALID_CATEGORIES = [
  'athletes',
  'hollywood', 
  'musicians',
  'tech-billionaires',
  'politicians',
  'influencers',
  'historical'
] as const;

const FREE_SEARCH_LIMIT = 3;

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

// Input validation functions
function validateName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  
  // Trim and check length
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return null;
  
  // Allow Unicode letters (accents), numbers, spaces, hyphens, apostrophes, and periods (e.g., "Beyoncé", "50 Cent", "O'Brien")
  const namePattern = /^[\p{L}\p{M}0-9\s\-'.]+$/u;
  if (!namePattern.test(trimmed)) return null;
  
  return trimmed;
}

function validateCategory(category: unknown): string | null {
  if (typeof category !== 'string') return null;
  
  const trimmed = category.trim().toLowerCase();
  if (!VALID_CATEGORIES.includes(trimmed as typeof VALID_CATEGORIES[number])) return null;
  
  return trimmed;
}

// Helper to return 200 with error field (prevents frontend global error dialog)
function errorResponse(message: string, code: string = 'ERROR') {
  return new Response(JSON.stringify({ error: message, errorCode: code, celebrity: null, celebrities: null }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Profession to emoji mapping
function getProfessionEmoji(profession: string): string {
  const lower = profession?.toLowerCase() || '';
  
  if (lower.includes('basketball') || lower.includes('nba')) return '🏀';
  if (lower.includes('football') || lower.includes('nfl') || lower.includes('soccer')) return '🏈';
  if (lower.includes('baseball') || lower.includes('mlb')) return '⚾';
  if (lower.includes('tennis')) return '🎾';
  if (lower.includes('golf')) return '⛳';
  if (lower.includes('boxer') || lower.includes('boxing') || lower.includes('ufc') || lower.includes('mma')) return '🥊';
  if (lower.includes('athlete') || lower.includes('sport') || lower.includes('olymp')) return '🏆';
  if (lower.includes('actor') || lower.includes('actress') || lower.includes('hollywood') || lower.includes('film')) return '🎬';
  if (lower.includes('singer') || lower.includes('musician') || lower.includes('rapper') || lower.includes('artist') || lower.includes('music')) return '🎤';
  if (lower.includes('tech') || lower.includes('ceo') || lower.includes('founder') || lower.includes('entrepreneur')) return '💻';
  if (lower.includes('politician') || lower.includes('president') || lower.includes('senator') || lower.includes('governor')) return '🏛️';
  if (lower.includes('influencer') || lower.includes('youtuber') || lower.includes('tiktoker') || lower.includes('streamer')) return '📱';
  if (lower.includes('model')) return '📸';
  if (lower.includes('author') || lower.includes('writer')) return '📚';
  if (lower.includes('chef') || lower.includes('cook')) return '👨‍🍳';
  if (lower.includes('investor') || lower.includes('billionaire')) return '💰';
  if (lower.includes('royal') || lower.includes('king') || lower.includes('queen') || lower.includes('prince')) return '👑';
  
  return '⭐'; // Default star for general celebrities
}

// Generate smart search variants for better Wikipedia matching
function generateSearchVariants(name: string, profession?: string): string[] {
  const variants: string[] = [name];
  
  // Remove periods
  const noPeriods = name.replace(/\./g, '');
  if (noPeriods !== name) variants.push(noPeriods);
  
  // Handle Jr/Sr
  variants.push(name.replace(/\s+Jr\.?$/i, ' Junior'));
  variants.push(name.replace(/\s+Sr\.?$/i, ' Senior'));
  
  // Try first + last name only (strip middle names)
  const nameParts = name.split(/\s+/);
  if (nameParts.length > 2) {
    variants.push(`${nameParts[0]} ${nameParts[nameParts.length - 1]}`);
  }
  
  // Add profession disambiguation for common names
  if (profession) {
    const profLower = profession.toLowerCase();
    if (profLower.includes('actor') || profLower.includes('actress')) {
      variants.push(`${name} (actor)`);
      variants.push(`${name} actor`);
    } else if (profLower.includes('singer') || profLower.includes('musician') || profLower.includes('rapper')) {
      variants.push(`${name} (singer)`);
      variants.push(`${name} (musician)`);
      variants.push(`${name} musician`);
    } else if (profLower.includes('athlete') || profLower.includes('basketball') || profLower.includes('football')) {
      variants.push(`${name} (athlete)`);
      variants.push(`${name} athlete`);
    } else if (profLower.includes('ceo') || profLower.includes('entrepreneur') || profLower.includes('billionaire')) {
      variants.push(`${name} (businessman)`);
      variants.push(`${name} entrepreneur`);
    }
  }
  
  // Remove duplicates
  return [...new Set(variants)];
}

// Try to fetch image from Wikipedia page summary (REST API)
async function tryWikipediaPageSummary(searchName: string): Promise<string | null> {
  try {
    // Wikipedia prefers underscores for spaces in URLs
    const wikiTitle = searchName.trim().replace(/\s+/g, '_');
    const pageImageUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    
    console.log(`Trying Wikipedia REST API: ${pageImageUrl}`);
    
    const pageRes = await fetch(pageImageUrl, {
      headers: { 
        'User-Agent': WIKI_USER_AGENT,
        'Api-User-Agent': WIKI_USER_AGENT,
        'Accept': 'application/json'
      }
    });
    
    console.log(`Wikipedia REST API status: ${pageRes.status} for ${searchName}`);
    
    if (pageRes.ok) {
      const pageData = await pageRes.json();
      
      // Skip disambiguation pages
      if (pageData.type === 'disambiguation') {
        console.log(`Skipping disambiguation page for ${searchName}`);
        return null;
      }
      
      if (pageData.originalimage?.source) {
        console.log(`Found Wikipedia originalimage for ${searchName}`);
        return pageData.originalimage.source;
      }
      
      if (pageData.thumbnail?.source) {
        const thumbUrl = pageData.thumbnail.source;
        const higherRes = thumbUrl.replace(/\/\d+px-/, '/400px-');
        console.log(`Found Wikipedia thumbnail for ${searchName}`);
        return higherRes;
      }
    }
  } catch (error) {
    console.log(`Wikipedia REST API error for "${searchName}":`, error);
  }
  return null;
}

// Try MediaWiki Action API (more lenient than REST API)
async function tryWikipediaActionAPI(searchName: string): Promise<string | null> {
  try {
    const wikiTitle = searchName.trim().replace(/\s+/g, '_');
    // Use prop=pageimages for main infobox image
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&origin=*&pithumbsize=500&piprop=original|thumbnail`;
    
    console.log(`Trying Wikipedia Action API for: ${searchName}`);
    
    const res = await fetch(apiUrl, {
      headers: { 
        'User-Agent': WIKI_USER_AGENT,
        'Api-User-Agent': WIKI_USER_AGENT
      }
    });
    
    console.log(`Wikipedia Action API status: ${res.status}`);
    
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages || {};
      
      for (const pageId of Object.keys(pages)) {
        if (pageId === '-1') continue;
        
        const page = pages[pageId];
        if (page.original?.source) {
          console.log(`Found image via Action API for ${searchName}`);
          return page.original.source;
        }
        if (page.thumbnail?.source) {
          console.log(`Found thumbnail via Action API for ${searchName}`);
          return page.thumbnail.source;
        }
      }
    }
  } catch (error) {
    console.log(`Wikipedia Action API error for "${searchName}":`, error);
  }
  return null;
}

// Search Wikipedia and get image from top results
async function tryWikipediaSearch(searchName: string, profession?: string): Promise<string | null> {
  try {
    // Add profession to search for better results
    const searchQuery = profession 
      ? `${searchName} ${profession.split(' ')[0]}`
      : searchName;
    
    const encodedQuery = encodeURIComponent(searchQuery);
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*&srlimit=8`;
    
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': WIKI_USER_AGENT, 'Api-User-Agent': WIKI_USER_AGENT }
    });
    
    if (!searchRes.ok) return null;
    
    const searchData = await searchRes.json();
    const results = searchData.query?.search || [];
    
    // Score results to find best match
    const lowerName = searchName.toLowerCase();
    const scoredResults = results.map((r: any) => {
      let score = 0;
      const lowerTitle = r.title.toLowerCase();
      
      // Exact match gets highest score
      if (lowerTitle === lowerName) score += 100;
      // Title contains full name
      else if (lowerTitle.includes(lowerName)) score += 50;
      // Name contains title
      else if (lowerName.includes(lowerTitle)) score += 30;
      
      // Avoid disambiguation pages
      if (lowerTitle.includes('disambiguation')) score -= 100;
      
      return { ...r, score };
    });
    
    // Sort by score
    scoredResults.sort((a: any, b: any) => b.score - a.score);
    
    // Try top 5 results
    for (const result of scoredResults.slice(0, 5)) {
      const pageTitle = encodeURIComponent(result.title);
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`;
      
      try {
        const summaryRes = await fetch(summaryUrl, {
          headers: { 'User-Agent': WIKI_USER_AGENT, 'Api-User-Agent': WIKI_USER_AGENT }
        });
        
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          
          // Skip disambiguation pages
          if (summaryData.type === 'disambiguation') continue;
          
          if (summaryData.originalimage?.source) {
            console.log(`Found Wikipedia image via search for ${searchName}: ${result.title}`);
            return summaryData.originalimage.source;
          }
          
          if (summaryData.thumbnail?.source) {
            const thumbUrl = summaryData.thumbnail.source;
            const higherRes = thumbUrl.replace(/\/\d+px-/, '/400px-');
            console.log(`Found Wikipedia thumbnail via search for ${searchName}: ${result.title}`);
            return higherRes;
          }
        }
      } catch (e) {
        // Continue to next result
      }
    }
  } catch (error) {
    console.log(`Wikipedia search error for "${searchName}":`, error);
  }
  return null;
}

// Try Wikidata for Commons images
async function tryWikidata(searchName: string): Promise<string | null> {
  try {
    const encodedName = encodeURIComponent(searchName);
    const wikidataSearchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodedName}&language=en&format=json&origin=*&limit=5`;
    
    const wdSearchRes = await fetch(wikidataSearchUrl, {
      headers: { 'User-Agent': WIKI_USER_AGENT, 'Api-User-Agent': WIKI_USER_AGENT }
    });
    
    if (!wdSearchRes.ok) return null;
    
    const wdData = await wdSearchRes.json();
    const entities = wdData.search || [];
    
    for (const entity of entities) {
      // Check if this entity is a human (instance of Q5)
      const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${entity.id}&property=P18&format=json&origin=*`;
      
      try {
        const claimsRes = await fetch(entityUrl, {
          headers: { 'User-Agent': WIKI_USER_AGENT, 'Api-User-Agent': WIKI_USER_AGENT }
        });
        
        if (claimsRes.ok) {
          const claimsData = await claimsRes.json();
          const imageClaim = claimsData.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
          
          if (imageClaim) {
            const fileName = imageClaim.replace(/ /g, '_');
            const commonsUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=400`;
            console.log(`Found Wikidata/Commons image for ${searchName}`);
            return commonsUrl;
          }
        }
      } catch (e) {
        // Continue to next entity
      }
    }
  } catch (error) {
    console.log(`Wikidata search error for "${searchName}":`, error);
  }
  return null;
}

// Try Wikipedia page images API (gets all images from a page)
async function tryWikipediaPageImages(searchName: string): Promise<string | null> {
  try {
    // Wikipedia prefers underscores for spaces
    const wikiTitle = searchName.trim().replace(/\s+/g, '_');
    const pageImagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&origin=*&pithumbsize=400&piprop=thumbnail|original`;
    
    console.log(`Trying Wikipedia page images API for: ${searchName}`);
    
    const res = await fetch(pageImagesUrl, {
      headers: { 
        'User-Agent': 'WealthPerspective/1.0 (https://earningsexplorer.shop; contact@earningsexplorer.shop) fetch/1.0',
        'Accept': 'application/json'
      }
    });
    
    console.log(`Wikipedia page images response status: ${res.status}`);
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const pages = data.query?.pages || {};
    
    console.log(`Wikipedia page images pages found: ${Object.keys(pages).length}`);
    
    for (const pageId of Object.keys(pages)) {
      if (pageId === '-1') {
        console.log(`Page not found for ${searchName}`);
        continue;
      }
      
      const page = pages[pageId];
      console.log(`Page ${pageId} has original: ${!!page.original}, thumbnail: ${!!page.thumbnail}`);
      
      if (page.original?.source) {
        console.log(`Found Wikipedia page image for ${searchName}`);
        return page.original.source;
      }
      if (page.thumbnail?.source) {
        console.log(`Found Wikipedia page thumbnail for ${searchName}`);
        return page.thumbnail.source;
      }
    }
  } catch (error) {
    console.log(`Wikipedia page images error for "${searchName}":`, error);
  }
  return null;
}

// Main function to aggressively try to get celebrity image
async function getWikipediaImage(name: string, profession?: string): Promise<string | null> {
  const searchVariants = generateSearchVariants(name, profession);
  
  // Strategy 1: Try direct page summary for all variants first (fastest)
  for (const variant of searchVariants.slice(0, 4)) {
    const image = await tryWikipediaPageSummary(variant);
    if (image) return image;
  }
  
  // Strategy 2: Try page images API
  for (const variant of searchVariants.slice(0, 3)) {
    const image = await tryWikipediaPageImages(variant);
    if (image) return image;
  }
  
  // Strategy 3: Try Wikipedia search with profession context
  const searchImage = await tryWikipediaSearch(name, profession);
  if (searchImage) return searchImage;
  
  // Strategy 4: Try Wikidata for all variants
  for (const variant of searchVariants.slice(0, 3)) {
    const image = await tryWikidata(variant);
    if (image) return image;
  }
  
  // Strategy 5: Last resort - broader Wikipedia search without profession
  for (const variant of searchVariants.slice(0, 2)) {
    const image = await tryWikipediaSearch(variant);
    if (image) return image;
  }
  
  console.log(`No Wikipedia image found for ${name} after all strategies`);
  return null;
}

// Get celebrity image - try multiple name variations
async function getCelebrityImage(
  aiName: string,        // Name returned by AI (e.g., "Robyn Rihanna Fenty")
  originalSearch: string, // Original user search term (e.g., "Rihanna")  
  profession: string,
  supabaseClient: any
): Promise<{ imageUrl: string | null; emoji: string }> {
  const slug = aiName.toLowerCase().replace(/\s+/g, '-');
  const emoji = getProfessionEmoji(profession);
  
  try {
    // Check cache first
    const { data: cached } = await supabaseClient
      .from('celebrity_images')
      .select('image_url')
      .eq('celebrity_slug', slug)
      .maybeSingle();
    
    if (cached?.image_url) {
      console.log(`Cache hit for ${aiName}`);
      return { imageUrl: cached.image_url, emoji };
    }
    
    // Also check cache with original search term
    const originalSlug = originalSearch.toLowerCase().replace(/\s+/g, '-');
    if (originalSlug !== slug) {
      const { data: cachedOriginal } = await supabaseClient
        .from('celebrity_images')
        .select('image_url')
        .eq('celebrity_slug', originalSlug)
        .maybeSingle();
      
      if (cachedOriginal?.image_url) {
        console.log(`Cache hit for original search: ${originalSearch}`);
        return { imageUrl: cachedOriginal.image_url, emoji };
      }
    }
    
    // Try original search term FIRST (more likely to match Wikipedia)
    console.log(`Trying Wikipedia with original search: "${originalSearch}"`);
    let wikiImage = await getWikipediaImage(originalSearch, profession);
    
    // If that fails and AI name is different, try AI name
    if (!wikiImage && aiName.toLowerCase() !== originalSearch.toLowerCase()) {
      console.log(`Trying Wikipedia with AI name: "${aiName}"`);
      wikiImage = await getWikipediaImage(aiName, profession);
    }
    
    if (wikiImage) {
      // Cache the Wikipedia URL
      await supabaseClient
        .from('celebrity_images')
        .upsert({
          celebrity_slug: slug,
          celebrity_name: aiName,
          image_url: wikiImage
        }, { onConflict: 'celebrity_slug' });
      
      console.log(`Cached Wikipedia image for ${aiName}`);
      return { imageUrl: wikiImage, emoji };
    }
    
    // No image found, return emoji only
    console.log(`No image for ${aiName}, using emoji: ${emoji}`);
    return { imageUrl: null, emoji };
    
  } catch (error) {
    console.error('Image fetch error:', error);
    return { imageUrl: null, emoji };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  if (isRateLimited(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return errorResponse('Too many requests. Please try again later.', 'RATE_LIMITED');
  }

  // Backend access control check
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("Authorization");
  let user = null;
  let isAnonymous = false;
  let anonymousSearchCount = 0;

  // Check for anonymous search count from header (client tracks this)
  const anonCountHeader = req.headers.get("X-Anonymous-Search-Count");
  if (anonCountHeader) {
    anonymousSearchCount = parseInt(anonCountHeader, 10) || 0;
  }

  if (authHeader && authHeader !== "Bearer null" && authHeader !== "Bearer undefined") {
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    user = userData.user;
  }

  if (!user) {
    // Allow anonymous users but check their search count
    isAnonymous = true;
    if (anonymousSearchCount >= FREE_SEARCH_LIMIT) {
      console.log(`Anonymous user exceeded free search limit: ${anonymousSearchCount}`);
      return errorResponse('Free searches used! Sign up to continue exploring celebrity earnings.', 'ANON_LIMIT_REACHED');
    }
    console.log(`Anonymous search allowed. Count: ${anonymousSearchCount + 1}/${FREE_SEARCH_LIMIT}`);
  } else {
    // Check authenticated user access
    const { data: accessData } = await supabaseClient
      .from("user_access")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!accessData?.has_lifetime_access && (accessData?.search_count || 0) >= FREE_SEARCH_LIMIT) {
      console.log(`User ${user.id} has exceeded free search limit`);
      return errorResponse('Free search limit reached. Please upgrade for unlimited access.', 'LIMIT_REACHED');
    }
  }

  try {
    const body = await req.json();
    
    // Validate inputs
    const name = body.name ? validateName(body.name) : null;
    const category = body.category ? validateCategory(body.category) : null;
    
    // Ensure at least one valid parameter
    if (!name && !category) {
      return errorResponse('Please provide a valid name or category.', 'INVALID_INPUT');
    }
    
    // If name was provided but invalid
    if (body.name && !name) {
      return errorResponse('Invalid name format. Please use only letters, spaces, and hyphens.', 'INVALID_INPUT');
    }
    
    // If category was provided but invalid
    if (body.category && !category) {
      return errorResponse('Invalid category. Please select a valid category.', 'INVALID_INPUT');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return errorResponse('Service temporarily unavailable. Please try again later.', 'SERVICE_UNAVAILABLE');
    }

    // Build sanitized prompt with specific instructions for consistent, verifiable data
    const prompt = name 
      ? `Provide earnings data for "${name}". Return ONLY a JSON object with these fields:
- name: full name
- profession: their primary profession
- category: one of (athletes, hollywood, musicians, tech-billionaires, politicians, influencers, historical)
- netWorth: number in USD (no commas or symbols)
- annualEarnings: number in USD (no commas or symbols) - MUST be > 0
- biggestDeal: their most famous/lucrative known deal or contract (string, e.g. "LeBron's $1B lifetime Nike deal" or "Taylor's $200M UMG deal")
- source: cite the specific Forbes/Bloomberg list and year (e.g., "Forbes 400 2024", "Bloomberg Billionaires 2024")

CRITICAL RULES:
1. Use ONLY the most recent Forbes or Bloomberg published figures. Do not estimate or interpolate.
2. For billionaires: Use their TOTAL annual wealth change from Forbes/Bloomberg tracking, not salary. If wealth grew $10B in a year, annual earnings = $10B.
3. For athletes/entertainers: Use Forbes highest-paid lists (athletes, celebrities, musicians). Include endorsements, sponsorships, NOT just salary.
4. For historical figures (pre-1950): Adjust to 2024 USD and note the original figure.
5. If you cannot find verified Forbes/Bloomberg data, use the most authoritative financial source available.
6. Be CONSISTENT - if Forbes says $50M, report $50M exactly.
7. NEVER return 0 for annualEarnings - estimate based on net worth if needed (5-10% of net worth as minimum).
8. ALWAYS include biggestDeal - research their most famous contract, acquisition, or deal. Be specific with amounts.

Return ONLY valid JSON, no markdown or explanation.`
      : `List 6 notable people in the ${category} category. Return ONLY a JSON array with objects containing: name, profession, category, netWorth (number), annualEarnings (number), biggestDeal (string describing their most famous deal). Use Forbes/Bloomberg published figures only. Never return 0 for annualEarnings. No markdown.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        temperature: 0, // Deterministic output for consistent results
        messages: [
          { role: 'system', content: 'You are a celebrity wealth data API. Return ONLY valid JSON. Use only verified Forbes, Bloomberg, or official financial reporting figures. Be consistent and accurate - never estimate or vary figures between queries. NEVER return 0 for annualEarnings - if exact data is unavailable, estimate based on net worth.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI Gateway error:', response.status);
      return errorResponse('Unable to fetch data right now. Please try again.', 'AI_ERROR');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Log raw AI response for debugging
    console.log(`AI raw response content: ${content.substring(0, 500)}`);
    
    // Parse the JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid AI response format');
      return errorResponse('Unable to process data. Please try again.', 'PARSE_ERROR');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (name) {
      // Log the raw parsed data for debugging
      console.log(`AI parsed data for "${name}": netWorth=${parsed.netWorth}, annualEarnings=${parsed.annualEarnings}`);
      
      // Validate earnings data - if 0 or missing, log warning
      if (!parsed.annualEarnings || parsed.annualEarnings === 0) {
        console.warn(`WARNING: Zero/missing annualEarnings for ${parsed.name || name}, netWorth: ${parsed.netWorth}`);
      }
      
      // Get image with aggressive Wikipedia + emoji fallback
      // Try original search term first (what user typed), then AI name
      const { imageUrl, emoji } = await getCelebrityImage(parsed.name || name, name, parsed.profession || 'celebrity', supabaseClient);
      
      // Ensure numeric values are properly parsed
      const netWorth = Number(parsed.netWorth) || 0;
      let annualEarnings = Number(parsed.annualEarnings) || 0;
      
      // Fallback: If earnings are 0 but we have net worth, estimate at 5% annual return
      if (annualEarnings === 0 && netWorth > 0) {
        annualEarnings = Math.round(netWorth * 0.05);
        console.log(`Estimated annualEarnings for ${parsed.name} at 5% of netWorth: $${annualEarnings}`);
      }
      
      const celebrity = {
        id: parsed.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
        imageUrl,
        emoji,
        ...parsed,
        annualEarnings,
        netWorth,
      };
      console.log(`Fetched celebrity: ${parsed.name}, earnings: $${annualEarnings}, netWorth: $${netWorth}, image: ${imageUrl ? 'found' : 'emoji: ' + emoji}`);
      return new Response(JSON.stringify({ celebrity, error: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Get images for all celebrities in parallel
      const celebritiesWithImages = await Promise.all(
        parsed.map(async (p: any) => {
          // For category searches, use the name as both AI name and search term
          const { imageUrl, emoji } = await getCelebrityImage(p.name, p.name, p.profession || 'celebrity', supabaseClient);
          return {
            id: p.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            imageUrl,
            emoji,
            ...p,
            annualEarnings: Number(p.annualEarnings) || 0,
            netWorth: Number(p.netWorth) || 0,
          };
        })
      );
      console.log(`Fetched ${celebritiesWithImages.length} celebrities with images`);
      return new Response(JSON.stringify({ celebrities: celebritiesWithImages, error: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Function error:', error);
    return errorResponse('An unexpected error occurred. Please try again.', 'UNEXPECTED_ERROR');
  }
});
