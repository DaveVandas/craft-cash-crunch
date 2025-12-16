import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, formatCurrency, calculateEarningsBreakdown, generateComparisons, getMostDramaticComparison } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { getSimilarCelebrities, nameToSlug } from '@/lib/similarCelebrities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Share2, DollarSign, Clock, TrendingUp, Zap, Download, Loader2, Flame, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

const InstagramIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

interface ShareCardProps {
  celebrity: Celebrity;
  userSalary?: number;
}

const ShareCard = ({ celebrity, userSalary }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flexMode, setFlexMode] = useState(false);
  const breakdown = calculateEarningsBreakdown(celebrity.annualEarnings);
  const comparisons = generateComparisons(celebrity.annualEarnings);
  const dramaticComparison = getMostDramaticComparison(celebrity.annualEarnings);
  
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

  const handleInstagramShare = async () => {
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
        toast.success('Card saved! Open Instagram → Stories → Select the image from your gallery', {
          duration: 6000,
        });
      }
    } catch (error) {
      toast.error('Failed to download card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTikTokShare = async () => {
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
        toast.success('Card saved! Open TikTok → Create → Add the image from your gallery', {
          duration: 6000,
        });
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
                className="font-serif text-3xl md:text-4xl font-bold"
                style={{ 
                  background: 'linear-gradient(90deg, #fb923c, #f97316, #ea580c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {celebrity.name}
              </h2>
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
              <p className="text-orange-300/80 text-sm uppercase tracking-widest mb-4">
                Earns
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
                    {dramaticComparison.item}
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

            {/* Net Worth & Annual Earnings */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="text-center py-4 rounded-xl border-2 border-amber-500/40"
                style={{ background: 'linear-gradient(145deg, rgba(184,134,11,0.15) 0%, rgba(10,10,11,0.8) 100%)' }}
              >
                <p className="text-xs text-amber-300/70 uppercase tracking-widest mb-1">💎 Net Worth</p>
                <p 
                  className="text-2xl md:text-3xl font-bold"
                  style={{ 
                    background: 'linear-gradient(90deg, #ffd700, #ffb347, #ffd700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {formatCompactCurrency(celebrity.netWorth)}
                </p>
              </div>
              <div 
                className="text-center py-4 rounded-xl border-2 border-amber-500/40"
                style={{ background: 'linear-gradient(145deg, rgba(184,134,11,0.15) 0%, rgba(10,10,11,0.8) 100%)' }}
              >
                <p className="text-xs text-amber-300/70 uppercase tracking-widest mb-1">💰 Annual</p>
                <p 
                  className="text-2xl md:text-3xl font-bold"
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
            <span className="text-xs font-medium text-black/80">earningsexplorer.shop</span>
            <span className="text-black/50">•</span>
            <span className="text-xs text-black/60">{new Date().getFullYear()}</span>
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Share this card</p>
            <div className="flex gap-2">
              <Button 
                onClick={handleDownload}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
              <Button 
                onClick={() => handleShare('copy')}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Primary: Native Share with Image */}
          <Button 
            onClick={() => handleShare('native')}
            className="w-full mb-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold h-9 text-sm"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4 mr-2" />
            )}
            Share Card
          </Button>

          {/* Social Platform Buttons - Compact Circle Icons */}
          <div className="flex items-center justify-center gap-2">
            <Button 
              onClick={() => handleShare('twitter')}
              size="icon"
              className="h-9 w-9 rounded-full bg-black hover:bg-black/80 text-white"
            >
              <TwitterIcon />
            </Button>
            <Button 
              onClick={() => handleShare('facebook')}
              size="icon"
              className="h-9 w-9 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white"
            >
              <FacebookIcon />
            </Button>
            <Button 
              onClick={() => handleShare('linkedin')}
              size="icon"
              className="h-9 w-9 rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white"
            >
              <LinkedInIcon />
            </Button>
            <Button 
              onClick={handleInstagramShare}
              size="icon"
              className="h-9 w-9 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <InstagramIcon />
              )}
            </Button>
            <Button 
              onClick={handleTikTokShare}
              size="icon"
              className="h-9 w-9 rounded-full bg-black hover:bg-black/80 text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TikTokIcon />
              )}
            </Button>
          </div>

          {/* You Might Also Like Section */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">You might also like</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {getSimilarCelebrities(celebrity.name, celebrity.category, 4).map((similar) => (
                <Link
                  key={similar.name}
                  to={`/profile/${nameToSlug(similar.name)}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-border/30 hover:border-primary/30 transition-all group"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm flex-shrink-0">
                    {getAvatarEmoji(celebrity.profession)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                      {similar.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {similar.hourlyEarnings}
                    </p>
                  </div>
                </Link>
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
