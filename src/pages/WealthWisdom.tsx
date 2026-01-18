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
  Target
} from 'lucide-react';

// Featured story - rotates every 3 days for more frequent updates
const getWeeklyStory = () => {
  const stories = [
    {
      title: "From Homeless to Billionaire: The Howard Schultz Story",
      subtitle: "How a kid from the projects built a $100B coffee empire",
      image: "☕",
      intro: "Growing up in the Brooklyn projects, Howard Schultz never imagined he'd one day run one of the most valuable brands on Earth.",
      story: `Howard Schultz was born in 1953 in the Bayview Housing Projects of Brooklyn, New York. His father was a truck driver who never earned more than $20,000 a year. When Howard was seven, his father broke his ankle at work and lost his job — with no health insurance, no worker's compensation, and no safety net.

That moment of seeing his family's vulnerability shaped everything that followed.

**The Turning Point**

Schultz became the first in his family to attend college, earning a football scholarship to Northern Michigan University. After graduating, he worked his way up in sales before discovering a small coffee bean company in Seattle called Starbucks.

In 1982, he joined as Director of Marketing. But he had a bigger vision — he wanted to transform it from a bean seller into an Italian-style espresso bar experience.

The founders said no.

**Betting Everything**

So Schultz left and started his own coffee company, Il Giornale. He pitched to 242 investors. 217 said no. But he kept going.

In 1987, he bought Starbucks for $3.8 million with help from local investors. His vision? Create a "third place" between work and home where people could connect.

**The Empire**

Today, Starbucks has over 35,000 stores in 80+ countries, and Schultz's net worth exceeds $4.5 billion. But perhaps more importantly, he revolutionized how American companies treat employees — offering health insurance and stock options even to part-time workers.

"I wanted to build the kind of company my father never got to work for."`,
      quote: "In life, you can blame a lot of people and you can wallow in self-pity, or you can pick yourself up and say, 'Listen, I have to be responsible for myself.'",
      lessons: [
        "Your background doesn't define your ceiling",
        "When investors say no, find different investors",
        "Build the company you wish existed",
        "Take care of people, and they'll take care of your business"
      ],
      tags: ["Entrepreneur", "Starbucks", "Perseverance"]
    },
    {
      title: "Sleeping in His Car to Sleeping on Money: Jay-Z's Billion Dollar Journey",
      subtitle: "From Marcy Projects to hip-hop's first billionaire",
      image: "🎤",
      intro: "Shawn Corey Carter grew up in a housing project where drug dealers were the only visible millionaires. He chose a different path to the top.",
      story: `In the Marcy Houses of Brooklyn, young Shawn Carter watched his neighborhood crumble around him. His father left when he was 11. Drug dealers drove nice cars while working people struggled. For a while, he took what seemed like the only path available.

But he had another talent: words.

**The Hustle Transforms**

Jay-Z's rap sheets turned into rap verses. He started recording in the late '80s, but no record label would sign him. So in 1995, with partners Damon Dash and Kareem "Biggs" Burke, he did something unheard of — he started his own label, Roc-A-Fella Records.

They sold CDs out of car trunks. They hustled like their lives depended on it — because in many ways, they did.

**Building an Empire**

"Reasonable Doubt" dropped in 1996. It changed everything. But Jay-Z wasn't just making music — he was building businesses.

Rocawear clothing line? Sold for $204 million.
Part ownership of the Brooklyn Nets? Leveraged that into Barclays Center naming rights negotiations.
Tidal streaming service? Sold majority stake to Square for $297 million.
Armand de Brignac champagne? Sold 50% to LVMH for estimated $300+ million.

**The Billionaire Blueprint**

In 2019, Forbes declared Jay-Z hip-hop's first billionaire. His net worth? Over $2.5 billion today.

But here's what most people miss: Jay-Z didn't just get rich from music. He studied finance. He surrounded himself with smart money people. He owned masters, not just made music.

"I'm not a businessman, I'm a business, man."`,
      quote: "I will not lose, for even in defeat, there's a valuable lesson learned, so it evens up for me.",
      lessons: [
        "Own your masters (and your intellectual property)",
        "Diversify into businesses you understand",
        "Surround yourself with people smarter than you in areas you're weak",
        "Never let your past define your future"
      ],
      tags: ["Music", "Entrepreneurship", "Investing"]
    },
    {
      title: "From Welfare to Worth Billions: Oprah's Unbreakable Rise",
      subtitle: "How a teenage runaway became America's most powerful media mogul",
      image: "📺",
      intro: "Born to an unmarried teenage mother in rural Mississippi, Oprah Winfrey's early life was a series of traumas that would break most people.",
      story: `Oprah was born into poverty in Kosciusko, Mississippi in 1954. She wore dresses made of potato sacks. She was raised by her grandmother until age 6, then bounced between her mother in Milwaukee and her father in Nashville.

She was abused by family members starting at age 9. At 14, she became pregnant (the child died shortly after birth). She ran away from home. She was sent to juvenile detention.

**The Voice Emerges**

But something remarkable happened when Oprah discovered her voice. At age 17, she won a local beauty pageant. At 19, she became the youngest — and first Black female — news anchor at Nashville's WLAC-TV.

She wasn't just good at her job. She was *different*. She connected with people. She made them feel seen.

**Building Harpo**

In 1986, The Oprah Winfrey Show went national. Within a year, it was the highest-rated talk show in America.

But Oprah didn't just host. She negotiated ownership. In 1988, she founded Harpo Productions, becoming only the third woman in American history to own her own major studio.

The show ran for 25 seasons, generating over $2 billion in revenue.

**The Empire Expands**

OWN (Oprah Winfrey Network) — $70 million deal with Discovery
Weight Watchers investment — turned $43 million into $400 million
O Magazine — 2+ million subscribers at peak
Book Club recommendations — could add $30 million to a book's sales overnight

**Today**

Oprah's net worth exceeds $2.5 billion. She's given away over $400 million to charitable causes. She built a school in South Africa.

From potato sack dresses to literal billions.`,
      quote: "The biggest adventure you can ever take is to live the life of your dreams.",
      lessons: [
        "Your trauma doesn't have to define you",
        "Own your platform, don't just appear on it",
        "Authenticity is your superpower",
        "Use success to lift others"
      ],
      tags: ["Media", "Self-Made", "Philanthropy"]
    },
    {
      title: "Rejected 1,009 Times: Colonel Sanders' Late-Game Victory",
      subtitle: "How a 65-year-old turned a recipe and a Social Security check into a $15B empire",
      image: "🍗",
      intro: "Most 65-year-olds are thinking about retirement. Harland Sanders was just getting started.",
      story: `By age 65, Harland Sanders had failed at pretty much everything. He'd been a farmhand, a streetcar conductor, a railroad fireman (fired for fighting), a lawyer (lost his practice after a courtroom brawl), an insurance salesman (fired), a tire salesman, a gas station operator, and a motel owner.

When the interstate bypassed his restaurant in Corbin, Kentucky, he was left with nothing but a Social Security check for $105 and a recipe for fried chicken.

**The 1,009 Rejections**

At an age when most people give up, Sanders put on his white suit, loaded his car with a pressure cooker and his secret blend of 11 herbs and spices, and hit the road.

He drove from restaurant to restaurant, cooking his chicken for owners, asking them to franchise his recipe in exchange for a nickel per chicken sold.

He slept in his car. He heard "no" over and over. Legend says he was rejected 1,009 times before a restaurant in Salt Lake City said yes.

**From Zero to Empire**

By 1964, Sanders had 600 franchised outlets. That year, he sold Kentucky Fried Chicken for $2 million ($19 million today) — though he stayed on as spokesman until his death.

Today, KFC has 27,000 locations in 145 countries, generating over $30 billion in annual sales.

**The Lesson**

Sanders didn't succeed despite his age. He succeeded because of a lifetime of failure that taught him exactly how to make chicken — and exactly how to never give up.`,
      quote: "I made a resolve then that I was going to amount to something if I could. And no hours, nor amount of labor, nor amount of money would deter me.",
      lessons: [
        "It's never too late to start",
        "Every failure teaches you something",
        "Persistence beats talent when talent doesn't persist",
        "Age is just a number if your fire is still burning"
      ],
      tags: ["Late Bloomer", "Persistence", "Franchise"]
    },
    {
      title: "From $7.50/Hour to Billionaire: Sara Blakely's Spanx Story",
      subtitle: "How a fax machine saleswoman invented a billion-dollar industry",
      image: "👗",
      intro: "Sara Blakely was selling fax machines door-to-door, earning $7.50 an hour. One night, cutting the feet off her pantyhose changed everything.",
      story: `Sara Blakely's journey to becoming the youngest self-made female billionaire started with a simple frustration: her pants didn't look right with regular pantyhose.

**The $5,000 Gamble**

In 1998, Sara had saved $5,000 from selling fax machines. She invested every penny into creating footless pantyhose — a product that didn't exist.

She couldn't afford a lawyer, so she wrote her own patent by reading textbooks. Manufacturers laughed at her. She got rejected by every hosiery mill she approached.

Finally, one factory owner agreed — not because of the pitch, but because his daughters said it was a great idea.

**Breaking Into Retail**

Sara drove to Neiman Marcus, talked her way into a buyer meeting, and literally put on the product in the bathroom to demonstrate the difference. She got her first order.

She packed products herself. She worked nights and weekends. She didn't take a salary for years.

**The Oprah Effect**

When Oprah named Spanx one of her "Favorite Things" in 2000, sales exploded. But Sara had already been grinding for two years before that moment.

**Today**

Sara sold a majority stake of Spanx in 2021, valuing the company at $1.2 billion. She gave every employee two first-class plane tickets and $10,000 cash to celebrate.

From $5,000 to $1.2 billion. From fax machines to fashion empire.`,
      quote: "It's important to be willing to make mistakes. The worst thing that can happen is you become memorable.",
      lessons: [
        "Start with the money you have, not the money you want",
        "Persistence beats perfection every time",
        "Learn skills yourself when you can't afford to hire them",
        "Success often comes after years of invisible grinding"
      ],
      tags: ["Self-Made", "Fashion", "Persistence"]
    },
    {
      title: "The Immigrant Who Built a $70 Billion Empire: Do Won Chang",
      subtitle: "From janitor to Forever 21 founder",
      image: "🛍️",
      intro: "Do Won Chang arrived in America with almost nothing. He worked three jobs simultaneously. Twenty years later, he owned one of the world's largest fashion retailers.",
      story: `In 1981, Do Won Chang immigrated to Los Angeles from South Korea with his wife and daughters. He didn't speak English. He had no connections. He had almost no money.

**The Grind**

To survive, he worked three jobs at once: janitor, gas station attendant, and coffee shop worker. He worked from 6 AM to midnight, seven days a week.

But he was watching. Learning. He noticed that the people driving the nicest cars weren't doctors or lawyers — they were in the clothing business.

**Fashion 21**

In 1984, with savings from years of grinding, Do Won and his wife Jin Sook opened a small clothing store in Highland Park, LA. They called it Fashion 21.

First year sales: $700,000. The store was just 900 square feet.

The secret? Affordable fashion that looked like expensive runway styles. They could spot trends and get products on shelves in weeks, not months.

**The Empire Grows**

Fashion 21 became Forever 21. One store became hundreds. The company grew to over 800 stores in 57 countries at its peak.

At its height, Forever 21 generated $4.4 billion in annual revenue. The Chang family's net worth reached $6 billion.

**The Lesson**

Do Won Chang often says: "I am very thankful that I came to this country with almost nothing, because having almost nothing makes you hungry."`,
      quote: "America is still the land of opportunity. Work hard, stay focused, be patient.",
      lessons: [
        "Immigrant hunger can be a superpower",
        "Work multiple jobs to learn multiple industries",
        "Watch what successful people do, not just what they say",
        "Speed and adaptation beat slow perfection"
      ],
      tags: ["Immigrant Story", "Retail", "Hard Work"]
    },
    {
      title: "Rejected from 30 Jobs: Jack Ma's Journey to $40 Billion",
      subtitle: "How China's most famous failure built Alibaba",
      image: "📱",
      intro: "Jack Ma failed his college entrance exam twice. He was rejected from 30 jobs including KFC. He started an internet company without knowing anything about technology.",
      story: `Before becoming one of China's richest men, Jack Ma collected failures like trophies.

**The Rejection Collector**

- Failed his college entrance exam twice
- Rejected from Harvard 10 times
- Applied to 30 jobs after college, rejected from all of them
- KFC came to his town, 24 people applied, 23 got hired — he was the one rejection
- Applied to be a police officer — rejected

**Finding the Internet**

In 1995, at age 31, Jack Ma visited the United States and saw the internet for the first time. He typed "beer" into a search engine. Results came from America, Germany, Japan — but nothing from China.

He saw opportunity where others saw nothing.

**The Garage Years**

Back in China, Jack gathered 17 friends into his apartment. He raised $60,000 — pooling everyone's life savings. They built Alibaba.

For years, they didn't pay themselves. They ate instant noodles. They slept on the floor.

**The Empire**

Alibaba became the world's largest e-commerce company. At its peak, the company was worth over $800 billion. Jack Ma's personal net worth reached $40 billion.

The man rejected by KFC now owns companies that employ over 250,000 people.

**His Famous Words**

"If you don't give up, you still have a chance. Giving up is the greatest failure."`,
      quote: "Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.",
      lessons: [
        "Rejection is just redirection",
        "You don't need to understand technology to build tech companies",
        "Start with people who believe in you, not credentials",
        "Your biggest asset is your ability to not give up"
      ],
      tags: ["Tech", "Perseverance", "Alibaba"]
    }
  ];
  
  // Rotate every 3 days for more frequent updates
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000));
  const storyIndex = Math.floor(dayOfYear / 3) % stories.length;
  return stories[storyIndex];
};

const quickWisdom = [
  { icon: "💰", title: "The 10x Rule", text: "Grant Cardone says success requires 10x the effort you think. Most people underestimate what it takes." },
  { icon: "📈", title: "Compound Interest", text: "Einstein called it the 8th wonder. $100/month at 10% for 40 years = $632,408. Start now." },
  { icon: "🧠", title: "Invest in Yourself", text: "Warren Buffett says the best investment is in your own abilities. 50% of billionaires read 1+ book per week." },
  { icon: "⏰", title: "Time is Money", text: "Calculate your hourly rate. Every hour wasted on non-productive activities costs you that amount." },
];

const WealthWisdom = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  
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
              <p className="text-xl text-muted-foreground mb-6">
                Inspiring stories of people who started with nothing and built empires.
                Real strategies. Real lessons. Real motivation.
              </p>
            </div>
          </div>
        </section>
        
        {/* Email Signup Banner */}
        <section className="py-8 bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 border-y border-primary/20">
          <div className="container">
            {subscribed ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-semibold text-xl">You're In!</h3>
                <p className="text-muted-foreground">Check your inbox for weekly wealth wisdom.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Get Weekly Wealth Wisdom</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                  <Button type="submit" disabled={loading} className="whitespace-nowrap">
                    {loading ? 'Joining...' : 'Join Free'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Join 0 moguls-in-training. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </section>
        
        {/* Featured Story */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl font-bold">This Week's Story</h2>
              <Badge variant="outline" className="ml-auto">
                <Flame className="h-3 w-3 mr-1 text-orange-500" />
                Featured
              </Badge>
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