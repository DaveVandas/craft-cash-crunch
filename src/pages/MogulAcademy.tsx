import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { 
  GraduationCap,
  BookOpen,
  Mail,
  TrendingUp,
  Quote,
  Star,
  ChevronRight,
  Lightbulb,
  Target,
  DollarSign,
  BarChart3,
  Rocket,
  ArrowLeft
} from 'lucide-react';

// Lessons rotate every 4 days
const getLessonOfTheWeek = () => {
  const lessons = [
    {
      id: 1,
      level: 'Beginner',
      title: "What Is the Stock Market? (The Lemonade Stand Version)",
      subtitle: "Understanding stocks in the simplest way possible",
      emoji: "🍋",
      intro: "Imagine you have the best lemonade stand in town. Business is booming, but you need money to grow bigger. Here's where stocks come in!",
      content: `**Picture This**

You make $100 a week selling lemonade. Pretty good! But you want to add cookies, hire a helper, and open a second stand. That costs $500. You don't have $500.

**Here's the Big Idea**

What if you split your lemonade business into 100 pieces (called "shares")? Each piece is worth $10. You sell 50 pieces to your neighbors for $500. Now they each own a tiny part of your business!

This is exactly what big companies do. Apple, Tesla, Nike — they all sold pieces of their company to regular people like us. When you buy a stock, you own a tiny piece of that company.

**Why Would Anyone Buy?**

Simple. If your lemonade stand starts making $200 a week, those $10 pieces are now worth $20! Your neighbors doubled their money.

That's what investors hope for. Buy a piece of a good company. Watch it grow. Watch your money grow.

**The Cool Part**

You don't need to be rich to start. Many apps let you buy pieces of stocks for just $1. That's cheaper than a coffee!

**Real Talk**

Sara bought $100 of Apple stock when she was 16 (with her mom's help). She just left it there. By 25, it was worth $800. She literally did nothing but wait.`,
      keyPoints: [
        "A stock is just a tiny piece of a company",
        "When the company grows, your piece becomes worth more",
        "You can start with as little as $1",
        "The stock market is just a place where people buy and sell these pieces"
      ],
      caseStudy: {
        title: "The Kid Who Bought Netflix",
        text: "In 2012, a high school student named Jake bought $200 of Netflix stock at $10 per share (20 shares). His friends laughed. By 2021, those shares were worth over $12,000. He used it to pay for his first year of college."
      },
      tags: ["Basics", "Stocks 101", "Beginner"]
    },
    {
      id: 2,
      level: 'Beginner',
      title: "Bulls, Bears & Why Animal Names Matter",
      subtitle: "The weird words Wall Street uses (and what they actually mean)",
      emoji: "🐂",
      intro: "You'll hear people say 'the market is bullish' or 'we're in a bear market.' Sounds weird, right? Let's decode this zoo.",
      content: `**Meet the Bull**

Picture a bull charging forward with its horns UP. That's what a "bull market" is — prices going UP. Everyone's happy. People are buying. The vibe is good.

When someone says "I'm bullish on Tesla," they mean they think Tesla's stock price will go UP.

**Meet the Bear**

Now picture a bear swiping DOWN with its paw. That's a "bear market" — prices going DOWN. People are scared. They're selling. The vibe is rough.

When someone says "I'm bearish on crypto," they think prices will go DOWN.

**Why Does This Matter?**

Here's a secret: Bear markets are actually when smart investors make their money. 

Think about it. When everyone's scared and selling, prices drop. But good companies don't suddenly become bad companies just because their stock price dropped. It's like a sale at your favorite store!

**Real Numbers**

The stock market has had about 26 bear markets since 1929. After EVERY single one, prices eventually went back up and hit new highs. Every. Single. Time.

**The Mogul Move**

Rich people don't panic during bear markets. They buy more. Warren Buffett says: "Be fearful when others are greedy, and greedy when others are fearful."

Translation: When everyone's scared, that's often the best time to buy.`,
      keyPoints: [
        "Bull = prices going UP (the bull's horns push upward)",
        "Bear = prices going DOWN (the bear's paw swipes down)",
        "Bear markets are scary but normal — they always recover",
        "Smart investors buy during bear markets when prices are low"
      ],
      caseStudy: {
        title: "The 2020 Crash Recovery",
        text: "In March 2020, COVID crashed the market 34% in one month. Scary! But people who bought at the bottom saw the market double in less than two years. A $1,000 investment became $2,000."
      },
      tags: ["Vocabulary", "Market Cycles", "Beginner"]
    },
    {
      id: 3,
      level: 'Beginner',
      title: "The Magic of Compound Interest",
      subtitle: "How your money makes money while you sleep",
      emoji: "✨",
      intro: "Einstein called compound interest the 'eighth wonder of the world.' Here's why even small amounts can become huge over time.",
      content: `**The Penny Story**

Would you rather have $1 million right now, or a penny that doubles every day for 30 days?

Most people grab the million. Big mistake.

That penny becomes $5.3 MILLION in 30 days. Day 1: 1 cent. Day 10: $5. Day 20: $5,000. Day 30: $5.3 million.

That's compound interest. Your money earns money. Then THAT money earns more money. It snowballs.

**Real Life Example**

You invest $100 per month starting at age 18. Average return: 10% per year (the stock market's historical average).

By age 65, you have: $1,048,250. ONE MILLION DOLLARS.

Total you actually invested: $56,400. 

The rest? That's compound interest doing its thing.

**But Wait...**

What if you started at 28 instead? Same $100/month, same 10%.

By 65, you have: $379,664.

You waited 10 years and lost $668,586! That's the price of waiting.

**The Simple Rule**

The earlier you start, the less you need to invest. Someone starting at 18 can invest HALF as much as someone starting at 28 and still end up with MORE money.

Time is your superpower. Use it.`,
      keyPoints: [
        "Compound interest = earning money on your money",
        "Starting early matters MORE than how much you invest",
        "Even $50/month can become hundreds of thousands",
        "Time in the market beats timing the market"
      ],
      caseStudy: {
        title: "The Ronald Read Story",
        text: "Ronald Read was a gas station attendant and janitor in Vermont. He never made more than $50,000 a year. But he invested small amounts consistently for 60 years. When he died at 92, he left behind $8 MILLION. His secret? He started young and never stopped."
      },
      tags: ["Compound Interest", "Long-Term", "Beginner"]
    },
    {
      id: 4,
      level: 'Beginner',
      title: "What Is an Index Fund? (The Lazy Way to Win)",
      subtitle: "How to invest without picking individual stocks",
      emoji: "📊",
      intro: "What if you could own a piece of ALL the best companies at once? That's exactly what an index fund does.",
      content: `**The Problem With Picking Stocks**

Trying to pick which stocks will go up is HARD. Even professional money managers — people who do this full-time — fail to beat the market 85% of the time.

So what do smart investors do instead?

**Enter the Index Fund**

An index fund is like a basket that holds pieces of many companies. Instead of buying Apple, you buy a little bit of Apple, Microsoft, Amazon, Google, Tesla, and 495 other companies all at once.

The most famous one? The S&P 500. It tracks the 500 biggest US companies.

**Why This Is Genius**

1. Instant diversification (you're not betting on just one company)
2. Super low fees (computers manage it, not expensive humans)
3. It just... works. The S&P 500 has averaged about 10% returns per year since 1926.

**Real Talk**

Warren Buffett, one of the best investors ever, says that for most people, index funds are the smartest investment. He even has a bet that index funds will beat professional fund managers. (He's winning that bet.)

**Getting Started**

Open an account on an app like Fidelity, Vanguard, or Robinhood. Search for "S&P 500 Index Fund" or "Total Stock Market Index Fund." Put money in regularly. Done.

That's literally the strategy that has made millions of regular people wealthy.`,
      keyPoints: [
        "Index funds own many stocks at once — instant diversification",
        "They have super low fees compared to other investments",
        "You don't need to pick individual winners",
        "Even billionaires recommend them for regular investors"
      ],
      caseStudy: {
        title: "The Bet That Proved Everything",
        text: "In 2007, Warren Buffett bet $1 million that an S&P 500 index fund would beat professional hedge fund managers over 10 years. By 2017, the index fund returned 7.1% annually. The hedge funds? Only 2.2%. Buffett won easily and donated the winnings to charity."
      },
      tags: ["Index Funds", "Passive Investing", "Beginner"]
    },
    {
      id: 5,
      level: 'Intermediate',
      title: "What Is ROI and Why It Matters",
      subtitle: "The simple math that tells you if something is worth it",
      emoji: "📈",
      intro: "ROI stands for Return On Investment. It's how you know if your money is working hard or hardly working.",
      content: `**The Simple Formula**

ROI = (Money Gained - Money Spent) / Money Spent × 100

Let's break it down with a real example.

**Example 1: Stocks**

You buy $1,000 of stock. A year later, it's worth $1,200.

ROI = ($1,200 - $1,000) / $1,000 × 100 = 20%

Not bad! That's beating the average.

**Example 2: Side Hustle**

You spend $500 on equipment to start a pressure washing business. First year, you make $2,500.

ROI = ($2,500 - $500) / $500 × 100 = 400%

THAT'S the power of starting a business.

**Why Rich People Love ROI**

Every dollar is a soldier. ROI tells you how hard your soldiers are fighting.

- Bank savings account: 0.5% ROI (your soldiers are sleeping)
- S&P 500 average: 10% ROI (your soldiers are working)
- Starting a business: 100-500% ROI (your soldiers are on fire)

**The Hidden ROI**

Education has ROI too. A $5,000 course that helps you get a $20,000 raise? That's 400% ROI in year one alone.

Time has ROI. An hour spent learning investing could be worth thousands in future gains.

Everything is an investment. Calculate your returns.`,
      keyPoints: [
        "ROI tells you how hard your money is working",
        "Higher ROI = better investment",
        "Businesses often have higher ROI than stocks",
        "Everything — time, education, skills — has ROI"
      ],
      caseStudy: {
        title: "The $5,000 Course That Made Millions",
        text: "Alex Hormozi spent $5,000 on business coaching when he was broke. It taught him how to price services properly. He used that knowledge to build Gym Launch, which he later sold for $46 million. That $5,000 had an ROI of 920,000%."
      },
      tags: ["ROI", "Math", "Intermediate"]
    },
    {
      id: 6,
      level: 'Intermediate',
      title: "Diversification: Don't Put All Your Eggs in One Basket",
      subtitle: "Why spreading your money around protects you",
      emoji: "🥚",
      intro: "What happens if you put all your money in one stock and it crashes? Diversification is how the pros protect themselves.",
      content: `**The Basic Idea**

Imagine you have $10,000 to invest. Two options:

Option A: Put it all in one company
Option B: Split it across 10 different companies

With Option A, if that company crashes 50%, you lose $5,000.
With Option B, if one company crashes 50%, you only lose $500.

That's diversification. Spread the risk.

**How the Pros Do It**

A well-diversified portfolio might include:
- US stocks (40%)
- International stocks (20%)
- Bonds (25%)
- Real estate funds (10%)
- Cash (5%)

When stocks crash, bonds often go up. When the US struggles, international might be fine. They balance each other out.

**But Don't Over-Complicate It**

Here's a secret: One S&P 500 index fund already gives you diversification across 500 companies. That's often enough for most people.

**The Warren Buffett Warning**

Buffett says: "Diversification is protection against ignorance."

Translation: If you REALLY know what you're doing, you might concentrate bets. But for most people? Spread it around and sleep well at night.`,
      keyPoints: [
        "Diversification = spreading money across different investments",
        "It protects you when one investment fails",
        "Index funds offer instant diversification",
        "Don't over-complicate — simple diversification works"
      ],
      caseStudy: {
        title: "The Enron Disaster",
        text: "Thousands of Enron employees had their entire retirement savings in Enron stock. When the company collapsed in 2001, they lost everything — some lost over $1 million overnight. Workers who diversified their savings across multiple investments were fine."
      },
      tags: ["Diversification", "Risk Management", "Intermediate"]
    },
    {
      id: 7,
      level: 'Intermediate',
      title: "What Is Private Equity? (The Rich Kids' Club)",
      subtitle: "How wealthy people invest in companies before they're public",
      emoji: "🏛️",
      intro: "Private equity is how the ultra-rich buy entire companies, fix them up, and sell them for profit. Here's how it works.",
      content: `**Public vs. Private**

When you buy Apple stock, you're buying a "public" company. Anyone can buy shares.

A "private" company isn't on the stock market. Regular people can't buy it. This is where private equity comes in.

**The Basic Game**

Private equity firms raise money from wealthy investors (minimum investment: often $1 million+). They use that money to buy private companies.

Then they:
1. Cut costs
2. Improve operations
3. Grow the business
4. Sell it for more than they paid

**Example**

A PE firm buys a chain of pizza restaurants for $50 million. They spend 3 years making it more efficient — better suppliers, new technology, fewer waste. They sell it for $150 million.

Investors triple their money.

**Why Can't Regular People Do This?**

Regulations require you to be an "accredited investor" (generally $1M+ net worth or $200K+ income) to invest in private equity.

BUT — you can buy stocks of public PE firms like Blackstone or KKR to get some exposure.

**The Takeaway**

Private equity is just: Buy company → Make it better → Sell for profit. Same thing you could do with a small local business, just at a massive scale.`,
      keyPoints: [
        "Private equity = buying, improving, and selling entire companies",
        "It's usually only available to wealthy investors",
        "PE firms aim to triple or more their investment",
        "You can invest in public PE companies like Blackstone"
      ],
      caseStudy: {
        title: "The Dunkin' Turnaround",
        text: "In 2006, private equity firms bought Dunkin' Donuts for $2.4 billion. They expanded stores, improved the menu, and modernized operations. In 2020, Dunkin' was sold for $11.3 billion. Investors made 4.7x their money."
      },
      tags: ["Private Equity", "Alternative Investments", "Intermediate"]
    },
    {
      id: 8,
      level: 'Intermediate',
      title: "The Power of Dollar Cost Averaging",
      subtitle: "How to invest without worrying about timing the market",
      emoji: "⏰",
      intro: "Should you wait for the market to drop before investing? Nope. Here's a better strategy that takes the stress away.",
      content: `**The Timing Problem**

Everyone wants to "buy low, sell high." But how do you know when is low? You don't. Even professionals get it wrong constantly.

**The Solution: Dollar Cost Averaging (DCA)**

Instead of investing a big chunk at once, invest the same amount regularly — like $100 every week or $500 every month.

Sometimes you buy when prices are high. Sometimes you buy when prices are low. Over time, it averages out.

**Why This Is Brilliant**

1. No stress about timing
2. You automatically buy more shares when prices are low
3. It becomes a habit, not a decision
4. Works great with automated transfers

**Real Numbers**

From 2000-2020, if you invested $500/month in the S&P 500:
- You invested $120,000 total
- Your account grew to $362,000
- You survived the 2008 crash AND the 2020 crash
- You still tripled your money

**Set It and Forget It**

The best investors automate everything. Set up automatic transfers from your bank to your investment account. Forget about it. Check it once a year.

This is literally how most millionaires do it. No secrets. Just consistency.`,
      keyPoints: [
        "DCA = investing the same amount at regular intervals",
        "You don't need to time the market",
        "It reduces stress and emotional decisions",
        "Automation makes it even easier"
      ],
      caseStudy: {
        title: "Lump Sum vs. DCA",
        text: "A 2012 Vanguard study found that investing a lump sum beats DCA about 66% of the time. But DCA wins for emotional peace. Most people who try to time the market end up never investing at all. The best investment is the one you actually make."
      },
      tags: ["DCA", "Strategy", "Intermediate"]
    }
  ];
  
  // Rotate every 4 days
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000));
  const lessonIndex = Math.floor(dayOfYear / 4) % lessons.length;
  return lessons[lessonIndex];
};

// Get all lessons for archive
const getAllLessons = () => {
  const lessons = [
    { id: 1, title: "What Is the Stock Market?", level: "Beginner", emoji: "🍋" },
    { id: 2, title: "Bulls, Bears & Market Terms", level: "Beginner", emoji: "🐂" },
    { id: 3, title: "The Magic of Compound Interest", level: "Beginner", emoji: "✨" },
    { id: 4, title: "What Is an Index Fund?", level: "Beginner", emoji: "📊" },
    { id: 5, title: "What Is ROI and Why It Matters", level: "Intermediate", emoji: "📈" },
    { id: 6, title: "Diversification Explained", level: "Intermediate", emoji: "🥚" },
    { id: 7, title: "What Is Private Equity?", level: "Intermediate", emoji: "🏛️" },
    { id: 8, title: "Dollar Cost Averaging", level: "Intermediate", emoji: "⏰" },
  ];
  return lessons;
};

const MogulAcademy = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  
  const lesson = getLessonOfTheWeek();
  const allLessons = getAllLessons();

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
          source: 'mogul_academy'
        });
      
      if (error) {
        if (error.code === '23505') {
          toast.info("You're already enrolled! 🎓");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to Mogul Academy! 🎓", {
          description: "You'll receive new lessons every 4 days."
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
      
      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent" />
          <div className="absolute top-20 right-10 text-6xl opacity-20 animate-pulse">📚</div>
          <div className="absolute bottom-20 left-10 text-5xl opacity-20 animate-bounce">💡</div>
          
          <div className="container relative">
            <Link to="/mogul-markets" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Mogul Markets
            </Link>
            
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <GraduationCap className="h-3 w-3 mr-1" />
                Free Education
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
                Mogul <span className="gradient-gold-text">Academy</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Learn money, markets, and investing — explained so simply a 5th grader could get it.
                New lessons every 4 days. Real stories. Real results.
              </p>
            </div>
          </div>
        </section>
        
        {/* Email Signup Banner */}
        <section className="py-8 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-emerald-500/10 border-y border-emerald-500/20">
          <div className="container">
            {subscribed ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="font-semibold text-xl">You're Enrolled!</h3>
                <p className="text-muted-foreground">New lessons drop every 4 days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-emerald-400" />
                  <span className="font-semibold">Get New Lessons In Your Inbox</span>
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
                  <Button type="submit" disabled={loading} className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-700">
                    {loading ? 'Enrolling...' : 'Enroll Free'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Join future moguls. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </section>
        
        {/* Current Lesson */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-emerald-400" />
              <h2 className="font-serif text-2xl font-bold">Today's Lesson</h2>
              <Badge variant="outline" className="ml-auto">
                <Lightbulb className="h-3 w-3 mr-1 text-amber-500" />
                {lesson.level}
              </Badge>
            </div>
            
            <Card className="border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-500/5 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {lesson.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-6xl mb-4">{lesson.emoji}</div>
                <CardTitle className="font-serif text-2xl md:text-3xl leading-tight">
                  {lesson.title}
                </CardTitle>
                <p className="text-lg text-muted-foreground">{lesson.subtitle}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-lg font-medium text-emerald-400/90 border-l-4 border-emerald-500 pl-4">
                  {lesson.intro}
                </p>
                
                <div className="prose prose-invert max-w-none">
                  {lesson.content.split('\n\n').map((paragraph, i) => (
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
                
                {/* Key Points */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Key Takeaways
                  </h3>
                  <div className="grid gap-3">
                    {lesson.keyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <ChevronRight className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-foreground/90">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Case Study */}
                <div className="relative p-6 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-lg mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h4 className="font-semibold">Real Story: {lesson.caseStudy.title}</h4>
                  </div>
                  <p className="text-muted-foreground">{lesson.caseStudy.text}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Lesson Archive */}
        <section className="py-12 bg-gradient-to-b from-transparent to-emerald-500/5">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-2xl font-bold">All Lessons</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allLessons.map((l) => (
                <Card key={l.id} className="border-border/50 hover:border-emerald-500/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">{l.emoji}</div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {l.level}
                    </Badge>
                    <h3 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                      {l.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-center text-muted-foreground mt-6">
              More lessons coming every 4 days. Subscribe to stay updated!
            </p>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12">
          <div className="container">
            <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-emerald-500/10">
              <CardContent className="p-8 text-center">
                <Rocket className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">Ready to Practice?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Put your new knowledge to work! Trade stocks with virtual money on Mogul Markets. No risk, all learning.
                </p>
                <Link to="/mogul-markets">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-emerald-600">
                    Start Trading (Paper Money)
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
};

export default MogulAcademy;
