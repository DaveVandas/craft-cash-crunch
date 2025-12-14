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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  if (isRateLimited(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Backend access control check
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.warn("No auth header - blocking unauthenticated request");
    return new Response(JSON.stringify({ error: 'Please sign in to search for celebrities.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await supabaseClient.auth.getUser(token);
  const user = userData.user;

  if (!user) {
    console.warn("Invalid token - blocking request");
    return new Response(JSON.stringify({ error: 'Please sign in to search for celebrities.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check user access
  const { data: accessData } = await supabaseClient
    .from("user_access")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!accessData?.has_lifetime_access && (accessData?.search_count || 0) >= FREE_SEARCH_LIMIT) {
    console.log(`User ${user.id} has exceeded free search limit`);
    return new Response(JSON.stringify({ error: 'Free search limit reached. Please upgrade for unlimited access.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    
    // Validate inputs
    const name = body.name ? validateName(body.name) : null;
    const category = body.category ? validateCategory(body.category) : null;
    
    // Ensure at least one valid parameter
    if (!name && !category) {
      return new Response(JSON.stringify({ error: 'Please provide a valid name or category.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // If name was provided but invalid
    if (body.name && !name) {
      return new Response(JSON.stringify({ error: 'Invalid name format. Please use only letters, spaces, and hyphens.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // If category was provided but invalid
    if (body.category && !category) {
      return new Response(JSON.stringify({ error: 'Invalid category. Please select a valid category.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build sanitized prompt
    const prompt = name 
      ? `Provide earnings data for the celebrity named "${name}". Return a JSON object with: name, profession, category (one of: athletes, hollywood, musicians, tech-billionaires, politicians, influencers, historical), netWorth (number in USD), annualEarnings (number in USD), and a brief source note. Be accurate based on recent public data. IMPORTANT: For historical figures (people who lived before 1950), adjust all wealth values to 2024 USD using proper inflation calculations. Only return the JSON, no other text.`
      : `List 6 notable people in the ${category} category with their earnings. Return a JSON array of objects with: name, profession, category, netWorth, annualEarnings. Only return the JSON array, no other text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a celebrity wealth data API. Always return valid JSON only. Only provide data for real, publicly known individuals.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI Gateway error:', response.status);
      return new Response(JSON.stringify({ error: 'Unable to fetch data. Please try again.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse the JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid AI response format');
      return new Response(JSON.stringify({ error: 'Unable to process data. Please try again.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (name) {
      const celebrity = {
        id: parsed.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
        ...parsed
      };
      return new Response(JSON.stringify({ celebrity }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      const celebrities = parsed.map((p: any) => ({
        id: p.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
        ...p
      }));
      return new Response(JSON.stringify({ celebrities }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
