import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Crown, Sparkles, Flame, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SocialCaptionsCardProps {
  affiliateCode: string;
  displayName: string;
}

interface Caption {
  id: string;
  text: string;
  tags: string[];
  style: 'viral' | 'curious' | 'flex' | 'educational';
}

export function SocialCaptionsCard({ affiliateCode, displayName }: SocialCaptionsCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const referralUrl = `${window.location.origin}/ref/${affiliateCode}`;

  const handleCopy = async (caption: Caption) => {
    const fullText = `${caption.text}\n\n${caption.tags.join(' ')}\n\n🔗 ${referralUrl}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(caption.id);
      toast.success('Caption copied! Paste it in your post 📋');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const tiktokCaptions: Caption[] = [
    {
      id: 'tt1',
      text: `POV: You just discovered how much Ronaldo makes while you're sleeping... and now you can't unsleep 😭💀\n\nThis app literally shows you what celebrities earn PER SECOND. I'm shook.`,
      tags: ['#fyp', '#moneytok', '#celebrity', '#wealth', '#mindblown', '#viral'],
      style: 'viral',
    },
    {
      id: 'tt2',
      text: `The way I gasped when I saw how long it takes me to earn what Taylor Swift makes in 1 MINUTE... 📉\n\nDownload this app and prepare to question everything`,
      tags: ['#fyp', '#financetok', '#taylorswift', '#wealthy', '#millionaire'],
      style: 'curious',
    },
    {
      id: 'tt3',
      text: `Plot twist: There's an app that shows you could buy 47 Teslas with what Elon makes in a DAY 🚗\n\nI'm using this as motivation to build my empire fr`,
      tags: ['#fyp', '#elonmusk', '#motivation', '#hustle', '#entrepreneur', '#mogul'],
      style: 'flex',
    },
    {
      id: 'tt4',
      text: `Okay but why did nobody tell me about this app sooner??\n\nYou can literally compare your salary to any billionaire and see how fast they make YOUR yearly income 🤯`,
      tags: ['#fyp', '#moneytok', '#billionaire', '#wealthy', '#finance', '#musthave'],
      style: 'viral',
    },
    {
      id: 'tt5',
      text: `This app just told me Jeff Bezos makes my rent in 0.3 seconds...\n\nAnyway, who else needs a new career path? 😅👑`,
      tags: ['#fyp', '#jeffbezos', '#amazon', '#wealth', '#comedy', '#relatable'],
      style: 'curious',
    },
  ];

  const instagramCaptions: Caption[] = [
    {
      id: 'ig1',
      text: `Every mogul started somewhere. 👑\n\nI just discovered this app that shows exactly how much celebrities and billionaires earn in real-time. Watching their earnings tick up by the SECOND hits different.\n\nUse it as motivation to build YOUR empire. Link in bio ⬆️`,
      tags: ['#mogullife', '#wealth', '#motivation', '#entrepreneur', '#millionairemindset', '#success'],
      style: 'flex',
    },
    {
      id: 'ig2',
      text: `The wealth gap visualized in the most shocking way... 📊\n\nThis app compares your earnings to billionaires and shows you could work for 847 YEARS to make what they earn in a day.\n\nNot posting this to make you sad — posting this to light a fire 🔥`,
      tags: ['#wealthgap', '#motivation', '#financialfreedom', '#hustle', '#grind', '#mindset'],
      style: 'educational',
    },
    {
      id: 'ig3',
      text: `Mindset shift: Instead of being jealous of billionaires, study them. 📚\n\nThis app breaks down celebrity earnings in a way that actually makes you think differently about money.\n\nKnowledge is power. Use code ${affiliateCode} 👑`,
      tags: ['#mogulmindset', '#wealthy', '#success', '#entrepreneur', '#billionaire', '#growth'],
      style: 'educational',
    },
    {
      id: 'ig4',
      text: `Just spent an hour on this app comparing my salary to celebrities and now I'm equally motivated and terrified 😭💪\n\nSeriously though, seeing wealth visualized like this changes your perspective on what's possible.`,
      tags: ['#realtalk', '#wealthperspective', '#motivation', '#financetips', '#mogul'],
      style: 'curious',
    },
  ];

  const twitterCaptions: Caption[] = [
    {
      id: 'tw1',
      text: `Just found out Cristiano Ronaldo earns my monthly salary every 4.2 seconds.\n\nThis app is brutal but I can't stop using it 💀`,
      tags: ['#Wealth', '#CelebrityEarnings'],
      style: 'viral',
    },
    {
      id: 'tw2',
      text: `There's an app that shows you celebrity earnings in real-time.\n\nWatching Elon's net worth tick up $47,000 while I eat breakfast was... humbling.\n\nBut also? Motivating. 👑`,
      tags: ['#Mogul', '#Motivation'],
      style: 'flex',
    },
    {
      id: 'tw3',
      text: `The best $0 I ever spent was downloading this app.\n\nIt literally changed how I think about money, time, and building wealth.\n\nIf you're not checking this out, you're sleeping 💤`,
      tags: ['#WealthPerspective', '#Finance'],
      style: 'curious',
    },
    {
      id: 'tw4',
      text: `Mogul tip: Don't hate the game, study it.\n\nThis app shows exactly how the ultra-wealthy earn. Use it as your blueprint.\n\n${referralUrl}`,
      tags: ['#MogulMindset', '#Success'],
      style: 'educational',
    },
    {
      id: 'tw5',
      text: `Taylor Swift earns $1M+ per day.\n\nI earn... significantly less.\n\nBut this app reminded me that comparison is the thief of joy AND the fuel for hustle. Choose wisely 🔥`,
      tags: ['#Hustle', '#Wealth'],
      style: 'flex',
    },
  ];

  const getStyleBadge = (style: Caption['style']) => {
    switch (style) {
      case 'viral':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1"><Flame className="w-3 h-3" />Viral</Badge>;
      case 'curious':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1"><Sparkles className="w-3 h-3" />Hook</Badge>;
      case 'flex':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1"><Crown className="w-3 h-3" />Mogul</Badge>;
      case 'educational':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1"><Zap className="w-3 h-3" />Value</Badge>;
    }
  };

  const renderCaptions = (captions: Caption[]) => (
    <div className="space-y-4">
      {captions.map((caption) => (
        <div
          key={caption.id}
          className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            {getStyleBadge(caption.style)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(caption)}
              className="shrink-0 gap-2"
            >
              {copiedId === caption.id ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm whitespace-pre-line mb-3">{caption.text}</p>
          <div className="flex flex-wrap gap-1">
            {caption.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary/80">{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Ready-to-Post Captions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          One-click copy captions with your referral link included. Post, go viral, get paid! 👑
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tiktok" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tiktok" className="gap-2">
              <span className="text-lg">📱</span>
              <span className="hidden sm:inline">TikTok</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="gap-2">
              <span className="text-lg">📸</span>
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="gap-2">
              <span className="text-lg">𝕏</span>
              <span className="hidden sm:inline">Twitter</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tiktok">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <span className="font-semibold">Pro Tip:</span> TikTok loves controversy and curiosity. 
                These captions are designed to stop the scroll! 🎯
              </p>
            </div>
            {renderCaptions(tiktokCaptions)}
          </TabsContent>

          <TabsContent value="instagram">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <span className="font-semibold">Pro Tip:</span> Instagram rewards value and authenticity. 
                Add your personal take to make it yours! ✨
              </p>
            </div>
            {renderCaptions(instagramCaptions)}
          </TabsContent>

          <TabsContent value="twitter">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <span className="font-semibold">Pro Tip:</span> Twitter loves hot takes and threads. 
                These are perfect for engagement! 🔥
              </p>
            </div>
            {renderCaptions(twitterCaptions)}
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Mogul Strategy</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Post at peak hours (7-9am, 12-2pm, 7-10pm). Use trending sounds on TikTok. 
            Reply to comments to boost engagement. Consistency beats perfection — post daily and watch your empire grow! 👑
          </p>
        </div>
      </CardContent>
    </Card>
  );
}