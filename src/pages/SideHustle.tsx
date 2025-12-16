import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, Clock, Rocket, Flame, Target, Zap, Crown, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/earnings';

interface CalculationResult {
  profit: number;
  monthlyProfit: number;
  yearlyProfit: number;
  roi: number;
  breakEvenSales: number;
}

const SIDE_HUSTLE_IDEAS = [
  {
    name: 'Reselling Sneakers',
    emoji: '👟',
    avgBuyPrice: 180,
    avgSellPrice: 280,
    salesPerMonth: 8,
    difficulty: 'Medium',
    description: 'Buy limited releases, flip for profit. Hype is money.',
    tips: 'Follow @snkr_twitr, use bots for drops, check StockX prices first'
  },
  {
    name: 'Print on Demand',
    emoji: '👕',
    avgBuyPrice: 12,
    avgSellPrice: 28,
    salesPerMonth: 30,
    difficulty: 'Easy',
    description: 'Design once, sell forever. Zero inventory risk.',
    tips: 'Use Printful + Etsy combo, trending niches = quick cash'
  },
  {
    name: 'Dropshipping',
    emoji: '📦',
    avgBuyPrice: 8,
    avgSellPrice: 25,
    salesPerMonth: 50,
    difficulty: 'Medium',
    description: 'Sell without touching product. Digital arbitrage.',
    tips: 'Find winning products on TikTok, use DSers for automation'
  },
  {
    name: 'Thrift Flipping',
    emoji: '🏷️',
    avgBuyPrice: 5,
    avgSellPrice: 35,
    salesPerMonth: 20,
    difficulty: 'Easy',
    description: "Goodwill to gold. One person's trash = your treasure.",
    tips: 'Focus on vintage, designer, and rare finds. Poshmark is king.'
  },
  {
    name: 'Freelance Design',
    emoji: '🎨',
    avgBuyPrice: 0,
    avgSellPrice: 150,
    salesPerMonth: 6,
    difficulty: 'Medium',
    description: 'Turn creativity into cash. Logos, social media, the works.',
    tips: 'Start on Fiverr, build portfolio on Behance, raise prices quarterly'
  },
  {
    name: 'Amazon FBA',
    emoji: '📈',
    avgBuyPrice: 15,
    avgSellPrice: 40,
    salesPerMonth: 100,
    difficulty: 'Hard',
    description: 'Let Amazon do the heavy lifting. Scale to the moon.',
    tips: 'Use Jungle Scout for research, start with private label'
  },
  {
    name: 'Social Media Management',
    emoji: '📱',
    avgBuyPrice: 0,
    avgSellPrice: 500,
    salesPerMonth: 3,
    difficulty: 'Medium',
    description: 'Get paid to post. Turn scrolling into salary.',
    tips: 'Package content creation + scheduling, use Later or Buffer'
  },
  {
    name: 'Digital Products',
    emoji: '💻',
    avgBuyPrice: 0,
    avgSellPrice: 29,
    salesPerMonth: 40,
    difficulty: 'Medium',
    description: 'Templates, courses, presets. Build once, sell infinitely.',
    tips: 'Notion templates are hot, use Gumroad or Lemon Squeezy'
  }
];

const SideHustle = () => {
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [salesPerPeriod, setSalesPerPeriod] = useState<string>('');
  const [period, setPeriod] = useState<string>('month');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedHustle, setSelectedHustle] = useState<typeof SIDE_HUSTLE_IDEAS[0] | null>(null);

  const calculate = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const sales = parseFloat(salesPerPeriod) || 0;

    if (sell <= buy || sales <= 0) {
      setResult(null);
      return;
    }

    const profitPerItem = sell - buy;
    const periodMultiplier = period === 'week' ? 4 : period === 'day' ? 30 : 1;
    const monthlySales = sales * periodMultiplier;
    const monthlyProfit = profitPerItem * monthlySales;
    const yearlyProfit = monthlyProfit * 12;
    const roi = ((sell - buy) / buy) * 100;
    const breakEvenSales = buy > 0 ? Math.ceil(buy / profitPerItem) : 0;

    setResult({
      profit: profitPerItem,
      monthlyProfit,
      yearlyProfit,
      roi: isFinite(roi) ? roi : 0,
      breakEvenSales
    });
  };

  const applyHustle = (hustle: typeof SIDE_HUSTLE_IDEAS[0]) => {
    setSelectedHustle(hustle);
    setBuyPrice(hustle.avgBuyPrice.toString());
    setSellPrice(hustle.avgSellPrice.toString());
    setSalesPerPeriod(hustle.salesPerMonth.toString());
    setPeriod('month');
    
    // Calculate with new values
    const profitPerItem = hustle.avgSellPrice - hustle.avgBuyPrice;
    const monthlyProfit = profitPerItem * hustle.salesPerMonth;
    const yearlyProfit = monthlyProfit * 12;
    const roi = hustle.avgBuyPrice > 0 ? ((hustle.avgSellPrice - hustle.avgBuyPrice) / hustle.avgBuyPrice) * 100 : 0;
    
    setResult({
      profit: profitPerItem,
      monthlyProfit,
      yearlyProfit,
      roi,
      breakEvenSales: hustle.avgBuyPrice > 0 ? Math.ceil(hustle.avgBuyPrice / profitPerItem) : 0
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Side Hustle <span className="gradient-gold-text">Calculator</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how flipping, freelancing, or selling can stack your paper. 
            Run the numbers. Build the empire. 💰
          </p>
        </div>

        <Tabs defaultValue="calculator" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="calculator" className="text-base">
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="ideas" className="text-base">
              <Flame className="h-4 w-4 mr-2" />
              Hot Hustles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Calculator Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Flip Calculator
                </CardTitle>
                <CardDescription>
                  Enter your buy price, sell price, and volume to see the potential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyPrice">Buy Price ($)</Label>
                    <Input
                      id="buyPrice"
                      type="number"
                      placeholder="0.00"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Sell Price ($)</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      placeholder="0.00"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sales">Sales Volume</Label>
                    <Input
                      id="sales"
                      type="number"
                      placeholder="10"
                      value={salesPerPeriod}
                      onChange={(e) => setSalesPerPeriod(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Per</Label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculate} className="w-full" size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Calculate My Potential
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {result && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-5 w-5" />
                    Your Hustle Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-card border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Profit/Item</p>
                      <p className="text-2xl font-bold text-green-500">{formatCurrency(result.profit)}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                      <p className="text-2xl font-bold gradient-gold-text">{formatCurrency(result.monthlyProfit)}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Yearly</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(result.yearlyProfit)}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">ROI</p>
                      <p className="text-2xl font-bold text-amber-500">{result.roi.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">
                      At this rate, you'd make <span className="text-foreground font-semibold">{formatCurrency(result.yearlyProfit)}/year</span> — 
                      that's <span className="text-primary font-semibold">{formatCurrency(result.yearlyProfit / 12)}/month</span> in your pocket. 
                      {result.yearlyProfit >= 50000 && (
                        <span className="block mt-2 text-primary">🔥 That's serious money. You could quit your day job!</span>
                      )}
                      {result.yearlyProfit >= 100000 && (
                        <span className="block mt-1 text-amber-500">👑 Six figures from a side hustle? Mogul status.</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Trending Side Hustles for 2024</h2>
              <p className="text-muted-foreground">Click any hustle to run the numbers with average figures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SIDE_HUSTLE_IDEAS.map((hustle, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg ${
                    selectedHustle?.name === hustle.name ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => applyHustle(hustle)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{hustle.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{hustle.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            hustle.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' :
                            hustle.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {hustle.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{hustle.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            ${hustle.avgBuyPrice} → ${hustle.avgSellPrice}
                          </span>
                          <span className="text-green-500 font-medium">
                            +${hustle.avgSellPrice - hustle.avgBuyPrice}/unit
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          💡 {hustle.tips}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedHustle && result && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    {selectedHustle.emoji} {selectedHustle.name} Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly</p>
                      <p className="text-xl font-bold gradient-gold-text">{formatCurrency(result.monthlyProfit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Yearly</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(result.yearlyProfit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="text-xl font-bold text-amber-500">{result.roi.toFixed(0)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default SideHustle;
