import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share, Plus, MoreVertical, Check, Crown, Zap, Wifi, RefreshCw } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function DownloadAppSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Auto-detect platform for default tab
    const ua = navigator.userAgent;
    if (/Android/.test(ua)) {
      setActiveTab('android');
    }

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
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-primary/10 p-8 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
            <Check className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl font-bold">App Installed!</h3>
          <p className="text-sm text-muted-foreground">
            You're experiencing the full Wealth Perspective app
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20">
      {/* Luxury gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      {/* Animated shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="relative p-6 md:p-10">
        {/* Header with crown */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-xl shadow-primary/30 mb-4 animate-pulse">
            <Crown className="w-7 h-7 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">
            Get the <span className="gradient-gold-text">Free App</span>
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
            Install Wealth Perspective on your device for the ultimate mogul experience
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { icon: Zap, label: 'Lightning Fast' },
            { icon: Wifi, label: 'Works Offline' },
            { icon: RefreshCw, label: 'Auto Updates' },
          ].map(({ icon: Icon, label }) => (
            <div 
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Platform tabs */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex rounded-xl bg-muted/50 p-1 border border-border">
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'ios'
                  ? 'bg-card shadow-md text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              iPhone
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'android'
                  ? 'bg-card shadow-md text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
              </svg>
              Android
            </button>
          </div>
        </div>

        {/* Install instructions card */}
        <div className="max-w-md mx-auto">
          <div className="relative rounded-xl bg-card border border-border p-6 shadow-lg">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative space-y-4">
              {activeTab === 'ios' ? (
                <>
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground mb-4">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    Install on iPhone or iPad
                  </div>
                  
                  <div className="space-y-3">
                    <Step number={1}>
                      <span>Tap the <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs font-semibold"><Share className="w-3 h-3" /> Share</span> button in Safari</span>
                    </Step>
                    <Step number={2}>
                      <span>Scroll down and tap <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs font-semibold"><Plus className="w-3 h-3" /> Add to Home Screen</span></span>
                    </Step>
                    <Step number={3}>
                      <span>Tap <span className="font-semibold text-primary">Add</span> in the top right</span>
                    </Step>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                      </svg>
                    </div>
                    Install on Android
                  </div>
                  
                  <div className="space-y-3">
                    <Step number={1}>
                      <span>Tap the <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs font-semibold"><MoreVertical className="w-3 h-3" /> Menu</span> in Chrome</span>
                    </Step>
                    <Step number={2}>
                      <span>Tap <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs font-semibold"><Download className="w-3 h-3" /> Install app</span></span>
                    </Step>
                    <Step number={3}>
                      <span>Tap <span className="font-semibold text-primary">Install</span> to confirm</span>
                    </Step>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Native Install Button (when available) */}
        {deferredPrompt && (
          <div className="text-center mt-6">
            <Button 
              onClick={handleInstallClick}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/30 px-8"
            >
              <Download className="w-5 h-5" />
              Install Now — Free
            </Button>
          </div>
        )}

        {/* Bottom tagline */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          No app store required • Takes 10 seconds • 100% free
        </p>
      </div>
    </div>
  );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md shadow-primary/20">
        {number}
      </div>
      <div className="text-sm text-muted-foreground pt-0.5">{children}</div>
    </div>
  );
}
