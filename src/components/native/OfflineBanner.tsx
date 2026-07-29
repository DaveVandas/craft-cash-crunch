import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { WifiOff } from 'lucide-react';

/**
 * Native connectivity banner. Uses the Capacitor Network plugin on device
 * (and the browser online/offline events on web) so the app can tell users
 * they are viewing cached data instead of failing silently.
 */
const OfflineBanner = () => {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let remove: (() => void) | undefined;

    (async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { Network } = await import('@capacitor/network');
          const status = await Network.getStatus();
          setOffline(!status.connected);
          const handle = await Network.addListener('networkStatusChange', (s) => {
            setOffline(!s.connected);
          });
          remove = () => handle.remove();
          return;
        } catch {
          // fall through to web events
        }
      }
      const on = () => setOffline(false);
      const off = () => setOffline(true);
      setOffline(!navigator.onLine);
      window.addEventListener('online', on);
      window.addEventListener('offline', off);
      remove = () => {
        window.removeEventListener('online', on);
        window.removeEventListener('offline', off);
      };
    })();

    return () => remove?.();
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-destructive/90 text-destructive-foreground text-xs md:text-sm py-1.5 px-4 flex items-center justify-center gap-2">
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>You are offline — showing your saved data.</span>
    </div>
  );
};

export default OfflineBanner;
