import { useRef, useState } from 'react';
import { useShareCard } from '@/hooks/useShareCard';
import ShareMenuDropdown from '@/components/share/ShareMenuDropdown';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/earnings';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';
import { Rocket, TrendingUp, Target, Zap, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SideHustle {
  name: string;
  emoji: string;
  avgBuyPrice: number;
  avgSellPrice: number;
  salesPerMonth: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  tips: string;
  category: string;
  guide: string;
}

interface SideHustleShareCardProps {
  hustle: SideHustle;
  className?: string;
}

const SideHustleShareCard = ({ hustle, className = '' }: SideHustleShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Calculate profits
  const profitPerSale = hustle.avgSellPrice - hustle.avgBuyPrice;
  const monthlyProfit = profitPerSale * hustle.salesPerMonth;
  const yearlyProfit = monthlyProfit * 12;
  const roi = hustle.avgBuyPrice > 0 
    ? ((profitPerSale / hustle.avgBuyPrice) * 100).toFixed(0) 
    : '∞';

  // Special calculation for affiliate
  const isAffiliate = hustle.name === 'Wealth Perspective Affiliate';
  const affiliateMonthly = isAffiliate ? 500 * 1.5 : monthlyProfit;
  const affiliateYearly = isAffiliate ? affiliateMonthly * 12 : yearlyProfit;

  const displayMonthly = isAffiliate ? affiliateMonthly : monthlyProfit;
  const displayYearly = isAffiliate ? affiliateYearly : yearlyProfit;

  const getShareText = () => {
    // Keep share text short to avoid truncation in messaging apps
    if (isAffiliate) {
      return `🚀 ${hustle.name} ${hustle.emoji} - $750+/mo potential!`;
    }
    return `🚀 ${hustle.name} ${hustle.emoji} - ${formatCurrency(displayMonthly)}/mo profit!`;
  };

  const shareUrl = getShareUrlWithRedirect('side-hustle', '/side-hustle');
  const imageName = `${hustle.name.replace(/\s+/g, '-').toLowerCase()}-hustle-card`;

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
    title: `${hustle.name} - Side Hustle`,
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* The Shareable Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-4 border-emerald-500/60 shadow-2xl"
        style={{ 
          background: 'linear-gradient(145deg, #0a1a0f 0%, #0a0a0b 50%, #0a1510 100%)',
        }}
      >
        {/* Frame Effect */}
        <div className="absolute inset-0 border-4 border-emerald-400/20 rounded-xl pointer-events-none" />
        
        {/* Top Banner */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #059669 100%)' }}
        >
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-white" />
            <span className="font-serif text-lg font-bold text-white tracking-wide">
              Side Hustle
            </span>
          </div>
          <span className="text-sm font-semibold text-white/80">💰 CASH PLAY</span>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="text-center border-b border-emerald-500/30 pb-4">
            <span className="text-5xl block mb-3">{hustle.emoji}</span>
            <h2 
              className="font-serif text-xl md:text-2xl font-bold mb-1 px-2 leading-tight break-words"
              style={{ 
                background: 'linear-gradient(90deg, #6ee7b7, #34d399, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                wordBreak: 'break-word',
              }}
            >
              {hustle.name}
            </h2>
            <p className="text-emerald-400/80 text-sm font-medium">{hustle.description}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-emerald-300/50 text-xs">Side Hustle Profit Breakdown</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-emerald-300/40 hover:text-emerald-300/80 transition-colors">
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-xs">
                    Estimates based on average market prices, typical sales volume, and community data.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              hustle.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              hustle.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {hustle.difficulty} Difficulty
            </span>
          </div>

          {/* Profit Stats */}
          <div 
            className="p-4 rounded-xl border border-emerald-500/30 text-center"
            style={{ background: 'rgba(16,185,129,0.1)' }}
          >
            <p className="text-emerald-400/60 text-[10px] uppercase tracking-wider mb-1">
              Estimated Earnings
            </p>
            <p className="text-emerald-300/60 text-xs mb-2">Potential monthly profit</p>
            <p 
              className="text-4xl font-black"
              style={{ 
                background: 'linear-gradient(90deg, #6ee7b7, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatCurrency(displayMonthly)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatBox 
              icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
              label="Per Year"
              value={formatCurrency(displayYearly)}
            />
            <StatBox 
              icon={<Target className="h-3.5 w-3.5 text-emerald-400" />}
              label="ROI"
              value={`${roi}%`}
            />
            {hustle.avgBuyPrice > 0 && (
              <>
                <StatBox 
                  icon={<Zap className="h-3.5 w-3.5 text-emerald-400" />}
                  label="Buy Price"
                  value={formatCurrency(hustle.avgBuyPrice)}
                />
                <StatBox 
                  icon={<Zap className="h-3.5 w-3.5 text-emerald-400" />}
                  label="Sell Price"
                  value={formatCurrency(hustle.avgSellPrice)}
                />
              </>
            )}
            {hustle.avgBuyPrice === 0 && (
              <>
                <StatBox 
                  icon={<Zap className="h-3.5 w-3.5 text-emerald-400" />}
                  label="Startup Cost"
                  value="$0"
                />
                <StatBox 
                  icon={<Zap className="h-3.5 w-3.5 text-emerald-400" />}
                  label="Sales/Mo"
                  value={hustle.salesPerMonth.toString()}
                />
              </>
            )}
          </div>

          {/* Pro Tip */}
          <div 
            className="p-3 rounded-lg border border-emerald-500/20 text-center"
            style={{ background: 'rgba(16,185,129,0.05)' }}
          >
            <p className="text-emerald-300/80 text-sm">
              💡 <span className="font-medium">{hustle.tips}</span>
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div 
          className="px-6 py-3 flex items-center justify-center gap-3"
          style={{ background: 'linear-gradient(90deg, #065f46 0%, #047857 50%, #065f46 100%)' }}
        >
          <span className="text-xs font-medium text-emerald-100/80">earningsexplorer.shop</span>
          <span className="text-emerald-100/50">•</span>
          <span className="text-xs text-emerald-100/60">{new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Share Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-5 pb-5">
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
            buttonText="Share This Hustle"
          />
        </CardContent>
      </Card>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div 
    className="p-3 rounded-lg border border-emerald-500/20 text-center"
    style={{ background: 'rgba(16,185,129,0.08)' }}
  >
    <div className="flex items-center justify-center gap-1 mb-1">
      {icon}
      <span className="text-[10px] uppercase tracking-wider text-emerald-300/60">{label}</span>
    </div>
    <p className="text-lg font-bold text-emerald-100">{value}</p>
  </div>
);

export default SideHustleShareCard;
