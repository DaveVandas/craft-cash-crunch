import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import appIcon from '@/assets/app-icon.png';
import { PhoneBezel } from '@/components/marketing/PhoneBezel';
import earningsAsset from '@/assets/store-screens/01-earnings.png.asset.json';
import realityAsset from '@/assets/store-screens/02-reality-check.png.asset.json';
import compareAsset from '@/assets/store-screens/03-compare.png.asset.json';
import marketsAsset from '@/assets/store-screens/04-mogul-markets.png.asset.json';
import portfoliosAsset from '@/assets/store-screens/05-vip-portfolios.png.asset.json';
import quizAsset from '@/assets/store-screens/06-quiz.png.asset.json';

/**
 * Marketing screenshots for App Store and Google Play store listings.
 * Each frame embeds a real iPhone-bezel screenshot of the live app on a
 * gold gradient background. Rendered at iPhone 6.7" (1290×2796) and
 * Android (1080×1920). Capture via DevTools "Capture node screenshot" on
 * the element with data-screenshot-inner.
 */

type DeviceSize = 'iphone-67' | 'android';

const SIZES: Record<DeviceSize, { w: number; h: number; label: string }> = {
  'iphone-67': { w: 1290, h: 2796, label: 'iPhone 6.7" (1290×2796)' },
  android: { w: 1080, h: 1920, label: 'Android Phone (1080×1920)' },
};

interface Screenshot {
  id: string;
  caption: string;
  subCaption: string;
  accent: string;
  /** Real app screenshot asset URL. Omit for illustrated frames. */
  screen?: string;
  /** Illustrated body, used when screen is not provided. */
  body?: React.ReactNode;
}

const screenshots: Screenshot[] = [
  {
    id: '01-earnings',
    caption: 'See Real-Time Mogul Earnings',
    subCaption: 'Watch the ultra-rich rake it in by the second',
    accent: 'from-amber-400 via-yellow-500 to-amber-600',
    screen: earningsAsset.url,
  },
  {
    id: '02-reality-check',
    caption: 'How Fast Do They Earn YOUR Salary?',
    subCaption: 'Reality Check breaks it down in seconds',
    accent: 'from-rose-500 to-amber-500',
    screen: realityAsset.url,
  },
  {
    id: '03-compare',
    caption: 'Mogul vs Mogul, Head-to-Head',
    subCaption: 'Side-by-side wealth showdowns with the receipts',
    accent: 'from-violet-500 to-amber-500',
    screen: compareAsset.url,
  },
  {
    id: '04-mogul-markets',
    caption: 'Trade Like a Mogul. Risk Zero.',
    subCaption: 'Paper-trade real stocks with virtual cash',
    accent: 'from-emerald-500 to-amber-500',
    screen: marketsAsset.url,
  },
  {
    id: '05-vip-portfolios',
    caption: 'Mirror Billionaire Portfolios',
    subCaption: 'See what politicians and tycoons actually hold',
    accent: 'from-sky-500 to-amber-500',
    screen: portfoliosAsset.url,
  },
  {
    id: '06-quiz',
    caption: 'Test Your Wealth IQ',
    subCaption: 'Daily quiz, streak multipliers, real wealth wisdom',
    accent: 'from-fuchsia-500 to-amber-500',
    screen: quizAsset.url,
  },
  {
    id: '07-lifetime',
    caption: 'Unlock Everything Forever',
    subCaption: 'One payment. No subscriptions. Ever.',
    accent: 'from-amber-400 to-yellow-600',
    body: (
      <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center justify-center gap-10 text-center">
        {/* premium price medallion */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300/40 to-yellow-600/20 blur-3xl rounded-full scale-150" />
          <div className="relative rounded-[64px] border-2 border-amber-300/40 bg-gradient-to-br from-amber-500/15 via-yellow-500/5 to-amber-700/15 p-16 shadow-[0_0_120px_rgba(245,191,66,0.35)]">
            <Crown className="h-28 w-28 mx-auto text-amber-300 drop-shadow-[0_0_30px_rgba(245,191,66,0.7)]" />
            <div className="mt-6 text-5xl font-black tracking-wide text-amber-200/90 uppercase">Lifetime Access</div>
            <div className="mt-4 text-[10rem] leading-none font-black bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
              $9.99
            </div>
            <div className="mt-2 text-2xl text-white/70 italic">one payment · yours forever</div>
          </div>
        </div>

        {/* feature list */}
        <div className="grid grid-cols-1 gap-5 text-2xl text-white">
          {[
            { Icon: DollarSign, text: 'Unlimited celebrity searches' },
            { Icon: TrendingUp, text: 'Every premium feature unlocked' },
            { Icon: Sparkles, text: 'No ads. No subscriptions. Ever.' },
            { Icon: Crown, text: 'Future updates included free' },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-4 rounded-2xl border border-amber-300/20 bg-black/30 px-8 py-4 backdrop-blur-sm">
              <Icon className="h-7 w-7 text-amber-300 shrink-0" />
              <span className="font-semibold">{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function StoreScreenshots() {
  const [size, setSize] = useState<DeviceSize>('iphone-67');
  const dims = SIZES[size];
  // Display at 1/3 scale so we can see all frames on screen; capture the
  // rendered DOM at full resolution via DevTools.
  const scale = 0.33;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Store Screenshots</h1>
            <p className="text-zinc-400 text-sm">App Store & Google Play marketing frames with real in-app screenshots inside iPhone bezels.</p>
          </div>
          <div className="flex gap-2">
            {(Object.keys(SIZES) as DeviceSize[]).map((s) => (
              <Button key={s} variant={s === size ? 'default' : 'outline'} onClick={() => setSize(s)}>
                {SIZES[s].label}
              </Button>
            ))}
          </div>
        </header>

        <div className="text-zinc-500 text-xs">Capture target: {dims.w} × {dims.h}px. In DevTools, right-click the element with <code>data-screenshot-inner</code> → "Capture node screenshot".</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {screenshots.map((s) => (
            <div key={s.id} className="space-y-2">
              <div className="text-xs text-zinc-400 font-mono">{s.id}.png</div>
              <Card
                data-screenshot={s.id}
                className={`relative overflow-hidden rounded-[60px] border-0 bg-gradient-to-br ${s.accent}`}
                style={{
                  width: dims.w * scale,
                  height: dims.h * scale,
                }}
              >
                <div
                  className="absolute inset-0 origin-top-left"
                  style={{ transform: `scale(${scale})`, width: dims.w, height: dims.h }}
                >
                  <ScreenshotFrame s={s} w={dims.w} h={dims.h} />
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-zinc-800 text-sm text-zinc-400 space-y-2">
          <p className="font-semibold text-white">Export instructions</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open DevTools (Cmd/Ctrl+Shift+I) and right-click a screenshot card.</li>
            <li>Choose "Capture node screenshot" on the inner full-resolution layer (data-screenshot-inner).</li>
            <li>Repeat for each frame in both iPhone 6.7" and Android sizes.</li>
            <li>Upload to App Store Connect (Screenshots → 6.7") and Play Console (Phone screenshots).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function ScreenshotFrame({ s, w, h }: { s: Screenshot; w: number; h: number }) {
  return (
    <div
      data-screenshot-inner={s.id}
      className="relative w-full h-full overflow-hidden"
      style={{ width: w, height: h }}
    >
      {/* dark base */}
      <div className="absolute inset-0 bg-zinc-950" />
      {/* ambient glow */}
      <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-gradient-to-br ${s.accent} opacity-30 blur-3xl rounded-full`} />
      <div className={`absolute -bottom-40 right-0 w-[80%] h-[40%] bg-gradient-to-br ${s.accent} opacity-20 blur-3xl rounded-full`} />

      <div className="relative h-full flex flex-col p-24">
        {/* caption block — fixed height so the phone bezel below sits at the same y on every frame */}
        <div className="text-center flex flex-col justify-center" style={{ height: 480 }}>
          <h2 className="text-7xl font-black leading-tight text-white tracking-tight">
            {s.caption}
          </h2>
          <p className="text-3xl text-white/70 leading-snug mt-4">{s.subCaption}</p>
        </div>

        {/* body — phone bezel anchored to a fixed slot so size + position match across all frames */}
        <div className="flex-1 flex items-start justify-center">
          {s.screen ? (
            <PhoneBezel src={s.screen} alt={s.caption} width={760} />
          ) : (
            <div className="w-full max-w-[900px] flex items-center">{s.body}</div>
          )}
        </div>

        {/* footer brand mark — fixed height too */}
        <div className="flex items-center justify-center gap-4" style={{ height: 140 }}>
          <img src={appIcon} alt="" width={80} height={80} className="rounded-2xl" />
          <div className="text-3xl font-bold text-white">Wealth Perspective</div>
        </div>
      </div>
    </div>
  );
}
