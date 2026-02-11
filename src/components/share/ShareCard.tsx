import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, formatCurrency, calculateEarningsBreakdown, generateComparisons, getMostDramaticComparison } from '@/lib/earnings';
import { pluralizeItem } from '@/lib/utils';
import { getAvatarEmoji } from '@/lib/avatar';
import { getSimilarCelebrities, nameToSlug } from '@/lib/similarCelebrities';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, Clock, TrendingUp, Zap, Flame, Sparkles, Info } from 'lucide-react';
import ShareCardDecorations from '@/components/share/ShareCardDecorations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useShareCard } from '@/hooks/useShareCard';
import ShareMenuDropdown from '@/components/share/ShareMenuDropdown';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';
import { HowWeCalculateModal } from '@/components/info/HowWeCalculateModal';

interface ShareCardProps {
  celebrity: Celebrity;
  userSalary?: number;
}

const ShareCard = ({ celebrity }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [flexMode, setFlexMode] = useState(false);
  const navigate = useNavigate();
  const breakdown = calculateEarningsBreakdown(celebrity.annualEarnings);
  const comparisons = generateComparisons(celebrity.annualEarnings);
  const dramaticComparison = getMostDramaticComparison(celebrity.annualEarnings);
  
  const handleSuggestionClick = (slug: string, previewData: { name: string; netWorth: string; hourlyEarnings: string; emoji: string }) => {
    // Pass preview data via navigation state for instant display
    navigate(`/profile/${slug}`, { 
      state: { preview: previewData }
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  
  // Get diverse comparisons for visual appeal
  const topComparisons = comparisons.slice(0, 4);

  const getShareText = () => {
    return `💰 ${celebrity.name} earns ${formatCompactCurrency(breakdown.perSecond)}/second! That's ${formatCompactCurrency(celebrity.annualEarnings)}/year. Check out their full wealth stats:`;
  };

  // Use OG-enabled share URL that redirects to the profile page
  const shareUrl = getShareUrlWithRedirect('home', `/profile/${celebrity.id}`);
  const imageName = `${celebrity.name.replace(/\s+/g, '-').toLowerCase()}-wealth-card`;

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
  } = useShareCard({
    cardRef: cardRef as React.RefObject<HTMLDivElement>,
    shareText: getShareText(),
    shareUrl,
    imageName,
    title: `${celebrity.name} Wealth Card`,
  });

  return (
    <div id="share-card" className="space-y-6">
      {/* Flex Mode Toggle - Centered */}
      <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
        <Label htmlFor="flex-mode" className="text-sm text-muted-foreground cursor-pointer">
          Standard
        </Label>
        <Switch
          id="flex-mode"
          checked={flexMode}
          onCheckedChange={setFlexMode}
          className="data-[state=checked]:bg-orange-500"
        />
        <Label htmlFor="flex-mode" className={`text-sm cursor-pointer flex items-center gap-1 ${flexMode ? 'text-orange-500 font-semibold' : 'text-muted-foreground'}`}>
          <Flame className={`h-4 w-4 ${flexMode ? 'text-orange-500' : ''}`} />
          Flex Mode
        </Label>
      </div>

      {/* Card - Flex Mode or Standard */}
      {flexMode && dramaticComparison ? (
        /* FLEX MODE CARD - Single dramatic stat */
        <div 
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl border-4 border-orange-500/60 shadow-2xl"
          style={{ 
            background: 'linear-gradient(145deg, #1a1a1c 0%, #0a0a0b 50%, #1a0a00 100%)',
          }}
        >
          {/* Fire Frame Effect */}
          <div className="absolute inset-0 border-4 border-orange-400/20 rounded-xl pointer-events-none" />
          <ShareCardDecorations variant="orange" />
          
          {/* Top Banner */}
          <div 
            className="px-6 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(90deg, #f97316 0%, #fb923c 50%, #f97316 100%)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="font-serif text-lg font-bold text-black tracking-wide">
                FLEX MODE
              </span>
            </div>
            <span className="text-sm font-semibold text-black/70">💎</span>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-6">
            {/* Avatar and Name */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Avatar className="h-24 w-24 ring-4 ring-orange-500/50 shadow-lg">
                  <AvatarImage src={celebrity.imageUrl} alt={celebrity.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 text-4xl text-orange-200">
                    {getAvatarEmoji(celebrity.profession)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 
                className="font-serif text-2xl md:text-3xl font-bold px-2 leading-tight break-words text-orange-100"
                style={{ 
                  wordBreak: 'break-word',
                }}
              >
                {celebrity.name}
              </h2>
              <p className="text-orange-300/70 text-sm font-medium mt-1">{celebrity.profession}</p>
            </div>

            {/* Net Worth, Annual & Hourly Earnings */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-3 rounded-xl border border-orange-500/30" style={{ background: 'rgba(249,115,22,0.1)' }}>
                <p className="text-orange-300/60 text-[10px] uppercase tracking-widest">Net Worth</p>
                <p className="text-lg font-bold text-orange-100">{formatCompactCurrency(celebrity.netWorth)}</p>
              </div>
              <div className="text-center p-3 rounded-xl border border-orange-500/30" style={{ background: 'rgba(249,115,22,0.1)' }}>
                <p className="text-orange-300/60 text-[10px] uppercase tracking-widest">Annual</p>
                <p className="text-lg font-bold text-orange-100">{formatCompactCurrency(celebrity.annualEarnings)}</p>
              </div>
              <div className="text-center p-3 rounded-xl border border-orange-500/30" style={{ background: 'rgba(249,115,22,0.1)' }}>
                <p className="text-orange-300/60 text-[10px] uppercase tracking-widest">Per Hour</p>
                <p className="text-lg font-bold text-orange-100">{formatCurrency(breakdown.perHour)}</p>
              </div>
            </div>

            {/* THE DRAMATIC STAT */}
            <div 
              className="text-center py-8 rounded-2xl border-2 border-orange-500/40"
              style={{ background: 'linear-gradient(145deg, rgba(249,115,22,0.2) 0%, rgba(10,10,11,0.9) 100%)' }}
            >
              <p className="text-orange-400/60 text-[10px] text-center mb-1">
                Total purchasing power over 5 years
              </p>
              <p className="text-orange-300/80 text-sm uppercase tracking-widest mb-4">
                5-Year Empire
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-6xl">{dramaticComparison.emoji}</span>
                <div>
                  <p 
                    className="text-5xl md:text-6xl font-black"
                    style={{ 
                      background: 'linear-gradient(90deg, #fb923c, #f97316)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {dramaticComparison.quantity.toLocaleString()}
                  </p>
                  <p className="text-2xl text-orange-100 font-bold">
                    {pluralizeItem(dramaticComparison.item, dramaticComparison.quantity)}
                  </p>
                </div>
              </div>
              <p className="text-orange-400 text-xl font-semibold uppercase tracking-wide">
                {dramaticComparison.timeframe}
              </p>
              <p className="text-orange-200/60 text-sm mt-2">
                {dramaticComparison.context}
              </p>
            </div>
          </div>

          {/* Bottom Banner */}
          <div 
            className="px-6 py-3 flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(90deg, #7c2d12 0%, #9a3412 50%, #7c2d12 100%)' }}
          >
            <span className="text-xs font-medium text-orange-100/80">earningsexplorer.shop</span>
            <span className="text-orange-100/50">•</span>
            <span className="text-xs text-orange-100/60">{new Date().getFullYear()}</span>
          </div>
        </div>
      ) : (
        /* STANDARD CARD - Baseball Card Style */
        <div 
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl border-4 border-amber-500/60 shadow-2xl"
          style={{ 
            background: 'linear-gradient(145deg, #1a1a1c 0%, #0a0a0b 50%, #1a1510 100%)',
          }}
        >
          {/* Gold Frame Effect */}
          <div className="absolute inset-0 border-4 border-amber-400/20 rounded-xl pointer-events-none" />
          <ShareCardDecorations variant="gold" />
          
          {/* Top Banner with Logo */}
          <div 
            className="px-6 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(90deg, #b8860b 0%, #daa520 50%, #b8860b 100%)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="font-serif text-lg font-bold text-black tracking-wide">
                Wealth Perspective
              </span>
            </div>
            <span className="text-sm font-semibold text-black/70">EST. 2024</span>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-5">
            {/* Header with Avatar and Name */}
            <div className="text-center border-b border-amber-500/30 pb-4">
              <div className="flex justify-center mb-3">
                <Avatar className="h-20 w-20 ring-2 ring-amber-500/50 shadow-lg">
                  <AvatarImage src={celebrity.imageUrl} alt={celebrity.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 text-3xl text-amber-200">
                    {getAvatarEmoji(celebrity.profession)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 
                className="font-serif text-2xl md:text-3xl font-bold mb-1 px-2 leading-tight break-words"
                style={{ 
                  background: 'linear-gradient(90deg, #ffd700, #ffb347, #ffd700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  wordBreak: 'break-word',
                }}
              >
                {celebrity.name}
              </h2>
              <p className="text-amber-400/80 text-sm font-medium">{celebrity.profession}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <p className="text-amber-300/50 text-xs">Estimated Wealth Breakdown</p>
                <HowWeCalculateModal variant="icon" className="h-4 w-4 text-amber-300/40 hover:text-amber-300/80" />
              </div>
            </div>

            {/* Net Worth Section */}
            <div 
              className="p-4 rounded-xl border border-amber-500/30 text-center"
              style={{ background: 'rgba(184,134,11,0.1)' }}
            >
              <p className="text-amber-300/60 text-xs uppercase tracking-widest mb-1">Estimated Net Worth</p>
              <p 
                className="text-4xl font-black"
                style={{ 
                  background: 'linear-gradient(90deg, #ffd700, #ffb347)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatCompactCurrency(celebrity.netWorth)}
              </p>
            </div>

            {/* Earnings Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              <StatBox 
                icon={<DollarSign className="h-3.5 w-3.5 text-amber-400" />}
                label="Per Year"
                value={formatCompactCurrency(celebrity.annualEarnings)}
              />
              <StatBox 
                icon={<TrendingUp className="h-3.5 w-3.5 text-amber-400" />}
                label="Per Month"
                value={formatCurrency(breakdown.perMonth)}
              />
              <StatBox 
                icon={<Clock className="h-3.5 w-3.5 text-amber-400" />}
                label="Per Hour"
                value={formatCurrency(breakdown.perHour)}
              />
              <StatBox 
                icon={<Zap className="h-3.5 w-3.5 text-amber-400" />}
                label="Per Minute"
                value={formatCurrency(breakdown.perMinute)}
              />
            </div>

            {/* Comparison Section */}
            <div 
              className="p-4 rounded-xl border border-amber-500/20"
              style={{ background: 'rgba(184,134,11,0.05)' }}
            >
              <p className="text-amber-400/60 text-xs uppercase tracking-wider text-center mb-1">
                Mogul Purchasing Power
              </p>
              <p className="text-amber-300/40 text-[10px] text-center mb-3">
                What they could buy in a year
              </p>
              <div className="space-y-2">
                {topComparisons.slice(0, 3).map((comparison, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-xl border border-amber-500/20"
                    style={{ background: 'rgba(0,0,0,0.4)' }}
                  >
                    <span className="text-3xl flex-shrink-0">{comparison.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <p 
                          className="text-2xl font-black"
                          style={{ 
                            background: 'linear-gradient(90deg, #ffd700, #ffb347)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {comparison.quantity.toLocaleString()}
                        </p>
                        <p className="text-amber-200/90 text-sm font-bold">
                          {pluralizeItem(comparison.item, comparison.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div 
            className="px-6 py-3 flex items-center justify-center gap-3"
            style={{ background: 'linear-gradient(90deg, #8b6914 0%, #a67c00 50%, #8b6914 100%)' }}
          >
            <span className="text-xs font-medium text-amber-100/80">earningsexplorer.shop</span>
            <span className="text-amber-100/50">•</span>
            <span className="text-xs text-amber-100/60">{new Date().getFullYear()}</span>
          </div>
        </div>
      )}

      {/* Share Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-5 pb-5">
          {/* Share Menu Dropdown */}
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
            buttonText="Share Wealth Card"
          />

          {/* You Might Also Like Section */}
          <div className="mt-6 p-4 rounded-lg border border-border/50 bg-secondary/10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">You Might Also Like</span>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {getSimilarCelebrities(celebrity.name, celebrity.category, 4).map((similar) => (
                <button
                  key={similar.name}
                  onClick={() => handleSuggestionClick(nameToSlug(similar.name), similar)}
                  className="px-3 py-1.5 text-sm text-foreground border border-border/60 rounded-full hover:border-primary/60 hover:text-primary transition-colors"
                >
                  {similar.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div 
    className="p-3 rounded-lg border border-amber-500/20 text-center"
    style={{ background: 'rgba(184,134,11,0.08)' }}
  >
    <div className="flex items-center justify-center gap-1 mb-1">
      {icon}
      <span className="text-[10px] uppercase tracking-wider text-amber-300/60">{label}</span>
    </div>
    <p className="text-lg font-bold text-amber-100">{value}</p>
  </div>
);

export default ShareCard;
