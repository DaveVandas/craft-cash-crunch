import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// CORS configuration - restrict to allowed origins
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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData } = await supabaseClient.auth.getUser(token);
    
    if (!userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, ...params } = await req.json();

    // SUBMIT: Submit feedback
    if (action === 'submit') {
      const { overallRating, experienceRating, whatLiked, whatToImprove, additionalComments } = params;

      // Get user's beta invite if they have one
      const { data: accessData } = await supabaseClient
        .from('user_access')
        .select('beta_invite_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      const { data: feedback, error } = await supabaseClient
        .from('beta_feedback')
        .insert({
          user_id: userData.user.id,
          beta_invite_id: accessData?.beta_invite_id || null,
          overall_rating: overallRating,
          experience_rating: experienceRating,
          what_liked: whatLiked || null,
          what_to_improve: whatToImprove || null,
          additional_comments: additionalComments || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        throw new Error('Failed to submit feedback');
      }

      return new Response(JSON.stringify({ success: true, feedback }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CHECK: Check if user has already submitted feedback
    if (action === 'check') {
      const { data: existing } = await supabaseClient
        .from('beta_feedback')
        .select('id, created_at')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return new Response(JSON.stringify({ 
        hasSubmitted: !!existing,
        lastSubmission: existing?.created_at || null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Beta feedback error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
