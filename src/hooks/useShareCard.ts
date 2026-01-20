import { useState, useRef, useCallback, RefObject } from 'react';
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

// Robust clipboard copy that works on mobile Safari
const copyToClipboardRobust = async (text: string): Promise<boolean> => {
  // Method 1: Modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy method
    }
  }

  // Method 2: Legacy execCommand with proper focus handling for mobile Safari
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but still selectable
    textArea.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 2em;
      height: 2em;
      padding: 0;
      border: none;
      outline: none;
      box-shadow: none;
      background: transparent;
      font-size: 16px;
    `;
    
    document.body.appendChild(textArea);
    
    // iOS-specific handling
    if (isIOS()) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, text.length);
    } else {
      textArea.focus();
      textArea.select();
    }
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
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
  const [isPreGenerating, setIsPreGenerating] = useState(false);
  const preGeneratedImageRef = useRef<{ blob: Blob; file: File } | null>(null);

  const generateCardImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const element = cardRef.current;
      
      // Clone the element to avoid modifying the original
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Apply inline styles to ensure visibility during capture
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = `${element.offsetWidth}px`;
      clone.style.zIndex = '-1';
      clone.style.opacity = '1';
      clone.style.visibility = 'visible';
      // Add extra padding at bottom to prevent text clipping
      clone.style.paddingBottom = '4px';
      
      // Append to body temporarily
      document.body.appendChild(clone);
      
      // Wait for any images/fonts to load and layout to settle
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Get the actual rendered height including any overflow
      const computedStyle = window.getComputedStyle(clone);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const scrollHeight = clone.scrollHeight;
      const captureHeight = Math.max(clone.offsetHeight, scrollHeight) + 2; // Extra 2px safety margin

      const canvas = await html2canvas(clone, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: clone.offsetWidth,
        height: captureHeight,
        windowWidth: clone.offsetWidth,
        windowHeight: captureHeight,
        onclone: (clonedDoc, clonedElement) => {
          // Ensure all elements are visible in the clone
          clonedElement.style.opacity = '1';
          clonedElement.style.visibility = 'visible';
          clonedElement.style.display = 'block';
          clonedElement.style.overflow = 'visible';
        },
      });
      
      // Clean up the clone
      document.body.removeChild(clone);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.92);
      });
    } catch (err) {
      console.error('Failed to generate image:', err);
      return null;
    }
  }, [cardRef]);

  // Pre-generate image when menu opens for instant "Save to Photos"
  const handleMenuOpen = useCallback(async () => {
    // Don't re-generate if we already have one
    if (preGeneratedImageRef.current || isPreGenerating) return;
    
    setIsPreGenerating(true);
    try {
      const blob = await generateCardImage();
      if (blob) {
        const filename = `${imageName}.jpg`;
        const file = new File([blob], filename, { type: 'image/jpeg' });
        preGeneratedImageRef.current = { blob, file };
      }
    } catch (err) {
      console.error('Pre-generation failed:', err);
    } finally {
      setIsPreGenerating(false);
    }
  }, [generateCardImage, imageName, isPreGenerating]);

  // Clear pre-generated image (call when card content changes)
  const clearPreGeneratedImage = useCallback(() => {
    preGeneratedImageRef.current = null;
  }, []);

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
    // iOS Safari requires navigator.share() to be called from a direct user gesture.
    // If the image isn't pre-generated yet, don't generate it here (async) because it can lose
    // the user gesture and force a download fallback.
    if (!preGeneratedImageRef.current) {
      void handleMenuOpen();
      toast.info('Preparing image…', {
        description: 'Give it a second, then tap “Save to Photos” again.',
        duration: 3500,
      });
      return;
    }

    setIsGeneratingImage(true);

    try {
      const imageBlob = preGeneratedImageRef.current.blob;
      const file = preGeneratedImageRef.current.file;

      // ALWAYS try native share sheet first on mobile - this is the only way to "Save to Photos"
      if (navigator.share && file) {
        try {
          await navigator.share({
            title,
            files: [file],
          });
          // Clear pre-generated after successful share
          preGeneratedImageRef.current = null;
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') {
            // User cancelled - don't clear, they might try again
            return;
          }
          // Share failed, continue to fallback
          console.log('Native share failed, falling back:', err);
        }
      }

      // Fallback: trigger download
      const filename = `${imageName}.jpg`;
      triggerDownload(imageBlob, filename);
      preGeneratedImageRef.current = null;
      
      if (isMobile()) {
        if (isIOS()) {
          toast.info('Image saved to Files', {
            description: 'To save to Photos: Open Files app → Downloads → Tap image → Tap share icon → "Save Image"',
            duration: 8000,
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
      // Use pre-generated image if available
      let imageBlob: Blob | null = preGeneratedImageRef.current?.blob ?? null;
      let file: File | null = preGeneratedImageRef.current?.file ?? null;
      
      if (!imageBlob) {
        imageBlob = await generateCardImage();
        if (imageBlob) {
          file = new File([imageBlob], `${imageName}.jpg`, { type: 'image/jpeg' });
        }
      }
      
      // Mobile: try native share
      if (navigator.share) {
        // Try with image first
        if (file && await canShareFiles(file)) {
          try {
            await navigator.share({
              title,
              text: shareText,
              files: [file],
            });
            preGeneratedImageRef.current = null;
            return; // Success
          } catch (err) {
            if ((err as Error).name === 'AbortError') return;
            // Continue to try without file
            console.log('Share with file failed, trying without:', err);
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
      
      // Desktop/fallback: copy to clipboard using robust method
      const textToCopy = shareText + '\n' + shareUrl;
      const copied = await copyToClipboardRobust(textToCopy);
      
      if (copied) {
        toast.success('Copied to clipboard!', {
          description: 'Paste it in your text message',
        });
      } else {
        toast.error('Could not copy. Try long-pressing to select and copy the link.');
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
      // Use pre-generated image if available
      let blob: Blob | null = preGeneratedImageRef.current?.blob ?? null;
      
      if (!blob) {
        blob = await generateCardImage();
      }
      
      if (!blob) {
        toast.error('Failed to generate image');
        return;
      }
      
      const filename = `${imageName}.jpg`;
      triggerDownload(blob, filename);
      preGeneratedImageRef.current = null;
      
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
      // Use pre-generated image if available
      let blob: Blob | null = preGeneratedImageRef.current?.blob ?? null;
      
      if (!blob) {
        blob = await generateCardImage();
      }
      
      if (!blob) {
        toast.error('Failed to generate image');
        return;
      }
      
      const filename = `${imageName}.jpg`;
      triggerDownload(blob, filename);
      preGeneratedImageRef.current = null;
      
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
    isPreGenerating,
    handleMenuOpen,
    clearPreGeneratedImage,
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
