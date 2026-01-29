import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { formatCompactCurrency, calculateTimeToEarn } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Share2, TrendingDown, Skull, Flame, Copy, MessageCircle, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Social media icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface RealityCheckShareCardProps {
  userSalary: number;
  celebrityName: string;
  celebrityAnnualEarnings: number;
  celebrityProfession?: string;
  celebrityImageUrl?: string;
}

// Brutal comparisons for "Kick Me While I'm Down" mode
const getBrutalComparisons = (userSalary: number, celebrityAnnualEarnings: number, celebrityName: string) => {
  const secondsPerYear = 365.25 * 24 * 60 * 60;
  const perSecond = celebrityAnnualEarnings / secondsPerYear;
  const ratio = celebrityAnnualEarnings / userSalary;
  
  const comparisons = [
    {
      text: `${celebrityName} makes your rent while brushing their teeth`,
      detail: "Every. Single. Morning.",
    },
    {
      text: `Your life savings? That's ${celebrityName}'s bathroom break money`,
      detail: "Literally pocket change.",
    },
    {
      text: `${celebrityName} earns your monthly paycheck during one sneeze`,
      detail: "Bless you... I guess?",
    },
    {
      text: `While you stress about bills, ${celebrityName} accidentally makes your salary`,
      detail: "Without even noticing.",
    },
    {
      text: `${celebrityName}'s accountant earns more than you just counting their money`,
      detail: "The irony hurts.",
    },
  ];
  
  // Pick based on ratio for variety
  return comparisons[Math.floor(ratio) % comparisons.length];
};

const RealityCheckShareCard = ({ 
  userSalary, 
  celebrityName, 
  celebrityAnnualEarnings,
  celebrityProfession,
  celebrityImageUrl
}: RealityCheckShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [brutalMode, setBrutalMode] = useState(false);

  const timeToEarnUserSalary = calculateTimeToEarn(userSalary, celebrityAnnualEarnings);
  const ratio = Math.round(celebrityAnnualEarnings / userSalary);
  const brutalComparison = getBrutalComparisons(userSalary, celebrityAnnualEarnings, celebrityName);
  
  // Calculate some brutal stats
  const secondsPerYear = 365.25 * 24 * 60 * 60;
  const perSecond = celebrityAnnualEarnings / secondsPerYear;
  const yearsToMatch = Math.round(celebrityAnnualEarnings / userSalary);

  const getShareText = () => {
    const url = 'https://earningsexplorer.shop/calculator';
    return brutalMode
      ? `💀 Kick Me While I'm Down\n\n${brutalComparison.text}\n${brutalComparison.detail}\n\n${celebrityName} makes ${ratio.toLocaleString()}x what I make.\n\nCheck yours: ${url}`
      : `💭 Reality Check\n\n${celebrityName} earns my yearly salary in just ${timeToEarnUserSalary}! 😱\n\nThey make ${ratio.toLocaleString()}x what I make.\n\nCheck your earnings: ${url}`;
  };


  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.92);
      });
    } catch (_err) {
      return null;
    }
  };

  const handleCopyLink = async () => {
    try {
      const text = getShareText();
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!', {
        description: 'Paste it anywhere to share',
      });
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleTwitterShare = async () => {
    // Twitter doesn't support image upload via URL, just share text with link
    const text = getShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url = 'https://earningsexplorer.shop/calculator';
    const text = getShareText();
    // Facebook Feed Dialog allows both URL and quote text
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const text = getShareText();
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = 'https://earningsexplorer.shop/calculator';
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  // Helper: detect iOS
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Helper: detect mobile
  const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Helper: check if can share files
  const canShareFiles = async (file: File): Promise<boolean> => {
    if (!navigator.share || !navigator.canShare) return false;
    try {
      return navigator.canShare({ files: [file] });
    } catch {
      return false;
    }
  };

  // Helper: download fallback
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleSaveImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      const imageBlob = await generateCardImage();
      if (!imageBlob) {
        toast.error('Failed to generate image');
        return;
      }

      const filename = `reality-check-${celebrityName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      const file = new File([imageBlob], filename, { type: 'image/jpeg' });

      // ALWAYS try native share sheet first - this is the only way to "Save to Photos"
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Reality Check', files: [file] });
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          // Share API failed, falling back to download
        }
      }

      // Fallback to download
      triggerDownload(imageBlob, filename);
      
      if (isMobile()) {
        if (isIOS()) {
          toast.info('Image saved to Files', {
            description: 'To save to Photos: Open Files app → Downloads → Tap image → Tap share icon → "Save Image"',
            duration: 8000,
          });
        } else {
          toast.success('Image downloaded!', {
            description: 'Check your Downloads folder',
          });
        }
      } else {
        toast.success('Image saved!', {
          description: 'Check your downloads folder',
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('Failed to save image');
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTextShare = async () => {
    setIsGeneratingImage(true);
    
    try {
      const imageBlob = await generateCardImage();
      const text = getShareText();
      const shareTitle = brutalMode ? 'Kick Me While I\'m Down' : 'Reality Check';
      
      // Mobile: try native share
      if (navigator.share) {
        // Try with image first
        if (imageBlob) {
          const file = new File([imageBlob], 'reality-check.jpg', { type: 'image/jpeg' });
          
          if (await canShareFiles(file)) {
            try {
              await navigator.share({
                title: shareTitle,
                text,
                files: [file],
              });
              return; // Success
            } catch (err) {
              if ((err as Error).name === 'AbortError') return;
              // Share with file failed, trying without
            }
          }
        }
        
        // Try share without image
        try {
          await navigator.share({
            title: shareTitle,
            text,
          });
          return; // Success
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          // Share without file failed, using clipboard
        }
      }
      
      // Desktop/fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!', {
          description: 'Paste it in your text message',
        });
      } catch {
        // Final fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success('Copied to clipboard!');
        } catch {
          toast.error('Could not share. Please copy the link manually.');
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('handleTextShare error:', err);
      if ((err as Error).name !== 'AbortError') {
        toast.error('Failed to share');
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle - Centered */}
      <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
        <Label htmlFor="brutal-mode" className="text-sm text-muted-foreground cursor-pointer">
          Standard
        </Label>
        <Switch
          id="brutal-mode"
          checked={brutalMode}
          onCheckedChange={setBrutalMode}
          className="data-[state=checked]:bg-red-500"
        />
        <Label 
          htmlFor="brutal-mode" 
          className={`text-sm cursor-pointer flex items-center gap-1 ${brutalMode ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}
        >
          <Skull className={`h-4 w-4 ${brutalMode ? 'text-red-500' : ''}`} />
          Kick Me While I'm Down
        </Label>
      </div>

      {/* Shareable Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-1"
        style={{
          background: brutalMode 
            ? 'linear-gradient(135deg, #dc2626, #f97316, #dc2626, #991b1b)'
            : 'linear-gradient(135deg, #d4af37, #f5d779, #d4af37, #b8860b)',
        }}
      >
        <div className={`rounded-xl p-6 ${
          brutalMode 
            ? 'bg-gradient-to-br from-[#1a0505] via-[#1f0a0a] to-[#0a0a0a]'
            : 'bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {brutalMode ? (
              <>
                <Skull className="h-6 w-6 text-red-500" />
                <span className="font-serif text-lg font-bold text-red-400">
                  Kick Me While I'm Down
                </span>
                <Skull className="h-6 w-6 text-red-500" />
              </>
            ) : (
              <>
                <span className="text-2xl">💭</span>
                <span className="font-serif text-lg font-bold text-amber-400">
                  Reality Check
                </span>
              </>
            )}
          </div>

          {brutalMode ? (
            /* Brutal Mode Content */
            <>
              {/* Celebrity with flames */}
              <div className="flex flex-col items-center mb-6 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                  <Flame className="h-6 w-6 text-red-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <Avatar className="h-20 w-20 ring-2 ring-red-500/50 shadow-lg shadow-red-500/20">
                  <AvatarImage src={celebrityImageUrl} alt={celebrityName} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-red-900/50 to-red-800/30">
                    {getAvatarEmoji(celebrityProfession || '')}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-white mt-3 text-lg">{celebrityName}</p>
                <p className="text-red-400 font-mono text-xs mt-1">
                  {formatCompactCurrency(celebrityAnnualEarnings)}/year
                </p>
              </div>

              {/* Brutal Stat */}
              <div className="bg-gradient-to-r from-red-900/40 via-orange-900/30 to-red-900/40 rounded-lg p-5 border border-red-500/40 text-center mb-4">
                <p className="text-white font-bold text-lg leading-tight mb-2">
                  {brutalComparison.text}
                </p>
                <p className="text-red-400 text-sm italic">
                  {brutalComparison.detail}
                </p>
              </div>

              {/* Three column brutal stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/20">
                  <p className="text-red-400 font-bold text-sm">{formatCompactCurrency(perSecond)}</p>
                  <p className="text-gray-500 text-[10px]">per second</p>
                </div>
                <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/20">
                  <p className="text-red-400 font-bold text-sm">{ratio.toLocaleString()}x</p>
                  <p className="text-gray-500 text-[10px]">your salary</p>
                </div>
                <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/20">
                  <p className="text-red-400 font-bold text-sm">{yearsToMatch.toLocaleString()}</p>
                  <p className="text-gray-500 text-[10px]">yrs to match</p>
                </div>
              </div>

              {/* Brutal message */}
              <div className="text-center mt-4 py-3 border-t border-red-500/20">
                <p className="text-gray-400 text-xs italic">
                  "Thanks, I hate it." 🥲
                </p>
              </div>
            </>
          ) : (
            /* Standard Mode Content */
            <>
              {/* Celebrity Section */}
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 ring-2 ring-amber-500/50 shadow-lg">
                  <AvatarImage src={celebrityImageUrl} alt={celebrityName} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-amber-900/50 to-amber-800/30">
                    {getAvatarEmoji(celebrityProfession || '')}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-white mt-3 text-lg">{celebrityName}</p>
                <p className="text-amber-400 font-mono text-sm">
                  {formatCompactCurrency(celebrityAnnualEarnings)}/year
                </p>
              </div>

              {/* Comparison Stats */}
              <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 rounded-lg p-4 border border-amber-500/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-400 font-bold">VS MY SALARY</span>
                </div>
                
                <div className="space-y-3 text-center">
                  <div>
                    <p className="text-gray-400 text-xs">They earn my yearly salary in</p>
                    <p className="text-amber-400 font-bold text-2xl">{timeToEarnUserSalary}</p>
                  </div>
                  
                  <div className="border-t border-amber-500/20 pt-3">
                    <p className="text-gray-400 text-xs">They make</p>
                    <p className="text-white font-bold text-xl">
                      <span className="text-amber-400">{ratio.toLocaleString()}x</span> what I make
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-amber-500/20">
            <p className="text-gray-500 text-xs">earningsexplorer.shop</p>
          </div>
        </div>
      </div>

      {/* Share Menu */}
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="w-full max-w-xs bg-gradient-to-r from-primary to-primary/80"
              disabled={isGeneratingImage}
            >
              {isGeneratingImage ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Share Result
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem onClick={handleTextShare} className="cursor-pointer">
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
            <DropdownMenuItem onClick={handleSaveImage} className="cursor-pointer">
              <Image className="h-4 w-4" />
              <span className="ml-2">Save to Photos</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <Copy className="h-4 w-4" />
              <span className="ml-2">Copy Text</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default RealityCheckShareCard;
