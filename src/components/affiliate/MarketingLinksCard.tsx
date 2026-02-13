import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';
import { 
  Link2, 
  Copy, 
  Check, 
  Crown, 
  Flame, 
  Rocket, 
  DollarSign,
  ExternalLink,
  Home,
  Eye,
  ImageIcon,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MarketingLinksCardProps {
  affiliateCode: string;
}

const BASE_URL = 'https://earningsexplorer.shop';

// Map link IDs to og-share page keys
const OG_PAGE_MAP: Record<string, string> = {
  'home': 'home',
  'ref': 'home',
  'variant-a': 'landing-a',
  'variant-b': 'landing-b',
  'variant-c': 'landing-c',
  'variant-d': 'landing-d',
};

const OG_META: Record<string, { title: string; description: string }> = {
  'home': { title: 'Wealth Perspective', description: 'Putting wealth into perspective, one mind-blowing comparison at a time!' },
  'landing-a': { title: 'Think Like The 1% | Wealth Perspective', description: 'While you work 40 hours, Elon Musk makes what you\'ll earn in 10 lifetimes.' },
  'landing-b': { title: 'Your Wealth Reality Check | Wealth Perspective', description: 'Compare your salary to any celebrity in real-time. The numbers will shock you.' },
  'landing-c': { title: 'See Money Differently | Wealth Perspective', description: 'Watch billionaire earnings tick up by the second. Mind-blowing wealth comparisons.' },
  'landing-d': { title: 'One TikTok Could Pay You $39,000 | Wealth Perspective', description: 'Join the mogul movement. Share viral wealth content and earn cash for every friend who signs up.' },
};

const MARKETING_LINKS = [
  {
    id: 'home',
    label: 'Homepage',
    path: '/',
    description: 'Main entry point with search & tools',
    icon: Home,
    badge: null,
  },
  {
    id: 'ref',
    label: 'Your Referral Page',
    path: '/ref/',
    useCodeInPath: true,
    description: 'Personalized page with your name',
    icon: Crown,
    badge: 'Best',
  },
  {
    id: 'variant-a',
    label: 'Landing A - Luxury',
    path: '/landing/a',
    description: '"Think Like The 1%" angle',
    icon: Crown,
    badge: null,
  },
  {
    id: 'variant-b',
    label: 'Landing B - Wake Up',
    path: '/landing/b',
    description: '"You\'re Just Uninformed" angle',
    icon: Flame,
    badge: 'High CTR',
  },
  {
    id: 'variant-c',
    label: 'Landing C - Stats',
    path: '/landing/c',
    description: '"42 Seconds" earnings hook',
    icon: Rocket,
    badge: null,
  },
  {
    id: 'variant-d',
    label: 'Landing D - Affiliate',
    path: '/landing/d',
    description: '"Get Paid to Share" for recruiters',
    icon: DollarSign,
    badge: 'Recruit',
  },
];

export function MarketingLinksCard({ affiliateCode }: MarketingLinksCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewLink, setPreviewLink] = useState<typeof MARKETING_LINKS[0] | null>(null);
  const [previewTab, setPreviewTab] = useState<string>('page');
  const [ogImageTimestamp, setOgImageTimestamp] = useState<number>(Date.now());
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const getDirectUrl = (link: typeof MARKETING_LINKS[0]) => {
    if (link.useCodeInPath) {
      return `${BASE_URL}${link.path}${affiliateCode}`;
    }
    return `${BASE_URL}${link.path}?ref=${affiliateCode}`;
  };

  const getFullUrl = (link: typeof MARKETING_LINKS[0]) => {
    const directUrl = getDirectUrl(link);
    const redirectPath = directUrl.replace(BASE_URL, '') || '/';
    return getShareUrlWithRedirect('home', redirectPath);
  };

  const getOgImageUrl = (linkId: string) => {
    const pageKey = OG_PAGE_MAP[linkId] || 'home';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/og-images/${pageKey}.png?t=${ogImageTimestamp}`;
  };

  const handleRegenerate = async (linkId: string) => {
    const pageKey = OG_PAGE_MAP[linkId] || 'home';
    setRegenerating(linkId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-og-image', {
        body: null,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      // Use fetch directly since we need query params
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const res = await fetch(
        `${supabaseUrl}/functions/v1/generate-og-image?page=${pageKey}&force=true`,
        { headers: { 'Authorization': `Bearer ${anonKey}`, 'apikey': anonKey } }
      );
      if (res.ok) {
        setOgImageTimestamp(Date.now());
        toast.success('New OG image generated! 🎨');
      } else {
        toast.error('Failed to regenerate image');
      }
    } catch {
      toast.error('Failed to regenerate image');
    } finally {
      setRegenerating(null);
    }
  };

  const handleCopy = async (link: typeof MARKETING_LINKS[0]) => {
    const url = getFullUrl(link);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(link.id);
      toast.success('Link copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleOpen = (link: typeof MARKETING_LINKS[0]) => {
    window.open(getDirectUrl(link), '_blank');
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          Your Marketing Links
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use different landing pages to A/B test what converts best for your audience.
          All links track back to your affiliate code.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {MARKETING_LINKS.map((link) => {
          const Icon = link.icon;
          const isCopied = copiedId === link.id;
          
          return (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{link.label}</p>
                    {link.badge && (
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] px-1.5 py-0 ${
                          link.badge === 'Best' 
                            ? 'border-primary/50 text-primary' 
                            : link.badge === 'High CTR'
                            ? 'border-orange-500/50 text-orange-500'
                            : 'border-green-500/50 text-green-500'
                        }`}
                      >
                        {link.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => { setPreviewLink(link); setPreviewTab('page'); }}
                  title="Preview"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpen(link)}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${isCopied ? 'text-green-500' : ''}`}
                  onClick={() => handleCopy(link)}
                  title="Copy link"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: Test different landing pages to see which converts best for your audience!
          </p>
        </div>
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={!!previewLink} onOpenChange={(open) => !open && setPreviewLink(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col">
          <DialogHeader className="p-4 pb-2 flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2 min-w-0">
              <DialogTitle className="text-sm font-medium truncate">
                {previewLink?.label}
              </DialogTitle>
              {previewLink?.badge && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex-shrink-0">
                  {previewLink.badge}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => previewLink && handleCopy(previewLink)}
              >
                {copiedId === previewLink?.id ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => previewLink && handleOpen(previewLink)}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Tab switcher: Page Preview vs Social Card */}
          <div className="px-4 pb-2">
            <Tabs value={previewTab} onValueChange={setPreviewTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="page" className="gap-1.5 text-xs">
                  <Eye className="w-3.5 h-3.5" />
                  Page Preview
                </TabsTrigger>
                <TabsTrigger value="og" className="gap-1.5 text-xs">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Social Card Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 border-t border-border/50 min-h-0 overflow-auto">
            {previewTab === 'page' && previewLink && (
              <iframe
                src={previewLink.useCodeInPath ? `/ref/${affiliateCode}` : `${previewLink.path}?ref=${affiliateCode}`}
                className="w-full h-full rounded-b-lg"
                title={`Preview: ${previewLink.label}`}
              />
            )}
            {previewTab === 'og' && previewLink && (
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  This is what people see when your link is shared on Twitter, Facebook, LinkedIn, etc.
                </p>

                {/* Mock social card */}
                <div className="max-w-lg mx-auto rounded-xl border border-border/50 overflow-hidden bg-card">
                  <div className="aspect-[1.91/1] bg-muted relative">
                    <img
                      src={getOgImageUrl(previewLink.id)}
                      alt="OG preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/og-image.png';
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">earningsexplorer.shop</p>
                    <p className="font-semibold text-sm line-clamp-2">
                      {OG_META[OG_PAGE_MAP[previewLink.id] || 'home']?.title || 'Wealth Perspective'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {OG_META[OG_PAGE_MAP[previewLink.id] || 'home']?.description || ''}
                    </p>
                  </div>
                </div>

                {/* Regenerate button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleRegenerate(previewLink.id)}
                    disabled={regenerating === previewLink.id}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${regenerating === previewLink.id ? 'animate-spin' : ''}`} />
                    {regenerating === previewLink.id ? 'Generating...' : 'Regenerate Image'}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ Social platforms cache cards. After regenerating, it may take a few hours for Twitter/Facebook to show the new image.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}