import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, formatCurrency, calculateEarningsBreakdown, calculateTimeToEarn, generateComparisons } from '@/lib/earnings';
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
  const formatted1 = formatCompactCurrency(person1.annualEarnings);
  const formatted2 = formatCompactCurrency(person2.annualEarnings);
  const isTie =
    (minEarnings > 0 && maxEarnings / minEarnings <= 1.05) ||
    formatted1 === formatted2;
  
  const winner = person1.annualEarnings >= person2.annualEarnings ? person1 : person2;
  const loser = person1.annualEarnings >= person2.annualEarnings ? person2 : person1;
  const ratio = loser.annualEarnings > 0 ? winner.annualEarnings / loser.annualEarnings : 0;
  const timeToEarn = calculateTimeToEarn(loser.annualEarnings, winner.annualEarnings);
  
  // Calculate the EXTRA income (difference between winner and loser)
  const extraIncome = winner.annualEarnings - loser.annualEarnings;
  const extraBreakdown = calculateEarningsBreakdown(extraIncome);
  
  // Get what the winner can buy with just the EXTRA income
  const extraComparisons = generateComparisons(extraIncome);
  // Pick the most impressive one for the flex
  const flexComparison = extraComparisons.find(c => 
    c.item.includes('Private Jet') || c.item.includes('Superyacht') || c.item.includes('Bugatti') || c.item.includes('Mansion')
  ) || extraComparisons.find(c => c.quantity >= 1 && c.quantity <= 50) || extraComparisons[0];

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
    const flexText = flexComparison 
      ? `${flexComparison.emoji} With just the EXTRA income, ${winner.name} buys ${flexComparison.quantity} ${flexComparison.item} ${flexComparison.timeframe}` 
      : '';
    
    const text = isTie
      ? `💰 Wealth Showdown: ${person1.name} vs ${person2.name}\n\n🤝 It's a Draw!\n📊 Both earn approximately ${formatCompactCurrency(person1.annualEarnings)}/year\n\nCompare celebrity earnings at earningsexplorer.shop`
      : `💰 Wealth Showdown: ${winner.name} vs ${loser.name}\n\n👑 Winner: ${winner.name}\n📊 Earns ${ratio.toFixed(1)}x more\n💸 Extra income: ${formatCompactCurrency(extraIncome)}/year\n⏱️ Makes ${loser.name}'s yearly salary in ${timeToEarn}\n${flexText ? `\n${flexText}` : ''}\n\nCompare celebrity earnings at earningsexplorer.shop`;

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

        const file = new File([blob], 'wealth-showdown.png', { type: 'image/png' });
        const shareData: ShareData & { files?: File[] } = {
          title: 'Wealth Showdown',
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
          a.download = 'wealth-showdown.png';
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
        // User cancelled or error - fall through to clipboard
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
        <div className="rounded-xl bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] p-5">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl">💎</span>
            <span className="font-serif text-base font-bold text-amber-400">
              Wealth Showdown
            </span>
          </div>

          {/* VS Layout */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Person 1 */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <Avatar className="h-16 w-16 mx-auto ring-2 ring-amber-500/50 shadow-lg">
                  <AvatarImage src={person1.imageUrl} alt={person1.name} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-amber-900/50 to-amber-800/30">
                    {person1.emoji || getAvatarEmoji(person1.profession)}
                  </AvatarFallback>
                </Avatar>
                {!isTie && person1 === winner && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="h-6 w-6 text-amber-400 fill-amber-400 drop-shadow-lg" />
                  </div>
                )}
              </div>
              <p className="font-bold text-white mt-2 text-xs truncate max-w-[90px] mx-auto">{person1.name}</p>
              <p className="text-[10px] text-amber-400 font-mono">
                {formatCompactCurrency(person1.annualEarnings)}/yr
              </p>
            </div>

            {/* VS */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xs">VS</span>
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <Avatar className="h-16 w-16 mx-auto ring-2 ring-amber-500/50 shadow-lg">
                  <AvatarImage src={person2.imageUrl} alt={person2.name} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-amber-900/50 to-amber-800/30">
                    {person2.emoji || getAvatarEmoji(person2.profession)}
                  </AvatarFallback>
                </Avatar>
                {!isTie && person2 === winner && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="h-6 w-6 text-amber-400 fill-amber-400 drop-shadow-lg" />
                  </div>
                )}
              </div>
              <p className="font-bold text-white mt-2 text-xs truncate max-w-[90px] mx-auto">{person2.name}</p>
              <p className="text-[10px] text-amber-400 font-mono">
                {formatCompactCurrency(person2.annualEarnings)}/yr
              </p>
            </div>
          </div>

          {/* Result Section */}
          {isTie ? (
            <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 rounded-lg p-3 border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Equal className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 font-bold text-sm">IT'S A DRAW!</span>
                <Equal className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-white text-center text-xs">
                Both earn approximately <span className="text-amber-400 font-bold">{formatCompactCurrency(person1.annualEarnings)}/yr</span>
              </p>
            </div>
          ) : (
            <>
              {/* Winner Declaration */}
              <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 rounded-lg p-3 border border-amber-500/30 mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 font-bold text-sm">{winner.name} WINS</span>
                  <Trophy className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-white text-center text-xs mb-1">
                  Earns <span className="text-amber-400 font-bold">{ratio.toFixed(1)}x</span> more than {loser.name}
                </p>
                <p className="text-gray-400 text-center text-[10px]">
                  Makes {loser.name}'s yearly salary in just <span className="text-amber-400 font-bold">{timeToEarn}</span>
                </p>
              </div>

              {/* The Extra Income Flex - What winner can do with the difference */}
              <div className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/20 to-emerald-900/40 rounded-lg p-3 border border-emerald-500/30">
                <p className="text-emerald-400 text-[10px] uppercase tracking-wide text-center mb-2">
                  💸 With just the extra <span className="font-bold">{formatCompactCurrency(extraIncome)}/yr</span>
                </p>
                {flexComparison ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{flexComparison.emoji}</span>
                    <div className="text-center">
                      <p className="text-white text-sm">
                        <span className="text-emerald-400 font-bold">{flexComparison.quantity}</span>{' '}
                        {flexComparison.item}
                      </p>
                      <p className="text-emerald-400 text-xs font-bold">{flexComparison.timeframe}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white text-xs text-center">
                    {winner.name} pockets <span className="text-emerald-400 font-bold">{formatCurrency(extraBreakdown.perHour)}</span> more per hour
                  </p>
                )}
                <p className="text-gray-500 text-[9px] text-center mt-2 italic">
                  ...that {loser.name} can only dream about 😅
                </p>
              </div>
            </>
          )}

          {/* Branding Footer */}
          <div className="text-center mt-4 pt-2 border-t border-amber-500/20">
            <p className="text-gray-600 text-[10px]">earningsexplorer.shop</p>
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
