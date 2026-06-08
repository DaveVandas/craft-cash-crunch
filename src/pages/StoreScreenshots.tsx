import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, DollarSign, Brain, BarChart3, Sparkles, Trophy } from 'lucide-react';
import appIcon from '@/assets/app-icon.png';

/**
 * Marketing screenshots designed for the App Store and Google Play store
 * listings. Each frame is rendered at iPhone 6.7" (1290×2796) and Android
 * (1080×1920) safe dimensions. Capture them at device-pixel-ratio 2 in
 * Chrome DevTools' Device Mode to export the final PNGs.
 *
 * Usage: open /store-screenshots, use the size toggle, then screenshot each
 * card. Drop the resulting PNGs into App Store Connect / Play Console.
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
  body: React.ReactNode;
}

const screenshots: Screenshot[] = [
  {
    id: '01-hero',
    caption: 'How Much Do The Ultra-Rich Earn?',
    subCaption: 'Real-time celebrity earnings, made jaw-droppingly tangible',
    accent: 'from-amber-400 via-yellow-500 to-amber-600',
    body: (
      <div className="flex flex-col items-center gap-8">
        <img src={appIcon} alt="" width={320} height={320} className="rounded-[80px] shadow-2xl shadow-amber-500/30" />
        <div className="text-center space-y-3">
          <div className="text-7xl font-black text-white">$10,452<span className="text-amber-400">/sec</span></div>
          <div className="text-3xl text-amber-200/80">Elon Musk's earning rate</div>
        </div>
      </div>
    ),
  },
  {
    id: '02-reality-check',
    caption: 'How Long To Earn YOUR Salary?',
    subCaption: 'Reality Check tells you in seconds',
    accent: 'from-rose-500 to-amber-500',
    body: (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200">
          <Brain className="h-7 w-7" /> <span className="text-2xl">Reality Check</span>
        </div>
        <div className="text-6xl font-black text-white leading-tight">Your annual salary</div>
        <div className="text-5xl font-black text-amber-300">= 4 minutes</div>
        <div className="text-3xl text-white/70">of Taylor Swift's income</div>
      </div>
    ),
  },
  {
    id: '03-mogul-markets',
    caption: 'Trade Like a Mogul. Risk Zero.',
    subCaption: 'Paper-trade real stocks with $100K virtual cash',
    accent: 'from-emerald-500 to-amber-500',
    body: (
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-3 text-emerald-200">
          <BarChart3 className="h-10 w-10" />
          <div className="text-3xl">Mogul Markets</div>
        </div>
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-4">
          <div className="flex justify-between items-end">
            <div className="text-white/70 text-2xl">Portfolio</div>
            <div className="text-emerald-300 text-xl">+18.4% today</div>
          </div>
          <div className="text-7xl font-black text-white">$127,438</div>
          <div className="flex gap-3 pt-2">
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-200">NVDA +12%</span>
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-200">TSLA +8%</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: '04-compare',
    caption: 'Compare Any Two Moguls',
    subCaption: 'Side-by-side wealth showdowns',
    accent: 'from-violet-500 to-amber-500',
    body: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-violet-200">
          <Trophy className="h-10 w-10" />
          <div className="text-3xl">Wealth Showdown</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Bezos', val: '$1.2M/hr' },
            { name: 'Oprah', val: '$285K/hr' },
          ].map((p) => (
            <div key={p.name} className="rounded-3xl bg-white/5 border border-white/10 p-6 text-center space-y-3">
              <div className="text-2xl text-white/70">{p.name}</div>
              <div className="text-4xl font-black text-amber-300">{p.val}</div>
            </div>
          ))}
        </div>
        <div className="text-center text-2xl text-white/80">Bezos earns Oprah's hourly salary every <span className="text-amber-300 font-bold">14 minutes</span></div>
      </div>
    ),
  },
  {
    id: '05-quiz',
    caption: 'Test Your Wealth IQ',
    subCaption: 'Daily quiz, streak multipliers, leaderboard',
    accent: 'from-sky-500 to-amber-500',
    body: (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-sky-200">
          <Sparkles className="h-10 w-10" />
          <div className="text-3xl">Wealth Quiz</div>
        </div>
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-5">
          <div className="text-3xl text-white leading-snug">Whose annual income could buy a private island?</div>
          {['Mr. Beast', 'Beyoncé', 'Both', 'Neither'].map((o, i) => (
            <div key={o} className={`rounded-2xl px-6 py-4 text-2xl ${i === 2 ? 'bg-emerald-500/30 border border-emerald-400 text-white' : 'bg-white/5 text-white/70'}`}>{o}</div>
          ))}
        </div>
        <div className="flex justify-center gap-4 text-2xl">
          <span className="text-amber-300">🔥 7-day streak</span>
          <span className="text-amber-300">3x multiplier</span>
        </div>
      </div>
    ),
  },
  {
    id: '06-lifetime',
    caption: 'Unlock Everything Forever',
    subCaption: 'One payment. No subscriptions. Ever.',
    accent: 'from-amber-400 to-yellow-600',
    body: (
      <div className="space-y-6 text-center">
        <Crown className="h-24 w-24 mx-auto text-amber-300" />
        <div className="text-6xl font-black text-white">Lifetime Access</div>
        <div className="text-8xl font-black bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">$9.99</div>
        <div className="space-y-3 text-2xl text-white/80 pt-4">
          <div className="flex items-center justify-center gap-2"><DollarSign className="h-6 w-6 text-amber-300" /> Unlimited celebrity searches</div>
          <div className="flex items-center justify-center gap-2"><TrendingUp className="h-6 w-6 text-amber-300" /> All premium features</div>
          <div className="flex items-center justify-center gap-2"><Sparkles className="h-6 w-6 text-amber-300" /> No ads, ever</div>
        </div>
      </div>
    ),
  },
];

export default function StoreScreenshots() {
  const [size, setSize] = useState<DeviceSize>('iphone-67');
  const dims = SIZES[size];
  // Display at 1/3 scale so we can see all six on screen; capture the rendered
  // DOM at full resolution via DevTools.
  const scale = 0.33;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Store Screenshots</h1>
            <p className="text-zinc-400 text-sm">Six frames designed for App Store & Google Play submissions. Capture each at full size using DevTools.</p>
          </div>
          <div className="flex gap-2">
            {(Object.keys(SIZES) as DeviceSize[]).map((s) => (
              <Button key={s} variant={s === size ? 'default' : 'outline'} onClick={() => setSize(s)}>
                {SIZES[s].label}
              </Button>
            ))}
          </div>
        </header>

        <div className="text-zinc-500 text-xs">Capture target: {dims.w} × {dims.h}px. Right-click any frame → Inspect → screenshot the matching node at DPR 1.</div>

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
            <li>Choose "Capture node screenshot" on the inner full-resolution layer (data-screenshot attribute).</li>
            <li>Repeat for each of the 6 frames in both iPhone 6.7" and Android sizes.</li>
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
        {/* caption block */}
        <div className="space-y-4 text-center">
          <h2 className="text-7xl font-black leading-tight text-white tracking-tight">
            {s.caption}
          </h2>
          <p className="text-3xl text-white/70 leading-snug">{s.subCaption}</p>
        </div>

        {/* body */}
        <div className="flex-1 flex items-center justify-center mt-12">
          <div className="w-full max-w-[900px]">{s.body}</div>
        </div>

        {/* footer brand mark */}
        <div className="flex items-center justify-center gap-4 pt-12">
          <img src={appIcon} alt="" width={80} height={80} className="rounded-2xl" />
          <div className="text-3xl font-bold text-white">Wealth Perspective</div>
        </div>
      </div>
    </div>
  );
}
