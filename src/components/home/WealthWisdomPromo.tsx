import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, ArrowRight, MessageCircle, Copy } from 'lucide-react';
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

const SITE_URL = "https://earningsexplorer.shop";

const WealthWisdomPromo = () => {
  const shareText = `📚 Weekly rags-to-riches stories from billionaires who started with nothing.\n\n🔥 Read their journeys at ${SITE_URL}/wealth-wisdom`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wealth Wisdom',
          text: shareText,
          url: `${SITE_URL}/wealth-wisdom`,
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
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/wealth-wisdom`)}&quote=${encodeURIComponent('📚 Weekly rags-to-riches stories from billionaires')}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/wealth-wisdom`)}`;
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
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-amber-500/5 p-4 md:p-5 overflow-hidden" data-tour="wealth-wisdom">
      <div className="absolute top-2 right-4 text-3xl opacity-20">📚</div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-lg font-bold">Wealth Wisdom</h3>
              <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                New
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Weekly rags-to-riches stories from billionaires who started with nothing.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PremiumShareIconButton iconOnly />
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
          
          <Button asChild size="sm" className="group flex-1 sm:flex-initial">
            <Link to="/wealth-wisdom">
              Read Story
              <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WealthWisdomPromo;
