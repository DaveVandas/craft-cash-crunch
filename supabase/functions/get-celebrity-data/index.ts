import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  
  // Only allow letters, spaces, hyphens, apostrophes, and periods (for names like "Jr." or "O'Brien")
  const namePattern = /^[a-zA-Z\s\-'.]+$/;
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

// Fetch Wikipedia image for a celebrity
async function fetchWikipediaImage(name: string): Promise<string | null> {
  try {
    const encodedName = encodeURIComponent(name);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    
    // Get the first page result
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null; // Page not found
    
    const imageUrl = pages[pageId]?.thumbnail?.source;
    return imageUrl || null;
  } catch (error) {
    console.error('Wikipedia image fetch error:', error);
    return null;
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
  if (!authHeader) {
    console.warn("No auth header - blocking unauthenticated request");
    return errorResponse('Please sign in to search for celebrities.', 'AUTH_REQUIRED');
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await supabaseClient.auth.getUser(token);
  const user = userData.user;

  if (!user) {
    console.warn("Invalid token - blocking request");
    return errorResponse('Please sign in to search for celebrities.', 'AUTH_REQUIRED');
  }

  // Check user access
  const { data: accessData } = await supabaseClient
    .from("user_access")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!accessData?.has_lifetime_access && (accessData?.search_count || 0) >= FREE_SEARCH_LIMIT) {
    console.log(`User ${user.id} has exceeded free search limit`);
    return errorResponse('Free search limit reached. Please upgrade for unlimited access.', 'LIMIT_REACHED');
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
- annualEarnings: number in USD (no commas or symbols)
- source: cite the specific Forbes/Bloomberg list and year (e.g., "Forbes 400 2024", "Bloomberg Billionaires 2024")

CRITICAL RULES:
1. Use ONLY the most recent Forbes or Bloomberg published figures. Do not estimate or interpolate.
2. For billionaires: Use their TOTAL annual wealth change from Forbes/Bloomberg tracking, not salary.
3. For athletes/entertainers: Use Forbes highest-paid lists (athletes, celebrities, musicians).
4. For historical figures (pre-1950): Adjust to 2024 USD and note the original figure.
5. If you cannot find verified Forbes/Bloomberg data, use the most authoritative financial source available.
6. Be CONSISTENT - if Forbes says $50M, report $50M exactly.

Return ONLY valid JSON, no markdown or explanation.`
      : `List 6 notable people in the ${category} category. Return ONLY a JSON array with objects containing: name, profession, category, netWorth (number), annualEarnings (number). Use Forbes/Bloomberg published figures only. No markdown.`;

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
          { role: 'system', content: 'You are a celebrity wealth data API. Return ONLY valid JSON. Use only verified Forbes, Bloomberg, or official financial reporting figures. Be consistent and accurate - never estimate or vary figures between queries.' },
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
    
    // Parse the JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid AI response format');
      return errorResponse('Unable to process data. Please try again.', 'PARSE_ERROR');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (name) {
      // Fetch Wikipedia image for single celebrity
      const imageUrl = await fetchWikipediaImage(parsed.name || name);
      
      const celebrity = {
        id: parsed.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
        imageUrl,
        ...parsed
      };
      console.log(`Fetched celebrity: ${parsed.name}, image: ${imageUrl ? 'found' : 'not found'}`);
      return new Response(JSON.stringify({ celebrity, error: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Fetch Wikipedia images for all celebrities in parallel
      const celebritiesWithImages = await Promise.all(
        parsed.map(async (p: any) => {
          const imageUrl = await fetchWikipediaImage(p.name);
          return {
            id: p.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            imageUrl,
            ...p
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
