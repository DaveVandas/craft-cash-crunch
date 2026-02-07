import { useState, useEffect } from 'react';
import { Quote, MessageCircle, Copy } from 'lucide-react';
import PremiumShareIconButton from '@/components/share/PremiumShareIconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/share/ShareMenuDropdown';

interface RichHabit {
  habit: string;
  source: string;
}

const richHabits: RichHabit[] = [
  { habit: "Wake up early. 90% of executives wake before 6am.", source: "Success Study" },
  { habit: "Read daily. Warren Buffett reads 500 pages a day.", source: "Warren Buffett" },
  { habit: "Pay yourself first. Save before you spend.", source: "The Richest Man in Babylon" },
  { habit: "Network relentlessly. Your net worth equals your network.", source: "Tim Ferriss" },
  { habit: "Think long-term. Compound interest is the 8th wonder.", source: "Albert Einstein" },
  { habit: "Invest in yourself. The best ROI is self-improvement.", source: "Benjamin Franklin" },
  { habit: "Track every dollar. What gets measured gets managed.", source: "Peter Drucker" },
  { habit: "Avoid lifestyle inflation. Live below your means.", source: "Dave Ramsey" },
  { habit: "Take calculated risks. Fortune favors the bold.", source: "Elon Musk" },
  { habit: "Multiple income streams. Never rely on one source.", source: "Robert Kiyosaki" },
  { habit: "Learn to say no. Protect your time fiercely.", source: "Steve Jobs" },
  { habit: "Automate savings. Remove emotion from investing.", source: "Tony Robbins" },
  { habit: "Embrace failure. Every setback is a setup for comeback.", source: "Oprah Winfrey" },
  { habit: "Stay curious. Never stop learning new skills.", source: "Jeff Bezos" },
  { habit: "Think in decades, not days. Patience builds empires.", source: "Naval Ravikant" },
  { habit: "Surround yourself with excellence. You are the average of 5 people.", source: "Jim Rohn" },
  { habit: "Action beats perfection. Start before you feel ready.", source: "Richard Branson" },
  { habit: "Guard your reputation. It takes years to build, seconds to destroy.", source: "Warren Buffett" },
  { habit: "Own assets, not liabilities. Make money work for you.", source: "Rich Dad Poor Dad" },
  { habit: "Stay hungry, stay foolish. Complacency kills success.", source: "Steve Jobs" },
];

const SITE_URL = "https://earningsexplorer.shop";

const RichHabits = () => {
  const [habit, setHabit] = useState<RichHabit | null>(null);

  useEffect(() => {
    // Pick a random habit on mount (changes each time app opens)
    const randomIndex = Math.floor(Math.random() * richHabits.length);
    setHabit(richHabits[randomIndex]);
  }, []);

  if (!habit) return null;

  const shareText = `💰 Rich Habit: "${habit.habit}"\n\n— ${habit.source}\n\n🔥 More wealth wisdom at ${SITE_URL}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rich Habit',
          text: shareText,
          url: SITE_URL,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(`💰 "${habit.habit}" — ${habit.source}`)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleInstagramShare = () => {
    handleCopyText();
    toast.success('Text copied! Open Instagram and paste in your story or post.');
  };

  const handleTikTokShare = () => {
    handleCopyText();
    toast.success('Text copied! Open TikTok and paste in your video caption.');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="relative py-6">
      <div className="flex items-start gap-3 max-w-2xl mx-auto px-4">
        <Quote className="h-5 w-5 text-primary/40 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="text-sm md:text-base text-foreground/80 italic leading-relaxed">
            {habit.habit}
          </p>
          <p className="text-xs text-muted-foreground">
            — {habit.source}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <PremiumShareIconButton className="shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
              <MessageCircle className="h-4 w-4" />
              <span className="ml-2">Text / Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
              <WhatsAppIcon />
              <span className="ml-2">WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
              <TwitterIcon />
              <span className="ml-2">X (Twitter)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
              <FacebookIcon />
              <span className="ml-2">Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLinkedInShare} className="cursor-pointer">
              <LinkedInIcon />
              <span className="ml-2">LinkedIn</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInstagramShare} className="cursor-pointer">
              <InstagramIcon />
              <span className="ml-2">Instagram</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTikTokShare} className="cursor-pointer">
              <TikTokIcon />
              <span className="ml-2">TikTok</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer">
              <Copy className="h-4 w-4" />
              <span className="ml-2">Copy Text</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default RichHabits;
