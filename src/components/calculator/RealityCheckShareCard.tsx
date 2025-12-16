import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { formatCompactCurrency, calculateTimeToEarn } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Share2, TrendingDown, Skull, Flame } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `reality-check-vs-${celebrityName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Card downloaded!');
    } catch (error) {
      toast.error('Failed to generate image');
    }
  };

  const handleShare = async () => {
    const text = `💭 Reality Check\n\n${celebrityName} earns my yearly salary in just ${timeToEarnUserSalary}! 😱\n\nThey make ${ratio.toLocaleString()}x what I make.\n\nCheck your earnings with Wealth Perspective`;

    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

    try {
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          logging: false,
        });

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create image blob'));
          }, 'image/png');
        });

        const file = new File([blob], 'reality-check.png', { type: 'image/png' });
        const shareData: ShareData & { files?: File[] } = {
          title: 'Reality Check',
          text,
          files: [file],
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast.success('Shared card image!');
          return;
        }

        if (isMobile) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reality-check.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Card saved! Share it from your photos/gallery.');
          return;
        }
      }
    } catch (err) {
      // Fall through to text/clipboard share
    }

  if (navigator.share && !isMobile) {
    try {
      await navigator.share({ text });
      toast.success('Shared successfully!');
      return;
    } catch (err) {
      // User cancelled
    }
  }

    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} className="flex-1" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={handleShare} className="flex-1 bg-gradient-to-r from-primary to-primary/80">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default RealityCheckShareCard;
