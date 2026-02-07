import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, ChevronRight, Rocket, MessageCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumShareIconButton from '@/components/share/PremiumShareIconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/share/ShareMenuDropdown';

interface SideHustle {
  name: string;
  emoji: string;
  avgBuyPrice: number;
  avgSellPrice: number;
  salesPerMonth: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  category: string;
}

// Top hustles that rotate daily - subset for preview
const PREVIEW_HUSTLES: SideHustle[] = [
  { 
    name: 'Wealth Perspective Affiliate', emoji: '💎', avgBuyPrice: 0, avgSellPrice: 1.5, salesPerMonth: 500, difficulty: 'Easy', 
    description: 'Share our app, get paid per signup!', category: 'digital'
  },
  { 
    name: 'Thrift Flipping', emoji: '🏷️', avgBuyPrice: 5, avgSellPrice: 35, salesPerMonth: 20, difficulty: 'Easy', 
    description: 'Goodwill to gold.', category: 'flipping'
  },
  { 
    name: 'Digital Products', emoji: '💻', avgBuyPrice: 0, avgSellPrice: 29, salesPerMonth: 40, difficulty: 'Medium', 
    description: 'Build once, sell infinitely.', category: 'digital'
  },
  { 
    name: 'Tech Flipping', emoji: '📱', avgBuyPrice: 150, avgSellPrice: 300, salesPerMonth: 6, difficulty: 'Medium', 
    description: 'Phones, laptops, tablets.', category: 'flipping'
  },
  { 
    name: 'Pressure Washing', emoji: '💦', avgBuyPrice: 50, avgSellPrice: 250, salesPerMonth: 8, difficulty: 'Easy', 
    description: 'Clean = cash.', category: 'services'
  },
  { 
    name: 'UGC Content Creator', emoji: '📲', avgBuyPrice: 0, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Medium', 
    description: 'Create TikTok-style ads.', category: 'digital'
  },
];

const SITE_URL = "https://earningsexplorer.shop";

const SideHustlePreview = () => {
  // Rotate which hustles show based on day (after affiliate which is always first)
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const rotatedHustles = [
    PREVIEW_HUSTLES[0], // Keep affiliate first
    ...PREVIEW_HUSTLES.slice(1).sort((a, b) => {
      const hashA = (a.name.charCodeAt(0) + dayOfYear) % 100;
      const hashB = (b.name.charCodeAt(0) + dayOfYear) % 100;
      return hashA - hashB;
    }).slice(0, 3)
  ];

  const formatProfit = (hustle: SideHustle) => {
    const profit = (hustle.avgSellPrice - hustle.avgBuyPrice) * hustle.salesPerMonth;
    return profit >= 1000 ? `$${(profit / 1000).toFixed(1)}k` : `$${profit.toFixed(0)}`;
  };

  const shareText = `🚀 Looking for side hustle ideas?\n\n💰 Thrift Flipping: $600/mo\n💻 Digital Products: $1k+/mo\n💎 Affiliate Marketing: $750+/mo\n\n🔥 Browse 30+ profit-tested hustles at ${SITE_URL}/side-hustle`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Side Hustle Ideas',
          text: shareText,
          url: `${SITE_URL}/side-hustle`,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/side-hustle`)}&quote=${encodeURIComponent('🚀 Browse 30+ profit-tested side hustle ideas')}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/side-hustle`)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleInstagramShare = () => {
    handleCopyText();
    toast.success('Text copied! Open Instagram and paste in your story or post.');
  };

  const handleTikTokShare = () => {
    handleCopyText();
    toast.success('Text copied! Open TikTok and paste in your video caption.');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-emerald-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="h-5 w-5 text-emerald-500" />
            <span className="font-serif">Side Hustle Ideas</span>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-xs">
              <Flame className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PremiumShareIconButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                <span className="ml-2">Text / Message</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
                <WhatsAppIcon />
                <span className="ml-2">WhatsApp</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
                <TwitterIcon />
                <span className="ml-2">X (Twitter)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
                <FacebookIcon />
                <span className="ml-2">Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLinkedInShare} className="cursor-pointer">
                <LinkedInIcon />
                <span className="ml-2">LinkedIn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleInstagramShare} className="cursor-pointer">
                <InstagramIcon />
                <span className="ml-2">Instagram</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTikTokShare} className="cursor-pointer">
                <TikTokIcon />
                <span className="ml-2">TikTok</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer">
                <Copy className="h-4 w-4" />
                <span className="ml-2">Copy Text</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">Quick ways to stack cash on the side</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {rotatedHustles.map((hustle) => (
            <Link 
              key={hustle.name}
              to="/side-hustle"
              className="p-3 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">{hustle.emoji}</span>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {hustle.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] px-1 py-0 flex-shrink-0 ${
                        hustle.difficulty === 'Easy' ? 'border-green-500/30 text-green-500' :
                        hustle.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-500' : 
                        'border-red-500/30 text-red-500'
                      }`}
                    >
                      {hustle.difficulty}
                    </Badge>
                    <span className="text-[10px] font-semibold text-emerald-500 truncate">
                      {formatProfit(hustle)}/mo
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/side-hustle">
          <Button variant="outline" className="w-full gap-2 border-primary/30 hover:border-primary hover:bg-primary/5">
            <span>Explore All 30+ Hustles</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SideHustlePreview;
