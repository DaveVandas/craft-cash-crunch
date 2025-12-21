import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, Rocket, Flame, Zap, Crown, ArrowDown } from 'lucide-react';
import { formatCurrency } from '@/lib/earnings';

interface CalculationResult {
  profit: number;
  monthlyProfit: number;
  yearlyProfit: number;
  roi: number;
  salesPerDay: number;
  salesPerWeek: number;
  salesPerMonth: number;
}

// Extended pool of side hustles for rotation
const ALL_SIDE_HUSTLES = [
  { name: 'Reselling Sneakers', emoji: '👟', avgBuyPrice: 180, avgSellPrice: 280, salesPerMonth: 8, difficulty: 'Medium', description: 'Buy limited releases, flip for profit.', tips: 'Follow @snkr_twitr, use bots for drops' },
  { name: 'Print on Demand', emoji: '👕', avgBuyPrice: 12, avgSellPrice: 28, salesPerMonth: 30, difficulty: 'Easy', description: 'Design once, sell forever.', tips: 'Printful + Etsy = passive income' },
  { name: 'Dropshipping', emoji: '📦', avgBuyPrice: 8, avgSellPrice: 25, salesPerMonth: 50, difficulty: 'Medium', description: 'Sell without touching product.', tips: 'Find winners on TikTok' },
  { name: 'Thrift Flipping', emoji: '🏷️', avgBuyPrice: 5, avgSellPrice: 35, salesPerMonth: 20, difficulty: 'Easy', description: "Goodwill to gold.", tips: 'Vintage & designer on Poshmark' },
  { name: 'Freelance Design', emoji: '🎨', avgBuyPrice: 0, avgSellPrice: 150, salesPerMonth: 6, difficulty: 'Medium', description: 'Turn creativity into cash.', tips: 'Start Fiverr, build portfolio' },
  { name: 'Amazon FBA', emoji: '📈', avgBuyPrice: 15, avgSellPrice: 40, salesPerMonth: 100, difficulty: 'Hard', description: 'Let Amazon do the lifting.', tips: 'Use Jungle Scout for research' },
  { name: 'Social Media Mgmt', emoji: '📱', avgBuyPrice: 0, avgSellPrice: 500, salesPerMonth: 3, difficulty: 'Medium', description: 'Get paid to post.', tips: 'Package content + scheduling' },
  { name: 'Digital Products', emoji: '💻', avgBuyPrice: 0, avgSellPrice: 29, salesPerMonth: 40, difficulty: 'Medium', description: 'Build once, sell infinitely.', tips: 'Notion templates are hot' },
  { name: 'Online Tutoring', emoji: '📚', avgBuyPrice: 0, avgSellPrice: 50, salesPerMonth: 20, difficulty: 'Easy', description: 'Share knowledge, get paid.', tips: 'Wyzant, Varsity Tutors' },
  { name: 'Handmade Crafts', emoji: '🧶', avgBuyPrice: 10, avgSellPrice: 45, salesPerMonth: 15, difficulty: 'Easy', description: 'Turn hobbies into income.', tips: 'Etsy is your best friend' },
  { name: 'Car Detailing', emoji: '🚗', avgBuyPrice: 20, avgSellPrice: 150, salesPerMonth: 12, difficulty: 'Medium', description: 'Mobile detailing = flexibility.', tips: 'Start with friends & family' },
  { name: 'Pet Sitting', emoji: '🐕', avgBuyPrice: 0, avgSellPrice: 50, salesPerMonth: 15, difficulty: 'Easy', description: 'Get paid to hang with pets.', tips: 'Rover app for bookings' },
  { name: 'YouTube Channel', emoji: '🎬', avgBuyPrice: 0, avgSellPrice: 100, salesPerMonth: 10, difficulty: 'Hard', description: 'Build audience, monetize.', tips: 'Consistency > perfection' },
  { name: 'Pressure Washing', emoji: '💦', avgBuyPrice: 30, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Medium', description: 'Satisfying work, great margins.', tips: 'Before/after pics sell' },
  { name: 'Flipping Furniture', emoji: '🪑', avgBuyPrice: 25, avgSellPrice: 120, salesPerMonth: 6, difficulty: 'Medium', description: 'Facebook finds to profit.', tips: 'Paint & hardware = magic' },
  { name: 'Photography', emoji: '📸', avgBuyPrice: 0, avgSellPrice: 300, salesPerMonth: 4, difficulty: 'Medium', description: 'Capture moments, charge premium.', tips: 'Start with events & portraits' },
  { name: 'Lawn Care', emoji: '🌿', avgBuyPrice: 10, avgSellPrice: 75, salesPerMonth: 16, difficulty: 'Easy', description: 'Simple service, recurring income.', tips: 'Upsell seasonal services' },
  { name: 'Consulting', emoji: '💼', avgBuyPrice: 0, avgSellPrice: 200, salesPerMonth: 8, difficulty: 'Hard', description: 'Monetize your expertise.', tips: 'Package your knowledge' },
  { name: 'Voiceover Work', emoji: '🎙️', avgBuyPrice: 0, avgSellPrice: 100, salesPerMonth: 10, difficulty: 'Medium', description: 'Your voice = your product.', tips: 'Fiverr & Voices.com' },
  { name: 'Affiliate Marketing', emoji: '🔗', avgBuyPrice: 0, avgSellPrice: 30, salesPerMonth: 50, difficulty: 'Medium', description: 'Recommend products, earn commissions.', tips: 'Build an email list' },
  { name: 'Stock Photography', emoji: '🖼️', avgBuyPrice: 0, avgSellPrice: 5, salesPerMonth: 200, difficulty: 'Easy', description: 'Upload once, earn forever.', tips: 'Shutterstock + Adobe Stock' },
  { name: 'Cleaning Service', emoji: '🧹', avgBuyPrice: 15, avgSellPrice: 120, salesPerMonth: 12, difficulty: 'Easy', description: 'Always in demand.', tips: 'Residential or Airbnb focus' },
  { name: 'Bookkeeping', emoji: '📊', avgBuyPrice: 0, avgSellPrice: 400, salesPerMonth: 5, difficulty: 'Medium', description: 'Numbers = money.', tips: 'QuickBooks certification helps' },
  { name: 'Food Delivery', emoji: '🍕', avgBuyPrice: 5, avgSellPrice: 25, salesPerMonth: 60, difficulty: 'Easy', description: 'Flexible hours, instant pay.', tips: 'Multi-app for max earnings' },
];

const INSPIRATIONAL_QUOTES = [
  { quote: "The best time to start was yesterday. The second best time is now.", author: "Unknown" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes" },
  { quote: "Your side hustle could become your main hustle.", author: "Gary Vaynerchuk" },
  { quote: "Wealth is not about having a lot of money; it's about having a lot of options.", author: "Chris Rock" },
  { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The harder you work, the luckier you get.", author: "Gary Player" },
  { quote: "Stop waiting for the perfect moment. Take the moment and make it perfect.", author: "Unknown" },
  { quote: "Your income is directly related to your philosophy, not the economy.", author: "Jim Rohn" },
  { quote: "Rich people have small TVs and big libraries. Poor people have small libraries and big TVs.", author: "Zig Ziglar" },
  { quote: "It's not about money or connections. It's the willingness to outwork everyone.", author: "Mark Cuban" },
  { quote: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan" },
  { quote: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
  { quote: "I never dreamed about success. I worked for it.", author: "Estée Lauder" },
];

// Get rotated hustles based on day (changes daily)
const getRotatedHustles = () => {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  const shuffled = [...ALL_SIDE_HUSTLES].sort((a, b) => {
    const hashA = (a.name.charCodeAt(0) + dayOfYear) % 100;
    const hashB = (b.name.charCodeAt(0) + dayOfYear) % 100;
    return hashA - hashB;
  });
  return shuffled.slice(0, 8);
};

// Get random quote (changes on each page load/visit)
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
  return INSPIRATIONAL_QUOTES[randomIndex];
};

const SideHustle = () => {
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [salesPerPeriod, setSalesPerPeriod] = useState<string>('');
  const [period, setPeriod] = useState<string>('month');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedHustle, setSelectedHustle] = useState<typeof ALL_SIDE_HUSTLES[0] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Get rotated content on mount
  const [displayedHustles] = useState(() => getRotatedHustles());
  const [displayedQuote] = useState(() => getRandomQuote());

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateResult = (buy: number, sell: number, sales: number, periodType: string) => {
    if (sell <= buy || sales <= 0) {
      setResult(null);
      return;
    }

    const profitPerItem = sell - buy;
    const periodMultiplier = periodType === 'week' ? 4 : periodType === 'day' ? 30 : 1;
    const monthlySales = sales * periodMultiplier;
    const monthlyProfit = profitPerItem * monthlySales;
    const yearlyProfit = monthlyProfit * 12;
    const roi = buy > 0 ? ((sell - buy) / buy) * 100 : 0;

    setResult({
      profit: profitPerItem,
      monthlyProfit,
      yearlyProfit,
      roi: isFinite(roi) ? roi : 0,
      salesPerDay: Math.ceil(monthlySales / 30),
      salesPerWeek: Math.ceil(monthlySales / 4),
      salesPerMonth: monthlySales
    });
  };

  const handleInputChange = (field: 'buy' | 'sell' | 'sales', value: string) => {
    if (field === 'buy') setBuyPrice(value);
    else if (field === 'sell') setSellPrice(value);
    else setSalesPerPeriod(value);

    // Recalculate with new values
    const buy = field === 'buy' ? parseFloat(value) || 0 : parseFloat(buyPrice) || 0;
    const sell = field === 'sell' ? parseFloat(value) || 0 : parseFloat(sellPrice) || 0;
    const sales = field === 'sales' ? parseFloat(value) || 0 : parseFloat(salesPerPeriod) || 0;
    calculateResult(buy, sell, sales, period);
  };

  const applyHustle = (hustle: typeof ALL_SIDE_HUSTLES[0]) => {
    setSelectedHustle(hustle);
    setBuyPrice(hustle.avgBuyPrice.toString());
    setSellPrice(hustle.avgSellPrice.toString());
    setSalesPerPeriod(hustle.salesPerMonth.toString());
    setPeriod('month');
    
    calculateResult(hustle.avgBuyPrice, hustle.avgSellPrice, hustle.salesPerMonth, 'month');
    
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-10 md:py-12">
        <PaywallGate>
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              Side Hustle <span className="gradient-gold-text">Guide</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Every mogul started somewhere. Pick a hustle, run the numbers, and see what's possible. 💰
          </p>
          
          {/* Inspirational Quote */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-xl mx-auto">
            <p className="text-base md:text-lg italic text-foreground/90">"{displayedQuote.quote}"</p>
            <p className="text-sm text-muted-foreground mt-2">— {displayedQuote.author}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hot Hustles Grid */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Flame className="h-6 w-6 text-amber-500" />
                Pick Your Hustle
              </CardTitle>
              <CardDescription className="text-base">
                Tap any option below to see how the numbers break down
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {displayedHustles.map((hustle) => (
                  <button
                    key={hustle.name}
                    onClick={() => applyHustle(hustle)}
                    className={`p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] ${
                      selectedHustle?.name === hustle.name 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                        : 'border-border/50 bg-card/50'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{hustle.emoji}</span>
                    <span className="text-sm font-semibold block truncate text-foreground">{hustle.name}</span>
                    <span className={`text-xs font-medium ${
                      hustle.difficulty === 'Easy' ? 'text-green-500' :
                      hustle.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                    }`}>{hustle.difficulty}</span>
                  </button>
                ))}
              </div>
              
              {!selectedHustle && (
                <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
                  <ArrowDown className="h-5 w-5 animate-bounce" />
                  <span className="text-base">Tap a hustle above to see the breakdown</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results & Calculator - Shows when hustle selected */}
          {selectedHustle && (
            <div ref={resultsRef} className="space-y-6 animate-fade-in">
              {/* Selected Hustle Header */}
              <div className="flex items-center gap-4 p-5 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-4xl">{selectedHustle.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{selectedHustle.name}</h3>
                  <p className="text-base text-foreground/70 mt-1">{selectedHustle.description}</p>
                  <p className="text-sm text-primary mt-2 font-medium">💡 Pro tip: {selectedHustle.tips}</p>
                </div>
              </div>

              {/* Adjustable Inputs + Results Combined */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
                <CardContent className="p-5 md:p-6">
                  <p className="text-sm font-semibold text-foreground mb-4">Adjust the numbers to fit your situation:</p>
                  
                  {/* Inline Adjustable Inputs */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-xs text-foreground/70 font-medium">Buy Price</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={buyPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleInputChange('buy', value);
                          }}
                          className="pl-7 h-11 text-base font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-foreground/70 font-medium">Sell Price</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={sellPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleInputChange('sell', value);
                          }}
                          className="pl-7 h-11 text-base font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-foreground/70 font-medium">Sales/Month</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={salesPerPeriod}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          handleInputChange('sales', value);
                        }}
                        className="h-11 text-base font-medium mt-1"
                      />
                    </div>
                  </div>

                  {result && (
                    <>
                      {/* Results Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Profit/Item</p>
                          <p className="text-xl md:text-2xl font-bold text-green-500">{formatCurrency(result.profit)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Monthly</p>
                          <p className="text-xl md:text-2xl font-bold gradient-gold-text">{formatCurrency(result.monthlyProfit)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">Yearly</p>
                          <p className="text-xl md:text-2xl font-bold text-primary">{formatCurrency(result.yearlyProfit)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                          <p className="text-xs text-foreground/60 font-medium mb-1">ROI</p>
                          <p className="text-xl md:text-2xl font-bold text-amber-500">{result.roi.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Volume Breakdown */}
                      <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <p className="text-sm text-foreground/80 mb-3 text-center font-semibold">📦 What it takes to hit these numbers:</p>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xl md:text-2xl font-bold text-foreground">{result.salesPerDay}</p>
                            <p className="text-xs text-foreground/60 font-medium">sales/day</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xl md:text-2xl font-bold text-foreground">{result.salesPerWeek}</p>
                            <p className="text-xs text-foreground/60 font-medium">sales/week</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xl md:text-2xl font-bold text-foreground">{result.salesPerMonth}</p>
                            <p className="text-xs text-foreground/60 font-medium">sales/month</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/60 text-center mt-3">
                          That's {formatCurrency(result.profit)} profit per sale × {result.salesPerMonth} sales
                        </p>
                      </div>

                      {/* Motivational Messages based on results */}
                      <div className="mt-5 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                        {result.yearlyProfit >= 100000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            🚀 {formatCurrency(result.yearlyProfit)}/year — You could quit your day job!
                          </p>
                        ) : result.yearlyProfit >= 50000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            🔥 {formatCurrency(result.yearlyProfit)}/year — That's serious side income!
                          </p>
                        ) : result.yearlyProfit >= 20000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            💪 {formatCurrency(result.yearlyProfit)}/year — A solid extra income stream!
                          </p>
                        ) : result.yearlyProfit >= 5000 ? (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            ✨ {formatCurrency(result.yearlyProfit)}/year — Great start! Scale it up!
                          </p>
                        ) : (
                          <p className="text-base md:text-lg text-primary font-semibold">
                            🌱 Every empire starts small. Keep building!
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Encouragement Footer */}
              <div className="text-center p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-primary/20">
                <Crown className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-foreground">
                  Remember: Consistency beats intensity.
                </p>
                <p className="text-base text-foreground/70 mt-2">
                  Show up every day, learn from mistakes, and watch your hustle grow into something real.
                </p>
              </div>
            </div>
          )}
        </div>
        </PaywallGate>
      </main>

      <Footer />
    </div>
  );
};

export default SideHustle;
