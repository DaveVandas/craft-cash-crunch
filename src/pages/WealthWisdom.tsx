import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Sparkles, 
  BookOpen, 
  Mail, 
  TrendingUp, 
  Quote, 
  Star,
  Flame,
  Crown,
  Rocket,
  Target,
  Share2,
  MessageCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Library
} from 'lucide-react';
import {
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/share/ShareMenuDropdown';
import { getShareUrl } from '@/lib/shareUrls';
import { WEALTH_STORIES, getWeeklyStory, getStoryId, type WealthStory } from '@/lib/wealthWisdomStories';

const quickWisdom = [
  { icon: "💰", title: "The 10x Rule", text: "Grant Cardone says success requires 10x the effort you think. Most people underestimate what it takes." },
  { icon: "📈", title: "Compound Interest", text: "Einstein called it the 8th wonder. $100/month at 10% for 40 years = $632,408. Start now." },
  { icon: "🧠", title: "Invest in Yourself", text: "Warren Buffett says the best investment is in your own abilities. 50% of billionaires read 1+ book per week." },
  { icon: "⏰", title: "Time is Money", text: "Calculate your hourly rate. Every hour wasted on non-productive activities costs you that amount." },
];

const BASE_SUBSCRIBER_COUNT = 8245;

const WealthWisdom = () => {
  const [showArchive, setShowArchive] = useState(false);
  const [expandedArchiveStory, setExpandedArchiveStory] = useState<number | null>(null);
  
  const story = getWeeklyStory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert({ 
          email: email.toLowerCase().trim(),
          name: name.trim() || null,
          source: 'wealth_wisdom_blog'
        });
      
      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed! 🎉");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to the winners circle! 🏆", {
          description: "You'll receive our weekly wealth wisdom soon."
        });
        setSubscribed(true);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SITE_URL = "https://earningsexplorer.shop";
  
  const storyId = getStoryId(story);
  
  const trackShare = async (platform: string) => {
    try {
      await supabase.rpc('track_story_share', {
        p_story_id: storyId,
        p_story_title: story.title,
        p_platform: platform
      });
    } catch {
      // Silent fail
    }
  };
  
  const ogShareUrl = getShareUrl('wealth-wisdom');
  
  const getStoryShareText = () => {
    return `📚 ${story.title}\n\n"${story.quote}"\n\n🔥 Read the full rags-to-riches story`;
  };

  const handleStoryNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: getStoryShareText(),
          url: ogShareUrl,
        });
        trackShare('native');
      } catch {
        // User cancelled
      }
    } else {
      handleStoryCopyText();
    }
  };

  const handleStoryWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getStoryShareText() + '\n\n' + ogShareUrl)}`, '_blank');
    trackShare('whatsapp');
  };

  const handleStoryTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getStoryShareText())}&url=${encodeURIComponent(ogShareUrl)}`, '_blank', 'width=550,height=420');
    trackShare('twitter');
  };

  const handleStoryFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogShareUrl)}&quote=${encodeURIComponent(story.title)}`, '_blank', 'width=550,height=420');
    trackShare('facebook');
  };

  const handleStoryLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogShareUrl)}`, '_blank', 'width=550,height=420');
    trackShare('linkedin');
  };

  const handleStoryInstagramShare = () => {
    handleStoryCopyText();
    toast.success('Text copied! Open Instagram and paste in your story or post.');
    trackShare('instagram');
  };

  const handleStoryTikTokShare = () => {
    handleStoryCopyText();
    toast.success('Text copied! Open TikTok and paste in your video caption.');
    trackShare('tiktok');
  };

  const handleStoryCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getStoryShareText() + '\n\n' + ogShareUrl);
      toast.success('Story copied to clipboard!');
      trackShare('copy');
    } catch {
      toast.error('Failed to copy');
    }
  };

  // Get current story index so we can exclude it from archive
  const currentStoryIndex = WEALTH_STORIES.indexOf(story);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pb-24 md:pb-0">
        <div className="container pt-4">
          <Breadcrumb currentPage="Wealth Wisdom" />
        </div>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-amber-500/10 to-transparent" />
          <div className="absolute top-20 right-10 text-6xl opacity-20 animate-pulse">💎</div>
          <div className="absolute bottom-20 left-10 text-5xl opacity-20 animate-bounce">🚀</div>
          
          <div className="container relative">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Weekly Inspiration
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                Wealth <span className="gradient-gold-text">Wisdom</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Inspiring stories of people who started with nothing and built empires.
                Real strategies. Real lessons. Real motivation.
              </p>
              <p className="text-sm text-muted-foreground">
                {WEALTH_STORIES.length} stories · New story every week · Browse the full archive below
              </p>
            </div>
          </div>
        </section>
        
        {/* Email signup section - coming soon once email infrastructure is set up */}
        
        {/* Featured Story */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl font-bold">This Week's Story</h2>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleStoryNativeShare} className="cursor-pointer">
                      <MessageCircle className="h-4 w-4" />
                      <span className="ml-2">Text / Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryWhatsAppShare} className="cursor-pointer">
                      <WhatsAppIcon />
                      <span className="ml-2">WhatsApp</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryTwitterShare} className="cursor-pointer">
                      <TwitterIcon />
                      <span className="ml-2">X (Twitter)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryFacebookShare} className="cursor-pointer">
                      <FacebookIcon />
                      <span className="ml-2">Facebook</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryLinkedInShare} className="cursor-pointer">
                      <LinkedInIcon />
                      <span className="ml-2">LinkedIn</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryInstagramShare} className="cursor-pointer">
                      <InstagramIcon />
                      <span className="ml-2">Instagram</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryTikTokShare} className="cursor-pointer">
                      <TikTokIcon />
                      <span className="ml-2">TikTok</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStoryCopyText} className="cursor-pointer">
                      <Copy className="h-4 w-4" />
                      <span className="ml-2">Copy Text</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Badge variant="outline">
                  <Flame className="h-3 w-3 mr-1 text-orange-500" />
                  Featured
                </Badge>
              </div>
            </div>
            
            <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-6xl mb-4">{story.image}</div>
                <CardTitle className="font-serif text-2xl md:text-3xl leading-tight">
                  {story.title}
                </CardTitle>
                <p className="text-lg text-muted-foreground">{story.subtitle}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-lg font-medium text-primary/90 border-l-4 border-primary pl-4">
                  {story.intro}
                </p>
                
                <div className="prose prose-invert max-w-none">
                  {story.story.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph.startsWith('**') ? (
                        <span className="font-semibold text-foreground text-lg block mt-6 mb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </span>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
                
                <Separator className="my-8" />
                
                {/* Quote */}
                <div className="relative p-6 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-lg">
                  <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/30" />
                  <blockquote className="text-lg md:text-xl italic text-center px-8 py-4">
                    "{story.quote}"
                  </blockquote>
                </div>
                
                {/* Key Lessons */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Key Takeaways</h3>
                  </div>
                  <div className="grid gap-3">
                    {story.lessons.map((lesson, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Quick Wisdom Section */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <Rocket className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl font-bold">Quick Wealth Wisdom</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickWisdom.map((item, i) => (
                <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story Archive */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Library className="h-6 w-6 text-primary" />
                <h2 className="font-serif text-2xl font-bold">Story Archive</h2>
                <Badge variant="secondary" className="ml-2">{WEALTH_STORIES.length} Stories</Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowArchive(!showArchive)}
                className="gap-2"
              >
                {showArchive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showArchive ? 'Collapse' : 'Browse All'}
              </Button>
            </div>

            {!showArchive && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {WEALTH_STORIES.slice(0, 8).map((s, i) => (
                  <Card 
                    key={i} 
                    className={`cursor-pointer hover:border-primary/50 transition-all hover:shadow-md ${i === currentStoryIndex ? 'border-primary/50 ring-1 ring-primary/30' : 'border-border/50'}`}
                    onClick={() => {
                      setShowArchive(true);
                      setExpandedArchiveStory(i);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{s.image}</span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2">{s.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{s.subtitle}</p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {s.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                            ))}
                            {i === currentStoryIndex && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">This Week</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {showArchive && (
              <div className="space-y-4">
                {WEALTH_STORIES.map((s, i) => (
                  <Card 
                    key={i} 
                    className={`overflow-hidden transition-all ${i === currentStoryIndex ? 'border-primary/50' : 'border-border/50'}`}
                  >
                    <div 
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center gap-4"
                      onClick={() => setExpandedArchiveStory(expandedArchiveStory === i ? null : i)}
                    >
                      <span className="text-4xl flex-shrink-0">{s.image}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{s.title}</h4>
                          {i === currentStoryIndex && (
                            <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                              <Flame className="h-3 w-3 mr-1" />This Week
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{s.subtitle}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {s.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedArchiveStory === i ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {expandedArchiveStory === i && (
                      <div className="px-4 pb-6 pt-2 border-t border-border/50">
                        <p className="text-primary/90 font-medium border-l-4 border-primary pl-4 mb-4">
                          {s.intro}
                        </p>
                        
                        <div className="prose prose-invert max-w-none mb-6">
                          {s.story.split('\n\n').map((paragraph, pi) => (
                            <p key={pi} className="text-muted-foreground leading-relaxed mb-3 text-sm">
                              {paragraph.startsWith('**') ? (
                                <span className="font-semibold text-foreground block mt-4 mb-1">
                                  {paragraph.replace(/\*\*/g, '')}
                                </span>
                              ) : (
                                paragraph
                              )}
                            </p>
                          ))}
                        </div>

                        <div className="relative p-4 bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-lg mb-6">
                          <Quote className="absolute top-3 left-3 h-6 w-6 text-primary/30" />
                          <blockquote className="text-base italic text-center px-6 py-2">
                            "{s.quote}"
                          </blockquote>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold text-sm">Key Takeaways</h4>
                        </div>
                        <div className="grid gap-2">
                          {s.lessons.map((lesson, li) => (
                            <div key={li} className="flex items-start gap-2 p-2 rounded bg-muted/30 text-sm">
                              <span className="text-primary font-bold">{li + 1}.</span>
                              <span>{lesson}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Bottom CTA */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          <div className="container relative text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-serif text-3xl font-bold mb-4">
              Ready to Write Your Story?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Every billionaire started somewhere. Use our tools to see how the wealthy got there — 
              and get inspired to build your own path.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <a href="/">
                  <TrendingUp className="h-4 w-4" />
                  Explore Earnings
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <a href="/calculator">
                  <Star className="h-4 w-4" />
                  Reality Check
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default WealthWisdom;
