// Daily Celebrity Spotlight push blast.
//
// Sends today's featured celebrity as a push notification to every registered
// device. Designed to be triggered on a schedule (pg_cron / external cron).
//
// APNs / FCM delivery is done via Expo Push API for portability — set the
// `EXPO_ACCESS_TOKEN` secret when you're ready to send real pushes. Until then
// the function logs the payload and exits successfully so the pipeline is
// end-to-end even before credentials are wired.
//
// POST body (all optional):
//   { title?: string, body?: string, url?: string, dry_run?: boolean }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = Boolean(body?.dry_run);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Grab today's featured celebrity (best-effort — fall back gracefully).
    let title = String(body?.title ?? '💎 Today\'s Celebrity Spotlight');
    let msg = String(body?.body ?? 'A new billionaire earnings breakdown just dropped. Tap to see how they made it.');
    const url = String(body?.url ?? 'https://earningsexplorer.shop/');

    try {
      const { data } = await supabase
        .from('featured_celebrity')
        .select('name, tagline')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.name) {
        title = `💎 Today's Spotlight: ${data.name}`;
        if (data.tagline) msg = data.tagline;
      }
    } catch {
      /* table optional — ignore */
    }

    // Pull all native tokens (iOS + Android).
    const { data: tokens, error } = await supabase
      .from('device_tokens')
      .select('token, platform')
      .in('platform', ['ios', 'android']);

    if (error) {
      console.error('device_tokens fetch failed', error);
      return json({ error: error.message }, 500);
    }

    const targets = tokens ?? [];
    console.log(`[spotlight] fetched ${targets.length} device tokens`);

    if (dryRun || targets.length === 0) {
      return json({ ok: true, count: targets.length, dryRun, title, body: msg });
    }

    const expoToken = Deno.env.get('EXPO_ACCESS_TOKEN');
    // If we don't have push creds yet, log & exit — devices will still get the
    // local-notification fallback scheduled by initPushNotifications().
    if (!expoToken) {
      console.warn('[spotlight] EXPO_ACCESS_TOKEN not set — skipping send');
      return json({ ok: true, sent: 0, count: targets.length, skipped: 'no_creds' });
    }

    // Batch to Expo push (100 per request per Expo guidelines).
    const messages = targets.map((t) => ({
      to: t.token,
      sound: 'default',
      title,
      body: msg,
      data: { url },
    }));

    let sent = 0;
    for (let i = 0; i < messages.length; i += 100) {
      const chunk = messages.slice(i, i + 100);
      const resp = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${expoToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
        },
        body: JSON.stringify(chunk),
      });
      if (resp.ok) sent += chunk.length;
      else console.warn('[spotlight] expo chunk failed', resp.status, await resp.text());
    }

    return json({ ok: true, sent, count: targets.length });
  } catch (err) {
    console.error('send-daily-spotlight failed', err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
