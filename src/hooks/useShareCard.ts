import { useState, RefObject } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface UseShareCardOptions {
  cardRef: RefObject<HTMLDivElement>;
  shareText: string;
  shareUrl: string;
  imageName: string;
  title?: string;
}

// Detect iOS (iPhone, iPad, iPod)
const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Detect if running in a mobile browser
const isMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ((navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile ?? false);
};

// Check if native share with files is supported
const canShareFiles = async (file: File): Promise<boolean> => {
  if (!navigator.share) return false;
  if (!navigator.canShare) return false;
  
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
};

export const useShareCard = ({
  cardRef,
  shareText,
  shareUrl,
  imageName,
  title = 'Wealth Perspective',
}: UseShareCardOptions) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const generateCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const element = cardRef.current;
      const rect = element.getBoundingClientRect();

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        width: rect.width,
        height: rect.height,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.92);
      });
    } catch (err) {
      console.error('Failed to generate image:', err);
      return null;
    }
  };

  // Download fallback - works on all platforms
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Delay revoke to ensure download starts
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
      toast.success('Copied to clipboard!', {
        description: 'Paste it anywhere to share',
      });
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText + '\n' + shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Copied to clipboard!');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleSaveImage = async () => {
    setIsGeneratingImage(true);

    try {
      const imageBlob = await generateCardImage();
      if (!imageBlob) {
        toast.error('Failed to generate image');
        return;
      }

      const filename = `${imageName}.jpg`;
      const file = new File([imageBlob], filename, { type: 'image/jpeg' });

      // Try native share API with file (best experience on mobile)
      if (await canShareFiles(file)) {
        try {
          await navigator.share({ files: [file] });
          // User completed share sheet action - no toast needed as they chose what to do
          return;
        } catch (err) {
          // AbortError = user cancelled, which is fine
          if ((err as Error).name === 'AbortError') return;
          // Other errors: fall through to download
          console.log('Share API failed, falling back to download:', err);
        }
      }

      // Fallback: trigger download
      triggerDownload(imageBlob, filename);
      
      if (isMobile()) {
        if (isIOS()) {
          toast.success('Image downloaded!', {
            description: 'Find it in Files app → Downloads, then save to Photos',
            duration: 5000,
          });
        } else {
          toast.success('Image downloaded!', {
            description: 'Check your Downloads folder',
          });
        }
      } else {
        toast.success('Image saved!', {
          description: 'Check your downloads folder',
        });
      }
    } catch (err) {
      console.error('handleSaveImage error:', err);
      toast.error('Failed to save image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTextShare = async () => {
    setIsGeneratingImage(true);
    
    try {
      // First try to generate the image
      const imageBlob = await generateCardImage();
      
      // Mobile: try native share
      if (navigator.share) {
        // Try with image first
        if (imageBlob) {
          const file = new File([imageBlob], `${imageName}.jpg`, { type: 'image/jpeg' });
          
          if (await canShareFiles(file)) {
            try {
              await navigator.share({
                title,
                text: shareText,
                files: [file],
              });
              return; // Success
            } catch (err) {
              if ((err as Error).name === 'AbortError') return;
              // Continue to try without file
              console.log('Share with file failed, trying without:', err);
            }
          }
        }
        
        // Try share without image (text + URL only)
        try {
          await navigator.share({
            title,
            text: shareText,
            url: shareUrl,
          });
          return; // Success
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          // Continue to clipboard fallback
          console.log('Share without file failed, using clipboard:', err);
        }
      }
      
      // Desktop/fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
        toast.success('Copied to clipboard!', {
          description: 'Paste it in your text message',
        });
      } catch {
        // Final fallback
        const textArea = document.createElement('textarea');
        textArea.value = shareText + '\n' + shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success('Copied to clipboard!');
        } catch {
          toast.error('Could not share. Please copy the link manually.');
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('handleTextShare error:', err);
      // Don't show error for user cancellation
      if ((err as Error).name !== 'AbortError') {
        toast.error('Failed to share');
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleInstagramShare = async () => {
    setIsGeneratingImage(true);
    try {
      const blob = await generateCardImage();
      if (!blob) {
        toast.error('Failed to generate image');
        return;
      }
      
      const filename = `${imageName}.jpg`;
      triggerDownload(blob, filename);
      
      toast.success('Card saved!', {
        description: 'Open Instagram → Stories → Select the image from your gallery',
        duration: 6000,
      });
    } catch {
      toast.error('Failed to download card');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTikTokShare = async () => {
    setIsGeneratingImage(true);
    try {
      const blob = await generateCardImage();
      if (!blob) {
        toast.error('Failed to generate image');
        return;
      }
      
      const filename = `${imageName}.jpg`;
      triggerDownload(blob, filename);
      
      toast.success('Card saved!', {
        description: 'Open TikTok → Create → Add the image from your gallery',
        duration: 6000,
      });
    } catch {
      toast.error('Failed to download card');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    handleCopyLink,
    handleTwitterShare,
    handleFacebookShare,
    handleWhatsAppShare,
    handleLinkedInShare,
    handleSaveImage,
    handleTextShare,
    handleInstagramShare,
    handleTikTokShare,
    generateCardImage,
  };
};
