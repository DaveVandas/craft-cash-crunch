import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { formatCompactCurrency, calculateTimeToEarn } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Share2, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface RealityCheckShareCardProps {
  userSalary: number;
  celebrityName: string;
  celebrityAnnualEarnings: number;
  celebrityProfession?: string;
  celebrityImageUrl?: string;
}

const RealityCheckShareCard = ({ 
  userSalary, 
  celebrityName, 
  celebrityAnnualEarnings,
  celebrityProfession,
  celebrityImageUrl
}: RealityCheckShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const timeToEarnUserSalary = calculateTimeToEarn(userSalary, celebrityAnnualEarnings);
  const ratio = Math.round(celebrityAnnualEarnings / userSalary);

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
    const appUrl = window.location.origin;
    const text = `💭 Reality Check\n\n${celebrityName} earns my yearly salary in just ${timeToEarnUserSalary}! 😱\n\nThey make ${ratio.toLocaleString()}x what I make.\n\nCheck your earnings at ${appUrl}`;

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

    if (navigator.share) {
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
      {/* Shareable Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-1"
        style={{
          background: 'linear-gradient(135deg, #d4af37, #f5d779, #d4af37, #b8860b)',
        }}
      >
        <div className="rounded-xl bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] p-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">💭</span>
            <span className="font-serif text-lg font-bold text-amber-400">
              Reality Check
            </span>
          </div>

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

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-amber-500/20">
            <p className="text-gray-500 text-xs">{window.location.host}</p>
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
