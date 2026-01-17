import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://earningsexplorer.shop',
  'https://www.earningsexplorer.shop',
  'https://craft-cash-crunch.lovable.app',
  'https://id-preview--86ba5315-0e8e-45d4-9ce2-019ca156c207.lovable.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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
    const { action, ...params } = await req.json();

    // CREATE: Admin creates a new invite
    if (action === 'create') {
      // Verify admin role
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

      const { recipientEmail, recipientName } = params;
      const inviteCode = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      const { data: invite, error } = await supabaseClient
        .from('beta_invites')
        .insert({
          invite_code: inviteCode,
          created_by: userData.user.id,
          recipient_email: recipientEmail || null,
          recipient_name: recipientName || null,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invite:', error);
        throw new Error('Failed to create invite');
      }

      const baseUrl = Deno.env.get('SITE_URL') || 'https://earningsexplorer.shop';
      const inviteLink = `${baseUrl}/beta?code=${inviteCode}`;
      
      const recipientGreeting = recipientName ? `Hi ${recipientName}!` : 'Hi there!';

      const inviteMessage = `🎉 ${recipientGreeting}

You've been personally selected to be one of our exclusive beta testers for Wealth Perspective!

We genuinely value your opinion and feedback. As a beta tester, you'll have the unique opportunity to shape the final product. Your insights matter deeply to us – every suggestion you make could directly influence how we build and improve the app.

✨ Your exclusive beta access includes:
• 7 days of unlimited, full-featured access
• Early access to features before anyone else
• Direct influence on the final product through your feedback
• A voice that truly matters in our development process

We're not just looking for testers – we're looking for partners who can help us create something amazing. Your honest feedback, whether it's praise or constructive criticism, will help us make Wealth Perspective the best it can be.

👉 Click here to get started: ${inviteLink}

This invite expires in 7 days, so don't wait!

Thank you for being part of our journey. We can't wait to hear what you think!

— The Wealth Perspective Team`;

      return new Response(JSON.stringify({
        invite,
        inviteLink,
        inviteMessage,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // VALIDATE: Check if an invite code is valid
    if (action === 'validate') {
      const { code } = params;

      const { data: invite, error } = await supabaseClient
        .from('beta_invites')
        .select('*')
        .eq('invite_code', code)
        .maybeSingle();

      if (error || !invite) {
        return new Response(JSON.stringify({ valid: false, reason: 'Invite not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (invite.status === 'claimed') {
        return new Response(JSON.stringify({ valid: false, reason: 'Invite already used' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (new Date(invite.expires_at) < new Date()) {
        // Update status to expired
        await supabaseClient
          .from('beta_invites')
          .update({ status: 'expired' })
          .eq('id', invite.id);

        return new Response(JSON.stringify({ valid: false, reason: 'Invite expired' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Return minimal data - only first name, no email or other sensitive info
      return new Response(JSON.stringify({ 
        valid: true, 
        recipientName: invite.recipient_name?.split(' ')[0] || '',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CLAIM: Claim an invite after signup
    if (action === 'claim') {
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

      const { code } = params;

      // Get the invite
      const { data: invite, error: fetchError } = await supabaseClient
        .from('beta_invites')
        .select('*')
        .eq('invite_code', code)
        .eq('status', 'pending')
        .maybeSingle();

      if (fetchError || !invite) {
        return new Response(JSON.stringify({ error: 'Invalid or expired invite' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if expired
      if (new Date(invite.expires_at) < new Date()) {
        await supabaseClient
          .from('beta_invites')
          .update({ status: 'expired' })
          .eq('id', invite.id);

        return new Response(JSON.stringify({ error: 'Invite expired' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Claim the invite
      const now = new Date();
      const betaExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { error: claimError } = await supabaseClient
        .from('beta_invites')
        .update({
          claimed_by: userData.user.id,
          claimed_at: now.toISOString(),
          status: 'claimed',
        })
        .eq('id', invite.id);

      if (claimError) {
        console.error('Error claiming invite:', claimError);
        throw new Error('Failed to claim invite');
      }

      // Update user_access with beta info
      const { error: accessError } = await supabaseClient
        .from('user_access')
        .update({
          beta_invite_id: invite.id,
          beta_expires_at: betaExpiresAt.toISOString(),
        })
        .eq('user_id', userData.user.id);

      if (accessError) {
        console.error('Error updating user access:', accessError);
      }

      // Create initial session record
      await supabaseClient
        .from('beta_sessions')
        .insert({
          user_id: userData.user.id,
          beta_invite_id: invite.id,
        });

      return new Response(JSON.stringify({ 
        success: true,
        betaExpiresAt: betaExpiresAt.toISOString(),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE: Admin deletes an invite
    if (action === 'delete') {
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

      const { inviteId } = params;

      if (!inviteId) {
        return new Response(JSON.stringify({ error: 'Invite ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabaseClient
        .from('beta_invites')
        .delete()
        .eq('id', inviteId);

      if (error) {
        console.error('Error deleting invite:', error);
        throw new Error('Failed to delete invite');
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Beta invite error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});