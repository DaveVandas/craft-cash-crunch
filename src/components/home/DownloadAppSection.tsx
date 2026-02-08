import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Share, Plus, MoreVertical, Check, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function DownloadAppSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsAndroid(/Android/.test(ua));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Check className="w-6 h-6" />
          <span className="font-semibold">App Installed!</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          You're using the full Wealth Perspective experience
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-background to-card">
      {/* Decorative glow effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Free Download</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">
            Get the <span className="gradient-gold-text">Wealth Perspective</span> App
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Install our app for instant access, offline support, and the full mogul experience
          </p>
        </div>

        {/* App Store Style Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* iOS Badge */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available on</p>
                <p className="text-lg font-semibold -mt-0.5">iPhone & iPad</p>
              </div>
            </div>
          </div>

          {/* Android Badge */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.341c-.5 0-.5-.75 0-.75h.25c.5 0 .5.75 0 .75h-.25zm-11.046 0c-.5 0-.5-.75 0-.75h.25c.5 0 .5.75 0 .75h-.25zm11.405-6.02l1.607-2.785a.333.333 0 10-.577-.333l-1.628 2.82a10.187 10.187 0 00-4.28-.925c-1.537 0-2.99.33-4.28.925L7.095 6.203a.333.333 0 10-.577.333l1.607 2.784C5.252 10.686 3.333 13.463 3.333 16.667h17.334c0-3.204-1.919-5.98-4.785-7.346zM3.333 17.333c0 .367.3.667.667.667h16c.367 0 .667-.3.667-.667v-3.666H3.333v3.666z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available on</p>
                <p className="text-lg font-semibold -mt-0.5">Android</p>
              </div>
            </div>
          </div>
        </div>

        {/* Install Instructions */}
        <div className="bg-muted/50 rounded-xl p-5 mb-6">
          <h4 className="font-semibold mb-4 text-center">How to Install</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* iOS Instructions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                  <svg className="w-4 h-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                iPhone & iPad
              </div>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  <span>Tap the <Share className="inline w-4 h-4 mx-1" /> Share button in Safari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  <span>Scroll and tap <Plus className="inline w-4 h-4 mx-1" /> <strong>Add to Home Screen</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  <span>Tap <strong>Add</strong> — that's it!</span>
                </li>
              </ol>
            </div>

            {/* Android Instructions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341c-.5 0-.5-.75 0-.75h.25c.5 0 .5.75 0 .75h-.25zm-11.046 0c-.5 0-.5-.75 0-.75h.25c.5 0 .5.75 0 .75h-.25zm11.405-6.02l1.607-2.785a.333.333 0 10-.577-.333l-1.628 2.82a10.187 10.187 0 00-4.28-.925c-1.537 0-2.99.33-4.28.925L7.095 6.203a.333.333 0 10-.577.333l1.607 2.784C5.252 10.686 3.333 13.463 3.333 16.667h17.334c0-3.204-1.919-5.98-4.785-7.346z"/>
                  </svg>
                </div>
                Android
              </div>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  <span>Tap the <MoreVertical className="inline w-4 h-4 mx-1" /> menu in Chrome</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  <span>Tap <Download className="inline w-4 h-4 mx-1" /> <strong>Install app</strong> or <strong>Add to Home Screen</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  <span>Confirm and you're done!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Native Install Button (when available) */}
        {deferredPrompt && (
          <div className="text-center">
            <Button 
              onClick={handleInstallClick}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
            >
              <Download className="w-5 h-5" />
              Install Now — It's Free
            </Button>
          </div>
        )}

        {/* Features list */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary" />
            Works offline
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary" />
            Fast & lightweight
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary" />
            No app store needed
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary" />
            Always up to date
          </span>
        </div>
      </div>
    </div>
  );
}
