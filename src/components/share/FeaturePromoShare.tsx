import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Sparkles, MessageCircle, Copy } from 'lucide-react';
import {
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/share/ShareMenuDropdown';
import { getShareUrl, type ShareablePage } from '@/lib/shareUrls';
import { trackShareEvent, type ShareFeature as TrackingFeature } from '@/hooks/useShareTracking';

const SITE_URL = "https://earningsexplorer.shop";

interface PromoContent {
  title: string;
  shareText: string;
  url: string;
  ogPage: ShareablePage; // For social media previews
  trackingFeature: TrackingFeature; // For analytics
}

const PROMO_CONTENT: Record<string, PromoContent> = {
  trades: {
    title: 'Who Needs College',
    shareText: `💰 8 trades that pay MORE than most degrees:\n\n⚡ Electrician: $95k/yr\n🔧 Plumber: $90k/yr\n❄️ HVAC Tech: $85k/yr\n🔥 Welder: $80k/yr\n\n📈 Start earning at 18 while others rack up $100k+ in debt.\n\n🎓 Skip college. Stack wealth.`,
    url: `${SITE_URL}/trades`,
    ogPage: 'trades',
    trackingFeature: 'trades',
  },
  mogulMarkets: {
    title: 'Mogul Markets',
    shareText: `📈 Mogul Markets - Trade like a billionaire!\n\n💵 $10,000 paper money to start\n🎯 Real-time stock prices\n👑 Copy celebrity portfolios\n📊 Track your P&L\n\n🔥 Practice trading risk-free!`,
    url: `${SITE_URL}/mogul-markets`,
    ogPage: 'mogul-markets',
    trackingFeature: 'mogul-markets',
  },
  vipPortfolios: {
    title: 'VIP Portfolios',
    shareText: `👑 Ever wonder what stocks politicians trade?\n\n📊 See Nancy Pelosi's portfolio\n💼 Track Warren Buffett's moves\n🎯 Copy trades to your paper portfolio\n\n🔥 Mirror the VIPs!`,
    url: `${SITE_URL}/celebrity-portfolios`,
    ogPage: 'celebrity-portfolios',
    trackingFeature: 'celebrity-portfolios',
  },
  wealthQuiz: {
    title: 'Wealth Quiz',
    shareText: `🧠 Think you know how fast billionaires make money?\n\n💰 Guess celebrity earnings\n🔥 Build streaks for bonus points\n🏆 Earn your wealth title\n\n🎯 Test your mogul IQ!`,
    url: `${SITE_URL}/quiz`,
    ogPage: 'quiz',
    trackingFeature: 'quiz',
  },
  realityCheck: {
    title: 'Reality Check',
    shareText: `💭 Ever wonder how your salary compares to celebrities?\n\n⏱️ See how fast they earn YOUR salary\n😅 Prepare to be humbled\n💡 Get motivated to build wealth\n\n🔥 Get your reality check!`,
    url: `${SITE_URL}/calculator`,
    ogPage: 'calculator',
    trackingFeature: 'calculator',
  },
  debtDestroyer: {
    title: 'Debt Destroyer',
    shareText: `💀 Drowning in debt? This calculator shows you the way out.\n\n📊 Avalanche vs Snowball methods\n💵 See exactly how much interest you're paying\n🚀 Find your fastest path to freedom\n\n🔥 Crush your debt!`,
    url: `${SITE_URL}/debt-destroyer`,
    ogPage: 'debt-destroyer',
    trackingFeature: 'side-hustle',
  },
  sideHustle: {
    title: 'Side Hustle Ideas',
    shareText: `💰 50+ side hustles ranked by PROFIT:\n\n🔥 Reselling, flipping, digital products\n📊 Real profit calculators\n📚 Step-by-step guides for each\n\n🚀 Find your perfect money maker!`,
    url: `${SITE_URL}/side-hustle`,
    ogPage: 'side-hustle',
    trackingFeature: 'side-hustle',
  },
  affiliate: {
    title: 'Get Paid to Share',
    shareText: `💎 Get PAID to share viral wealth content!\n\n💵 $1-2 per signup\n📈 No cap on earnings\n🚀 One viral TikTok = $39,000\n\n👑 Join the Mogul Movement!`,
    url: `${SITE_URL}/become-affiliate`,
    ogPage: 'affiliate',
    trackingFeature: 'affiliate',
  },
  compare: {
    title: 'Celebrity Compare',
    shareText: `⚔️ Who earns more? Compare any two celebrities!\n\n💰 Mind-blowing earnings differences\n📊 Real-time data\n🔥 Prepare to be shocked\n\n🏆 Pick your winner!`,
    url: `${SITE_URL}/compare`,
    ogPage: 'compare',
    trackingFeature: 'compare',
  },
  mogulAcademy: {
    title: 'Mogul Academy',
    shareText: `🎓 FREE financial education that actually makes sense!\n\n📈 Stocks, compound interest, ROI explained\n💡 Written at a 5th-grade level\n📚 Lessons rotate weekly\n\n🚀 Level up your money IQ!`,
    url: `${SITE_URL}/mogul-academy`,
    ogPage: 'mogul-academy',
    trackingFeature: 'mogul-academy',
  },
};

interface FeaturePromoShareProps {
  feature: 'trades' | 'mogulMarkets' | 'vipPortfolios' | 'wealthQuiz' | 'realityCheck' | 'debtDestroyer' | 'sideHustle' | 'affiliate' | 'compare' | 'mogulAcademy';
  size?: 'sm' | 'default';
  showLabel?: boolean;
  variant?: 'ghost' | 'outline' | 'default';
}

const FeaturePromoShare = ({ 
  feature, 
  size = 'sm', 
  showLabel = false,
  variant = 'ghost'
}: FeaturePromoShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const content = PROMO_CONTENT[feature];
  if (!content) return null;

  // Get the OG-optimized URL for social sharing
  const ogUrl = getShareUrl(content.ogPage);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        trackShareEvent(content.trackingFeature, 'native', 'link');
        await navigator.share({
          title: content.title,
          text: content.shareText,
          url: ogUrl, // Use OG URL for rich previews
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    trackShareEvent(content.trackingFeature, 'whatsapp', 'link');
    const url = `https://wa.me/?text=${encodeURIComponent(content.shareText + '\n\n' + ogUrl)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    trackShareEvent(content.trackingFeature, 'twitter', 'link');
    // Twitter/X uses the URL for OG previews
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.shareText)}&url=${encodeURIComponent(ogUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    trackShareEvent(content.trackingFeature, 'facebook', 'link');
    // Facebook scrapes the URL for OG tags
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    trackShareEvent(content.trackingFeature, 'linkedin', 'link');
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleInstagramShare = () => {
    trackShareEvent(content.trackingFeature, 'instagram', 'text');
    handleCopyText();
    toast.success('Text copied! Open Instagram and paste in your story or post.');
  };

  const handleTikTokShare = () => {
    trackShareEvent(content.trackingFeature, 'tiktok', 'text');
    handleCopyText();
    toast.success('Text copied! Open TikTok and paste in your video caption.');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(content.shareText + '\n\n' + ogUrl);
      trackShareEvent(content.trackingFeature, 'copy', 'text');
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const isSmall = size === 'sm';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`relative overflow-hidden flex items-center justify-center gap-1.5
            bg-gradient-to-r from-amber-500/20 to-yellow-500/10 
            border border-amber-500/40 
            hover:from-amber-500/30 hover:to-yellow-500/20 
            hover:border-amber-400/60 
            hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] 
            transition-all duration-300
            ${isSmall ? (showLabel ? 'h-8 px-3' : 'h-8 w-8 min-w-8 p-0') : (showLabel ? 'h-9 px-4' : 'h-9 w-9 min-w-9 p-0')}`
          }
        >
          <Sparkles className={`text-amber-500 shrink-0 ${isSmall ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          {showLabel && <span className="text-amber-500 font-medium text-xs">Share</span>}
        </Button>
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
  );
};

export default FeaturePromoShare;
