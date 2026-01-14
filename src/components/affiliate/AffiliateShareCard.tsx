import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Copy, Check, Crown, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

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

  const referralUrl = `${window.location.origin}/auth?ref=${affiliateCode}`;
  
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
          title: 'Join Wealth Perspective',
          text: `🎩 Use my code ${affiliateCode} to explore how the ultra-wealthy earn! See what you can make compared to billionaires.`,
          files: [file],
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback to copying link
        await navigator.clipboard.writeText(referralUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error('Failed to share');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="space-y-4">
      {/* The Shareable Card */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsl(45, 100%, 8%) 0%, hsl(0, 0%, 5%) 50%, hsl(45, 100%, 10%) 100%)',
        }}
      >
        {/* Gold border frame */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '4px solid transparent',
            background: 'linear-gradient(145deg, hsl(45, 100%, 50%), hsl(35, 100%, 40%), hsl(45, 100%, 55%)) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-between p-6 text-center">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              {isVip && <Crown className="w-5 h-5 text-primary" />}
              <span className="text-primary font-bold text-sm tracking-widest uppercase">
                Wealth Perspective
              </span>
              {isVip && <Crown className="w-5 h-5 text-primary" />}
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Mogul Invite
            </h2>
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Exclusive Access</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* QR Code */}
          <div className="relative p-4 rounded-xl bg-white shadow-xl">
            <QRCodeSVG
              value={referralUrl}
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
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
          </div>

          {/* Affiliate Info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Invited by</p>
              <p className="text-xl font-bold text-foreground">{displayName}</p>
            </div>
            
            <div 
              className="px-4 py-2 rounded-lg inline-block"
              style={{
                background: 'linear-gradient(135deg, hsl(45, 100%, 50%) 0%, hsl(35, 100%, 40%) 100%)',
              }}
            >
              <span className="text-lg font-mono font-bold text-background tracking-wider">
                {affiliateCode}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>See how billionaires really earn</span>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Scan to explore celebrity earnings
            </p>
            <p className="text-xs text-primary font-medium">
              earningsexplorer.shop
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 opacity-20"
          style={{
            background: 'radial-gradient(circle at top right, hsl(45, 100%, 50%) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 opacity-20"
          style={{
            background: 'radial-gradient(circle at bottom left, hsl(45, 100%, 50%) 0%, transparent 70%)',
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
          variant="outline"
          className="gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Link preview */}
      <div className="max-w-sm mx-auto p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">Your referral link:</p>
        <p className="text-sm font-mono text-foreground break-all">{referralUrl}</p>
      </div>
    </div>
  );
}
