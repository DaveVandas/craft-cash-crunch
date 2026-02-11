import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Image, 
  Copy, 
  Check, 
  Download,
  Sparkles,
  ExternalLink,
  Palette,
} from 'lucide-react';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaKitCardProps {
  affiliateCode: string;
}

const SITE_URL = 'https://earningsexplorer.shop';

interface SocialAsset {
  id: string;
  ogImage: string;
  title: string;
  description: string;
  caption: {
    twitter: string;
    instagram: string;
    tiktok: string;
    facebook: string;
  };
  tags: {
    twitter: string[];
    instagram: string[];
    tiktok: string[];
    facebook: string[];
  };
  path: string;
  /** If set, use OG share URL with this page key */
  ogPageKey?: string;
  category?: 'feature' | 'landing';
}

const SOCIAL_ASSETS: SocialAsset[] = [
  // === LANDING PAGES (for recruiting/sharing) ===
  {
    id: 'landing-a',
    ogImage: '/og-image.png',
    title: 'Think Like The 1%',
    description: 'Best for: Aspirational audiences',
    caption: {
      twitter: `🤯 Ever wonder how the rich REALLY think?\n\nWhile you're working 40 hours, Elon Musk makes what you'll earn in 10 lifetimes.\n\nThis app puts wealth into perspective 👇`,
      instagram: `Ever wonder how the rich REALLY think? 🧠💰\n\nThis app shows you how fast billionaires make YOUR yearly salary...\n\nElon makes it in 0.3 seconds. I'm still processing this 😭\n\nLink in bio to see for yourself ⬆️`,
      tiktok: `POV: You just learned Elon Musk makes your yearly salary in 0.3 seconds...\n\nThis app shows you how the 1% REALLY live 👑\n\nI'm not okay.`,
      facebook: `Just found this eye-opening app that shows how fast billionaires make money compared to the rest of us.\n\nElon Musk earns the average salary in less than a second! Really puts things in perspective.`,
    },
    tags: {
      twitter: ['#Wealth', '#Billionaire', '#Mindset'],
      instagram: ['#wealthmindset', '#billionaire', '#motivation', '#rich', '#perspective', '#mindblown'],
      tiktok: ['#fyp', '#billionaire', '#wealth', '#mindblown', '#viral', '#rich'],
      facebook: ['wealth', 'perspective', 'billionaire', 'mindset'],
    },
    path: '/landing-a',
    ogPageKey: 'landing-a',
    category: 'landing',
  },
  {
    id: 'landing-b',
    ogImage: '/og-image.png',
    title: 'Reality Check',
    description: 'Best for: Salary comparison hook',
    caption: {
      twitter: `This app gives you a REALITY CHECK on wealth 📊\n\nCompare your earnings to celebrities in real-time...\n\nThe numbers will humble you 😅`,
      instagram: `Ready for your REALITY CHECK? 📊💰\n\nThis app lets you compare your earnings to celebrities in real-time.\n\nI compared my salary to Taylor Swift's and... let's just say I need a moment 😭\n\nLink in bio ⬆️`,
      tiktok: `This app just gave me a reality check I didn't ask for 😭\n\nYou can compare your salary to ANY celebrity in real-time...\n\nTaylor Swift makes my yearly salary in 47 seconds 💀`,
      facebook: `Just got a "reality check" from this app that compares your earnings to celebrities in real-time.\n\nIt's humbling but also strangely motivating! Really makes you think about wealth differently.`,
    },
    tags: {
      twitter: ['#RealityCheck', '#Salary', '#Wealth'],
      instagram: ['#realitycheck', '#salary', '#celebrity', '#wealth', '#motivation', '#hustle'],
      tiktok: ['#fyp', '#realitycheck', '#salary', '#viral', '#celebrity', '#humbled'],
      facebook: ['reality check', 'salary', 'wealth', 'comparison'],
    },
    path: '/landing-b',
    ogPageKey: 'landing-b',
    category: 'landing',
  },
  {
    id: 'landing-c',
    ogImage: '/og-image.png',
    title: 'Wealth Perspective',
    description: 'Best for: General audiences',
    caption: {
      twitter: `Putting wealth into perspective, one mind-blowing comparison at a time 🤯\n\nThis app changed how I think about money forever.\n\nSee how fast the rich REALLY earn 👇`,
      instagram: `See money differently 💎✨\n\nThis app puts wealth into perspective with mind-blowing comparisons.\n\nOnce you see how fast billionaires earn, you'll never think about money the same way!\n\nLink in bio ⬆️`,
      tiktok: `This app just changed how I see money forever 🤯\n\nWealth comparisons that will blow your mind...\n\nYou're not ready for this 💀`,
      facebook: `Found this fascinating app that puts wealth into perspective with eye-opening comparisons.\n\nReally interesting way to visualize the wealth gap and understand how the ultra-rich earn!`,
    },
    tags: {
      twitter: ['#Wealth', '#Money', '#Perspective'],
      instagram: ['#wealth', '#money', '#perspective', '#mindblown', '#rich', '#motivation'],
      tiktok: ['#fyp', '#money', '#wealth', '#perspective', '#viral', '#mindblown'],
      facebook: ['wealth', 'perspective', 'money', 'interesting'],
    },
    path: '/landing-c',
    ogPageKey: 'landing-c',
    category: 'landing',
  },
  {
    id: 'landing-d',
    ogImage: '/og-affiliate.png',
    title: 'Get Paid to Share',
    description: 'Best for: Recruiting affiliates',
    caption: {
      twitter: `One viral TikTok could pay you $39,000... 💰\n\nThis affiliate program pays you for every signup.\n\nI'm building passive income one share at a time 👑`,
      instagram: `One viral post could pay you THOUSANDS 💰🔥\n\nI just joined this affiliate program that pays you for every person who signs up through your link.\n\nTop affiliates are making $39K+ from single viral posts!\n\nLink in bio to join ⬆️`,
      tiktok: `One viral TikTok = $39,000? 💰\n\nThis affiliate program pays you $1-2 for EVERY signup.\n\nDo the math on a viral video... 🤯`,
      facebook: `Just discovered this affiliate program where you get paid for sharing!\n\nTop affiliates are earning thousands from viral posts. It's a pretty cool way to earn passive income just by sharing content you'd share anyway.`,
    },
    tags: {
      twitter: ['#Affiliate', '#PassiveIncome', '#SideHustle'],
      instagram: ['#affiliate', '#passiveincome', '#sidehustle', '#makemoney', '#viral', '#income'],
      tiktok: ['#fyp', '#affiliate', '#passiveincome', '#sidehustle', '#viral', '#moneytok'],
      facebook: ['affiliate', 'passive income', 'side hustle', 'earn money'],
    },
    path: '/landing-d',
    ogPageKey: 'landing-d',
    category: 'landing',
  },
  // === FEATURES (for promoting specific tools) ===
  {
    id: 'home',
    ogImage: '/og-image.png',
    title: 'Wealth Perspective',
    description: 'Main site - viral wealth comparisons',
    caption: {
      twitter: `🤯 Just discovered this app that shows you how fast billionaires make YOUR yearly salary...\n\nElon makes it in 0.3 seconds. I'm not okay.\n\nCheck it out 👇`,
      instagram: `The wealth gap visualized in the most shocking way... 📊\n\nThis app shows you how long it takes YOU to earn what billionaires make in SECONDS.\n\nI spent an hour comparing my salary to celebrities and now I'm equally motivated and terrified 😭💪\n\nLink in bio to see your reality check! ⬆️`,
      tiktok: `POV: You just discovered how much billionaires make while you're sleeping... and now you can't unsleep 😭💀\n\nThis app literally shows you what celebrities earn PER SECOND. I'm shook.`,
      facebook: `Just found this eye-opening app that puts wealth into perspective! 👀\n\nYou can see how fast celebrities and billionaires earn money compared to your salary. It's wild - Elon Musk earns the average salary in less than a second!\n\nDefinitely worth checking out if you want a reality check 💰`,
    },
    tags: {
      twitter: ['#Wealth', '#Money', '#Billionaire'],
      instagram: ['#wealthgap', '#motivation', '#financialfreedom', '#hustle', '#grind', '#mindset'],
      tiktok: ['#fyp', '#moneytok', '#celebrity', '#wealth', '#mindblown', '#viral'],
      facebook: ['wealth', 'money', 'perspective', 'billionaire'],
    },
    path: '/',
    category: 'feature',
  },
  {
    id: 'quiz',
    ogImage: '/og-quiz.png',
    title: 'Wealth Quiz',
    description: 'Viral "Who earns more?" game',
    caption: {
      twitter: `I just scored 8/10 on this celebrity earnings quiz and I'm questioning everything I know about money 🤯\n\nCan you beat my score?`,
      instagram: `Test your wealth IQ! 🧠💰\n\nI just took this quiz that makes you guess who earns more between celebrities... and I was WRONG on most of them!\n\nThink you can beat my score? Try it and find out! 🔥\n\nLink in bio ⬆️`,
      tiktok: `I got 8/10 on this celebrity earnings quiz and my brain is broken 🤯\n\nNo way Drake earns more than... wait, WHAT?!\n\nTry it and drop your score in the comments 👇`,
      facebook: `Just took this fun quiz that tests how well you know celebrity earnings! 🌟\n\nI thought I knew who made more money... I was so wrong! 😅\n\nCan you beat my score? Give it a try!`,
    },
    tags: {
      twitter: ['#Quiz', '#Celebrity', '#WealthQuiz'],
      instagram: ['#quiz', '#celebrity', '#money', '#challenge', '#viral', '#fyp'],
      tiktok: ['#fyp', '#quiz', '#celebrity', '#money', '#viral', '#mindblown'],
      facebook: ['quiz', 'fun', 'celebrity', 'game'],
    },
    path: '/quiz',
    category: 'feature',
  },
  {
    id: 'calculator',
    ogImage: '/og-calculator.png',
    title: 'Reality Check Calculator',
    description: 'Compare your salary to celebrities',
    caption: {
      twitter: `This "Reality Check" calculator shows how fast celebs earn YOUR salary.\n\nRonaldo makes my monthly salary in 4.2 seconds. \n\nI need a moment. 😭`,
      instagram: `Reality Check Time! ⏰💰\n\nI just used this calculator to compare my salary to celebrities...\n\nTaylor Swift earns my YEARLY salary in 47 seconds. FORTY SEVEN SECONDS.\n\nBrb, rethinking all my life choices 😅\n\nLink in bio to get YOUR reality check ⬆️`,
      tiktok: `This app just told me Jeff Bezos makes my rent in 0.3 seconds...\n\nAnyway, who else needs a new career path? 😅👑\n\nTry this Reality Check calculator and prepare to be humbled 💀`,
      facebook: `Just tried this "Reality Check" calculator that compares your salary to celebrity earnings...\n\nLet's just say it was humbling! 😅 Cristiano Ronaldo earns my monthly salary in seconds.\n\nIt's actually pretty motivating though - shows you what's possible!`,
    },
    tags: {
      twitter: ['#RealityCheck', '#Salary', '#Celebrity'],
      instagram: ['#realitycheck', '#salary', '#celebrity', '#motivation', '#wealth', '#hustle'],
      tiktok: ['#fyp', '#realitycheck', '#salary', '#celebrity', '#viral', '#relatable'],
      facebook: ['reality check', 'salary', 'comparison', 'motivation'],
    },
    path: '/calculator',
    category: 'feature',
  },
  {
    id: 'mogul-markets',
    ogImage: '/og-mogul-markets.png',
    title: 'Mogul Markets',
    description: 'Paper trading game',
    caption: {
      twitter: `Been paper trading on Mogul Markets and I'm up 47% this week 📈\n\nNo real money, just learning how to invest like the pros.\n\nThis is how I'm practicing before going real 🔥`,
      instagram: `Learning to invest without risking real money! 📈💸\n\nFound this paper trading game where you start with $100k virtual cash and build your portfolio like real investors.\n\nUp 47% this week and it's giving me SO much confidence for when I go real!\n\nLink in bio to start your mogul journey ⬆️`,
      tiktok: `I'm up 47% on my paper trading portfolio and it costs $0 to play 📈\n\nMogul Markets lets you practice investing with fake money before you risk the real thing.\n\nThis is how you actually learn 🔥`,
      facebook: `Been using this paper trading game to practice investing - no real money at risk!\n\nYou start with $100,000 virtual cash and can buy real stocks at real prices. It's been amazing for building confidence before I invest real money.\n\nUp 47% this week! 📈`,
    },
    tags: {
      twitter: ['#Investing', '#Stocks', '#PaperTrading'],
      instagram: ['#investing', '#stocks', '#papertrading', '#finance', '#mogul', '#wealth'],
      tiktok: ['#fyp', '#investing', '#stocks', '#money', '#finance', '#beginner'],
      facebook: ['investing', 'stocks', 'learning', 'finance'],
    },
    path: '/mogul-markets',
    category: 'feature',
  },
  {
    id: 'side-hustle',
    ogImage: '/og-side-hustle.png',
    title: 'Side Hustle Ideas',
    description: 'Find your perfect side hustle',
    caption: {
      twitter: `Found this site that matches you with side hustles based on your skills...\n\nApparently I could make $2K/month with my current skills. \n\nWhy did nobody tell me this sooner? 🤯`,
      instagram: `Looking for a side hustle that actually fits YOUR skills? 💼💰\n\nThis tool matches you with money-making ideas based on what you're already good at.\n\nNo more random suggestions - just opportunities that make sense for YOU.\n\nLink in bio to find your perfect side hustle ⬆️`,
      tiktok: `This site just told me I could make $2K/month with skills I ALREADY HAVE 🤯\n\nIt matches you with side hustles based on your actual abilities.\n\nWhy is nobody talking about this??`,
      facebook: `Stumbled across this tool that matches you with side hustle ideas based on your existing skills!\n\nReally helpful if you're looking for ways to earn extra income but don't know where to start. It's like a career counselor for side gigs! 💼`,
    },
    tags: {
      twitter: ['#SideHustle', '#PassiveIncome', '#Money'],
      instagram: ['#sidehustle', '#passiveincome', '#makemoney', '#entrepreneur', '#skills', '#income'],
      tiktok: ['#fyp', '#sidehustle', '#money', '#passiveincome', '#moneytok', '#viral'],
      facebook: ['side hustle', 'extra income', 'skills', 'money'],
    },
    path: '/side-hustle',
    category: 'feature',
  },
  {
    id: 'affiliate',
    ogImage: '/og-affiliate.png',
    title: 'Affiliate Program',
    description: 'Recruit new affiliates',
    caption: {
      twitter: `Making money just by sharing links? Yes please. 💰\n\nThis affiliate program pays you $1-2 for every signup. No complicated funnels, just share and earn.\n\nBuilding my little empire one share at a time 👑`,
      instagram: `Want to get PAID to share cool stuff? 💸👑\n\nI just joined this affiliate program that pays you for every person who signs up through your link.\n\nIt's literally the easiest side income - just share content you'd share anyway!\n\nLink in bio to become an affiliate ⬆️`,
      tiktok: `Get paid $1-2 every time someone signs up through your link 💰\n\nNo products to sell, no complicated funnels. Just share and earn.\n\nThis is how I'm building passive income on the side 👑`,
      facebook: `Just started as an affiliate for Wealth Perspective and it's surprisingly easy!\n\nYou share links, people sign up, you get paid. Simple as that.\n\nIf you're looking for a low-effort way to earn some extra money, this might be worth checking out!`,
    },
    tags: {
      twitter: ['#AffiliateMarketing', '#PassiveIncome', '#SideHustle'],
      instagram: ['#affiliate', '#passiveincome', '#sidehustle', '#makemoney', '#entrepreneur', '#income'],
      tiktok: ['#fyp', '#affiliate', '#passiveincome', '#sidehustle', '#moneytok', '#viral'],
      facebook: ['affiliate', 'passive income', 'side hustle', 'earn money'],
    },
    path: '/become-affiliate',
    category: 'feature',
  },
];

const OG_FEATURE_LABELS: Record<string, { label: string; emoji: string }> = {
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

function OGBackgroundsSection({ affiliateCode }: { affiliateCode: string }) {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await supabase.storage.from('og-images').list('', {
          sortBy: { column: 'name', order: 'asc' },
        });
        setImages(
          (data || [])
            .filter((f) => f.name.endsWith('.png'))
            .map((f) => ({
              name: f.name,
              url: `${SUPABASE_URL}/storage/v1/object/public/og-images/${f.name}`,
            }))
        );
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleSavePhoto = async (img: { name: string; url: string }) => {
    try {
      const response = await fetch(img.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wealth-perspective-bg-${img.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('Background saved! Add your own text in Canva or any editor 🎨');
    } catch {
      window.open(img.url, '_blank');
      toast.info('Opened in new tab — right-click to save');
    }
  };

  if (loading || images.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          <Palette className="w-3 h-3 mr-1" />
          AI Backgrounds
        </Badge>
        <span className="text-xs text-muted-foreground">Save & add your own text for ads/posts</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => {
          const meta = OG_FEATURE_LABELS[img.name];
          return (
            <div
              key={img.name}
              className="group relative rounded-lg border border-border overflow-hidden bg-card hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleSavePhoto(img)}
            >
              <div className="aspect-[1.9/1] bg-muted relative">
                <img
                  src={img.url}
                  alt={meta?.label || img.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Save Photo
                  </Button>
                </div>
              </div>
              <div className="p-2 flex items-center gap-1.5">
                <span className="text-sm">{meta?.emoji || '📄'}</span>
                <span className="text-xs font-medium truncate">{meta?.label || img.name}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        💡 Save these backgrounds and overlay your own text, stats, or affiliate link in Canva, Photoshop, or any photo editor!
      </p>
    </div>
  );
}

export function SocialMediaKitCard({ affiliateCode }: SocialMediaKitCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Generate the appropriate share URL based on asset type
  const getShareUrl = (asset: SocialAsset): string => {
    if (asset.ogPageKey) {
      // Use OG-enabled share URL for landing pages
      const redirectPath = `${asset.path}?ref=${affiliateCode}`;
      return getShareUrlWithRedirect(asset.ogPageKey as any, redirectPath);
    }
    // Default referral URL for features
    return `${SITE_URL}/ref/${affiliateCode}`;
  };

  const getFullCaption = (asset: SocialAsset, platform: keyof SocialAsset['caption']) => {
    const caption = asset.caption[platform];
    const tags = asset.tags[platform].join(' ');
    const shareUrl = getShareUrl(asset);
    return `${caption}\n\n${tags}\n\n🔗 ${shareUrl}`;
  };

  const handleCopyCaption = async (asset: SocialAsset, platform: keyof SocialAsset['caption']) => {
    const fullCaption = getFullCaption(asset, platform);
    try {
      await navigator.clipboard.writeText(fullCaption);
      setCopiedId(`${asset.id}-${platform}-caption`);
      toast.success('Caption copied! Paste it in your post 📋');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleCopyImageUrl = async (asset: SocialAsset) => {
    const imageUrl = `${SITE_URL}${asset.ogImage}`;
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopiedId(`${asset.id}-image-url`);
      toast.success('Image URL copied! 📷');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadImage = async (asset: SocialAsset) => {
    setDownloadingId(asset.id);
    try {
      const imageUrl = `${SITE_URL}${asset.ogImage}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wealth-perspective-${asset.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded! 📥');
    } catch {
      // Fallback: open in new tab
      window.open(`${SITE_URL}${asset.ogImage}`, '_blank');
      toast.info('Image opened in new tab - right-click to save');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderAssetCard = (asset: SocialAsset, platform: keyof SocialAsset['caption']) => {
    const isCaptionCopied = copiedId === `${asset.id}-${platform}-caption`;
    const isImageUrlCopied = copiedId === `${asset.id}-image-url`;
    const isDownloading = downloadingId === asset.id;
    const isLandingPage = asset.category === 'landing';

    return (
      <div
        key={asset.id}
        className={`p-4 rounded-lg border transition-colors ${
          isLandingPage 
            ? 'bg-primary/5 border-primary/30 hover:border-primary/50' 
            : 'bg-muted/30 border-border/50 hover:border-primary/30'
        }`}
      >
        {/* Image Preview */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-background/20 aspect-[1200/630]">
          <img
            src={asset.ogImage}
            alt={asset.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <Badge className="bg-background/80 text-foreground">{asset.title}</Badge>
            {isLandingPage && (
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs">
                OG Optimized
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3">{asset.description}</p>

        {/* Asset Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 flex-1"
            onClick={() => handleDownloadImage(asset)}
            disabled={isDownloading}
          >
            <Download className="h-3.5 w-3.5" />
            {isDownloading ? 'Saving...' : 'Save Image'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleCopyImageUrl(asset)}
          >
            {isImageUrlCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <ExternalLink className="h-3.5 w-3.5" />}
            URL
          </Button>
        </div>

        {/* Caption Preview */}
        <div className="p-3 bg-card/50 rounded-lg border border-border/30 mb-3">
          <p className="text-sm whitespace-pre-line line-clamp-4">{asset.caption[platform]}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags[platform].map((tag) => (
              <span key={tag} className="text-xs text-primary/80">{tag}</span>
            ))}
          </div>
        </div>

        {/* Copy Caption Button */}
        <Button
          className="w-full gap-2"
          variant={isCaptionCopied ? "secondary" : "default"}
          onClick={() => handleCopyCaption(asset, platform)}
        >
          {isCaptionCopied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Caption + Link
            </>
          )}
        </Button>
      </div>
    );
  };

  const platformTabs = [
    { key: 'twitter' as const, label: '𝕏', fullLabel: 'Twitter/X' },
    { key: 'instagram' as const, label: '📸', fullLabel: 'Instagram' },
    { key: 'tiktok' as const, label: '🎵', fullLabel: 'TikTok' },
    { key: 'facebook' as const, label: '📘', fullLabel: 'Facebook' },
  ];

  const landingAssets = SOCIAL_ASSETS.filter(a => a.category === 'landing');
  const featureAssets = SOCIAL_ASSETS.filter(a => a.category === 'feature');

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5 text-primary" />
          Social Media Kit
          <Badge className="ml-auto bg-gradient-to-r from-primary/30 to-primary/10 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {SOCIAL_ASSETS.length} Assets
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ready-to-share images with captions. Save the image, copy the caption, and post! Your referral link is included automatically.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="twitter" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            {platformTabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                <span className="text-lg">{tab.label}</span>
                <span className="hidden sm:inline text-xs">{tab.fullLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {platformTabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="space-y-6">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-center">
                  <span className="font-semibold">How to use:</span>{' '}
                  Save the image → Copy the caption → Post on {tab.fullLabel}! 🚀
                </p>
              </div>

              {/* Landing Pages Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    🚀 Landing Pages
                  </Badge>
                  <span className="text-xs text-muted-foreground">Best for recruiting new users</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {landingAssets.map((asset) => renderAssetCard(asset, tab.key))}
                </div>
              </div>

              {/* Features Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                    ✨ Features
                  </Badge>
                  <span className="text-xs text-muted-foreground">Promote specific tools</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featureAssets.map((asset) => renderAssetCard(asset, tab.key))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* AI Background Images Section */}
        <OGBackgroundsSection affiliateCode={affiliateCode} />

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Pro Tips</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong className="text-foreground">Landing pages</strong> have OG-optimized URLs - they show rich previews when shared!</li>
            <li>• <strong className="text-foreground">AI Backgrounds</strong> — save them and add your own text/stats in Canva or any photo editor!</li>
            <li>• Post at peak hours: <strong className="text-foreground">7-9am, 12-2pm, and 7-10pm</strong> in your timezone</li>
            <li>• Images get 2-3x more engagement than text-only posts! 📈</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
