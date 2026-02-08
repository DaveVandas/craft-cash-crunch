import { useRef } from 'react';
import { useShareCard } from '@/hooks/useShareCard';
import ShareMenuDropdown from '@/components/share/ShareMenuDropdown';
import { Card, CardContent } from '@/components/ui/card';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';

const AffiliateStoryCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getShareText = () => {
    return `🚀 This side hustle is INSANE:\n\n1️⃣ Get a free affiliate link\n2️⃣ Post TikToks about celebrity earnings\n3️⃣ Get paid $1-$2 for EVERY download\n\n💰 One viral video = $10,000+\n\nNo inventory. No customers. Just post & profit.\n\nJoin free:`;
  };

  const shareUrl = getShareUrlWithRedirect('affiliate', '/become-affiliate');
  const imageName = 'affiliate-launch-card';

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
    title: 'Affiliate Side Hustle',
  });

  return (
    <div className="space-y-4">
      {/* The Storyboard Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-4 border-primary/60 shadow-2xl"
        style={{ 
          background: 'linear-gradient(145deg, #0a0a1a 0%, #0a0a0b 40%, #1a0a20 100%)',
        }}
      >
        {/* Frame Effect */}
        <div className="absolute inset-0 border-4 border-primary/20 rounded-xl pointer-events-none" />
        
        {/* Top Banner */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-serif text-lg font-bold text-white tracking-wide">
              Launch Your Side Hustle
            </span>
          </div>
          <span className="text-sm font-semibold text-white/80">💎</span>
        </div>

        {/* Main Content - Storyboard */}
        <div className="p-6 space-y-4">
          {/* Hero Text */}
          <div className="text-center mb-2">
            <h2 
              className="font-serif text-xl md:text-2xl font-bold leading-tight"
              style={{ 
                background: 'linear-gradient(90deg, #c4b5fd, #a78bfa, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Get Paid To Share An App
            </h2>
            <p className="text-violet-300/70 text-sm mt-1">The easiest money you'll ever make</p>
          </div>

          {/* Storyboard Steps */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div 
              className="flex items-center gap-4 p-3 rounded-xl border border-violet-500/30"
              style={{ background: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                📱
              </div>
              <div className="flex-1">
                <p className="text-violet-200 font-semibold text-sm">Step 1: Apply & Get Your Link</p>
                <p className="text-violet-300/60 text-xs">Takes 2 minutes. Instant approval.</p>
              </div>
              <span className="text-violet-400/50 text-lg">→</span>
            </div>

            {/* Step 2 */}
            <div 
              className="flex items-center gap-4 p-3 rounded-xl border border-violet-500/30"
              style={{ background: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                🎬
              </div>
              <div className="flex-1">
                <p className="text-violet-200 font-semibold text-sm">Step 2: Create Content</p>
                <p className="text-violet-300/60 text-xs">React to celebrity earnings on TikTok/Reels</p>
              </div>
              <span className="text-violet-400/50 text-lg">→</span>
            </div>

            {/* Step 3 */}
            <div 
              className="flex items-center gap-4 p-3 rounded-xl border border-violet-500/30"
              style={{ background: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                📈
              </div>
              <div className="flex-1">
                <p className="text-violet-200 font-semibold text-sm">Step 3: Watch It Spread</p>
                <p className="text-violet-300/60 text-xs">The app is so good, it sells itself</p>
              </div>
              <span className="text-violet-400/50 text-lg">→</span>
            </div>

            {/* Step 4 - The Payoff */}
            <div 
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-amber-500/40"
              style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(139, 92, 246, 0.1))' }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              >
                💰
              </div>
              <div className="flex-1">
                <p className="text-amber-200 font-bold text-base">Step 4: GET PAID</p>
                <p className="text-amber-300/80 text-xs font-medium">$1-$2 per download. Forever.</p>
              </div>
            </div>
          </div>

          {/* Viral Potential Callout */}
          <div 
            className="p-4 rounded-xl border border-primary/30 text-center"
            style={{ background: 'rgba(139, 92, 246, 0.08)' }}
          >
            <p className="text-violet-300/60 text-xs uppercase tracking-widest mb-2">ONE VIRAL VIDEO =</p>
            <p 
              className="text-3xl md:text-4xl font-black"
              style={{ 
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              $10,000+
            </p>
            <p className="text-violet-300/50 text-xs mt-1">100K views → 10K downloads → 💸</p>
          </div>

          {/* Bottom Tag */}
          <div className="text-center">
            <p className="text-violet-400/70 text-xs">
              No inventory • No customers • No experience needed
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div 
          className="px-6 py-3 flex items-center justify-center gap-3"
          style={{ background: 'linear-gradient(90deg, #5b21b6 0%, #7c3aed 50%, #5b21b6 100%)' }}
        >
          <span className="text-xs font-medium text-violet-100/80">earningsexplorer.shop/become-affiliate</span>
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

export default AffiliateStoryCard;
