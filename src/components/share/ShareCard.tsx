import { useRef, useState } from 'react';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, formatCurrency, calculateEarningsBreakdown, generateComparisons } from '@/lib/earnings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, DollarSign, Clock, TrendingUp, Zap, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

// Custom social icons
const TwitterIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface ShareCardProps {
  celebrity: Celebrity;
  userSalary?: number;
}

const ShareCard = ({ celebrity, userSalary }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const breakdown = calculateEarningsBreakdown(celebrity.annualEarnings);
  const comparisons = generateComparisons(celebrity.annualEarnings);
  
  // Get diverse comparisons for visual appeal
  const topComparisons = comparisons.slice(0, 4);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0b',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${celebrity.name.replace(/\s+/g, '-').toLowerCase()}-wealth-card.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Card downloaded!');
      }
    } catch (error) {
      toast.error('Failed to download card');
    } finally {
      setIsGenerating(false);
    }
  };

  const getShareUrl = () => {
    return `${window.location.origin}/profile/${celebrity.id}`;
  };

  const getShareText = () => {
    return `💰 ${celebrity.name} earns ${formatCompactCurrency(breakdown.perSecond)}/second! That's ${formatCompactCurrency(celebrity.annualEarnings)}/year. Check out their full wealth stats:`;
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy' | 'native') => {
    const shareUrl = getShareUrl();
    const shareText = getShareText();

    if (platform === 'native') {
      setIsGenerating(true);
      try {
        const blob = await generateImage();
        if (blob && navigator.share && navigator.canShare) {
          const file = new File([blob], `${celebrity.name}-wealth-card.png`, { type: 'image/png' });
          const shareData = {
            title: `${celebrity.name} Wealth Card`,
            text: shareText,
            url: shareUrl,
            files: [file],
          };
          
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            toast.success('Shared successfully!');
          } else {
            // Fallback to sharing without file
            await navigator.share({
              title: `${celebrity.name} Wealth Card`,
              text: shareText,
              url: shareUrl,
            });
          }
        } else {
          toast.error('Sharing not supported on this device');
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (platform === 'twitter') {
      const twitterText = `${shareText}\n\n${shareUrl}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div id="share-card" className="space-y-6">
      {/* Baseball Card Style - Capturable */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-4 border-amber-500/60 shadow-2xl"
        style={{ 
          background: 'linear-gradient(145deg, #1a1a1c 0%, #0a0a0b 50%, #1a1510 100%)',
        }}
      >
        {/* Gold Frame Effect */}
        <div className="absolute inset-0 border-4 border-amber-400/20 rounded-xl pointer-events-none" />
        
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
          {/* Header with Name */}
          <div className="text-center border-b border-amber-500/30 pb-4">
            <h2 
              className="font-serif text-3xl md:text-4xl font-bold mb-1"
              style={{ 
                background: 'linear-gradient(90deg, #ffd700, #ffb347, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {celebrity.name}
            </h2>
            <p className="text-amber-200/70 text-sm uppercase tracking-widest">
              {celebrity.profession}
            </p>
          </div>

          {/* Annual Earnings - Hero Stat */}
          <div 
            className="text-center py-5 rounded-xl border-2 border-amber-500/40"
            style={{ background: 'linear-gradient(145deg, rgba(184,134,11,0.2) 0%, rgba(10,10,11,0.8) 100%)' }}
          >
            <p className="text-xs text-amber-300/70 uppercase tracking-widest mb-2">💰 Annual Earnings</p>
            <p 
              className="text-4xl md:text-5xl font-bold"
              style={{ 
                background: 'linear-gradient(90deg, #ffd700, #ffb347, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatCompactCurrency(celebrity.annualEarnings)}
            </p>
          </div>

          {/* Stats Grid - Like a Baseball Card */}
          <div className="grid grid-cols-2 gap-3">
            <StatBox 
              icon={<Zap className="h-4 w-4 text-amber-400" />}
              label="Per Second" 
              value={formatCurrency(breakdown.perSecond)} 
            />
            <StatBox 
              icon={<Clock className="h-4 w-4 text-amber-400" />}
              label="Per Minute" 
              value={formatCurrency(breakdown.perMinute)} 
            />
            <StatBox 
              icon={<TrendingUp className="h-4 w-4 text-amber-400" />}
              label="Per Hour" 
              value={formatCurrency(breakdown.perHour)} 
            />
            <StatBox 
              icon={<DollarSign className="h-4 w-4 text-amber-400" />}
              label="Per Day" 
              value={formatCurrency(breakdown.perDay)} 
            />
          </div>

          {/* Fun Comparisons */}
          <div className="space-y-2">
            <p className="text-xs text-amber-300/70 uppercase tracking-widest text-center">
              🛒 What This Buys
            </p>
            <div className="grid grid-cols-2 gap-2">
              {topComparisons.map((comparison, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-lg border border-amber-500/30"
                  style={{ background: 'rgba(184,134,11,0.1)' }}
                >
                  <span className="text-2xl">{comparison.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-sm font-bold truncate"
                      style={{ color: '#ffd700' }}
                    >
                      {comparison.quantity.toLocaleString()}
                    </p>
                    <p className="text-xs text-amber-100/80 truncate">
                      {comparison.item}
                    </p>
                    <p className="text-[10px] text-amber-200/50">
                      {comparison.timeframe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Salary Comparison */}
          {userSalary && userSalary > 0 && (
            <div 
              className="p-4 rounded-lg border border-red-500/30 text-center"
              style={{ background: 'rgba(220,38,38,0.1)' }}
            >
              <p className="text-xs text-red-300/70 mb-1">😅 Your Reality Check</p>
              <p className="text-sm text-red-100">
                Makes your yearly salary ({formatCompactCurrency(userSalary)}) in just{' '}
                <span className="text-red-400 font-bold">
                  {((userSalary / celebrity.annualEarnings) * 365 * 24 * 60).toFixed(1)} minutes
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div 
          className="px-6 py-3 flex items-center justify-center gap-3"
          style={{ background: 'linear-gradient(90deg, #8b7355 0%, #a08060 50%, #8b7355 100%)' }}
        >
          <span className="text-xs font-medium text-black/80">wealthperspective.app</span>
          <span className="text-black/50">•</span>
          <span className="text-xs text-black/60">{new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Share Buttons */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-4">Share this card</p>
          
          {/* Primary: Native Share with Image */}
          <Button 
            onClick={() => handleShare('native')}
            className="w-full mb-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            Share Card Image
          </Button>

          {/* Social Platform Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Button 
              onClick={() => handleShare('twitter')}
              className="bg-black hover:bg-black/80 text-white"
            >
              <TwitterIcon />
              <span className="ml-2">Twitter</span>
            </Button>
            <Button 
              onClick={() => handleShare('facebook')}
              className="bg-[#1877F2] hover:bg-[#1877F2]/80 text-white"
            >
              <FacebookIcon />
              <span className="ml-2">Facebook</span>
            </Button>
            <Button 
              onClick={() => handleShare('linkedin')}
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white"
            >
              <LinkedInIcon />
              <span className="ml-2">LinkedIn</span>
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleDownload}
              variant="outline"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download
            </Button>
            <Button 
              onClick={() => handleShare('copy')}
              variant="outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
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
