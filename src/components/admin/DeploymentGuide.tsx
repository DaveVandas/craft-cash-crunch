import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, Apple, CheckCircle2, Copy, ExternalLink, 
  Terminal, FolderOpen, Image, Rocket, AlertTriangle, Github
} from 'lucide-react';
import { toast } from 'sonner';

const DeploymentGuide = () => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const appIcons = [
    { name: 'iOS App Store (1024x1024)', path: '/app-icons/ios-1024x1024.png', target: 'ios/App/App/Assets.xcassets/AppIcon.appiconset/' },
    { name: 'Android xxxhdpi (192x192)', path: '/app-icons/android-xxxhdpi-192x192.png', target: 'android/app/src/main/res/mipmap-xxxhdpi/' },
    { name: 'Android xxhdpi (144x144)', path: '/app-icons/android-xxhdpi-144x144.png', target: 'android/app/src/main/res/mipmap-xxhdpi/' },
    { name: 'Android xhdpi (96x96)', path: '/app-icons/android-xhdpi-96x96.png', target: 'android/app/src/main/res/mipmap-xhdpi/' },
    { name: 'Android hdpi (72x72)', path: '/app-icons/android-hdpi-72x72.png', target: 'android/app/src/main/res/mipmap-hdpi/' },
    { name: 'Android mdpi (48x48)', path: '/app-icons/android-mdpi-48x48.png', target: 'android/app/src/main/res/mipmap-mdpi/' },
  ];

  const splashScreens = [
    { name: 'Universal Phone (1080x1920)', path: '/splash-screens/splash-1080x1920.png', use: 'iPhone X/11/12/13/14, Android phones' },
    { name: 'iPhone 8/7/6 (750x1334)', path: '/splash-screens/splash-750x1334.png', use: 'Older iPhones' },
    { name: 'iPhone SE (640x1136)', path: '/splash-screens/splash-640x1136.png', use: 'iPhone SE' },
    { name: 'iPad Portrait (1536x2048)', path: '/splash-screens/splash-1536x2048.png', use: 'iPad portrait mode' },
    { name: 'iPad Landscape (2048x1536)', path: '/splash-screens/splash-2048x1536.png', use: 'iPad landscape mode' },
    { name: 'Universal Square (1920x1920)', path: '/splash-screens/splash-1920x1920.png', use: 'iPad Pro, can be cropped' },
  ];

  const steps = [
    {
      step: 1,
      title: 'Export to GitHub',
      description: 'Connect your Lovable project to GitHub',
      commands: [
        '1. Click the project name (top-left) → Settings → GitHub',
        '2. Click "Connect to GitHub" and authorize Lovable',
        '3. Select your GitHub account/organization',
        '4. Click "Create Repository" to push your code',
      ],
      icon: Github,
    },
    {
      step: 2,
      title: 'Clone & Install Locally',
      description: 'Get the project on your local machine',
      commands: [
        'git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git',
        'cd YOUR_REPO',
        'npm install',
      ],
      icon: Terminal,
    },
    {
      step: 3,
      title: 'Add Native Platforms',
      description: 'Initialize iOS and/or Android projects',
      commands: [
        'npx cap add ios      # For iOS (requires Mac + Xcode)',
        'npx cap add android  # For Android (requires Android Studio)',
      ],
      icon: Smartphone,
    },
    {
      step: 4,
      title: 'Copy App Icons',
      description: 'Replace default icons with Wealth Perspective branding',
      commands: [
        '# iOS: Copy ios-1024x1024.png to ios/App/App/Assets.xcassets/AppIcon.appiconset/',
        '# Android: Copy each density icon to android/app/src/main/res/mipmap-*/',
        '# Use asset generator tools like "capacitor-assets" for automated resizing',
      ],
      icon: Image,
    },
    {
      step: 5,
      title: 'Configure Splash Screens',
      description: 'Set up branded launch screens',
      commands: [
        '# iOS: Add to ios/App/App/Assets.xcassets/Splash.imageset/',
        '# Android: Configure in android/app/src/main/res/drawable/',
        '# Or use @capacitor/splash-screen plugin for programmatic control',
      ],
      icon: Image,
    },
    {
      step: 6,
      title: 'Build & Sync',
      description: 'Compile and sync to native projects',
      commands: [
        'npm run build        # Build the web app',
        'npx cap sync         # Sync web assets to native projects',
      ],
      icon: Rocket,
    },
    {
      step: 7,
      title: 'Run on Device/Emulator',
      description: 'Test your native app',
      commands: [
        'npx cap run ios      # Run on iOS Simulator or device',
        'npx cap run android  # Run on Android Emulator or device',
        '# Or open in IDE:',
        'npx cap open ios     # Opens Xcode',
        'npx cap open android # Opens Android Studio',
      ],
      icon: Smartphone,
    },
    {
      step: 8,
      title: 'App Store Submission',
      description: 'Prepare and submit to app stores',
      commands: [
        '# iOS: Use Xcode → Product → Archive → Distribute',
        '# Android: Generate signed APK/AAB in Android Studio',
        '# Submit via App Store Connect (iOS) or Google Play Console (Android)',
      ],
      icon: Apple,
    },
  ];

  const productionChecklist = [
    { item: 'Remove development server URL from capacitor.config.ts', done: false, critical: true },
    { item: 'All console.log statements removed', done: true },
    { item: 'Privacy Policy has contact email', done: true },
    { item: 'Terms of Service has contact email', done: true },
    { item: 'App icons generated (1024x1024 for iOS)', done: true },
    { item: 'Splash screens generated', done: true },
    { item: 'App name set correctly (Wealth Perspective)', done: true },
    { item: 'Bundle ID configured (app.lovable.86ba53150e8e45d49ce2019ca156c207)', done: true },
    { item: 'Test on physical device before submission', done: false },
    { item: 'Apple Developer account ($99/year)', done: false },
    { item: 'Google Play Developer account ($25 one-time)', done: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Native App Deployment Guide
          </CardTitle>
          <CardDescription>
            Complete guide to building and submitting Wealth Perspective to iOS App Store and Google Play Store
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Production Checklist */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Pre-Submission Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productionChecklist.map((check, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  check.done 
                    ? 'border-primary/30 bg-primary/5' 
                    : check.critical 
                      ? 'border-destructive/30 bg-destructive/5'
                      : 'border-border bg-muted/30'
                }`}
              >
                {check.done ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : check.critical ? (
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${check.done ? 'text-primary' : ''}`}>
                  {check.item}
                  {check.critical && !check.done && (
                    <Badge variant="destructive" className="ml-2 text-xs">Critical</Badge>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assets Section */}
      <Tabs defaultValue="icons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="icons" className="gap-2">
            <Image className="h-4 w-4" />
            App Icons
          </TabsTrigger>
          <TabsTrigger value="splash" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Splash Screens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="icons">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                App Icons - Copy Paths
              </CardTitle>
              <CardDescription>
                Click to copy the file path. Download from public folder after GitHub export.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appIcons.map((icon, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <img src={icon.path} alt={icon.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{icon.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{icon.target}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(icon.path, icon.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="splash">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Splash Screens - Copy Paths
              </CardTitle>
              <CardDescription>
                Click to copy the file path. These are located in the public/splash-screens folder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {splashScreens.map((splash, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
                    <div className="h-16 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <img src={splash.path} alt={splash.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{splash.name}</p>
                      <p className="text-xs text-muted-foreground">{splash.use}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(splash.path, splash.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Step by Step Guide */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Step-by-Step Deployment
          </CardTitle>
          <CardDescription>
            Follow these steps in order to build and submit your native app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-full bg-border ml-5 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">Step {step.step}</Badge>
                  <h4 className="font-semibold">{step.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  {step.commands.map((cmd, j) => (
                    <div key={j} className="flex items-center justify-between gap-2 py-1">
                      <code className="text-xs text-muted-foreground font-mono break-all">{cmd}</code>
                      {cmd.startsWith('git') || cmd.startsWith('npm') || cmd.startsWith('npx') ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 flex-shrink-0"
                          onClick={() => copyToClipboard(cmd, 'Command')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Critical: Before App Store Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <strong>Remove the development server URL from capacitor.config.ts:</strong>
          </p>
          <div className="bg-muted rounded-lg p-3 border border-border">
            <code className="text-xs font-mono block">
              {`// Comment out or remove this section for production builds:
server: {
  url: 'https://86ba5315-0e8e-45d4-9ce2-019ca156c207.lovableproject.com?forceHideBadge=true',
  cleartext: true,
}`}
            </code>
          </div>
          <p className="text-sm text-muted-foreground">
            This URL is only for development hot-reload. For production, the app should load from the bundled web assets (dist folder), not from the sandbox URL.
          </p>
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://capacitorjs.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Capacitor Docs</p>
                <p className="text-xs text-muted-foreground">Official documentation</p>
              </div>
            </a>
            <a 
              href="https://developer.apple.com/app-store/connect/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <Apple className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">App Store Connect</p>
                <p className="text-xs text-muted-foreground">iOS submission portal</p>
              </div>
            </a>
            <a 
              href="https://play.google.com/console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Google Play Console</p>
                <p className="text-xs text-muted-foreground">Android submission portal</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentGuide;
