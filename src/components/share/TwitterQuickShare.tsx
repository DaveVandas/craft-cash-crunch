import { Button } from '@/components/ui/button';
import { trackShareEvent } from '@/hooks/useShareTracking';
import type { ShareFeature } from '@/hooks/useShareTracking';

// X/Twitter icon
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface TwitterQuickShareProps {
  shareText: string;
  shareUrl: string;
  feature: ShareFeature;
  context?: Record<string, unknown>;
  className?: string;
  variant?: 'prominent' | 'compact' | 'icon-only';
}

/**
 * One-tap Twitter/X share button optimized for mobile virality
 */
const TwitterQuickShare = ({
  shareText,
  shareUrl,
  feature,
  context = {},
  className = '',
  variant = 'prominent',
}: TwitterQuickShareProps) => {
  const handleTwitterShare = () => {
    // Track the share event
    trackShareEvent(feature, 'twitter', 'link', context);

    // Build the Twitter intent URL
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    
    // Open in new window (works great on mobile)
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon-only') {
    return (
      <Button
        onClick={handleTwitterShare}
        size="icon"
        className={`bg-black hover:bg-gray-900 text-white ${className}`}
      >
        <XIcon />
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleTwitterShare}
        size="sm"
        className={`bg-black hover:bg-gray-900 text-white gap-2 ${className}`}
      >
        <XIcon />
        <span>Post</span>
      </Button>
    );
  }

  // Prominent variant - designed for maximum CTR
  return (
    <Button
      onClick={handleTwitterShare}
      size="lg"
      className={`
        relative overflow-hidden
        bg-black hover:bg-gray-900 text-white
        font-bold text-base
        gap-2.5 px-6 py-3
        shadow-lg hover:shadow-xl
        transition-all duration-300
        hover:scale-[1.02]
        ${className}
      `}
    >
      <XIcon />
      <span>Share on 𝕏</span>
      {/* Shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
        <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </span>
    </Button>
  );
};

export default TwitterQuickShare;
