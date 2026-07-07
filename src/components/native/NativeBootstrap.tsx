import { useEffect } from 'react';
import { initPushNotifications } from '@/lib/pushNotifications';

/**
 * Fire-and-forget native initializer. Renders nothing.
 * Safe on web (all helpers no-op off-device).
 */
const NativeBootstrap = () => {
  useEffect(() => {
    initPushNotifications();
  }, []);
  return null;
};

export default NativeBootstrap;
