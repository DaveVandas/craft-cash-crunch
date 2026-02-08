import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    console.log('[PWA] Standalone mode:', standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
    console.log('[PWA] iOS detected:', ios);

    // Check if on mobile
    const mobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('[PWA] Mobile detected:', mobile);

    // Check if user dismissed before (with 7-day expiry)
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    console.log('[PWA] Dismissed at:', dismissedAt);
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      console.log('[PWA] Days since dismissed:', daysSinceDismissed);
      if (daysSinceDismissed < 7) {
        console.log('[PWA] Not showing - dismissed within 7 days');
        return; // Don't show if dismissed within last 7 days
      }
    }

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS, show prompt after delay if not standalone
    if (ios && !standalone) {
      console.log('[PWA] iOS: will show prompt in 5 seconds');
      setTimeout(() => {
        console.log('[PWA] iOS: showing prompt now');
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  // Don't show if already installed or not on mobile
  if (isStandalone || !showPrompt) {
    return null;
  }

  // Check if on mobile
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[90] md:hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-lg shadow-primary/10">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3 pr-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
            <span className="text-lg">👑</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-0.5">
              Add to Home Screen
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isIOS 
                ? "Tap the share button below, then 'Add to Home Screen' for quick access!"
                : "Get the full app experience with one tap from your home screen."}
            </p>
            
            {isIOS ? (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  Use Safari's share button below:
                </p>
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                  <span className="text-muted-foreground">→</span>
                  <span>Add to Home Screen</span>
                </div>
                <div className="flex justify-center mt-1 animate-bounce">
                  <span className="text-primary text-lg">↓</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleInstall}
                size="sm"
                className="mt-2 h-8 px-3 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-medium"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Install App
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
