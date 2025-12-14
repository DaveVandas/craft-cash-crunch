import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = name 
      ? `Provide earnings data for ${name}. Return a JSON object with: name, profession, category (one of: athletes, hollywood, musicians, tech-billionaires, politicians, influencers, historical), netWorth (number in USD), annualEarnings (number in USD), and a brief source note. Be accurate based on recent public data. Only return the JSON, no other text.`
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
          { role: 'system', content: 'You are a celebrity wealth data API. Always return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse the JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
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
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
