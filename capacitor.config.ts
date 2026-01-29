import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.86ba53150e8e45d49ce2019ca156c207',
  appName: 'Wealth Perspective',
  webDir: 'dist',
  server: {
    // For development - enables hot reload from the sandbox preview
    // Comment out or remove for production builds
    url: 'https://86ba5315-0e8e-45d4-9ce2-019ca156c207.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0a',
    },
  },
};

export default config;
