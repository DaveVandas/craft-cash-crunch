// Register a push notification device token for the current user (or anonymously).
// Called from the app after Capacitor Push Notifications registers with APNs/FCM.
//
// Body: { token: string, platform: 'ios'|'android'|'web', user_id?: string | null }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const body = await req.json();
    const token = String(body?.token ?? '').trim();
    const platform = String(body?.platform ?? '').trim().toLowerCase();
    const userId = body?.user_id ?? null;

    if (!token) return json({ error: 'token required' }, 400);
    if (!['ios', 'android', 'web'].includes(platform)) {
      return json({ error: 'invalid platform' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await supabase
      .from('device_tokens')
      .upsert(
        { token, platform, user_id: userId, last_seen_at: new Date().toISOString() },
        { onConflict: 'token' },
      );

    if (error) {
      console.error('device_tokens upsert failed', error);
      return json({ error: error.message }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('register-push-token failed', err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
