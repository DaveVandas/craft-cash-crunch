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
import { getShareUrl } from '@/lib/shareUrls';
import { handleMobileAppShare } from '@/lib/mobileShare';
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
  "Elon Musk's net worth fluctuates by billions daily — more than most lottery jackpots.",
  "Jeff Bezos could buy a new house every hour for 1,000 years and still be rich.",
  "The top 10 billionaires have more wealth than the bottom 3.5 billion people.",
  
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
  "Kim Kardashian makes $1.8 million per sponsored Instagram post.",
  "Travis Kelce's endorsement deals doubled after dating Taylor Swift.",
  "Shaq has made more money since retiring than he did playing basketball.",
  "Post Malone spent $40,000 on Postmates delivery in one year.",
  "Snoop Dogg makes $500,000 just to show up at a party.",
  "Floyd Mayweather earned $275 million for a single 36-minute fight.",
  "Dr. Dre sold Beats to Apple for $3 billion — mostly from headphones.",
  "Kanye West made $1.8 billion from Yeezy before Adidas dropped him.",
  "Ed Sheeran's Mathematics Tour became the highest-grossing tour ever.",
  "Bad Bunny earned $88 million in 2023 — more than any Latin artist ever.",
  
  // Corporate comparisons
  "Apple makes $1.7 million every 5 minutes.",
  "Amazon processes over $17,000 in sales every second.",
  "Google earns over $700 million per day from advertising alone.",
  "Netflix spends more on content annually than most countries spend on their military.",
  "Microsoft makes $1 billion in profit every 3 days.",
  "Nvidia's market cap grew by $200 billion in a single day in 2024.",
  "Disney makes more in a day than most people will earn in 10 lifetimes.",
  "Walmart's revenue exceeds the GDP of 170 countries.",
  "Apple has more cash reserves than the US Treasury.",
  "Amazon delivers 1.6 million packages per day — that is 18 per second.",
  "Tesla's stock once rose $50 billion in a single trading session.",
  "Saudi Aramco made $161 billion profit in one year — $5,100 per second.",
  
  // Inequality facts
  "The top 1% own more wealth than the bottom 90% combined.",
  "A billionaire spending $1,000 is like you spending less than a penny.",
  "The 10 richest people could lose 99.999% of their wealth and still be millionaires.",
  "The average CEO makes 344 times more than their median worker.",
  "It would take the average American worker 3.75 million years to earn $1 billion.",
  "The wealth of the top 5 billionaires has doubled since 2020.",
  "8 people own as much wealth as the poorest half of humanity.",
  "The richest 1% captured 63% of all new wealth created since 2020.",
  "A minimum wage worker would need 7 million years to earn Elon's net worth.",
  "Billionaires add $2.7 billion to their fortunes every single day.",
  
  // Historical wealth
  "Mansa Musa (14th century) was so rich he caused inflation across the Mediterranean.",
  "John D. Rockefeller's peak net worth was 2% of the entire US economy.",
  "Cleopatra's Egypt had more gold reserves than most modern central banks.",
  "The Medici family funded the entire Renaissance from their banking fortune.",
  "Andrew Carnegie gave away 90% of his fortune — $350 billion in today's dollars.",
  "King Solomon's wealth would be worth $2.2 trillion in today's dollars.",
  "The Rothschild family was once worth more than every country's GDP combined.",
  "Julius Caesar was worth $4.6 trillion adjusted for inflation.",
  "Genghis Khan controlled 25% of Earth's land — the largest empire ever.",
  "Augustus Caesar had a fortune equal to 25% of the entire Roman economy.",
  
  // Mind-bending comparisons
  "If you stacked $1 billion in $100 bills, it would be 3,300 feet tall.",
  "A million seconds is 12 days. A billion seconds is 32 years.",
  "Elon Musk could buy every NFL, NBA, MLB, and NHL team — and still have $150 billion left.",
  "Jeff Bezos's wealth could give every Amazon employee a $200,000 bonus.",
  "The iPhone you are holding costs more than 90% of the world earns in a month.",
  "You'd need to spend $10,000 per day for 274 years to spend $1 billion.",
  "A stack of $1 billion in $1 bills would reach 68 miles into space.",
  "If Jeff Bezos dropped $1,000, picking it up would waste his time — he makes more per second.",
  "Elon Musk makes the average US salary every 3 seconds.",
  "If you earned $10,000 per day since ancient Egypt, you'd still have less than Bezos.",
  "1 billion seconds ago, it was 1993. 1 billion minutes ago was around 100 AD.",
  
  // Spending comparisons
  "Billionaires could end world hunger 7 times over with just 2% of their wealth.",
  "Jeff Bezos's yacht cost $500 million — plus a $75 million support yacht.",
  "Elon Musk paid $44 billion for Twitter — the GDP of Ethiopia.",
  "Mark Cuban bought the Dallas Mavericks for $285 million — now worth $4 billion.",
  "Larry Ellison owns 98% of the Hawaiian island Lanai.",
  "Bill Gates owns more US farmland than anyone — 270,000 acres.",
  "The most expensive home ever sold was $238 million — a penthouse in NYC.",
  "A Bugatti Chiron costs $3 million. Musk could buy 100,000 of them.",
  "The most expensive yacht ever built cost $600 million — owned by a Russian oligarch.",
  "Jeff Bezos's space flight cost $5.5 billion — that is $55 million per minute.",
  
  // Sports wealth
  "The Dallas Cowboys are worth $9 billion — more than many countries' economies.",
  "Tiger Woods made $100 million playing and $1.7 billion from endorsements.",
  "Patrick Mahomes signed a $450 million contract — the largest in sports history.",
  "Real Madrid is worth $6.6 billion — more than Netflix when it started.",
  "Michael Jordan's $10 million gambling loss is 0.3% of his net worth.",
  "Shohei Ohtani's $700 million contract would take 14,000 years at minimum wage.",
  "The average NFL team is worth $4.5 billion — up 12% from last year.",
  "The Saudi Pro League spent $900 million on players in one transfer window.",
];

const DailyWealthFact = () => {
  const ogShareUrl = getShareUrl('wealth-facts');
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
  // Keep share text SHORT to avoid truncation in messaging apps
  const shareText = `💡 ${currentFact}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wealth Fact',
          text: shareText,
          url: ogShareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${ogShareUrl}`)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ogShareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogShareUrl)}&quote=${encodeURIComponent(`💡 Did you know? ${currentFact}`)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogShareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleInstagramShare = async () => {
    await handleMobileAppShare(
      shareText,
      ogShareUrl,
      'Wealth Fact',
      handleCopyText,
      { success: 'Text copied!', description: 'Open Instagram and paste in your story or post.' }
    );
  };

  const handleTikTokShare = async () => {
    await handleMobileAppShare(
      shareText,
      ogShareUrl,
      'Wealth Fact',
      handleCopyText,
      { success: 'Text copied!', description: 'Open TikTok and paste in your video caption.' }
    );
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${ogShareUrl}`);
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
