import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getShareUrl } from '@/lib/shareUrls';

// Social media icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface InviteFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteFriendsModal = ({ open, onOpenChange }: InviteFriendsModalProps) => {
  const [copied, setCopied] = useState(false);
  // Use OG-optimized URL for social sharing (serves proper meta tags to crawlers)
  const ogShareUrl = getShareUrl('home');
  const displayUrl = 'https://earningsexplorer.shop';
  const shareText = "🤑 Ever wonder how much celebrities REALLY make? Check out Wealth Perspective - it shows mind-blowing earnings comparisons!";

  const handleCopy = async () => {
    try {
      // Copy the OG-optimized URL for better social previews
      await navigator.clipboard.writeText(ogShareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogShareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogShareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + ogShareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wealth Perspective',
          text: shareText,
          url: ogShareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            Invite Friends
          </DialogTitle>
          <DialogDescription>
            Share Wealth Perspective with your friends and blow their minds with celebrity earnings!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Share Link</label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={displayUrl}
                className="bg-muted/50"
              />
              <Button onClick={handleCopy} variant="outline" className="shrink-0">
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                className="flex items-center gap-2 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50"
              >
                <TwitterIcon />
                Twitter / X
              </Button>
              <Button
                variant="outline"
                onClick={handleFacebookShare}
                className="flex items-center gap-2 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50"
              >
                <FacebookIcon />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 hover:bg-[#25D366]/10 hover:border-[#25D366]/50"
              >
                <WhatsAppIcon />
                WhatsApp
              </Button>
              {typeof navigator !== 'undefined' && navigator.share && (
                <Button
                  variant="outline"
                  onClick={handleNativeShare}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  More...
                </Button>
              )}
            </div>
          </div>

          {/* Fun message */}
          <p className="text-xs text-center text-muted-foreground">
            💰 Warning: May cause extreme salary envy and existential reflection
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendsModal;
