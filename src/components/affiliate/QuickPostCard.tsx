import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, ExternalLink, Rocket, Lightbulb, Info, ImageIcon, ChevronDown, ChevronUp, Download } from 'lucide-react';
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

      // For Twitter & Facebook, open share intent
      if (platform === 'twitter' || platform === 'facebook') {
        const captionOnly = post.caption + (post.hashtags ? `\n\n${post.hashtags}` : '');
        openShareIntent(platform, captionOnly, shareUrl);
        if (selectedImage) {
          toast.info('Attach the downloaded image to your tweet for maximum engagement! 🔥', { duration: 5000 });
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
          <TabsList className="grid w-full grid-cols-4">
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
    </Card>
  );
}
