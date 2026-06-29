import { useState, useRef, useEffect } from 'react';
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

type DeviceSize = 'iphone-67' | 'android' | 'ipad-13';

const SIZES: Record<DeviceSize, { w: number; h: number; label: string; previewScale: number }> = {
  'iphone-67': { w: 1284, h: 2778, label: 'iPhone 6.5"/6.7" (1284×2778)', previewScale: 0.33 },
  android: { w: 1080, h: 1920, label: 'Android Phone (1080×1920)', previewScale: 0.33 },
  'ipad-13': { w: 2048, h: 2732, label: 'iPad 13" (2048×2732)', previewScale: 0.22 },
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
  {
    id: '08-mogul-cash',
    caption: 'Stack the Deck. Trade Bigger.',
    subCaption: 'Add $20,000 in virtual paper cash',
    accent: 'from-emerald-500 via-amber-400 to-yellow-600',
    body: null,
  },
  {
    id: '09-review-reality-check',
    caption: '"Reality Check Hit Different"',
    subCaption: 'What members are saying',
    accent: 'from-amber-400 via-yellow-500 to-amber-600',
    body: (
      <TestimonialGraphic
        quote={'"I plugged in my salary expecting a chuckle. I got therapy. Brutal Mode should come with a hug."'}
        name="Marcus T."
        city="Austin, TX"
      />
    ),
  },
  {
    id: '10-review-ticker',
    caption: '"Bezos Earned My Rent in 4 Seconds"',
    subCaption: 'What members are saying',
    accent: 'from-rose-500 via-amber-400 to-yellow-600',
    body: (
      <TestimonialGraphic
        quote={'"Watching the earnings ticker on a billionaire is somehow more entertaining than Netflix. And weirdly educational."'}
        name="Priya S."
        city="Brooklyn, NY"
      />
    ),
  },
  {
    id: '11-review-paper-trading',
    caption: '"Paper Trading Made Me Brave"',
    subCaption: 'What members are saying',
    accent: 'from-emerald-500 via-amber-400 to-yellow-600',
    body: (
      <TestimonialGraphic
        quote={'"Mirrored a VIP portfolio with $100k of pretend money. Lost beautifully. Learned everything. Now I actually understand the market."'}
        name="Jordan K."
        city="Denver, CO"
      />
    ),
  },
];

function TestimonialGraphic({ quote, name, city }: { quote: string; name: string; city: string }) {
  return (
    <div className="w-full max-w-[1100px] mx-auto text-center">
      <div
        style={{
          borderRadius: 48,
          padding: '72px 68px 78px',
          background: '#100d05',
          border: '3px solid #fbbf24',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 110, lineHeight: '110px', letterSpacing: '0.15em', color: '#fbbf24', marginBottom: 40 }}>
          ★★★★★
        </div>
        <div style={{ fontSize: 46, lineHeight: '64px', fontWeight: 700, color: '#f8fafc', marginBottom: 48, fontStyle: 'italic' }}>
          {quote}
        </div>
        <div style={{ height: 2, background: 'rgba(251,191,36,0.35)', margin: '0 80px 36px' }} />
        <div style={{ fontSize: 36, lineHeight: '44px', fontWeight: 900, color: '#fde68a', marginBottom: 10 }}>
          {name}
        </div>
        <div style={{ fontSize: 28, lineHeight: '36px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
          {city}
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            borderRadius: 999,
            border: '1.5px solid rgba(251,191,36,0.5)',
            background: 'rgba(251,191,36,0.08)',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#fcd34d',
          }}
        >
          ✦ Verified Lifetime Member
        </div>
      </div>
    </div>
  );
}

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

function LifetimeCanvasPreview({ w, h }: { w: number; h: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let mounted = true;

    captureLifetimePng({ w, h }).then((blob) => {
      if (!mounted) return;
      objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
    });

    return () => {
      mounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [w, h]);

  return src ? <img src={src} alt="Lifetime Access screenshot" width={w} height={h} /> : <div className="h-full w-full bg-zinc-950" />;
}

async function captureLifetimePng(dims: { w: number; h: number }): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const drawRoundRect = (x: number, y: number, width: number, height: number, radius: number) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  const fit = dims.w / 1290;
  const pad = 96 * fit;
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, dims.w, dims.h);

  let glow = ctx.createRadialGradient(dims.w / 2, -60 * fit, 0, dims.w / 2, -60 * fit, 780 * fit);
  glow.addColorStop(0, 'rgba(251,191,36,0.34)');
  glow.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dims.w / 2, -60 * fit, 780 * fit, 0, Math.PI * 2);
  ctx.fill();

  glow = ctx.createRadialGradient(dims.w * 0.72, dims.h * 0.86, 0, dims.w * 0.72, dims.h * 0.86, 560 * fit);
  glow.addColorStop(0, 'rgba(251,191,36,0.22)');
  glow.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dims.w * 0.72, dims.h * 0.86, 560 * fit, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${72 * fit}px Arial, sans-serif`;
  ctx.fillText('Unlock Everything Forever', dims.w / 2, 375 * fit);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = `400 ${30 * fit}px Arial, sans-serif`;
  ctx.fillText('One payment. No subscriptions. Ever.', dims.w / 2, 426 * fit);

  const cardW = 900 * fit;
  const cardH = 420 * fit;
  const cardX = (dims.w - cardW) / 2;
  const cardY = 780 * fit;
  drawRoundRect(cardX, cardY, cardW, cardH, 48 * fit);
  ctx.fillStyle = '#100d05';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3 * fit;
  ctx.stroke();

  ctx.fillStyle = '#fde68a';
  ctx.font = `900 ${74 * fit}px Arial, sans-serif`;
  ctx.fillText('LIFETIME ACCESS', dims.w / 2, cardY + 128 * fit);
  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 ${196 * fit}px Arial, sans-serif`;
  ctx.fillText('$9.99', dims.w / 2, cardY + 315 * fit);
  ctx.fillStyle = '#f8fafc';
  ctx.font = `700 ${38 * fit}px Arial, sans-serif`;
  ctx.fillText('one payment · yours forever', dims.w / 2, cardY + 375 * fit);

  const benefits = [
    ['$', 'Unlimited celebrity\nsearches'],
    ['⚡', 'Real-time mogul earnings\nticker'],
    ['▥', 'Reality Check salary\nshowdowns'],
    ['◉', 'Mogul vs Mogul\ncomparisons'],
    ['↗', 'Paper-trade real stocks\nrisk-free'],
    ['♜', 'Mirror billionaire portfolios'],
    ['✺', 'Daily Wealth IQ quiz &\nstreaks'],
    ['▣', 'Mogul Academy premium\nlessons'],
    ['✦', 'No ads. No subscriptions.\nEver.'],
    ['∞', 'All future updates\nincluded'],
  ];
  const gap = 20 * fit;
  const boxW = (1100 * fit - gap) / 2;
  const boxH = 88 * fit;
  const gridX = (dims.w - 1100 * fit) / 2;
  const gridY = cardY + cardH + 50 * fit;
  benefits.forEach(([icon, label], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = gridX + col * (boxW + gap);
    const y = gridY + row * (boxH + 20 * fit);
    drawRoundRect(x, y, boxW, boxH, 12 * fit);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(252,211,77,0.28)';
    ctx.lineWidth = 1.5 * fit;
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fcd34d';
    ctx.font = `700 ${30 * fit}px Arial, sans-serif`;
    ctx.fillText(icon, x + 28 * fit, y + 55 * fit);
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${28 * fit}px Arial, sans-serif`;
    label.split('\n').forEach((line, lineIndex) => {
      ctx.fillText(line, x + 82 * fit, y + (38 + lineIndex * 32) * fit);
    });
  });

  try {
    const icon = await loadImage(appIcon);
    const iconSize = 80 * fit;
    const footerY = dims.h - 154 * fit;
    const totalW = 80 * fit + 24 * fit + 260 * fit;
    const iconX = (dims.w - totalW) / 2;
    drawRoundRect(iconX, footerY, iconSize, iconSize, 14 * fit);
    ctx.save();
    ctx.clip();
    ctx.drawImage(icon, iconX, footerY, iconSize, iconSize);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${30 * fit}px Arial, sans-serif`;
    ctx.fillText('Wealth Perspective', iconX + iconSize + 24 * fit, footerY + 51 * fit);
  } catch {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${30 * fit}px Arial, sans-serif`;
    ctx.fillText('Wealth Perspective', dims.w / 2, dims.h - 96 * fit);
  }

  return await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/png'));
}

function MogulCashCanvasPreview({ w, h }: { w: number; h: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let mounted = true;

    captureMogulCashPng({ w, h }).then((blob) => {
      if (!mounted) return;
      objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
    });

    return () => {
      mounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [w, h]);

  return src ? <img src={src} alt="Mogul Cash screenshot" width={w} height={h} /> : <div className="h-full w-full bg-zinc-950" />;
}

async function captureMogulCashPng(dims: { w: number; h: number }): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const drawRoundRect = (x: number, y: number, width: number, height: number, radius: number) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  const fit = dims.w / 1290;

  // Background
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, dims.w, dims.h);

  // Emerald glow top-left (money vibes)
  let glow = ctx.createRadialGradient(dims.w * 0.2, 80 * fit, 0, dims.w * 0.2, 80 * fit, 720 * fit);
  glow.addColorStop(0, 'rgba(16,185,129,0.30)');
  glow.addColorStop(1, 'rgba(16,185,129,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dims.w * 0.2, 80 * fit, 720 * fit, 0, Math.PI * 2);
  ctx.fill();

  // Gold glow bottom-right
  glow = ctx.createRadialGradient(dims.w * 0.78, dims.h * 0.82, 0, dims.w * 0.78, dims.h * 0.82, 640 * fit);
  glow.addColorStop(0, 'rgba(251,191,36,0.32)');
  glow.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dims.w * 0.78, dims.h * 0.82, 640 * fit, 0, Math.PI * 2);
  ctx.fill();

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${72 * fit}px Arial, sans-serif`;
  ctx.fillText('Stack the Deck.', dims.w / 2, 360 * fit);
  ctx.fillText('Trade Bigger.', dims.w / 2, 450 * fit);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = `400 ${30 * fit}px Arial, sans-serif`;
  ctx.fillText('Top up your Mogul Markets bankroll', dims.w / 2, 510 * fit);

  // Hero card
  const cardW = 980 * fit;
  const cardH = 720 * fit;
  const cardX = (dims.w - cardW) / 2;
  const cardY = 660 * fit;
  drawRoundRect(cardX, cardY, cardW, cardH, 48 * fit);
  ctx.fillStyle = '#100d05';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3 * fit;
  ctx.stroke();

  // "MOGUL CASH PACK" eyebrow
  ctx.fillStyle = '#34d399';
  ctx.font = `900 ${42 * fit}px Arial, sans-serif`;
  ctx.fillText('MOGUL CASH PACK', dims.w / 2, cardY + 110 * fit);

  // Big +$20,000
  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 ${188 * fit}px Arial, sans-serif`;
  ctx.fillText('+$20,000', dims.w / 2, cardY + 290 * fit);

  // subtitle
  ctx.fillStyle = '#fde68a';
  ctx.font = `700 ${36 * fit}px Arial, sans-serif`;
  ctx.fillText('virtual paper-trading cash', dims.w / 2, cardY + 350 * fit);

  // divider
  ctx.strokeStyle = 'rgba(251,191,36,0.35)';
  ctx.lineWidth = 2 * fit;
  ctx.beginPath();
  ctx.moveTo(cardX + 120 * fit, cardY + 430 * fit);
  ctx.lineTo(cardX + cardW - 120 * fit, cardY + 430 * fit);
  ctx.stroke();

  // Price
  ctx.fillStyle = '#ffffff';
  ctx.font = `400 ${32 * fit}px Arial, sans-serif`;
  ctx.fillText('just', dims.w / 2 - 170 * fit, cardY + 560 * fit);
  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 ${130 * fit}px Arial, sans-serif`;
  ctx.fillText('$4.99', dims.w / 2 + 30 * fit, cardY + 580 * fit);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = `500 ${28 * fit}px Arial, sans-serif`;
  ctx.fillText('one-time · in-app purchase', dims.w / 2, cardY + 650 * fit);

  // Benefit chips
  const benefits = [
    ['✦', 'Instantly added to your portfolio'],
    ['↗', 'Trade real-ticker stocks risk-free'],
    ['◉', 'Simulation only — no real money'],
  ];
  const chipW = 1000 * fit;
  const chipH = 96 * fit;
  const chipX = (dims.w - chipW) / 2;
  const chipsY = cardY + cardH + 60 * fit;
  benefits.forEach(([icon, label], i) => {
    const y = chipsY + i * (chipH + 18 * fit);
    drawRoundRect(chipX, y, chipW, chipH, 14 * fit);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(252,211,77,0.28)';
    ctx.lineWidth = 1.5 * fit;
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.font = `700 ${36 * fit}px Arial, sans-serif`;
    ctx.fillText(icon, chipX + 36 * fit, y + 62 * fit);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${32 * fit}px Arial, sans-serif`;
    ctx.fillText(label, chipX + 100 * fit, y + 60 * fit);
    ctx.textAlign = 'center';
  });

  // Footer brand
  try {
    const icon = await loadImage(appIcon);
    const iconSize = 80 * fit;
    const footerY = dims.h - 154 * fit;
    const totalW = 80 * fit + 24 * fit + 260 * fit;
    const iconX = (dims.w - totalW) / 2;
    drawRoundRect(iconX, footerY, iconSize, iconSize, 14 * fit);
    ctx.save();
    ctx.clip();
    ctx.drawImage(icon, iconX, footerY, iconSize, iconSize);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${30 * fit}px Arial, sans-serif`;
    ctx.fillText('Wealth Perspective', iconX + iconSize + 24 * fit, footerY + 51 * fit);
  } catch {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${30 * fit}px Arial, sans-serif`;
    ctx.fillText('Wealth Perspective', dims.w / 2, dims.h - 96 * fit);
  }

  return await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/png'));
}

export default function StoreScreenshots() {
  const [size, setSize] = useState<DeviceSize>('iphone-67');
  const [busy, setBusy] = useState<string | null>(null);
  const captureHostRef = useRef<HTMLDivElement>(null);
  const dims = SIZES[size];
  // Display at preview scale so we can see all frames on screen.
  const scale = dims.previewScale;

  /**
   * Render a single frame at full resolution off-screen, capture it with
   * html2canvas, and return the PNG blob. The capture node is mounted into
   * a fixed off-screen host so it does not affect layout.
   */
  async function capturePng(s: Screenshot): Promise<Blob> {
    if (s.id === '07-lifetime') {
      return captureLifetimePng(dims);
    }
    if (s.id === '08-mogul-cash') {
      return captureMogulCashPng(dims);
    }

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
  if (s.id === '07-lifetime') {
    return <LifetimeCanvasPreview w={w} h={h} />;
  }
  if (s.id === '08-mogul-cash') {
    return <MogulCashCanvasPreview w={w} h={h} />;
  }

  // Compute a phone-bezel width that fits the available vertical space.
  const captionH = 480;
  const footerH = 140;
  const availableH = h - captionH - footerH - 96; // 96 = padding top/bottom inside body
  const bezelWidth = Math.min(760, Math.round((availableH * 9) / 19.5));

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
            <PhoneBezel src={s.screen} alt={s.caption} width={bezelWidth} />
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
