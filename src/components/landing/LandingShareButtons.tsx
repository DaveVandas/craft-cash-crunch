import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { toast } from 'sonner';

interface LandingShareButtonsProps {
  shareText?: string;
  shareUrl?: string;
}

const LandingShareButtons = ({
  shareText = "🔥 Ever wonder how fast billionaires make money? This app is eye-opening!",
  shareUrl = "https://earningsexplorer.shop"
}: LandingShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wealth Perspective',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
          <Share2 className="mr-2 h-4 w-4" />
          Share...
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
          <Facebook className="mr-2 h-4 w-4" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="mr-2 h-4 w-4" />
          )}
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LandingShareButtons;
