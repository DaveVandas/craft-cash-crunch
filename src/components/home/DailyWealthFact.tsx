import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { MessageCircle, Copy } from 'lucide-react';

const wealthFacts = [
  // Billionaire comparisons
  "Jeff Bezos earns the median US annual salary every 11.5 seconds.",
  "Elon Musk could give every person on Earth $3 and still have billions left.",
  "If you made $5,000 a day since Columbus landed in America, you still would not have $1 billion.",
  "Bill Gates could spend $1 million every day for 400 years before running out.",
  "Mark Zuckerberg made $27 billion in a single day when Meta stock surged in 2024.",
  "Warren Buffett has given away over $50 billion — and is still worth $130+ billion.",
  "Larry Ellison earns about $36,000 per minute from Oracle dividends alone.",
  "The Walton family (Walmart heirs) earns $70,000 per minute from their holdings.",
  "Bernard Arnault (LVMH) added $62 billion to his net worth in 2023 alone.",
  
  // Celebrity earnings
  "Taylor Swift's Eras Tour grossed $2.2 billion — more than the GDP of 30 countries.",
  "LeBron James makes more in one game than most Americans earn in 5 years.",
  "Cristiano Ronaldo earns $1.6 million per Instagram post.",
  "Beyoncé's net worth could fund NASA for 3 months.",
  "MrBeast spends more on a single video than most movies cost to make.",
  "Dwayne Johnson earned $270 million for a single movie (Red One).",
  "Tiger Woods has earned over $1.8 billion in his career — mostly from endorsements.",
  "Lionel Messi earns approximately $1.5 million per week.",
  "Oprah Winfrey makes about $315 million per year — over $36,000 per hour.",
  "Drake earns roughly $50 million annually just from streaming royalties.",
  "Kylie Jenner made $590 million selling 51% of her cosmetics company.",
  "Michael Jordan earns more from Nike annually than he ever did playing basketball.",
  "Rihanna is worth over $1.4 billion — mostly from Fenty Beauty, not music.",
  "Jay-Z became hip-hop's first billionaire in 2019.",
  
  // Corporate comparisons
  "Apple makes $1.7 million every 5 minutes.",
  "Amazon processes over $17,000 in sales every second.",
  "Google earns over $700 million per day from advertising alone.",
  "Netflix spends more on content annually than most countries spend on their military.",
  "Microsoft makes $1 billion in profit every 3 days.",
  "Nvidia's market cap grew by $200 billion in a single day in 2024.",
  
  // Inequality facts
  "The top 1% own more wealth than the bottom 90% combined.",
  "A billionaire spending $1,000 is like you spending less than a penny.",
  "The 10 richest people could lose 99.999% of their wealth and still be millionaires.",
  "The average CEO makes 344 times more than their median worker.",
  "It would take the average American worker 3.75 million years to earn $1 billion.",
  "The wealth of the top 5 billionaires has doubled since 2020.",
  
  // Historical wealth
  "Mansa Musa (14th century) was so rich he caused inflation across the Mediterranean.",
  "John D. Rockefeller's peak net worth was 2% of the entire US economy.",
  "Cleopatra's Egypt had more gold reserves than most modern central banks.",
  "The Medici family funded the entire Renaissance from their banking fortune.",
  "Andrew Carnegie gave away 90% of his fortune — $350 billion in today's dollars.",
  
  // Mind-bending comparisons
  "If you stacked $1 billion in $100 bills, it would be 3,300 feet tall.",
  "A million seconds is 12 days. A billion seconds is 32 years.",
  "Elon Musk could buy every NFL, NBA, MLB, and NHL team — and still have $150 billion left.",
  "Jeff Bezos's wealth could give every Amazon employee a $200,000 bonus.",
  "The iPhone you are holding costs more than 90% of the world earns in a month.",
];

const SITE_URL = "https://earningsexplorer.shop";

const DailyWealthFact = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get today's fact based on date
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setFactIndex(dayOfYear % wealthFacts.length);
  }, []);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % wealthFacts.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const shuffleFact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setFactIndex(prev => (prev + 1) % wealthFacts.length);
      setIsAnimating(false);
    }, 300);
  };

  const currentFact = wealthFacts[factIndex];
  const shareText = `💡 Did you know? ${currentFact}\n\n🔥 Discover more jaw-dropping wealth facts at ${SITE_URL}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wealth Fact',
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
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(`💡 Did you know? ${currentFact}`)}`;
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
    <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 px-4 py-2 group hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center gap-3">
        <Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
        <p 
          className={`text-sm text-muted-foreground flex-1 transition-all duration-300 ${
            isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
        >
          <span className="text-primary font-medium">Did you know?</span> {currentFact}
        </p>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={shuffleFact}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isAnimating ? 'animate-spin' : ''}`} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Share2 className="h-3.5 w-3.5" />
              </Button>
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
    </div>
  );
};

export default DailyWealthFact;
