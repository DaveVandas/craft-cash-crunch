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

    // Check admin role
    const { data: isAdmin } = await supabaseClient.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch all beta invites
    const { data: invites, error: invitesError } = await supabaseClient
      .from('beta_invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (invitesError) throw invitesError;

    // Fetch all feedback with user emails
    const { data: feedback, error: feedbackError } = await supabaseClient
      .from('beta_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (feedbackError) throw feedbackError;

    // Fetch all beta sessions
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from('beta_sessions')
      .select('*')
      .order('started_at', { ascending: false });

    if (sessionsError) throw sessionsError;

    // Get user emails for feedback and sessions
    const userIds = new Set([
      ...feedback.map(f => f.user_id),
      ...sessions.map(s => s.user_id),
      ...invites.filter(i => i.claimed_by).map(i => i.claimed_by),
    ]);

    const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
    
    const userEmailMap: Record<string, string> = {};
    if (authUsers?.users) {
      authUsers.users.forEach(u => {
        if (userIds.has(u.id)) {
          userEmailMap[u.id] = u.email || 'Unknown';
        }
      });
    }

    // Enrich data with emails
    const enrichedInvites = invites.map(invite => ({
      ...invite,
      claimedByEmail: invite.claimed_by ? userEmailMap[invite.claimed_by] : null,
    }));

    const enrichedFeedback = feedback.map(fb => ({
      ...fb,
      userEmail: userEmailMap[fb.user_id] || 'Unknown',
    }));

    // Calculate total time per user
    const userTimeMap: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.duration_seconds) {
        userTimeMap[s.user_id] = (userTimeMap[s.user_id] || 0) + s.duration_seconds;
      }
    });

    const enrichedSessions = Object.entries(userTimeMap).map(([userId, totalSeconds]) => ({
      userId,
      userEmail: userEmailMap[userId] || 'Unknown',
      totalSeconds,
      totalMinutes: Math.round(totalSeconds / 60),
    }));

    return new Response(JSON.stringify({
      invites: enrichedInvites,
      feedback: enrichedFeedback,
      sessions: enrichedSessions,
      stats: {
        totalInvites: invites.length,
        pendingInvites: invites.filter(i => i.status === 'pending').length,
        claimedInvites: invites.filter(i => i.status === 'claimed').length,
        expiredInvites: invites.filter(i => i.status === 'expired').length,
        totalFeedback: feedback.length,
        avgOverallRating: feedback.length > 0 
          ? (feedback.reduce((sum, f) => sum + f.overall_rating, 0) / feedback.length).toFixed(1)
          : 0,
        avgExperienceRating: feedback.length > 0
          ? (feedback.reduce((sum, f) => sum + f.experience_rating, 0) / feedback.length).toFixed(1)
          : 0,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Admin beta data error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
