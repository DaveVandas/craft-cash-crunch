import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Copy, Check, Crown, TrendingUp } from 'lucide-react';
import TwitterQuickShare from '@/components/share/TwitterQuickShare';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { getShareUrlWithRedirect } from '@/lib/shareUrls';

interface AffiliateShareCardProps {
  affiliateCode: string;
  displayName: string;
  commissionRate?: number;
  isVip?: boolean;
}

export function AffiliateShareCard({ 
  affiliateCode, 
  displayName, 
  commissionRate = 1.00,
  isVip = false 
}: AffiliateShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralRedirectPath = `/ref/${affiliateCode}`;
  const referralDestinationUrl = `https://earningsexplorer.shop${referralRedirectPath}`;
  const referralShareUrl = getShareUrlWithRedirect('affiliate', referralRedirectPath);
  
  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating card image:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mogul-affiliate-${affiliateCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Card downloaded! 🎉');
      }
    } catch (error) {
      toast.error('Failed to download card');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();
      if (blob && navigator.share) {
        const file = new File([blob], `mogul-affiliate-${affiliateCode}.png`, { type: 'image/png' });
        await navigator.share({
          title: 'Wealth Perspective',
          text: `👑 Code: ${affiliateCode}`,
          url: referralShareUrl,
          files: [file],
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback: copy the share link
        await navigator.clipboard.writeText(referralShareUrl);
        toast.success('Link copied to clipboard! Paste it anywhere.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        // If native share fails, copy link as fallback
        try {
          await navigator.clipboard.writeText(referralShareUrl);
          toast.success('Link copied to clipboard!');
        } catch {
          toast.error('Could not share — please copy the link manually');
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCardImage();
      
      if (blob) {
        // Check if ClipboardItem API is available and supports image/png
        const canCopyImage = typeof ClipboardItem !== 'undefined' && 
          navigator.clipboard && 
          'write' in navigator.clipboard;
        
        if (canCopyImage) {
          try {
            // Some browsers need the blob wrapped in a Promise
            const clipboardItem = new ClipboardItem({
              'image/png': Promise.resolve(blob)
            });
            await navigator.clipboard.write([clipboardItem]);
            setCopied(true);
            toast.success('Card image copied! 📋 Paste it anywhere!');
            setTimeout(() => setCopied(false), 2000);
            return;
          } catch (_imgError) {
            // Image clipboard failed, trying alternative
          }
        }
        
        // Fallback: Download the image instead since clipboard doesn't support images
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mogul-affiliate-${affiliateCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setCopied(true);
        toast.success('Card downloaded! 📥 (Your device doesn\'t support image copy)', {
          description: 'Share the downloaded image directly!'
        });
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Ultimate fallback: copy link
        await navigator.clipboard.writeText(referralShareUrl);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      // Even if everything fails, try to copy the link
      try {
        await navigator.clipboard.writeText(referralShareUrl);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy - please screenshot the card');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* The Shareable Card - USES EXPLICIT COLORS FOR IMAGE GENERATION */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a1814 0%, #0d0d0d 50%, #1c1915 100%)',
        }}
      >
        {/* Gold border frame */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '4px solid transparent',
            background: 'linear-gradient(145deg, #FFD700, #B8860B, #FFE066) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Content - using explicit colors for image generation */}
        <div className="relative h-full flex flex-col items-center justify-between p-6 text-center">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              {isVip && <Crown className="w-5 h-5" style={{ color: '#FFD700' }} />}
              <span style={{ color: '#FFD700' }} className="font-bold text-sm tracking-widest uppercase">
                Wealth Perspective
              </span>
              {isVip && <Crown className="w-5 h-5" style={{ color: '#FFD700' }} />}
            </div>
            <h2 className="text-2xl font-bold" style={{ color: '#F5F3EE' }}>
              Join the Mogul Life
            </h2>
            <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#9CA3AF' }}>
              <Crown className="w-4 h-4" style={{ color: '#FFD700' }} />
              <span>Exclusive Mogul Access</span>
              <Crown className="w-4 h-4" style={{ color: '#FFD700' }} />
            </div>
          </div>

          {/* QR Code */}
          <div className="relative p-4 rounded-xl shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
            <QRCodeSVG
              value={referralDestinationUrl}
              size={160}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
              imageSettings={{
                src: '/favicon.png',
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 rounded-tl" style={{ borderColor: '#FFD700' }} />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 rounded-tr" style={{ borderColor: '#FFD700' }} />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 rounded-bl" style={{ borderColor: '#FFD700' }} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 rounded-br" style={{ borderColor: '#FFD700' }} />
          </div>

          {/* Affiliate Info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm flex items-center justify-center gap-1" style={{ color: '#9CA3AF' }}>
                <Crown className="w-3 h-3" style={{ color: '#FFD700' }} />
                Invited by Mogul
              </p>
              <p className="text-xl font-bold" style={{ color: '#F5F3EE' }}>{displayName}</p>
            </div>
            
            <div 
              className="px-4 py-2 rounded-lg inline-block"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
              }}
            >
              <span className="text-lg font-mono font-bold tracking-wider" style={{ color: '#1a1814' }}>
                {affiliateCode}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#FFD700' }}>
              <TrendingUp className="w-4 h-4" style={{ color: '#FFD700' }} />
              <span className="font-semibold">Live the mogul lifestyle</span>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-2">
            <p className="text-sm font-semibold" style={{ color: '#F5F3EE' }}>
              Scan to join the mogul movement 👑
            </p>
            <p className="text-sm font-bold tracking-wide" style={{ color: '#FFD700' }}>
              earningsexplorer.shop
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 opacity-20"
          style={{
            background: 'radial-gradient(circle at top right, #FFD700 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 opacity-20"
          style={{
            background: 'radial-gradient(circle at bottom left, #FFD700 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center max-w-sm mx-auto">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex-1 gap-2"
          variant="default"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          onClick={handleShare}
          disabled={isGenerating}
          className="flex-1 gap-2"
          variant="secondary"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          onClick={handleCopyLink}
          disabled={isGenerating}
          variant="outline"
          className="gap-2"
          title="Copy card to clipboard"
        >
          {isGenerating ? (
            <span className="animate-pulse text-xs">...</span>
          ) : copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Social Share Buttons */}
      <div className="flex gap-2 justify-center max-w-sm mx-auto">
        <TwitterQuickShare
          shareText={`👑 Join the mogul movement! Use code: ${affiliateCode}`}
          shareUrl={referralShareUrl}
          feature="affiliate"
          context={{ affiliateCode }}
          variant="compact"
          className="flex-1"
        />
        <Button
          size="sm"
          className="flex-1 gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white"
          onClick={() => {
            window.open(
              `https://wa.me/?text=${encodeURIComponent(`👑 Join the mogul movement! Code: ${affiliateCode}\n${referralShareUrl}`)}`,
              '_blank',
              'noopener,noreferrer'
            );
          }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.34 0-4.508-.764-6.26-2.057l-.437-.331-3.286 1.1 1.1-3.286-.331-.437A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          WhatsApp
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralShareUrl)}`,
              '_blank',
              'noopener,noreferrer'
            );
          }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </Button>
      </div>

      {/* Simple link display */}
      <div className="max-w-sm mx-auto p-3 bg-muted/50 rounded-lg text-center">
        <p className="text-xs text-muted-foreground mb-1">Your referral page:</p>
        <p className="text-sm font-medium text-primary">{referralDestinationUrl}</p>
      </div>
    </div>
  );
}
