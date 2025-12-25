import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

serve(async (req) => {
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

      const inviteMessage = `🎉 You've been chosen!\n\nYou're invited to beta test Wealth Perspective - our exciting new app launching soon!\n\nWe hold your opinions in high regard and would truly appreciate your participation as one of our exclusive beta testers.\n\n✨ Your invite includes:\n• 7 days of unlimited access\n• Early access to all features\n• Direct influence on the final product\n\nClick here to get started: ${inviteLink}\n\nThis invite expires in 7 days.\n\nThank you for being part of our journey!`;

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

      return new Response(JSON.stringify({ 
        valid: true, 
        invite,
        recipientName: invite.recipient_name,
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