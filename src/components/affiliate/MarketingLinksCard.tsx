import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Eye
} from 'lucide-react';

interface MarketingLinksCardProps {
  affiliateCode: string;
}

const BASE_URL = 'https://earningsexplorer.shop';

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
                  onClick={() => setPreviewLink(link)}
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
          <div className="flex-1 border-t border-border/50 min-h-0">
            {previewLink && (
              <iframe
                src={previewLink.useCodeInPath ? `/ref/${affiliateCode}` : `${previewLink.path}?ref=${affiliateCode}`}
                className="w-full h-full rounded-b-lg"
                title={`Preview: ${previewLink.label}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
