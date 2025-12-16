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
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { Celebrity } from '@/lib/types';
import { Search, Loader2, Rocket, TrendingUp, Flame, ArrowRight } from 'lucide-react';
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
  const [hustleResult, setHustleResult] = useState<{ monthly: number; yearly: number } | null>(null);
  const [selectedHustle, setSelectedHustle] = useState<typeof SIDE_HUSTLE_IDEAS[0] | null>(null);
  
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

  const applyHustlePreset = (hustle: typeof SIDE_HUSTLE_IDEAS[0]) => {
    setSelectedHustle(hustle);
    
    // Populate the calculator with realistic example values
    const buyPriceVal = Math.round(hustle.avgProfit * 0.4);
    const sellPriceVal = Math.round(hustle.avgProfit * 1.4);
    setBuyPrice(String(buyPriceVal));
    setSellPrice(String(sellPriceVal));
    setSalesVolume(String(hustle.salesPerMonth));
    
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
                <div className="mt-10 pt-8 border-t border-border/50">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Rocket className="h-6 w-6 text-primary" />
                      <h2 className="font-serif text-2xl font-bold">
                        Your Path to <span className="gradient-gold-text">Wealth</span>
                      </h2>
                    </div>
                    <p className="text-base text-foreground/70">
                      Feeling humbled? Good. Now let's talk about building income. 💰
                    </p>
                  </div>

                  {/* Unified Side Hustle Experience */}
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-500/5">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Flame className="h-5 w-5 text-amber-500" />
                        Pick a Side Hustle
                      </CardTitle>
                      <CardDescription className="text-base">
                        Tap one to see realistic earnings — then tweak the numbers if you want
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Hustle Grid */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {SIDE_HUSTLE_IDEAS.map((hustle) => (
                          <button
                            key={hustle.name}
                            onClick={() => applyHustlePreset(hustle)}
                            className={`p-3 rounded-xl border text-center transition-all hover:border-primary/50 hover:bg-primary/5 ${
                              selectedHustle?.name === hustle.name 
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                                : 'border-border/50 bg-card/50'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{hustle.emoji}</span>
                            <span className="text-xs font-medium block truncate text-foreground">{hustle.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Results appear when hustle selected */}
                      {selectedHustle && (
                        <div className="animate-fade-in space-y-4">
                          {/* Hustle Header */}
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                            <span className="text-3xl">{selectedHustle.emoji}</span>
                            <div className="flex-1">
                              <p className="text-lg font-bold text-foreground">{selectedHustle.name}</p>
                              <p className="text-sm text-primary">💡 {selectedHustle.tip}</p>
                            </div>
                          </div>

                          {/* Adjustable Inputs */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs text-foreground/70 font-medium">Buy Price</Label>
                              <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                  type="number"
                                  value={buyPrice}
                                  onChange={(e) => {
                                    setBuyPrice(e.target.value);
                                    const buy = parseFloat(e.target.value) || 0;
                                    const sell = parseFloat(sellPrice) || 0;
                                    const sales = parseFloat(salesVolume) || 0;
                                    if (sell > buy && sales > 0) {
                                      const profit = sell - buy;
                                      const monthly = profit * sales;
                                      setHustleResult({ monthly, yearly: monthly * 12 });
                                    }
                                  }}
                                  className="pl-7 h-10"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-foreground/70 font-medium">Sell Price</Label>
                              <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                  type="number"
                                  value={sellPrice}
                                  onChange={(e) => {
                                    setSellPrice(e.target.value);
                                    const buy = parseFloat(buyPrice) || 0;
                                    const sell = parseFloat(e.target.value) || 0;
                                    const sales = parseFloat(salesVolume) || 0;
                                    if (sell > buy && sales > 0) {
                                      const profit = sell - buy;
                                      const monthly = profit * sales;
                                      setHustleResult({ monthly, yearly: monthly * 12 });
                                    }
                                  }}
                                  className="pl-7 h-10"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-foreground/70 font-medium">Sales/Month</Label>
                              <Input
                                type="number"
                                value={salesVolume}
                                onChange={(e) => {
                                  setSalesVolume(e.target.value);
                                  const buy = parseFloat(buyPrice) || 0;
                                  const sell = parseFloat(sellPrice) || 0;
                                  const sales = parseFloat(e.target.value) || 0;
                                  if (sell > buy && sales > 0) {
                                    const profit = sell - buy;
                                    const monthly = profit * sales;
                                    setHustleResult({ monthly, yearly: monthly * 12 });
                                  }
                                }}
                                className="h-10 mt-1"
                              />
                            </div>
                          </div>

                          {/* Results */}
                          {hustleResult && hustleResult.monthly > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <p className="text-xs text-foreground/60 font-medium mb-1">Monthly Income</p>
                                <p className="text-2xl font-bold text-green-500">{formatCurrency(hustleResult.monthly)}</p>
                              </div>
                              <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-xs text-foreground/60 font-medium mb-1">Yearly Potential</p>
                                <p className="text-2xl font-bold text-amber-500">{formatCurrency(hustleResult.yearly)}</p>
                              </div>
                            </div>
                          )}

                          {/* Motivational Message */}
                          {hustleResult && hustleResult.yearly > 0 && (
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                              {salary > 0 && hustleResult.yearly >= salary * 0.5 ? (
                                <p className="text-base font-semibold text-primary">
                                  🔥 {formatCurrency(hustleResult.yearly)}/year extra — that's {((hustleResult.yearly / salary) * 100).toFixed(0)}% of your salary!
                                </p>
                              ) : (
                                <p className="text-base font-semibold text-primary">
                                  💪 {formatCurrency(hustleResult.yearly)}/year — every dollar counts. Keep stacking!
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prompt when nothing selected */}
                      {!selectedHustle && (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-base">👆 Tap a hustle above to see the breakdown</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Go Deeper Link */}
                  <div className="text-center pt-6">
                    <Link to="/side-hustle">
                      <Button variant="outline" size="lg" className="border-primary/50 hover:border-primary hover:bg-primary/10">
                        <Rocket className="h-5 w-5 mr-2" />
                        Explore More Side Hustles
                        <ArrowRight className="h-5 w-5 ml-2" />
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
