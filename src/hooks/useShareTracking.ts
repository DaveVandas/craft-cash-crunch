import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type SharePlatform = 
  | 'twitter' 
  | 'facebook' 
  | 'whatsapp' 
  | 'linkedin' 
  | 'instagram' 
  | 'tiktok' 
  | 'native' 
  | 'copy' 
  | 'save-image';

export type ShareFeature = 
  | 'compare' 
  | 'calculator' 
  | 'quiz' 
  | 'mogul-markets' 
  | 'profile' 
  | 'invite' 
  | 'affiliate' 
  | 'trades' 
  | 'celebrity-portfolios'
  | 'wealth-wisdom'
  | 'landing'
  | 'side-hustle';

export type ShareType = 'link' | 'image' | 'text';

interface ShareContext {
  celebrity_name?: string;
  affiliate_code?: string;
  quiz_score?: number;
  comparison_names?: string[];
  [key: string]: unknown;
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Track share events for analytics
 */
export function useShareTracking() {
  const trackShare = useCallback(async (
    feature: ShareFeature,
    platform: SharePlatform,
    shareType: ShareType = 'link',
    context: ShareContext = {}
  ) => {
    try {
      // Fire and forget - don't block the share action
      supabase.rpc('track_share', {
        p_feature: feature,
        p_platform: platform,
        p_share_type: shareType,
        p_context: context as Json,
        p_device_type: getDeviceType(),
        p_referrer: window.location.pathname,
      }).then(() => {
        console.log(`[Share Tracked] ${feature} → ${platform} (${shareType})`);
      });
    } catch (err) {
      // Silent fail - don't disrupt the user experience
      console.warn('[Share Tracking] Error:', err);
    }
  }, []);

  return { trackShare };
}

/**
 * Standalone tracking function for use outside of React components
 */
export async function trackShareEvent(
  feature: ShareFeature,
  platform: SharePlatform,
  shareType: ShareType = 'link',
  context: ShareContext = {}
) {
  try {
    await supabase.rpc('track_share', {
      p_feature: feature,
      p_platform: platform,
      p_share_type: shareType,
      p_context: context as Json,
      p_device_type: getDeviceType(),
      p_referrer: window.location.pathname,
    });
  } catch (err) {
    console.warn('[Share Tracking] Error:', err);
  }
}
