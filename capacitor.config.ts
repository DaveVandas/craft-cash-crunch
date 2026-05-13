import type { CapacitorConfig } from '@capacitor/cli';

// Enable hot-reload from the sandbox preview ONLY when CAP_DEV is set.
// For App Store / Play Store builds, leave CAP_DEV unset so the bundled
// `dist/` is shipped (Apple rejects apps that load remote web content).
const isDev = process.env.CAP_DEV === '1';

const config: CapacitorConfig = {
  appId: 'com.northspan.wealthperspective',
  appName: 'Wealth Perspective',
  webDir: 'dist',
  ...(isDev && {
    server: {
      url: 'https://earningsexplorer.shop',
      cleartext: true,
    },
  }),
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
