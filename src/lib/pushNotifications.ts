/**
 * Push + Local notification bootstrap.
 * Runs only on native (iOS/Android). Registers with APNs/FCM, persists the
 * device token to `device_tokens` for the daily Celebrity Spotlight blast,
 * and schedules a local morning fallback so review-time devices without a
 * push cert still receive a native alert.
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { supabase } from '@/integrations/supabase/client';

const LOCAL_DAILY_ID = 1001;

const persistToken = async (token: string) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    await supabase.functions.invoke('register-push-token', {
      body: {
        token,
        platform: Capacitor.getPlatform(),
        user_id: sessionData?.session?.user?.id ?? null,
      },
    });
  } catch (err) {
    console.warn('[push] register-push-token failed', err);
  }
};

const scheduleDailySpotlightFallback = async () => {
  try {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      const req = await LocalNotifications.requestPermissions();
      if (req.display !== 'granted') return;
    }
    // Cancel any prior schedule then schedule a repeating 9am notification.
    try {
      await LocalNotifications.cancel({ notifications: [{ id: LOCAL_DAILY_ID }] });
    } catch {
      /* ignore */
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          id: LOCAL_DAILY_ID,
          title: '💎 Today\'s Celebrity Spotlight',
          body: 'A new billionaire earnings breakdown is waiting. Tap to see how they made it.',
          schedule: { on: { hour: 9, minute: 0 }, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon_config_sample',
        },
      ],
    });
  } catch (err) {
    console.warn('[local-notify] schedule failed', err);
  }
};

export const initPushNotifications = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  // Always schedule the local fallback so at least SOMETHING native fires.
  scheduleDailySpotlightFallback();

  try {
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === 'prompt' || perm.receive === 'prompt-with-rationale') {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive !== 'granted') return;

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token) => {
      persistToken(token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.warn('[push] registration error', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.info('[push] received', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const url = (action.notification.data as { url?: string })?.url;
      if (url) {
        window.location.href = url;
      }
    });
  } catch (err) {
    console.warn('[push] init failed', err);
  }
};
