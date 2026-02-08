import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

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
}

const SOCIAL_ASSETS: SocialAsset[] = [
  {
    id: 'home',
    ogImage: '/og-image.png',
    title: 'Wealth Perspective',
    description: 'Main site promo - viral wealth comparisons',
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
  },
  {
    id: 'quiz',
    ogImage: '/og-quiz.png',
    title: 'Wealth Quiz',
    description: 'Viral "Who earns more?" guessing game',
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
  },
  {
    id: 'calculator',
    ogImage: '/og-calculator.png',
    title: 'Reality Check',
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
  },
  {
    id: 'mogul-markets',
    ogImage: '/og-mogul-markets.png',
    title: 'Mogul Markets',
    description: 'Paper trading game - invest like the 1%',
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
  },
  {
    id: 'affiliate',
    ogImage: '/og-affiliate.png',
    title: 'Get Paid to Share',
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
  },
];

export function SocialMediaKitCard({ affiliateCode }: SocialMediaKitCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const referralUrl = `${SITE_URL}/ref/${affiliateCode}`;

  const getFullCaption = (asset: SocialAsset, platform: keyof SocialAsset['caption']) => {
    const caption = asset.caption[platform];
    const tags = asset.tags[platform].join(' ');
    return `${caption}\n\n${tags}\n\n🔗 ${referralUrl}`;
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

    return (
      <div
        key={asset.id}
        className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
      >
        {/* Image Preview */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-black/20 aspect-[1200/630]">
          <img
            src={asset.ogImage}
            alt={asset.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-background/80 text-foreground">{asset.title}</Badge>
          </div>
        </div>

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
            className={`gap-2 ${isImageUrlCopied ? 'text-green-500' : ''}`}
            onClick={() => handleCopyImageUrl(asset)}
          >
            {isImageUrlCopied ? <Check className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
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
          className={`w-full gap-2 ${isCaptionCopied ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={() => handleCopyCaption(asset, platform)}
        >
          {isCaptionCopied ? (
            <>
              <Check className="h-4 w-4" />
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

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5 text-primary" />
          Social Media Kit
          <Badge className="ml-auto bg-gradient-to-r from-primary/30 to-amber-500/30 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
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
            <TabsContent key={tab.key} value={tab.key}>
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-center">
                  <span className="font-semibold">How to use:</span>{' '}
                  Save the image → Copy the caption → Post on {tab.fullLabel}! 🚀
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {SOCIAL_ASSETS.map((asset) => renderAssetCard(asset, tab.key))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Pro Tip</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Post images with captions at peak hours for maximum engagement: 
            <strong className="text-foreground"> 7-9am, 12-2pm, and 7-10pm</strong> in your timezone. 
            Images get 2-3x more engagement than text-only posts! 📈
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
