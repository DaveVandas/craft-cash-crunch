import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, calculateTimeToEarn } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Download, Share2, Crown, Trophy, Equal } from 'lucide-react';
import { toast } from 'sonner';

interface CompareShareCardProps {
  person1: Celebrity;
  person2: Celebrity;
}

const CompareShareCard = ({ person1, person2 }: CompareShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const maxEarnings = Math.max(person1.annualEarnings, person2.annualEarnings);
  const minEarnings = Math.min(person1.annualEarnings, person2.annualEarnings);
  const isTie = minEarnings > 0 && (maxEarnings / minEarnings) < 1.05;
  
  const winner = person1.annualEarnings >= person2.annualEarnings ? person1 : person2;
  const loser = person1.annualEarnings >= person2.annualEarnings ? person2 : person1;
  const ratio = winner.annualEarnings / loser.annualEarnings;
  const timeToEarn = calculateTimeToEarn(loser.annualEarnings, winner.annualEarnings);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `wealth-showdown-${person1.name.replace(/\s+/g, '-')}-vs-${person2.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Card downloaded!');
    } catch (error) {
      toast.error('Failed to generate image');
    }
  };

  const handleShare = async () => {
    const text = isTie
      ? `💰 Wealth Showdown: ${person1.name} vs ${person2.name}\n\n🤝 It's a Draw!\n📊 Both earn approximately ${formatCompactCurrency(person1.annualEarnings)}/year\n\nCheck your earnings at wealthperspective.app`
      : `💰 Wealth Showdown: ${winner.name} vs ${loser.name}\n\n👑 Winner: ${winner.name}\n📊 ${winner.name} earns ${ratio.toFixed(1)}x more!\n⏱️ ${winner.name} makes ${loser.name}'s yearly salary in just ${timeToEarn}\n\nCheck your earnings at wealthperspective.app`;

    // Try to share the image on mobile
    if (cardRef.current && navigator.canShare) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          logging: false,
        });
        
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
        
        const file = new File([blob], `wealth-showdown.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Wealth Showdown',
            text,
          });
          toast.success('Shared successfully!');
          return;
        }
      } catch (err) {
        // Fall through to text share or clipboard
      }
    }
    
    // Fallback: try text share (mobile) or clipboard (desktop)
    if (navigator.share) {
      try {
        await navigator.share({ text });
        toast.success('Shared successfully!');
        return;
      } catch (err) {
        // User cancelled or error - fall through to clipboard
      }
    }
    
    // Final fallback: copy to clipboard
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
            <span className="text-2xl">💎</span>
            <span className="font-serif text-lg font-bold text-amber-400">
              Wealth Showdown
            </span>
          </div>

          {/* VS Layout */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Person 1 */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <Avatar className="h-20 w-20 mx-auto ring-2 ring-amber-500/50 shadow-lg">
                  <AvatarImage src={person1.imageUrl} alt={person1.name} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-amber-900/50 to-amber-800/30">
                    {getAvatarEmoji(person1.profession)}
                  </AvatarFallback>
                </Avatar>
                {!isTie && person1 === winner && (
                  <div className="absolute -top-3 -right-3">
                    <Crown className="h-8 w-8 text-amber-400 fill-amber-400 drop-shadow-lg" />
                  </div>
                )}
              </div>
              <p className="font-bold text-white mt-2 text-sm">{person1.name}</p>
              <p className="text-xs text-amber-400 font-mono">
                {formatCompactCurrency(person1.annualEarnings)}/yr
              </p>
            </div>

            {/* VS */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-sm">VS</span>
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <Avatar className="h-20 w-20 mx-auto ring-2 ring-amber-500/50 shadow-lg">
                  <AvatarImage src={person2.imageUrl} alt={person2.name} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-amber-900/50 to-amber-800/30">
                    {getAvatarEmoji(person2.profession)}
                  </AvatarFallback>
                </Avatar>
                {!isTie && person2 === winner && (
                  <div className="absolute -top-3 -right-3">
                    <Crown className="h-8 w-8 text-amber-400 fill-amber-400 drop-shadow-lg" />
                  </div>
                )}
              </div>
              <p className="font-bold text-white mt-2 text-sm">{person2.name}</p>
              <p className="text-xs text-amber-400 font-mono">
                {formatCompactCurrency(person2.annualEarnings)}/yr
              </p>
            </div>
          </div>

          {/* Result Section */}
          {isTie ? (
            <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 rounded-lg p-4 border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Equal className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-bold">IT'S A DRAW!</span>
                <Equal className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-white text-center text-sm">
                Both earn approximately
              </p>
              <p className="text-amber-400 text-center font-bold text-lg mt-1">
                {formatCompactCurrency(person1.annualEarnings)}/yr
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 rounded-lg p-4 border border-amber-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-400 font-bold">WINNER</span>
                </div>
                <p className="text-white text-center font-serif text-lg">{winner.name}</p>
                <p className="text-amber-400 text-center text-sm mt-1">
                  earns <span className="font-bold">{ratio.toFixed(1)}x</span> more
                </p>
              </div>

              {/* Key Stat */}
              <div className="text-center mt-4">
                <p className="text-gray-400 text-xs">
                  {winner.name} makes {loser.name}'s yearly salary in
                </p>
                <p className="text-amber-400 font-bold text-xl">{timeToEarn}</p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-amber-500/20">
            <p className="text-gray-500 text-xs">wealthperspective.app</p>
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

export default CompareShareCard;
