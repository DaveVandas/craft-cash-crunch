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

// Safari/iOS can return a "successful" canvas with foreignObjectRendering but render it as a blank/black image.
const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // Chrome on iOS uses Safari engine but includes CriOS; treat it as Safari engine too.
  const isAppleWebKit = /AppleWebKit\//.test(ua);
  const isChrome = /Chrome\//.test(ua) || /CriOS\//.test(ua);
  const isFirefox = /Firefox\//.test(ua) || /FxiOS\//.test(ua);
  const isSafariLike = isAppleWebKit && !isChrome && !isFirefox;
  return isSafariLike || isIOS();
};

const getCaptureScale = (): number => (isMobile() ? 1.5 : 2);

const prepareCloneForCapture = (root: HTMLElement) => {
  // Force overflow visible on clone tree to avoid clipping
  root.querySelectorAll('*').forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl?.style) htmlEl.style.overflow = 'visible';
  });

  // Hint CORS for images when possible
  root.querySelectorAll('img').forEach((img) => {
    if (!img.getAttribute('crossorigin')) img.setAttribute('crossorigin', 'anonymous');
  });
};

const normalizeGradientTextForCanvas = (root: HTMLElement) => {
  // html2canvas (esp. without foreignObjectRendering) often drops background-clip:text,
  // resulting in fully transparent text (looks like a black card). For the clone only,
  // convert gradient-text to solid text using computed color.
  const isNearBlack = (cssColor: string): boolean => {
    const m = cssColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return false;
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    const brightness = (r + g + b) / 3;
    return brightness < 40;
  };

  const nodes = Array.from(root.querySelectorAll<HTMLElement>('*'));
  nodes.forEach((node) => {
    const cs = window.getComputedStyle(node);
    const webkitFill = (cs as unknown as { webkitTextFillColor?: string }).webkitTextFillColor;
    const isTransparentFill =
      webkitFill === 'transparent' ||
      webkitFill === 'rgba(0, 0, 0, 0)' ||
      cs.color === 'transparent' ||
      cs.color === 'rgba(0, 0, 0, 0)';

    if (!isTransparentFill) return;

    // Use computed color so the screenshot matches theme as closely as possible.
    // Some gradient-text nodes report a default computed color (often black) even though
    // the actual visible text comes from the gradient. If we blindly use that, the text
    // becomes effectively invisible on dark cards.
    const fallbackColor =
      cs.color && cs.color !== 'transparent' && !isNearBlack(cs.color)
        ? cs.color
        : 'rgb(245, 243, 238)';
    (node.style as unknown as { webkitTextFillColor?: string }).webkitTextFillColor = fallbackColor;
    node.style.color = fallbackColor;
    node.style.backgroundImage = 'none';
    (node.style as unknown as { webkitBackgroundClip?: string }).webkitBackgroundClip = 'border-box';
    node.style.backgroundClip = 'border-box';
  });
};

const isCanvasMostlyBackground = (canvas: HTMLCanvasElement): boolean => {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    const { width, height } = canvas;
    const sampleCount = 80;
    let darkish = 0;
    let total = 0;

    for (let i = 0; i < sampleCount; i++) {
      const x = Math.floor((i / sampleCount) * (width - 1));
      const y = Math.floor((((i * 13) % sampleCount) / sampleCount) * (height - 1));
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const brightness = (r + g + b) / 3;
      if (brightness < 20) darkish++;
      total++;
    }

    // If almost all sampled pixels are near-black, the render likely failed.
    return total > 0 && darkish / total > 0.95;
  } catch {
    return false;
  }
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

      // Off-screen capture wrapper (keeps inherited styles stable and avoids viewport clipping)
      const elementRect = element.getBoundingClientRect();
      const width = Math.ceil(elementRect.width);

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = `${width}px`;
      clone.style.maxWidth = `${width}px`;
      clone.style.boxSizing = 'border-box';

      prepareCloneForCapture(clone);

       const captureRoot = document.createElement('div');
       // NOTE: Using large transforms for off-screen positioning can cause WebKit
       // to “paint” nothing (resulting in black captures). A negative left keeps
       // it out of view while remaining paintable.
       captureRoot.style.cssText = `
         position: fixed;
         left: -10000px;
         top: 0;
         width: ${width}px;
         padding: 0 0 8px 0;
         overflow: visible;
         z-index: 2147483647;
         pointer-events: none;
       `;
      captureRoot.appendChild(clone);

      document.body.appendChild(captureRoot);

      try {
        // Wait for fonts to fully load (prevents baseline/vertical metric shifts)
        if (document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 500)),
          ]);
        }

        // Wait for images in the clone so layout doesn't shift during capture
        const imgs = Array.from(clone.querySelectorAll('img'));
        if (imgs.length) {
          await Promise.race([
            Promise.all(
              imgs.map(
                (img) =>
                  img.complete
                    ? Promise.resolve()
                    : new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                      })
              )
            ),
            new Promise((resolve) => setTimeout(resolve, 500)),
          ]);
        }

        // Normalize gradient/clip text so it doesn't disappear in canvas renders
        normalizeGradientTextForCanvas(clone);

        // Let layout settle for a couple paint cycles
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await new Promise((resolve) => setTimeout(resolve, 150));

        const height = Math.ceil(captureRoot.scrollHeight);

        const baseOptions = {
          backgroundColor: '#0a0a0a',
          scale: getCaptureScale(),
          useCORS: true,
          allowTaint: false,
          logging: false,
          width,
          height,
          scrollX: 0,
          scrollY: 0,
          windowWidth: width,
          windowHeight: height,
        } as const;

         // Prefer foreignObjectRendering except on Safari where it can silently render black.
         const preferForeignObject = !isSafari();

         const attemptRender = async (options: Parameters<typeof html2canvas>[1]) => {
           return html2canvas(captureRoot, options);
         };

         let canvas: HTMLCanvasElement | null = null;

         // Attempt 1: preferred strategy
         if (preferForeignObject) {
           try {
             canvas = await attemptRender({ ...baseOptions, foreignObjectRendering: true });
           } catch {
             canvas = await attemptRender(baseOptions);
           }
         } else {
           canvas = await attemptRender(baseOptions);
         }

         // Attempt 2: safer settings (no foreignObject, lower scale)
         if (canvas && isCanvasMostlyBackground(canvas)) {
           canvas = await attemptRender({
             ...baseOptions,
             foreignObjectRendering: false,
             scale: 1.25,
           });
         }

         // Attempt 3: last-resort toggle (sometimes helps on non-standard WebKit wrappers)
         if (canvas && isCanvasMostlyBackground(canvas)) {
           try {
             canvas = await attemptRender({
               ...baseOptions,
               foreignObjectRendering: true,
               scale: 1.25,
             });
           } catch {
             // keep previous canvas
           }
         }

         if (!canvas) return null;

         // If it's still basically a solid background, don't return a black image.
         if (isCanvasMostlyBackground(canvas)) {
           throw new Error('CAPTURE_RENDER_FAILED');
         }

        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.92);
        });
      } finally {
        document.body.removeChild(captureRoot);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'CAPTURE_RENDER_FAILED') {
        toast.error('Could not generate the share image on this device.', {
          description: 'Try again, or use a different browser/device to export the card.',
        });
      }
      return null;
    }
  }, [cardRef]);

  // Pre-generate image when menu opens for instant "Save to Photos"
  const handleMenuOpen = useCallback(async () => {
    // Don't re-generate if we already have one or if already generating
    if (preGeneratedImageRef.current || isPreGenerating) return;
    
    setIsPreGenerating(true);
    try {
      // Add a small delay on mobile to prevent UI blocking
      if (isMobile()) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const blob = await generateCardImage();
      if (blob) {
        const filename = `${imageName}.jpg`;
        const file = new File([blob], filename, { type: 'image/jpeg' });
        preGeneratedImageRef.current = { blob, file };
      }
    } catch (_err) {
      // Pre-generation failed silently - will regenerate on demand
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
    } catch (_err) {
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
