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
      // Get the actual dimensions of the element including all content
      const element = cardRef.current;
      const rect = element.getBoundingClientRect();

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        // Ensure full element is captured regardless of scroll position
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        // Force the canvas to match the element's full height
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
      toast.success('Copied to clipboard!', {
        description: 'Paste it anywhere to share',
      });
    } catch {
      toast.error('Failed to copy to clipboard');
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
      if (!imageBlob) return;

      const file = new File([imageBlob], `${imageName}.jpg`, { type: 'image/jpeg' });

      // Prefer the native share sheet on mobile (users can choose “Save Image” / Photos)
      if (navigator.share) {
        try {
          const canShareFiles =
            !('canShare' in navigator) ||
            !navigator.canShare ||
            navigator.canShare({ files: [file] });

          if (canShareFiles) {
            await navigator.share({ title, files: [file] } as unknown as ShareData);
            toast.success('Ready to save to Photos', {
              description: 'In the share sheet, choose “Save Image”',
            });
            return;
          }
        } catch (err) {
          // User cancelled
          if ((err as Error).name === 'AbortError') return;
          // Fall through to fallback
        }
      }

      // Fallback: trigger download (works on both mobile and desktop)
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Image saved!', {
        description: 'Check your downloads folder',
      });
    } catch {
      toast.error('Failed to save image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTextShare = async () => {
    setIsGeneratingImage(true);
    
    try {
      const imageBlob = await generateCardImage();
      
      // Try native share with image first (works on mobile)
      if (navigator.share) {
        if (imageBlob && navigator.canShare) {
          const file = new File([imageBlob], `${imageName}.jpg`, { type: 'image/jpeg' });
          const shareData = {
            title,
            text: shareText,
            url: shareUrl,
            files: [file],
          };
          
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            setIsGeneratingImage(false);
            return;
          }
        }
        
        // Share without image
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Desktop fallback - copy to clipboard
        await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
        toast.success('Copied to clipboard!', {
          description: 'Paste it in your text message',
        });
      }
    } catch (err) {
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
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${imageName}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Card saved! Open Instagram → Stories → Select the image from your gallery', {
          duration: 6000,
        });
      }
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
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${imageName}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Card saved! Open TikTok → Create → Add the image from your gallery', {
          duration: 6000,
        });
      }
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
