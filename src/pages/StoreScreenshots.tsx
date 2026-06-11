import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { Download, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Sparkles, Trophy, Brain, BarChart3, Users, Infinity as InfinityIcon, Zap, BookOpen } from 'lucide-react';

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
    body: <LifetimeOfferGraphic />,

  },
];

function LifetimeOfferGraphic() {
  const benefits = [
    { Icon: DollarSign, text: 'Unlimited celebrity searches' },
    { Icon: Zap, text: 'Real-time mogul earnings ticker' },
    { Icon: BarChart3, text: 'Reality Check salary showdowns' },
    { Icon: Users, text: 'Mogul vs Mogul comparisons' },
    { Icon: TrendingUp, text: 'Paper-trade real stocks risk-free' },
    { Icon: Trophy, text: 'Mirror billionaire portfolios' },
    { Icon: Brain, text: 'Daily Wealth IQ quiz & streaks' },
    { Icon: BookOpen, text: 'Mogul Academy premium lessons' },
    { Icon: Sparkles, text: 'No ads. No subscriptions. Ever.' },
    { Icon: InfinityIcon, text: 'All future updates included' },
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto text-center">
      <div
        style={{
          borderRadius: 48,
          padding: '62px 80px 68px',
          background: '#100d05',
          border: '3px solid #fbbf24',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 74, lineHeight: '90px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fde68a', marginBottom: 34 }}>
          Lifetime Access
        </div>
        <div style={{ fontSize: 196, lineHeight: '196px', fontWeight: 900, color: '#fbbf24', marginBottom: 30 }}>
          $9.99
        </div>
        <div style={{ fontSize: 38, lineHeight: '48px', fontWeight: 700, color: '#f8fafc' }}>
          one payment · yours forever
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 text-[2rem] text-white w-full mt-12">
        {benefits.map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-5 rounded-2xl border border-amber-300/25 bg-black/50 px-7 py-5 text-left">
            <Icon className="h-10 w-10 text-amber-300 shrink-0" />
            <span className="font-bold leading-tight">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StoreScreenshots() {
  const [size, setSize] = useState<DeviceSize>('iphone-67');
  const [busy, setBusy] = useState<string | null>(null);
  const captureHostRef = useRef<HTMLDivElement>(null);
  const dims = SIZES[size];
  // Display at 1/3 scale so we can see all frames on screen.
  const scale = 0.33;

  /**
   * Render a single frame at full resolution off-screen, capture it with
   * html2canvas, and return the PNG blob. The capture node is mounted into
   * a fixed off-screen host so it does not affect layout.
   */
  async function capturePng(s: Screenshot): Promise<Blob> {
    const host = captureHostRef.current!;
    const node = document.createElement('div');
    node.style.width = `${dims.w}px`;
    node.style.height = `${dims.h}px`;
    host.appendChild(node);

    // Render React tree synchronously via createRoot
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(node);
    root.render(
      <div className={`relative overflow-hidden bg-gradient-to-br ${s.accent}`} style={{ width: dims.w, height: dims.h }}>
        <ScreenshotFrame s={s} w={dims.w} h={dims.h} />
      </div>
    );

    // Wait a tick for images/fonts to settle
    await new Promise((r) => setTimeout(r, 400));
    await (document as any).fonts?.ready;

    const canvas = await html2canvas(node, {
      scale: 1,
      useCORS: true,
      backgroundColor: null,
      width: dims.w,
      height: dims.h,
      windowWidth: dims.w,
      windowHeight: dims.h,
    });

    root.unmount();
    host.removeChild(node);

    return await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
  }

  function fileName(s: Screenshot) {
    return `wealth-perspective_${size}_${s.id}.png`;
  }

  async function downloadOne(s: Screenshot) {
    try {
      setBusy(s.id);
      const blob = await capturePng(s);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName(s);
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  }

  async function downloadAll() {
    try {
      setBusy('__all__');
      const zip = new JSZip();
      for (const s of screenshots) {
        setBusy(`zip:${s.id}`);
        const blob = await capturePng(s);
        zip.file(fileName(s), blob);
      }
      const out = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wealth-perspective_${size}_screenshots.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  }

  const anyBusy = busy !== null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Store Screenshots</h1>
            <p className="text-zinc-400 text-sm">App Store & Google Play marketing frames. Download as full-resolution PNG (Apple's preferred format).</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(SIZES) as DeviceSize[]).map((s) => (
              <Button key={s} variant={s === size ? 'default' : 'outline'} onClick={() => setSize(s)} disabled={anyBusy}>
                {SIZES[s].label}
              </Button>
            ))}
            <Button onClick={downloadAll} disabled={anyBusy} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              {busy?.startsWith('zip') || busy === '__all__' ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Zipping…</>
              ) : (
                <><Download className="h-4 w-4 mr-2" /> Download all (.zip)</>
              )}
            </Button>
          </div>
        </header>

        <div className="text-zinc-500 text-xs">Capture target: {dims.w} × {dims.h}px · PNG, lossless. Files are named like <code>wealth-perspective_{size}_01-earnings.png</code> so they sort correctly in App Store Connect.</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {screenshots.map((s) => (
            <div key={s.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-zinc-400 font-mono">{s.id}.png</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadOne(s)}
                  disabled={anyBusy}
                  className="h-7 px-3 text-xs"
                >
                  {busy === s.id ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Rendering…</>
                  ) : (
                    <><Download className="h-3 w-3 mr-1" /> PNG</>
                  )}
                </Button>
              </div>
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
          <p className="font-semibold text-white">How downloads work</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click <strong>PNG</strong> on any card to download just that frame at full {dims.w}×{dims.h} resolution.</li>
            <li>Click <strong>Download all (.zip)</strong> to grab every frame for the selected device size in one bundle.</li>
            <li>Format is PNG (lossless) — Apple and Google both accept PNG or JPEG, but PNG preserves the gold gradients and crisp text.</li>
            <li>Switch the device toggle to re-export at Android (1080×1920) resolution.</li>
          </ul>
        </div>
      </div>

      {/* off-screen host where full-resolution captures are rendered */}
      <div
        ref={captureHostRef}
        aria-hidden
        style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}
      />
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
            <div className="w-full h-full flex items-center justify-center">{s.body}</div>
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
