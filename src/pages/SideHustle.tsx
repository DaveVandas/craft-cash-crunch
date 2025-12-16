import { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

const SIDE_HUSTLE_IDEAS = [
  {
    name: 'Reselling Sneakers',
    emoji: '👟',
    avgBuyPrice: 180,
    avgSellPrice: 280,
    salesPerMonth: 8,
    difficulty: 'Medium',
    description: 'Buy limited releases, flip for profit.',
    tips: 'Follow @snkr_twitr, use bots for drops'
  },
  {
    name: 'Print on Demand',
    emoji: '👕',
    avgBuyPrice: 12,
    avgSellPrice: 28,
    salesPerMonth: 30,
    difficulty: 'Easy',
    description: 'Design once, sell forever.',
    tips: 'Printful + Etsy = passive income'
  },
  {
    name: 'Dropshipping',
    emoji: '📦',
    avgBuyPrice: 8,
    avgSellPrice: 25,
    salesPerMonth: 50,
    difficulty: 'Medium',
    description: 'Sell without touching product.',
    tips: 'Find winners on TikTok'
  },
  {
    name: 'Thrift Flipping',
    emoji: '🏷️',
    avgBuyPrice: 5,
    avgSellPrice: 35,
    salesPerMonth: 20,
    difficulty: 'Easy',
    description: "Goodwill to gold.",
    tips: 'Vintage & designer on Poshmark'
  },
  {
    name: 'Freelance Design',
    emoji: '🎨',
    avgBuyPrice: 0,
    avgSellPrice: 150,
    salesPerMonth: 6,
    difficulty: 'Medium',
    description: 'Turn creativity into cash.',
    tips: 'Start Fiverr, build portfolio'
  },
  {
    name: 'Amazon FBA',
    emoji: '📈',
    avgBuyPrice: 15,
    avgSellPrice: 40,
    salesPerMonth: 100,
    difficulty: 'Hard',
    description: 'Let Amazon do the lifting.',
    tips: 'Use Jungle Scout for research'
  },
  {
    name: 'Social Media Mgmt',
    emoji: '📱',
    avgBuyPrice: 0,
    avgSellPrice: 500,
    salesPerMonth: 3,
    difficulty: 'Medium',
    description: 'Get paid to post.',
    tips: 'Package content + scheduling'
  },
  {
    name: 'Digital Products',
    emoji: '💻',
    avgBuyPrice: 0,
    avgSellPrice: 29,
    salesPerMonth: 40,
    difficulty: 'Medium',
    description: 'Build once, sell infinitely.',
    tips: 'Notion templates are hot'
  }
];

const SideHustle = () => {
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [salesPerPeriod, setSalesPerPeriod] = useState<string>('');
  const [period, setPeriod] = useState<string>('month');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedHustle, setSelectedHustle] = useState<typeof SIDE_HUSTLE_IDEAS[0] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const applyHustle = (hustle: typeof SIDE_HUSTLE_IDEAS[0]) => {
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
      
      <main className="flex-1 container py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Rocket className="h-7 w-7 text-primary" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Side Hustle <span className="gradient-gold-text">Guide</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pick a hustle, tweak the numbers, see the potential. 💰
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hot Hustles Grid */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-amber-500" />
                Pick Your Hustle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SIDE_HUSTLE_IDEAS.map((hustle) => (
                  <button
                    key={hustle.name}
                    onClick={() => applyHustle(hustle)}
                    className={`p-3 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                      selectedHustle?.name === hustle.name 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 bg-card/50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{hustle.emoji}</span>
                    <span className="text-xs font-medium block truncate">{hustle.name}</span>
                    <span className={`text-[10px] ${
                      hustle.difficulty === 'Easy' ? 'text-green-500' :
                      hustle.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                    }`}>{hustle.difficulty}</span>
                  </button>
                ))}
              </div>
              
              {!selectedHustle && (
                <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm">
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                  <span>Tap a hustle to see the breakdown</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results & Calculator - Shows when hustle selected */}
          {selectedHustle && (
            <div ref={resultsRef} className="space-y-4 animate-fade-in">
              {/* Selected Hustle Header */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-3xl">{selectedHustle.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedHustle.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedHustle.description}</p>
                  <p className="text-xs text-primary mt-1">💡 {selectedHustle.tips}</p>
                </div>
              </div>

              {/* Adjustable Inputs + Results Combined */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5">
                <CardContent className="p-4">
                  {/* Inline Adjustable Inputs */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Buy Price</Label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <Input
                          type="number"
                          value={buyPrice}
                          onChange={(e) => handleInputChange('buy', e.target.value)}
                          className="pl-6 h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Sell Price</Label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <Input
                          type="number"
                          value={sellPrice}
                          onChange={(e) => handleInputChange('sell', e.target.value)}
                          className="pl-6 h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Sales/Month</Label>
                      <Input
                        type="number"
                        value={salesPerPeriod}
                        onChange={(e) => handleInputChange('sales', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  {result && (
                    <>
                      {/* Results Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center p-3 rounded-lg bg-card border border-border/50">
                          <p className="text-[10px] text-muted-foreground">Profit/Item</p>
                          <p className="text-lg font-bold text-green-500">{formatCurrency(result.profit)}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-card border border-border/50">
                          <p className="text-[10px] text-muted-foreground">Monthly</p>
                          <p className="text-lg font-bold gradient-gold-text">{formatCurrency(result.monthlyProfit)}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-card border border-border/50">
                          <p className="text-[10px] text-muted-foreground">Yearly</p>
                          <p className="text-lg font-bold text-primary">{formatCurrency(result.yearlyProfit)}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-card border border-border/50">
                          <p className="text-[10px] text-muted-foreground">ROI</p>
                          <p className="text-lg font-bold text-amber-500">{result.roi.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Volume Breakdown */}
                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-2 text-center font-medium">📦 What it takes:</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded bg-secondary/30">
                            <p className="text-lg font-bold">{result.salesPerDay}</p>
                            <p className="text-[10px] text-muted-foreground">sales/day</p>
                          </div>
                          <div className="p-2 rounded bg-secondary/30">
                            <p className="text-lg font-bold">{result.salesPerWeek}</p>
                            <p className="text-[10px] text-muted-foreground">sales/week</p>
                          </div>
                          <div className="p-2 rounded bg-secondary/30">
                            <p className="text-lg font-bold">{result.salesPerMonth}</p>
                            <p className="text-[10px] text-muted-foreground">sales/month</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-2">
                          At {formatCurrency(result.profit)} profit per sale
                        </p>
                      </div>

                      {/* Motivational Message */}
                      {result.yearlyProfit >= 50000 && (
                        <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                          <p className="text-sm text-primary font-medium">
                            🔥 {formatCurrency(result.yearlyProfit)}/year — that's serious money!
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SideHustle;
