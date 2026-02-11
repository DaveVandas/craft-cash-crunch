import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Image as ImageIcon,
  RefreshCw,
  Download,
  ExternalLink,
  Sparkles,
  Copy,
  Wand2,
  Megaphone,
  Palette,
  FileImage,
  Share2,
  Smartphone,
  Monitor,
  LayoutTemplate,
} from 'lucide-react';

interface OGImage {
  name: string;
  size: number;
  created_at: string;
  url: string;
}

const FEATURE_LABELS: Record<string, { label: string; emoji: string }> = {
  'home.png': { label: 'Home / Main', emoji: '🏠' },
  'quiz.png': { label: 'Wealth Quiz', emoji: '🧠' },
  'calculator.png': { label: 'Reality Check', emoji: '🧮' },
  'mogul-markets.png': { label: 'Mogul Markets', emoji: '📈' },
  'trades.png': { label: 'Trade Careers', emoji: '🔧' },
  'side-hustle.png': { label: 'Side Hustles', emoji: '🚀' },
  'compare.png': { label: 'Who Earns More?', emoji: '⚔️' },
  'affiliate.png': { label: 'Affiliate Program', emoji: '📢' },
  'wealth-wisdom.png': { label: 'Wealth Wisdom', emoji: '📖' },
  'wealth-facts.png': { label: 'Wealth Facts', emoji: '🤯' },
  'mogul-academy.png': { label: 'Mogul Academy', emoji: '🎓' },
  'debt-destroyer.png': { label: 'Debt Destroyer', emoji: '💥' },
  'celebrity-portfolios.png': { label: 'VIP Portfolios', emoji: '💼' },
};

const MARKETING_TEMPLATES = [
  {
    title: 'Screenshot-to-Story Templates',
    description: 'Take a screenshot of any celebrity profile, wrap it in a branded story frame with your logo + CTA. Perfect for Instagram/TikTok stories.',
    icon: Smartphone,
    tips: [
      'Screenshot a dramatic stat (e.g. "Elon makes your salary in 8 seconds")',
      'Add a swipe-up CTA: "See YOUR reality check →"',
      'Use your affiliate link as the story link',
    ],
    status: 'Manual',
  },
  {
    title: 'Comparison Carousel Posts',
    description: 'Create multi-slide carousels comparing 3-5 celebrities. Each slide shows one celeb\'s earnings with the final slide as a CTA.',
    icon: LayoutTemplate,
    tips: [
      'Slide 1: "Who earns more per SECOND?" (hook)',
      'Slides 2-4: Celebrity stats with dramatic comparisons',
      'Final slide: "Check YOUR salary vs celebs → link in bio"',
      'Use Canva or Figma with our gold/dark brand colors',
    ],
    status: 'Manual',
  },
  {
    title: 'Viral Quote Cards',
    description: 'Generate eye-catching stat cards with a single shocking wealth fact. Perfect for X/Twitter, Facebook, and LinkedIn posts.',
    icon: FileImage,
    tips: [
      '"Jeff Bezos earns your annual salary every 11 seconds ⏱️"',
      'Use dark background (#0a0a0a) with gold text (#ffd700)',
      'Include earningsexplorer.shop watermark',
      'Post at peak times: 8-9am, 12-1pm, 5-7pm EST',
    ],
    status: 'Manual',
  },
  {
    title: 'Before/After Wealth Cards',
    description: 'Show "Your salary" vs "Celebrity earnings" side-by-side. The visual contrast drives engagement and shares.',
    icon: Monitor,
    tips: [
      'Left side: modest salary with 😅 emoji',
      'Right side: celebrity earnings with 😎 emoji',
      'Use the Reality Check share card as a template',
      'Tag friends: "Tag someone who needs this reality check"',
    ],
    status: 'Use Reality Check',
  },
  {
    title: 'Weekly Wealth Digest',
    description: 'A templated image series for recurring social posts — "This Week in Wealth" with 3 trending celebrity stats.',
    icon: Palette,
    tips: [
      'Pull from your top searched celebrities (Trends tab)',
      'Format: Name → Annual → Per Hour → Mind-blowing comparison',
      'Post every Monday for consistency',
      'Reuse the gold/dark template style from share cards',
    ],
    status: 'Manual',
  },
];

const OGImageGallery = () => {
  const [images, setImages] = useState<OGImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [regeneratingAll, setRegeneratingAll] = useState(false);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('og-images').list('', {
        sortBy: { column: 'name', order: 'asc' },
      });

      if (error) throw error;

      const ogImages: OGImage[] = (data || [])
        .filter((f) => f.name.endsWith('.png'))
        .map((f) => ({
          name: f.name,
          size: (f.metadata as Record<string, unknown>)?.size
            ? Number((f.metadata as Record<string, unknown>).size)
            : 0,
          created_at: f.created_at || '',
          url: `${SUPABASE_URL}/storage/v1/object/public/og-images/${f.name}`,
        }));

      setImages(ogImages);
    } catch (err) {
      console.error('Failed to fetch OG images:', err);
      toast.error('Failed to load OG images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleRegenerate = async (page: string) => {
    setRegenerating(page);
    try {
      const { data, error } = await supabase.functions.invoke('generate-og-image', {
        body: null,
        headers: {},
        method: 'GET',
      });

      // Use query params approach via direct fetch
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/generate-og-image?page=${page}&force=true`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      toast.success(`Regenerated ${page} OG image!`);
      fetchImages();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to regenerate';
      toast.error(msg);
    } finally {
      setRegenerating(null);
    }
  };

  const handleRegenerateAll = async () => {
    setRegeneratingAll(true);
    const pages = Object.keys(FEATURE_LABELS).map((f) => f.replace('.png', ''));
    let success = 0;
    let failed = 0;

    for (const page of pages) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/generate-og-image?page=${page}&force=true`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          },
        );

        if (response.ok) {
          success++;
        } else {
          failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 1500));
      } catch {
        failed++;
      }
    }

    toast.success(`Regenerated ${success} images (${failed} failed)`);
    fetchImages();
    setRegeneratingAll(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied!');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '—';
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-8">
      {/* OG Image Gallery */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Generated OG Images
              </CardTitle>
              <CardDescription>
                These images are served to social media crawlers (iMessage, X, Facebook) when your links are shared.
                Each one was generated by AI with your gold/dark luxury brand aesthetic.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchImages}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={handleRegenerateAll}
                disabled={regeneratingAll}
                className="gap-2"
              >
                <Wand2 className={`h-4 w-4 ${regeneratingAll ? 'animate-spin' : ''}`} />
                {regeneratingAll ? 'Generating...' : 'Regenerate All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-[1.9/1] rounded-lg" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No OG images generated yet</p>
              <Button onClick={handleRegenerateAll}>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate All Images
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => {
                const meta = FEATURE_LABELS[img.name];
                const page = img.name.replace('.png', '');
                const isRegenerating = regenerating === page;

                return (
                  <div
                    key={img.name}
                    className="group relative rounded-lg border border-border overflow-hidden bg-card hover:border-primary/50 transition-colors"
                  >
                    {/* Image Preview */}
                    <div className="aspect-[1.9/1] bg-muted relative">
                      <img
                        src={`${img.url}?t=${Date.now()}`}
                        alt={meta?.label || img.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyUrl(img.url)}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy URL
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a href={img.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Open
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRegenerate(page)}
                          disabled={isRegenerating || regeneratingAll}
                        >
                          <Wand2 className={`h-3.5 w-3.5 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                          Regen
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meta?.emoji || '📄'}</span>
                        <div>
                          <p className="text-sm font-medium">{meta?.label || img.name}</p>
                          <p className="text-xs text-muted-foreground">{formatSize(img.size)}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        OG
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing Templates & Ideas */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Marketing Image Templates & Ideas
          </CardTitle>
          <CardDescription>
            Advanced strategies to spread the word using visual content. These templates leverage your app's
            data and share card system to create viral-worthy marketing assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKETING_TEMPLATES.map((template, i) => {
              const Icon = template.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {template.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{template.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <div className="space-y-1.5">
                    {template.tips.map((tip, j) => (
                      <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Quick Workflow
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Search any celebrity on your app to generate their profile</li>
              <li>Use the <strong>Share → Save Image</strong> button on any share card to download</li>
              <li>Post the image to social media with a compelling caption from the Toolkit tab</li>
              <li>Include your link or affiliate link for attribution tracking</li>
              <li>Monitor results in the <strong>Share Analytics</strong> tab</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OGImageGallery;
