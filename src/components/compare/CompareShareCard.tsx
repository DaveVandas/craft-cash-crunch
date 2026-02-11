import { useRef, useState, useEffect } from 'react';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, formatCurrency, calculateEarningsBreakdown, calculateTimeToEarn, generateComparisons } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Trophy, Equal, Flame } from 'lucide-react';
import ShareCardDecorations from '@/components/share/ShareCardDecorations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useShareCard } from '@/hooks/useShareCard';
import ShareMenuDropdown from '@/components/share/ShareMenuDropdown';

interface CompareShareCardProps {
  person1: Celebrity;
  person2: Celebrity;
}

const CompareShareCard = ({ person1, person2 }: CompareShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [flexMode, setFlexMode] = useState(false);

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
  
  // Pick different comparisons for normal vs flex mode
  const normalFlex = extraComparisons.find(c => 
    c.item.includes('Lamborghini') || c.item.includes('Rolex') || c.item.includes('Ferrari')
  ) || extraComparisons.find(c => c.quantity >= 1 && c.quantity <= 50) || extraComparisons[0];
  
  // For flex mode, get multiple dramatic comparisons
  const flexComparisons = extraComparisons
    .filter(c => c.quantity >= 1)
    .sort((a, b) => {
      // Prioritize expensive items with reasonable quantities
      const priceA = a.item.includes('Jet') ? 5 : a.item.includes('Yacht') ? 4 : a.item.includes('Bugatti') ? 3 : 1;
      const priceB = b.item.includes('Jet') ? 5 : b.item.includes('Yacht') ? 4 : b.item.includes('Bugatti') ? 3 : 1;
      return priceB - priceA;
    })
    .slice(0, 3);

  const getShareText = () => {
    // Keep short to avoid truncation in messaging apps
    if (isTie) {
      return `🤝 ${person1.name} vs ${person2.name} - It's a Draw!`;
    }
    
    if (flexMode) {
      return `🔥 ${winner.name} earns ${ratio.toFixed(1)}x more than ${loser.name}!`;
    }
    
    return `💰 ${winner.name} vs ${loser.name}: ${ratio.toFixed(1)}x earnings difference!`;
  };

  const shareUrl = 'https://earningsexplorer.shop/compare';
  const imageName = `wealth-showdown-${flexMode ? 'flex-' : ''}${person1.name.replace(/\s+/g, '-')}-vs-${person2.name.replace(/\s+/g, '-')}`;

  const {
    isGeneratingImage,
    isPreGenerating,
    handleMenuOpen,
    handleCopyLink,
    handleTwitterShare,
    handleFacebookShare,
    handleWhatsAppShare,
    handleLinkedInShare,
    handleSaveImage,
    handleTextShare,
    handleInstagramShare,
    handleTikTokShare,
    clearPreGeneratedImage,
  } = useShareCard({
    cardRef: cardRef as React.RefObject<HTMLDivElement>,
    shareText: getShareText(),
    shareUrl,
    imageName,
    title: flexMode ? 'Wealth Showdown - FLEX MODE' : 'Wealth Showdown',
  });

  // Clear pre-generated image when flex mode changes so we regenerate the correct version
  useEffect(() => {
    clearPreGeneratedImage();
  }, [flexMode, clearPreGeneratedImage]);

  return (
    <div className="space-y-4">
      {/* Flex Mode Toggle */}
      {!isTie && (
        <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
          <Label htmlFor="flex-mode" className="text-sm text-muted-foreground cursor-pointer">
            Standard
          </Label>
          <Switch 
            id="flex-mode" 
            checked={flexMode} 
            onCheckedChange={setFlexMode}
          />
          <Label htmlFor="flex-mode" className={`text-sm cursor-pointer flex items-center gap-1 ${flexMode ? 'text-orange-400 font-semibold' : 'text-muted-foreground'}`}>
            <Flame className={`h-4 w-4 ${flexMode ? 'text-orange-400' : ''}`} />
            Flex Mode
          </Label>
        </div>
      )}

      {/* Shareable Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-1"
        style={{
          background: flexMode 
            ? 'linear-gradient(135deg, #f97316, #ea580c, #f97316, #c2410c)' 
            : 'linear-gradient(135deg, #d4af37, #f5d779, #d4af37, #b8860b)',
        }}
      >
        <div className="relative rounded-xl bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] p-5">
          <ShareCardDecorations variant={flexMode ? 'orange' : 'gold'} />
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {flexMode ? (
              <>
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="font-serif text-base font-bold text-orange-400">
                  FLEX MODE
                </span>
                <Flame className="h-5 w-5 text-orange-400" />
              </>
            ) : (
              <>
                <span className="text-xl">💎</span>
                <span className="font-serif text-base font-bold text-amber-400">
                  Wealth Showdown
                </span>
              </>
            )}
          </div>

          {/* VS Layout */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Person 1 */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
              <Avatar className={`h-16 w-16 mx-auto ring-2 shadow-lg ${flexMode ? 'ring-orange-500/50' : 'ring-amber-500/50'}`}>
                  {person1.imageUrl ? (
                    <img 
                      src={person1.imageUrl} 
                      alt={person1.name} 
                      className="aspect-square h-full w-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        // Hide broken image so fallback shows
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <AvatarFallback className={`text-2xl bg-gradient-to-br ${flexMode ? 'from-orange-900/50 to-orange-800/30' : 'from-amber-900/50 to-amber-800/30'}`}>
                    {person1.emoji || getAvatarEmoji(person1.profession)}
                  </AvatarFallback>
                </Avatar>
                {!isTie && person1 === winner && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className={`h-6 w-6 drop-shadow-lg ${flexMode ? 'text-orange-400 fill-orange-400' : 'text-amber-400 fill-amber-400'}`} />
                  </div>
                )}
              </div>
              <p className="font-bold text-white mt-2 text-xs truncate max-w-[90px] mx-auto">{person1.name}</p>
              <p className={`text-[10px] font-mono ${flexMode ? 'text-orange-400' : 'text-amber-400'}`}>
                {formatCompactCurrency(person1.annualEarnings)}/yr
              </p>
            </div>

            {/* VS */}
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${flexMode ? 'bg-gradient-to-br from-orange-500 to-orange-700' : 'bg-gradient-to-br from-amber-500 to-amber-700'}`}>
                <span className="text-black font-bold text-xs">VS</span>
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
              <Avatar className={`h-16 w-16 mx-auto ring-2 shadow-lg ${flexMode ? 'ring-orange-500/50' : 'ring-amber-500/50'}`}>
                  {person2.imageUrl ? (
                    <img 
                      src={person2.imageUrl} 
                      alt={person2.name} 
                      className="aspect-square h-full w-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        // Hide broken image so fallback shows
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <AvatarFallback className={`text-2xl bg-gradient-to-br ${flexMode ? 'from-orange-900/50 to-orange-800/30' : 'from-amber-900/50 to-amber-800/30'}`}>
                    {person2.emoji || getAvatarEmoji(person2.profession)}
                  </AvatarFallback>
                </Avatar>
                {!isTie && person2 === winner && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className={`h-6 w-6 drop-shadow-lg ${flexMode ? 'text-orange-400 fill-orange-400' : 'text-amber-400 fill-amber-400'}`} />
                  </div>
                )}
              </div>
              <p className="font-bold text-white mt-2 text-xs truncate max-w-[90px] mx-auto">{person2.name}</p>
              <p className={`text-[10px] font-mono ${flexMode ? 'text-orange-400' : 'text-amber-400'}`}>
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
          ) : flexMode ? (
            /* FLEX MODE Content */
            <>
              {/* Winner Declaration - More Aggressive */}
              <div className="bg-gradient-to-r from-orange-900/40 via-orange-800/20 to-orange-900/40 rounded-lg p-3 border border-orange-500/40 mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-orange-400" />
                  <span className="text-orange-400 font-bold text-base">{winner.name}</span>
                  <Trophy className="h-5 w-5 text-orange-400" />
                </div>
                <p className="text-white text-center text-sm font-bold">
                  DOMINATES by <span className="text-orange-400">{ratio.toFixed(1)}x</span>
                </p>
                
                {/* Key Stats Row */}
                <div className="flex justify-center gap-4 mt-2 pt-2 border-t border-orange-500/30">
                  <div className="text-center">
                    <p className="text-orange-400 text-[10px] uppercase">Net Worth</p>
                    <p className="text-white text-sm font-bold">{formatCompactCurrency(winner.netWorth)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-400 text-[10px] uppercase">Annual</p>
                    <p className="text-white text-sm font-bold">{formatCompactCurrency(winner.annualEarnings)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-400 text-[10px] uppercase">Per Hour</p>
                    <p className="text-white text-sm font-bold">{formatCurrency(calculateEarningsBreakdown(winner.annualEarnings).perHour)}</p>
                  </div>
                </div>
              </div>

              {/* Multiple Flex Stats */}
              <div className="bg-gradient-to-r from-orange-900/30 via-red-900/20 to-orange-900/30 rounded-lg p-3 border border-orange-500/30">
                <p className="text-orange-400 text-[10px] uppercase tracking-wide text-center mb-3 font-bold">
                  🔥 With the extra <span className="text-white">{formatCompactCurrency(extraIncome)}/yr</span> 🔥
                </p>
                
                <div className="space-y-2">
                  {flexComparisons.length > 0 ? (
                    flexComparisons.map((comp, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 bg-black/30 rounded-md p-2">
                        <span className="text-xl">{comp.emoji}</span>
                        <p className="text-white text-xs">
                          <span className="text-orange-400 font-bold">{comp.quantity}</span>{' '}
                          {comp.item}{' '}
                          <span className="text-orange-400 font-bold">{comp.timeframe}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white text-xs text-center">
                      {winner.name} pockets <span className="text-orange-400 font-bold">{formatCurrency(extraBreakdown.perHour)}</span> more per hour
                    </p>
                  )}
                </div>
                
                <p className="text-gray-400 text-[10px] text-center mt-3 italic">
                  ...while {loser.name} watches from the sidelines 💀
                </p>
              </div>
            </>
          ) : (
            /* Standard Mode Content */
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

              {/* The Extra Income Flex */}
              <div className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/20 to-emerald-900/40 rounded-lg p-3 border border-emerald-500/30">
                <p className="text-emerald-400 text-[10px] uppercase tracking-wide text-center mb-2">
                  💸 With just the extra <span className="font-bold">{formatCompactCurrency(extraIncome)}/yr</span>
                </p>
                {normalFlex ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{normalFlex.emoji}</span>
                    <div className="text-center">
                      <p className="text-white text-sm">
                        <span className="text-emerald-400 font-bold">{normalFlex.quantity}</span>{' '}
                        {normalFlex.item}
                      </p>
                      <p className="text-emerald-400 text-xs font-bold">{normalFlex.timeframe}</p>
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

      {/* Share Menu */}
      <ShareMenuDropdown
        isGeneratingImage={isGeneratingImage}
        isPreGenerating={isPreGenerating}
        onMenuOpen={handleMenuOpen}
        onTextShare={handleTextShare}
        onWhatsAppShare={handleWhatsAppShare}
        onTwitterShare={handleTwitterShare}
        onFacebookShare={handleFacebookShare}
        onLinkedInShare={handleLinkedInShare}
        onInstagramShare={handleInstagramShare}
        onTikTokShare={handleTikTokShare}
        onSaveImage={handleSaveImage}
        onCopyLink={handleCopyLink}
        buttonText="Share Showdown"
      />
    </div>
  );
};

export default CompareShareCard;
