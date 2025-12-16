import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SalaryInput from '@/components/calculator/SalaryInput';
import RealityCheckResult from '@/components/calculator/RealityCheckResult';
import RealityCheckShareCard from '@/components/calculator/RealityCheckShareCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { Celebrity } from '@/lib/types';
import { Search, Loader2, Rocket, Zap, TrendingUp, Flame, DollarSign, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/earnings';

const popularCelebrities = [
  { name: 'Elon Musk', earnings: 23500000000, emoji: '🚀' },
  { name: 'LeBron James', earnings: 119500000, emoji: '🏀' },
  { name: 'Taylor Swift', earnings: 185000000, emoji: '🎤' },
  { name: 'Cristiano Ronaldo', earnings: 260000000, emoji: '⚽' },
  { name: 'Beyoncé', earnings: 115000000, emoji: '👑' },
  { name: 'Jeff Bezos', earnings: 8500000000, emoji: '📦' },
];

const SIDE_HUSTLE_IDEAS = [
  { name: 'Reselling Sneakers', emoji: '👟', avgProfit: 100, salesPerMonth: 8, tip: 'Follow drops, use bots, check StockX' },
  { name: 'Print on Demand', emoji: '👕', avgProfit: 16, salesPerMonth: 30, tip: 'Printful + Etsy = passive income' },
  { name: 'Thrift Flipping', emoji: '🏷️', avgProfit: 30, salesPerMonth: 20, tip: 'Vintage & designer on Poshmark' },
  { name: 'Dropshipping', emoji: '📦', avgProfit: 17, salesPerMonth: 50, tip: 'Find winners on TikTok, automate' },
  { name: 'Freelance Design', emoji: '🎨', avgProfit: 150, salesPerMonth: 6, tip: 'Start Fiverr, raise prices quarterly' },
  { name: 'Digital Products', emoji: '💻', avgProfit: 29, salesPerMonth: 40, tip: 'Notion templates are hot right now' },
];

type SelectedCelebrity = {
  name: string;
  earnings: number;
  emoji?: string;
  profession?: string;
  imageUrl?: string;
};

const Calculator = () => {
  const [salary, setSalary] = useState(0);
  const [selectedCeleb, setSelectedCeleb] = useState<SelectedCelebrity | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Side hustle calculator state
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [salesVolume, setSalesVolume] = useState('');
  const [period, setPeriod] = useState('month');
  const [hustleResult, setHustleResult] = useState<{ monthly: number; yearly: number } | null>(null);
  
  const { searchCelebrity } = useCelebritySearch();

  const handleCompare = () => {
    if (salary > 0 && selectedCeleb) {
      setShowResults(true);
    }
  };

  const handleSalaryChange = (newSalary: number) => {
    setSalary(newSalary);
    setShowResults(false);
  };

  const handleCelebChange = (celeb: SelectedCelebrity) => {
    setSelectedCeleb(celeb);
    setShowResults(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await searchCelebrity(searchQuery.trim());
      if (result) {
        setSelectedCeleb({
          name: result.name,
          earnings: result.annualEarnings,
          profession: result.profession,
          imageUrl: result.imageUrl,
        });
        setSearchQuery('');
        setShowResults(false);
      }
      // If result is null, the search hook already surfaced the reason via toast (paywall, rate limit, AI error, etc.)
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const calculateHustle = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const sales = parseFloat(salesVolume) || 0;
    
    if (sell <= buy || sales <= 0) return;
    
    const profit = sell - buy;
    const multiplier = period === 'week' ? 4 : period === 'day' ? 30 : 1;
    const monthly = profit * sales * multiplier;
    setHustleResult({ monthly, yearly: monthly * 12 });
  };

  const applyHustlePreset = (hustle: typeof SIDE_HUSTLE_IDEAS[0]) => {
    // Populate the calculator with realistic example values
    setBuyPrice(String(Math.round(hustle.avgProfit * 0.4))); // Approximate buy price
    setSellPrice(String(Math.round(hustle.avgProfit * 1.4))); // Sell = buy + profit
    setSalesVolume(String(hustle.salesPerMonth));
    setPeriod('month');
    
    // Calculate and show results
    const monthly = hustle.avgProfit * hustle.salesPerMonth;
    setHustleResult({ monthly, yearly: monthly * 12 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Reality <span className="gradient-gold-text">Check</span> 💭
            </h1>
            <p className="text-muted-foreground">
              Prepare to have your mind blown. Enter your salary and see how it compares.
            </p>
          </div>

          <div className="space-y-6">
            <SalaryInput onSalaryChange={handleSalaryChange} currentSalary={salary} />

            {/* Celebrity Search */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Search any celebrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="e.g., Oprah, Drake, Messi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10"
                      disabled={isSearching}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Celebrities */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Or pick a popular celebrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {popularCelebrities.map((celeb) => (
                    <Button
                      key={celeb.name}
                      variant={selectedCeleb?.name === celeb.name ? "default" : "outline"}
                      className="h-auto py-3 flex-col"
                      onClick={() => handleCelebChange(celeb)}
                    >
                      <span className="text-xl mb-1">{celeb.emoji}</span>
                      <span className="text-xs">{celeb.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Celebrity Display */}
            {selectedCeleb && (
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 animate-fade-in">
                <p className="text-sm text-muted-foreground">Comparing with</p>
                <p className="text-lg font-bold text-primary">
                  {selectedCeleb.emoji && <span className="mr-2">{selectedCeleb.emoji}</span>}
                  {selectedCeleb.name}
                </p>
              </div>
            )}

            {/* Compare Button */}
            <Button 
              onClick={handleCompare}
              disabled={salary <= 0 || !selectedCeleb}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              🔍 Compare My Salary
            </Button>

            {showResults && selectedCeleb && (
              <>
                <RealityCheckResult
                  userSalary={salary}
                  celebrityName={selectedCeleb.name}
                  celebrityAnnualEarnings={selectedCeleb.earnings}
                />
                
                <RealityCheckShareCard
                  userSalary={salary}
                  celebrityName={selectedCeleb.name}
                  celebrityAnnualEarnings={selectedCeleb.earnings}
                  celebrityProfession={selectedCeleb.profession}
                  celebrityImageUrl={selectedCeleb.imageUrl}
                />

                {/* Path to Wealth Section */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Rocket className="h-6 w-6 text-primary" />
                      <h2 className="font-serif text-2xl font-bold">
                        Your Path to <span className="gradient-gold-text">Wealth</span>
                      </h2>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Feeling humbled? Good. Now let's talk about stacking that paper. 💰
                    </p>
                  </div>

                  {/* Quick Hustle Ideas */}
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-500/5 mb-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Flame className="h-5 w-5 text-amber-500" />
                        Hot Side Hustles
                      </CardTitle>
                      <CardDescription>Tap any hustle to see potential earnings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SIDE_HUSTLE_IDEAS.map((hustle) => (
                          <Button
                            key={hustle.name}
                            variant="outline"
                            className="h-auto py-3 flex-col text-left hover:border-primary/50 hover:bg-primary/5"
                            onClick={() => applyHustlePreset(hustle)}
                          >
                            <span className="text-xl mb-1">{hustle.emoji}</span>
                            <span className="text-xs font-medium">{hustle.name}</span>
                            <span className="text-[10px] text-green-500">+${hustle.avgProfit * hustle.salesPerMonth}/mo</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Custom Calculator */}
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Flip Calculator
                      </CardTitle>
                      <CardDescription>Buy low, sell high. See the potential.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Buy Price ($)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={buyPrice}
                            onChange={(e) => setBuyPrice(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Sell Price ($)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Sales Volume</Label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={salesVolume}
                            onChange={(e) => setSalesVolume(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Per</Label>
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
                      <Button onClick={calculateHustle} className="w-full">
                        <Zap className="h-4 w-4 mr-2" />
                        Calculate Potential
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Hustle Results */}
                  {hustleResult && (
                    <Card className="mt-4 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 animate-fade-in">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Monthly Side Income</p>
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(hustleResult.monthly)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Yearly Potential</p>
                            <p className="text-2xl font-bold gradient-gold-text">{formatCurrency(hustleResult.yearly)}</p>
                          </div>
                        </div>

                        {/* Volume Breakdown */}
                        {buyPrice && sellPrice && parseFloat(sellPrice) > parseFloat(buyPrice) && (
                          <div className="p-3 rounded-lg bg-background/50 border border-border/50 mb-4">
                            <p className="text-xs text-muted-foreground mb-2 text-center font-medium">📦 What it takes to hit these numbers:</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2 rounded bg-secondary/30">
                                <p className="text-lg font-bold text-foreground">
                                  {Math.ceil(hustleResult.monthly / (parseFloat(sellPrice) - parseFloat(buyPrice)) / 30)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">sales/day</p>
                              </div>
                              <div className="p-2 rounded bg-secondary/30">
                                <p className="text-lg font-bold text-foreground">
                                  {Math.ceil(hustleResult.monthly / (parseFloat(sellPrice) - parseFloat(buyPrice)) / 4)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">sales/week</p>
                              </div>
                              <div className="p-2 rounded bg-secondary/30">
                                <p className="text-lg font-bold text-foreground">
                                  {Math.ceil(hustleResult.monthly / (parseFloat(sellPrice) - parseFloat(buyPrice)))}
                                </p>
                                <p className="text-[10px] text-muted-foreground">sales/month</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center mt-2">
                              At {formatCurrency(parseFloat(sellPrice) - parseFloat(buyPrice))} profit per sale
                            </p>
                          </div>
                        )}

                        <div className="p-3 rounded-lg bg-background/50 text-center">
                          <p className="text-sm text-muted-foreground">
                            That's <span className="text-foreground font-semibold">{formatCurrency(hustleResult.yearly)}/year</span> extra — 
                            {salary > 0 && hustleResult.yearly >= salary * 0.5 && (
                              <span className="block mt-1 text-primary font-medium">
                                🔥 That's {((hustleResult.yearly / salary) * 100).toFixed(0)}% of your current salary. Mogul moves!
                              </span>
                            )}
                            {salary > 0 && hustleResult.yearly < salary * 0.5 && hustleResult.yearly > 0 && (
                              <span className="block mt-1 text-amber-500">
                                💪 Every dollar counts. Stack it up!
                              </span>
                            )}
                            {salary <= 0 && (
                              <span className="block mt-1 text-green-500">
                                💪 That's real money in your pocket!
                              </span>
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Go Deeper Link */}
                  <div className="text-center pt-4">
                    <Link to="/side-hustle">
                      <Button variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
                        <Rocket className="h-4 w-4 mr-2" />
                        Go Deeper: Full Side Hustle Guide
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
