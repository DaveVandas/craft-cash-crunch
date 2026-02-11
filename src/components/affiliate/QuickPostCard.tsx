import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Copy, Check, ExternalLink, Rocket, Lightbulb, Info, ImageIcon, ChevronDown, ChevronUp, Download, MessageSquare, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';
import { supabase } from '@/integrations/supabase/client';

interface QuickPostCardProps {
  affiliateCode: string;
  displayName: string;
}

interface ReadyPost {
  id: string;
  caption: string;
  hashtags: string;
  ogPage: string;
  redirectPath: string;
  label: string;
  emoji: string;
}

function getPosts(affiliateCode: string): Record<string, ReadyPost[]> {
  const refPath = `/ref/${affiliateCode}`;

  return {
    twitter: [
      {
        id: 'tw-1',
        caption: `🤯 Just found out Elon Musk makes my yearly salary in 0.3 seconds…\n\nThis app is brutal but I can't stop using it 💀`,
        hashtags: '#Wealth #Billionaire #Mindset',
        ogPage: 'home',
        redirectPath: refPath,
        label: 'Viral Hook',
        emoji: '🔥',
      },
      {
        id: 'tw-2',
        caption: `This "Reality Check" calculator shows how fast celebs earn YOUR salary.\n\nRonaldo makes my monthly salary in 4.2 seconds 😭`,
        hashtags: '#RealityCheck #Salary #Celebrity',
        ogPage: 'calculator',
        redirectPath: `/calculator?ref=${affiliateCode}`,
        label: 'Reality Check',
        emoji: '📊',
      },
      {
        id: 'tw-3',
        caption: `I scored 8/10 on this celebrity earnings quiz and now I'm questioning everything 🤯\n\nCan you beat my score?`,
        hashtags: '#Quiz #Celebrity #WealthQuiz',
        ogPage: 'quiz',
        redirectPath: `/quiz?ref=${affiliateCode}`,
        label: 'Quiz Challenge',
        emoji: '🧠',
      },
      {
        id: 'tw-4',
        caption: `Making money just by sharing links? Yes please. 💰\n\nThis program pays $1-2 for every signup. No complicated funnels.`,
        hashtags: '#AffiliateMarketing #PassiveIncome #SideHustle',
        ogPage: 'landing-d',
        redirectPath: `/landing/d?ref=${affiliateCode}`,
        label: 'Recruit Affiliates',
        emoji: '💰',
      },
    ],
    tiktok: [
      {
        id: 'tt-1',
        caption: `POV: You just learned Elon Musk makes your yearly salary in 0.3 seconds…\n\nI'm not okay. 😭`,
        hashtags: '#fyp #billionaire #wealth #mindblown #viral',
        ogPage: 'home',
        redirectPath: refPath,
        label: 'Viral Hook',
        emoji: '🔥',
      },
      {
        id: 'tt-2',
        caption: `This app just told me Jeff Bezos makes my rent in 0.3 seconds…\n\nAnyone else need a new career path? 😅👑`,
        hashtags: '#fyp #moneytok #celebrity #wealth #relatable',
        ogPage: 'calculator',
        redirectPath: `/calculator?ref=${affiliateCode}`,
        label: 'Reality Check',
        emoji: '📊',
      },
      {
        id: 'tt-3',
        caption: `I got 8/10 on this celebrity earnings quiz and my brain is broken 🤯\n\nDrop your score in the comments 👇`,
        hashtags: '#fyp #quiz #celebrity #money #viral',
        ogPage: 'quiz',
        redirectPath: `/quiz?ref=${affiliateCode}`,
        label: 'Quiz Challenge',
        emoji: '🧠',
      },
      {
        id: 'tt-4',
        caption: `One viral TikTok = $39,000? 💰\n\nThis affiliate program pays $1-2 for EVERY signup. Do the math… 🤯`,
        hashtags: '#fyp #affiliate #passiveincome #sidehustle #moneytok',
        ogPage: 'landing-d',
        redirectPath: `/landing/d?ref=${affiliateCode}`,
        label: 'Recruit Affiliates',
        emoji: '💰',
      },
    ],
    instagram: [
      {
        id: 'ig-1',
        caption: `Ever wonder how the rich REALLY think? 🧠💰\n\nThis app shows you how fast billionaires make YOUR yearly salary…\n\nElon makes it in 0.3 seconds. I'm still processing this 😭\n\nLink in bio ⬆️`,
        hashtags: '#wealthmindset #billionaire #motivation #rich #mindblown',
        ogPage: 'home',
        redirectPath: refPath,
        label: 'Viral Hook',
        emoji: '🔥',
      },
      {
        id: 'ig-2',
        caption: `Reality Check Time! ⏰💰\n\nI compared my salary to Taylor Swift… She earns my YEARLY salary in 47 seconds.\n\nBrb, rethinking my life choices 😅\n\nLink in bio ⬆️`,
        hashtags: '#realitycheck #salary #celebrity #motivation #wealth',
        ogPage: 'calculator',
        redirectPath: `/calculator?ref=${affiliateCode}`,
        label: 'Reality Check',
        emoji: '📊',
      },
      {
        id: 'ig-3',
        caption: `Want to get PAID to share cool stuff? 💸👑\n\nI joined this affiliate program that pays for every signup through your link.\n\nLiterally the easiest side income!\n\nLink in bio ⬆️`,
        hashtags: '#affiliate #passiveincome #sidehustle #makemoney #entrepreneur',
        ogPage: 'landing-d',
        redirectPath: `/landing/d?ref=${affiliateCode}`,
        label: 'Recruit Affiliates',
        emoji: '💰',
      },
    ],
    facebook: [
      {
        id: 'fb-1',
        caption: `Just found this eye-opening app that shows how fast celebrities make money compared to the rest of us.\n\nElon Musk earns the average salary in less than a second! Really puts things in perspective.`,
        hashtags: '',
        ogPage: 'home',
        redirectPath: refPath,
        label: 'General Share',
        emoji: '🌟',
      },
      {
        id: 'fb-2',
        caption: `Just tried this "Reality Check" calculator that compares your salary to celebrity earnings…\n\nLet's just say it was humbling! 😅 But also pretty motivating.`,
        hashtags: '',
        ogPage: 'calculator',
        redirectPath: `/calculator?ref=${affiliateCode}`,
        label: 'Reality Check',
        emoji: '📊',
      },
    ],
    sms: [
      {
        id: 'sms-1',
        caption: `Check this out — this app shows how fast Elon Musk makes YOUR salary. It's insane 🤯`,
        hashtags: '',
        ogPage: 'home',
        redirectPath: refPath,
        label: 'Quick Text',
        emoji: '💬',
      },
      {
        id: 'sms-2',
        caption: `You gotta try this — it compares your salary to celebrities in real time. Humbling 😅`,
        hashtags: '',
        ogPage: 'calculator',
        redirectPath: `/calculator?ref=${affiliateCode}`,
        label: 'Reality Check',
        emoji: '📊',
      },
      {
        id: 'sms-3',
        caption: `Can you beat my score on this celebrity earnings quiz? I got 8/10 🧠`,
        hashtags: '',
        ogPage: 'quiz',
        redirectPath: `/quiz?ref=${affiliateCode}`,
        label: 'Quiz Challenge',
        emoji: '🧠',
      },
    ],
  };
}

/** Feature label map for AI background images */
const IMAGE_LABELS: Record<string, string> = {
  'home.png': '🏠 Home',
  'quiz.png': '🧠 Quiz',
  'calculator.png': '🧮 Calculator',
  'mogul-markets.png': '📈 Markets',
  'trades.png': '🔧 Trades',
  'side-hustle.png': '🚀 Side Hustles',
  'compare.png': '⚔️ Compare',
  'affiliate.png': '📢 Affiliate',
  'wealth-wisdom.png': '📖 Wisdom',
  'wealth-facts.png': '🤯 Facts',
  'mogul-academy.png': '🎓 Academy',
  'debt-destroyer.png': '💥 Debt',
  'celebrity-portfolios.png': '💼 Portfolios',
};

function buildFullText(post: ReadyPost, shareUrl: string): string {
  const parts = [post.caption];
  if (post.hashtags) parts.push(post.hashtags);
  parts.push(`🔗 ${shareUrl}`);
  return parts.join('\n\n');
}

function buildShareUrl(post: ReadyPost): string {
  return getShareUrlWithRedirect(post.ogPage as any, post.redirectPath);
}

function openShareIntent(platform: string, text: string, url: string) {
  let intentUrl = '';
  switch (platform) {
    case 'twitter':
      intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'facebook':
      intentUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      break;
    case 'sms': {
      const body = `${text}\n\n${url}`;
      // Use sms: URI — works on iOS and Android
      intentUrl = `sms:?&body=${encodeURIComponent(body)}`;
      break;
    }
    default:
      return false;
  }
  window.open(intentUrl, '_blank', 'noopener,noreferrer');
  return true;
}

/** Download an image by fetching it as a blob */
async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    return true;
  } catch {
    return false;
  }
}

interface CompositeOptions {
  fontSizeMultiplier: number; // 0.5 to 2.0 (1.0 = default)
  verticalPosition: number;  // 0 to 100 (50 = center)
}

/** Render composite image to a canvas and return it */
async function renderComposite(
  imageUrl: string,
  caption: string,
  hashtags: string,
  shareUrl: string,
  options: CompositeOptions = { fontSizeMultiplier: 1.0, verticalPosition: 50 },
): Promise<HTMLCanvasElement | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    const W = Math.max(img.naturalWidth, 1200);
    const H = Math.max(img.naturalHeight, 630);
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Draw background image scaled to fill
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    ctx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, W, H);

    // Text sizing
    const baseFontSize = Math.round(W * 0.038);
    const fontSize = Math.round(baseFontSize * options.fontSizeMultiplier);
    const lineHeight = fontSize * 1.45;
    const padding = W * 0.08;
    const maxTextWidth = W - padding * 2;

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textBaseline = 'top';

    // Word-wrap
    const lines: string[] = [];
    const paragraphs = caption.split('\n');
    for (const para of paragraphs) {
      if (para.trim() === '') { lines.push(''); continue; }
      const words = para.split(' ');
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxTextWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    const hashtagFontSize = Math.round(fontSize * 0.7);
    const urlFontSize = Math.round(fontSize * 0.6);
    const captionHeight = lines.length * lineHeight;
    const hashtagHeight = hashtags ? hashtagFontSize * 1.5 + 10 : 0;
    const urlHeight = urlFontSize * 1.5 + 20;
    const totalHeight = captionHeight + hashtagHeight + urlHeight;

    // Vertical position: 0=top, 50=center, 100=bottom
    const availableSpace = H - totalHeight - padding * 2;
    let y = padding + (availableSpace * options.verticalPosition / 100);

    // Draw caption
    for (const line of lines) {
      if (line === '') { y += lineHeight * 0.5; continue; }
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(line, padding + 2, y + 2, maxTextWidth);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, padding, y, maxTextWidth);
      y += lineHeight;
    }

    // Hashtags
    if (hashtags) {
      y += 10;
      ctx.font = `${hashtagFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.fillText(hashtags, padding, y, maxTextWidth);
      y += hashtagFontSize * 1.5;
    }

    // URL
    y += 20;
    ctx.font = `${urlFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`🔗 ${shareUrl}`, padding, y, maxTextWidth);

    return canvas;
  } catch {
    return null;
  }
}

/** Download a canvas as PNG */
async function downloadCanvas(canvas: HTMLCanvasElement, filename: string): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    if (!blob) return false;
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    return true;
  } catch {
    return false;
  }
}

/** Composite preview modal with customization controls */
function CompositePreviewModal({
  open,
  onOpenChange,
  imageUrl,
  caption,
  hashtags,
  shareUrl,
  filename,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  caption: string;
  hashtags: string;
  shareUrl: string;
  filename: string;
}) {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [saving, setSaving] = useState(false);

  const updatePreview = useCallback(async () => {
    if (!open) return;
    const canvas = await renderComposite(imageUrl, caption, hashtags, shareUrl, {
      fontSizeMultiplier,
      verticalPosition,
    });
    if (canvas && previewRef.current) {
      const previewCtx = previewRef.current.getContext('2d')!;
      previewRef.current.width = canvas.width;
      previewRef.current.height = canvas.height;
      previewCtx.drawImage(canvas, 0, 0);
    }
  }, [open, imageUrl, caption, hashtags, shareUrl, fontSizeMultiplier, verticalPosition]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleSave = async () => {
    setSaving(true);
    const canvas = await renderComposite(imageUrl, caption, hashtags, shareUrl, {
      fontSizeMultiplier,
      verticalPosition,
    });
    if (canvas) {
      const success = await downloadCanvas(canvas, filename);
      if (success) {
        toast.success('🎨 Image with caption saved! Upload it directly to any platform.');
        onOpenChange(false);
      } else {
        toast.error('Failed to save image.');
      }
    } else {
      toast.error('Failed to generate image.');
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Customize Image + Caption
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Live preview */}
          <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/30">
            <canvas
              ref={previewRef}
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Font Size</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {Math.round(fontSizeMultiplier * 100)}%
                </span>
              </div>
              <Slider
                value={[fontSizeMultiplier]}
                onValueChange={([v]) => setFontSizeMultiplier(v)}
                min={0.5}
                max={2.0}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Small</span>
                <span>Default</span>
                <span>Large</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Position</Label>
                <span className="text-xs text-muted-foreground font-mono">
                  {verticalPosition <= 25 ? 'Top' : verticalPosition >= 75 ? 'Bottom' : 'Center'}
                </span>
              </div>
              <Slider
                value={[verticalPosition]}
                onValueChange={([v]) => setVerticalPosition(v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Top</span>
                <span>Center</span>
                <span>Bottom</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 gap-2" onClick={handleSave} disabled={saving}>
              <Download className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Image'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Image picker component */
function ImagePicker({
  images,
  selectedImage,
  onSelect,
}: {
  images: { name: string; url: string }[];
  selectedImage: string | null;
  onSelect: (url: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {selectedImage ? '✅ Image selected' : 'Attach an AI image (optional)'}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {expanded && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
          {/* No image option */}
          <button
            onClick={() => { onSelect(null); setExpanded(false); }}
            className={`relative rounded-lg overflow-hidden border-2 p-3 text-center text-xs transition-all ${
              !selectedImage ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/30'
            }`}
          >
            <span className="text-muted-foreground">No image</span>
          </button>
          {images.map((img) => (
            <button
              key={img.name}
              onClick={() => { onSelect(img.url); setExpanded(false); }}
              className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-video ${
                selectedImage === img.url ? 'border-primary ring-2 ring-primary/30' : 'border-border/50 hover:border-primary/30'
              }`}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-[10px] px-1 py-0.5 truncate">
                {IMAGE_LABELS[img.name] || img.name.replace('.png', '')}
              </div>
              {selectedImage === img.url && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuickPostCard({ affiliateCode, displayName }: QuickPostCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Record<string, string | null>>({});
  const [aiImages, setAiImages] = useState<{ name: string; url: string }[]>([]);
  const [posting, setPosting] = useState<string | null>(null);
  const [compositeModal, setCompositeModal] = useState<{
    open: boolean;
    imageUrl: string;
    caption: string;
    hashtags: string;
    shareUrl: string;
    filename: string;
  } | null>(null);
  const posts = getPosts(affiliateCode);
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  // Fetch AI background images from storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await supabase.storage.from('og-images').list('', {
          sortBy: { column: 'name', order: 'asc' },
        });
        setAiImages(
          (data || [])
            .filter((f) => f.name.endsWith('.png'))
            .map((f) => ({
              name: f.name,
              url: `${SUPABASE_URL}/storage/v1/object/public/og-images/${f.name}`,
            }))
        );
      } catch {
        // silently fail
      }
    };
    fetchImages();
  }, [SUPABASE_URL]);

  const handlePost = async (post: ReadyPost, platform: string) => {
    const shareUrl = buildShareUrl(post);
    const fullText = buildFullText(post, shareUrl);
    const selectedImage = selectedImages[post.id] || null;

    setPosting(post.id);

    try {
      // If an image is selected, download it first
      if (selectedImage) {
        const imgName = selectedImage.split('/').pop() || 'wealth-perspective.png';
        const downloaded = await downloadImage(selectedImage, `wealth-perspective-${imgName}`);
        if (downloaded) {
          toast.success('📸 Image saved! Attach it to your post.', { duration: 4000 });
        }
      }

      // For Twitter, Facebook & SMS, open share intent
      if (platform === 'twitter' || platform === 'facebook' || platform === 'sms') {
        const captionOnly = post.caption + (post.hashtags ? `\n\n${post.hashtags}` : '');
        openShareIntent(platform, captionOnly, shareUrl);
        if (platform === 'sms') {
          toast.success('Opening your messaging app! 💬');
        } else if (selectedImage) {
          toast.info('Attach the downloaded image to your post for maximum engagement! 🔥', { duration: 5000 });
        }
      } else {
        // For TikTok & Instagram, copy to clipboard
        await navigator.clipboard.writeText(fullText);
        setCopiedId(post.id);
        const platformName = platform === 'tiktok' ? 'TikTok' : 'Instagram';
        toast.success(
          selectedImage
            ? `Copied! Open ${platformName}, attach the saved image, and paste your caption 📱`
            : `Copied! Open ${platformName} and paste your caption 📱`,
          { duration: 4000 }
        );
        setTimeout(() => setCopiedId(null), 3000);
      }
    } catch {
      // Fallback: just copy text
      try {
        await navigator.clipboard.writeText(fullText);
        setCopiedId(post.id);
        toast.success('Caption + link copied! 📋');
        setTimeout(() => setCopiedId(null), 3000);
      } catch {
        toast.error('Failed to copy');
      }
    } finally {
      setPosting(null);
    }
  };

  const handleCopyOnly = (post: ReadyPost) => {
    const shareUrl = buildShareUrl(post);
    const fullText = buildFullText(post, shareUrl);
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedId(post.id);
      toast.success('Caption + link copied! 📋');
      setTimeout(() => setCopiedId(null), 3000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const platformConfig = [
    { key: 'twitter', icon: '𝕏', label: 'Twitter / X', actionLabel: 'Post on 𝕏', hasIntent: true },
    { key: 'tiktok', icon: '📱', label: 'TikTok', actionLabel: 'Copy for TikTok', hasIntent: false },
    { key: 'instagram', icon: '📸', label: 'Instagram', actionLabel: 'Copy for Instagram', hasIntent: false },
    { key: 'facebook', icon: '📘', label: 'Facebook', actionLabel: 'Post on Facebook', hasIntent: true },
    { key: 'sms', icon: '💬', label: 'SMS', actionLabel: 'Send via Text', hasIntent: true },
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Quick Post
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tap a button, post it, get paid. It's that simple. 👑
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* How to Post - Simple 3 Steps */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">How to Post (3 Steps)</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-2xl">1️⃣</div>
              <p className="text-xs font-medium">Pick a post & optionally attach an image</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">2️⃣</div>
              <p className="text-xs font-medium">Tap the button to post or copy</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">3️⃣</div>
              <p className="text-xs font-medium">Done! Your link is included</p>
            </div>
          </div>
        </div>

        {/* Platform Note */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong>Twitter & Facebook</strong> open a share window automatically. 
            <strong> TikTok & Instagram</strong> copy the caption — paste it when creating your post. 
            {aiImages.length > 0 && (
              <> Tap <strong>"Attach an AI image"</strong> to include a branded background!</>
            )}
          </p>
        </div>

        {/* Platform Tabs */}
        <Tabs defaultValue="twitter" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            {platformConfig.map((p) => (
              <TabsTrigger key={p.key} value={p.key} className="gap-1.5">
                <span className="text-base">{p.icon}</span>
                <span className="hidden sm:inline text-xs">{p.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {platformConfig.map((platform) => (
            <TabsContent key={platform.key} value={platform.key} className="space-y-3">
              {(posts[platform.key] || []).map((post) => {
                const isCopied = copiedId === post.id;
                const isPosting = posting === post.id;
                const selectedImage = selectedImages[post.id] || null;
                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    {/* Post label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span>{post.emoji}</span>
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">{post.label}</Badge>
                      {selectedImage && (
                        <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30 gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Image attached
                        </Badge>
                      )}
                    </div>

                    {/* Caption preview */}
                    <p className="text-sm whitespace-pre-line mb-3 text-foreground/90">{post.caption}</p>
                    
                    {post.hashtags && (
                      <p className="text-xs text-primary/70 mb-3">{post.hashtags}</p>
                    )}

                    {/* Selected image preview */}
                    {selectedImage && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-border/50 max-w-xs">
                        <img src={selectedImage} alt="Selected background" className="w-full h-auto" />
                      </div>
                    )}

                    {/* Image picker */}
                    {aiImages.length > 0 && (
                      <div className="mb-3">
                        <ImagePicker
                          images={aiImages}
                          selectedImage={selectedImage}
                          onSelect={(url) =>
                            setSelectedImages((prev) => ({ ...prev, [post.id]: url }))
                          }
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 gap-2"
                          onClick={() => handlePost(post, platform.key)}
                          disabled={isPosting}
                        >
                          {isPosting ? (
                            <>Preparing...</>
                          ) : isCopied ? (
                            <>
                              <Check className="w-4 h-4" />
                              {platform.hasIntent ? 'Posted!' : 'Copied!'}
                            </>
                          ) : (
                            <>
                              {platform.hasIntent ? (
                                <ExternalLink className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              {selectedImage
                                ? `${platform.hasIntent ? '📸 Post' : '📸 Copy'} with Image`
                                : platform.actionLabel}
                            </>
                          )}
                        </Button>
                        {platform.hasIntent && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopyOnly(post)}
                            title="Copy caption + link to clipboard"
                          >
                            {copiedId === post.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      {/* Save Image + Caption composite button */}
                      {selectedImage && (
                        <Button
                          variant="secondary"
                          className="w-full gap-2"
                          onClick={() => {
                            const shareUrl = buildShareUrl(post);
                            setCompositeModal({
                              open: true,
                              imageUrl: selectedImage,
                              caption: post.caption,
                              hashtags: post.hashtags,
                              shareUrl,
                              filename: `wealth-perspective-${post.id}.png`,
                            });
                          }}
                        >
                          <Settings2 className="w-4 h-4" />
                          Save Image + Caption
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Tips */}
        <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong className="text-foreground">Pro tip:</strong> Posts with images get 2-3x more engagement! Attach an AI background and watch your referrals grow 🚀
          </p>
        </div>
      </CardContent>

      {/* Composite preview modal */}
      {compositeModal && (
        <CompositePreviewModal
          open={compositeModal.open}
          onOpenChange={(open) => {
            if (!open) setCompositeModal(null);
          }}
          imageUrl={compositeModal.imageUrl}
          caption={compositeModal.caption}
          hashtags={compositeModal.hashtags}
          shareUrl={compositeModal.shareUrl}
          filename={compositeModal.filename}
        />
      )}
    </Card>
  );
}
