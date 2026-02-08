import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import PaywallGate from '@/components/paywall/PaywallGate';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import PageMeta from '@/components/seo/PageMeta';
import SalaryInput from '@/components/calculator/SalaryInput';
import RealityCheckResult from '@/components/calculator/RealityCheckResult';
import RealityCheckShareCard from '@/components/calculator/RealityCheckShareCard';
import FeaturePromoShare from '@/components/share/FeaturePromoShare';
import AffiliateWaitlist from '@/components/affiliate/AffiliateWaitlist';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { useAffiliateCapacity } from '@/hooks/useAffiliateCapacity';
import { Celebrity } from '@/lib/types';
import { Search, Loader2, Rocket, TrendingUp, Flame, ArrowRight, Crown, Sparkles } from 'lucide-react';
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
  { name: 'Wealth Perspective Affiliate', emoji: '💎', avgProfit: 200, salesPerMonth: 10, tip: 'Share this app, earn $1-2 per signup!', isPinned: true, link: '/become-affiliate', isAffiliate: true },
  { name: 'Reselling Sneakers', emoji: '👟', avgProfit: 100, salesPerMonth: 8, tip: 'Follow drops, use bots, check StockX', isAffiliate: false },
  { name: 'Print on Demand', emoji: '👕', avgProfit: 16, salesPerMonth: 30, tip: 'Printful + Etsy = passive income', isAffiliate: false },
  { name: 'Thrift Flipping', emoji: '🏷️', avgProfit: 30, salesPerMonth: 20, tip: 'Vintage & designer on Poshmark', isAffiliate: false },
  { name: 'Dropshipping', emoji: '📦', avgProfit: 17, salesPerMonth: 50, tip: 'Find winners on TikTok, automate', isAffiliate: false },
  { name: 'Digital Products', emoji: '💻', avgProfit: 29, salesPerMonth: 40, tip: 'Notion templates are hot right now', isAffiliate: false },
];

type SelectedCelebrity = {
  name: string;
  earnings: number;
  emoji?: string;
  profession?: string;
  imageUrl?: string;
  source?: string;
};

const Calculator = () => {
  const { isFull: affiliateFull, spotsRemaining } = useAffiliateCapacity();
  const location = useLocation();
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
  
  // Affiliate calculator state
  const [affiliateReferrals, setAffiliateReferrals] = useState('50');
  const [affiliateResult, setAffiliateResult] = useState<{
    tier1Earnings: number;
    tier2Earnings: number;
    totalEarnings: number;
    referralsInTier1: number;
    referralsInTier2: number;
  } | null>(null);
  
  const { searchCelebrity } = useCelebritySearch();

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle navigation from profile with pre-selected celebrity
  useEffect(() => {
    if (location.state?.celebrity) {
      const celeb = location.state.celebrity as Celebrity;
      setSelectedCeleb({
        name: celeb.name,
        earnings: celeb.annualEarnings,
        emoji: undefined,
        profession: celeb.profession,
        imageUrl: celeb.imageUrl,
        source: celeb.source,
      });
    }
  }, [location.state]);

  const handleCompare = () => {
    if (salary > 0 && selectedCeleb) {
      setShowResults(true);
      window.setTimeout(() => {
        document
          .getElementById('reality-check-results')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
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
          source: result.source,
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

  // Calculate affiliate earnings based on tier structure
  const calculateAffiliateEarnings = (totalReferrals: number) => {
    const TIER_1_LIMIT = 1000;
    const TIER_1_RATE = 1; // $1 per signup
    const TIER_2_RATE = 2; // $2 per signup after 1,000
    
    const referralsInTier1 = Math.min(totalReferrals, TIER_1_LIMIT);
    const referralsInTier2 = Math.max(0, totalReferrals - TIER_1_LIMIT);
    
    const tier1Earnings = referralsInTier1 * TIER_1_RATE;
    const tier2Earnings = referralsInTier2 * TIER_2_RATE;
    const totalEarnings = tier1Earnings + tier2Earnings;
    
    return { tier1Earnings, tier2Earnings, totalEarnings, referralsInTier1, referralsInTier2 };
  };

  const applyHustlePreset = (hustle: typeof SIDE_HUSTLE_IDEAS[0]) => {
    setSelectedHustle(hustle);
    
    if (hustle.isAffiliate) {
      // For affiliate, calculate based on referral tiers
      const referrals = parseInt(affiliateReferrals) || 50;
      setAffiliateResult(calculateAffiliateEarnings(referrals));
      // Clear regular hustle results
      setHustleResult(null);
    } else {
      // Clear affiliate results
      setAffiliateResult(null);
      // Populate the calculator with realistic example values
      const buyPriceVal = Math.round(hustle.avgProfit * 0.4);
      const sellPriceVal = Math.round(hustle.avgProfit * 1.4);
      setBuyPrice(String(buyPriceVal));
      setSellPrice(String(sellPriceVal));
      setSalesVolume(String(hustle.salesPerMonth));
      
      // Calculate and show results
      const monthly = hustle.avgProfit * hustle.salesPerMonth;
      setHustleResult({ monthly, yearly: monthly * 12 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="Reality Check"
        description="See how fast celebrities earn your salary. Prepare to have your mind blown with our Reality Check calculator!"
        image="/og-calculator.png"
        path="/calculator"
      />
      <Header />
      <main className="flex-1 container py-8 md:py-12 pb-24 md:pb-12 animate-fade-in">
        <PaywallGate>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb currentPage="Reality Check" />
            <FeaturePromoShare feature="realityCheck" size="sm" showLabel />
          </div>
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

            {/* Selected Celebrity Display - Right below salary */}
            {selectedCeleb && (
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 animate-fade-in">
                <p className="text-sm text-muted-foreground">Comparing with</p>
                <div className="flex items-center justify-center gap-3 mt-2">
                  {selectedCeleb.imageUrl && (
                    <img 
                      src={selectedCeleb.imageUrl} 
                      alt={selectedCeleb.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30"
                    />
                  )}
                  <p className="text-lg font-bold text-primary">
                    {selectedCeleb.emoji && <span className="mr-2">{selectedCeleb.emoji}</span>}
                    {selectedCeleb.name}
                  </p>
                </div>
                {selectedCeleb.profession && (
                  <p className="text-xs text-muted-foreground mt-1">{selectedCeleb.profession}</p>
                )}
              </div>
            )}

            {/* Compare Button - Right after comparing with */}
            {selectedCeleb && (
              <Button 
                onClick={handleCompare}
                disabled={salary <= 0}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                🔍 Compare My Salary
              </Button>
            )}

            {/* Celebrity Search */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedCeleb ? 'Pick another celebrity' : 'Search any celebrity'}
                </CardTitle>
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

            {showResults && selectedCeleb && (
              <div id="reality-check-results" className="space-y-6 scroll-mt-24">
                <RealityCheckResult
                  userSalary={salary}
                  celebrityName={selectedCeleb.name}
                  celebrityAnnualEarnings={selectedCeleb.earnings}
                  celebrityImageUrl={selectedCeleb.imageUrl}
                  celebritySource={selectedCeleb.source}
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
                      {/* PINNED AFFILIATE OPTION - Hero Style */}
                      {!affiliateFull && (
                        <button
                          onClick={() => applyHustlePreset(SIDE_HUSTLE_IDEAS.find(h => h.isAffiliate)!)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                            selectedHustle?.isAffiliate
                              ? 'border-amber-400 bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 ring-2 ring-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                              : 'border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          }`}
                        >
                          {/* Animated shimmer effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          
                          <div className="flex items-center gap-4 relative z-10">
                            {/* Icon with glow */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full" />
                              <div className="relative text-4xl">💎</div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Crown className="h-4 w-4 text-amber-400" />
                                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Become a Mogul</span>
                                <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                  HOT 🔥
                                </span>
                              </div>
                              <p className="text-base font-bold text-foreground">Wealth Perspective Affiliate</p>
                              <p className="text-sm text-amber-400/80">Earn $1-2 per signup • Unlimited potential</p>
                            </div>
                            
                            {/* Arrow */}
                            <div className="flex-shrink-0">
                              <Sparkles className="h-5 w-5 text-amber-400" />
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Other Hustles Grid */}
                      <div className="grid grid-cols-5 gap-2">
                        {SIDE_HUSTLE_IDEAS
                          .filter(hustle => !hustle.isAffiliate) // Affiliate is shown separately above
                          .map((hustle) => (
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
                            <span className="text-xs font-medium block truncate text-foreground">
                              {hustle.name.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Show waitlist when affiliate program is full */}
                      {affiliateFull && (
                        <AffiliateWaitlist variant="compact" spotsRemaining={spotsRemaining} />
                      )}

                      {/* Results appear when hustle selected */}
                      {selectedHustle && (
                        <div className="animate-fade-in space-y-4">
                          {/* Hustle Header */}
                          <div className={`p-4 rounded-xl bg-card border ${selectedHustle.isPinned ? 'border-amber-500/50' : 'border-border/50'}`}>
                            <div className="flex items-start gap-3">
                              <span className="text-3xl flex-shrink-0">{selectedHustle.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className="text-lg font-bold text-foreground truncate">{selectedHustle.name}</p>
                                  {selectedHustle.isPinned && selectedHustle.link && !affiliateFull && (
                                    <Link to={selectedHustle.link} className="flex-shrink-0">
                                      <Button size="sm" className="gap-1 bg-gradient-to-r from-amber-500 to-primary">
                                        Join <ArrowRight className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                                <p className="text-sm text-primary">💡 {selectedHustle.tip}</p>
                              </div>
                            </div>
                          </div>

                          {/* AFFILIATE CALCULATOR - Special tiered referral UI */}
                          {selectedHustle.isAffiliate && (
                            <div className="space-y-4">
                              {/* Tier Breakdown Visual */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-primary/10 border border-amber-500/30">
                                <p className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                  👑 Our Tiered Commission Structure
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center">
                                    <p className="text-2xl font-bold text-emerald-400">$1</p>
                                    <p className="text-xs text-muted-foreground">per signup</p>
                                    <p className="text-xs font-medium text-foreground/70 mt-1">First 1,000 referrals</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-card/50 border border-primary/30 text-center">
                                    <p className="text-2xl font-bold text-primary">$2</p>
                                    <p className="text-xs text-muted-foreground">per signup</p>
                                    <p className="text-xs font-medium text-foreground/70 mt-1">After 1,000 referrals</p>
                                  </div>
                                </div>
                              </div>

                              {/* Referral Input Slider */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm font-medium text-foreground">How many signups can you get?</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="text"
                                      inputMode="numeric"
                                      value={affiliateReferrals}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setAffiliateReferrals(value);
                                        const refs = parseInt(value) || 0;
                                        setAffiliateResult(calculateAffiliateEarnings(refs));
                                      }}
                                      className="w-24 h-9 text-center font-bold text-lg"
                                    />
                                    <span className="text-sm text-muted-foreground">signups</span>
                                  </div>
                                </div>
                                
                                {/* Quick preset buttons */}
                                <div className="flex flex-wrap gap-2">
                                  {[10, 50, 100, 500, 1000, 2000, 5000].map((num) => (
                                    <button
                                      key={num}
                                      onClick={() => {
                                        setAffiliateReferrals(String(num));
                                        setAffiliateResult(calculateAffiliateEarnings(num));
                                      }}
                                      className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                        parseInt(affiliateReferrals) === num
                                          ? 'bg-primary text-primary-foreground font-bold'
                                          : 'bg-secondary/50 text-foreground/70 hover:bg-secondary'
                                      }`}
                                    >
                                      {num.toLocaleString()}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Affiliate Earnings Breakdown */}
                              {affiliateResult && (
                                <div className="space-y-3">
                                  {/* Tier breakdown */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                                      <p className="text-[10px] text-emerald-400/70 font-medium">Tier 1 Earnings</p>
                                      <p className="text-lg font-bold text-emerald-400">{formatCurrency(affiliateResult.tier1Earnings)}</p>
                                      <p className="text-[10px] text-muted-foreground">{affiliateResult.referralsInTier1.toLocaleString()} × $1</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                                      <p className="text-[10px] text-primary/70 font-medium">Tier 2 Earnings</p>
                                      <p className="text-lg font-bold text-primary">{formatCurrency(affiliateResult.tier2Earnings)}</p>
                                      <p className="text-[10px] text-muted-foreground">{affiliateResult.referralsInTier2.toLocaleString()} × $2</p>
                                    </div>
                                  </div>
                                  
                                  {/* Total */}
                                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-primary/20 border border-amber-500/30 text-center">
                                    <p className="text-xs text-amber-400/80 font-medium mb-1">Total Affiliate Earnings</p>
                                    <p className="text-3xl font-bold gradient-gold-text">{formatCurrency(affiliateResult.totalEarnings)}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      from {parseInt(affiliateReferrals || '0').toLocaleString()} referrals
                                    </p>
                                  </div>

                                  {/* Comparison to salary if available */}
                                  {salary > 0 && affiliateResult.totalEarnings > 0 && (
                                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                                      <p className="text-sm font-semibold text-primary">
                                        {affiliateResult.totalEarnings >= salary ? (
                                          <>🔥 That's {((affiliateResult.totalEarnings / salary) * 100).toFixed(0)}% of your annual salary!</>
                                        ) : (
                                          <>💪 That's {((affiliateResult.totalEarnings / salary) * 100).toFixed(0)}% of your salary — keep sharing!</>
                                        )}
                                      </p>
                                    </div>
                                  )}

                                  {/* Viral scenarios - tangible examples */}
                                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                                    <p className="text-xs font-semibold text-violet-400 mb-3 text-center">🚀 Real Viral Scenarios</p>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                                        <span className="text-muted-foreground">📱 One viral TikTok (500 signups)</span>
                                        <span className="font-bold text-emerald-400">= $500</span>
                                      </div>
                                      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                                        <span className="text-muted-foreground">🐦 Twitter thread goes viral (2K signups)</span>
                                        <span className="font-bold text-emerald-400">= $3,000</span>
                                      </div>
                                      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                                        <span className="text-muted-foreground">🔥 You hit 5K referrals</span>
                                        <span className="font-bold gradient-gold-text">= $9,000</span>
                                      </div>
                                      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                                        <span className="text-muted-foreground">👑 Top affiliate (10K signups)</span>
                                        <span className="font-bold gradient-gold-text">= $19,000</span>
                                      </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center mt-3">
                                      💡 Tier 1: $1/signup (first 1K) • Tier 2: $2/signup (after 1K)
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* REGULAR HUSTLE CALCULATOR */}
                          {!selectedHustle.isAffiliate && (
                            <>
                              {/* Adjustable Inputs */}
                              <div className="grid grid-cols-3 gap-3">
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
                                        setBuyPrice(value);
                                        const buy = parseFloat(value) || 0;
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
                                      type="text"
                                      inputMode="decimal"
                                      value={sellPrice}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9.]/g, '');
                                        setSellPrice(value);
                                        const buy = parseFloat(buyPrice) || 0;
                                        const sell = parseFloat(value) || 0;
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
                                    type="text"
                                    inputMode="numeric"
                                    value={salesVolume}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      setSalesVolume(value);
                                      const buy = parseFloat(buyPrice) || 0;
                                      const sell = parseFloat(sellPrice) || 0;
                                      const sales = parseFloat(value) || 0;
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
                                  <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <p className="text-xs text-foreground/60 font-medium mb-1">Monthly Income</p>
                                    <p className="text-2xl font-bold text-emerald-500">{formatCurrency(hustleResult.monthly)}</p>
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
                            </>
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
              </div>
            )}
          </div>
        </div>
        </PaywallGate>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Calculator;
