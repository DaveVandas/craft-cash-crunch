import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PortfolioLoadingOverlay } from '@/components/trading/PortfolioLoadingOverlay';
import { 
  Users, 
  Search, 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  Building2,
  User,
  Briefcase,
  Cpu,
  ChevronRight,
  Copy,
  Check,
  ArrowLeft,
  Crown,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getOrCreateGuestSession, createSupabaseWithSession } from '@/lib/supabaseWithSession';
import { cn } from '@/lib/utils';

interface PortfolioHolding {
  ticker: string;
  companyName: string;
  value?: string;
  percentOfPortfolio?: number;
  recentAction?: 'buy' | 'sell' | 'hold';
  reportDate?: string;
}

interface CelebrityPortfolio {
  name: string;
  title: string;
  category: string;
  portfolioSummary: string;
  topHoldings: PortfolioHolding[];
  totalValue?: string;
  lastUpdated?: string;
  dataSource?: string;
}

interface FeaturedFigure {
  name: string;
  title: string;
  category: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  politician: <Building2 className="h-4 w-4" />,
  investor: <Briefcase className="h-4 w-4" />,
  celebrity: <User className="h-4 w-4" />,
  tech: <Cpu className="h-4 w-4" />,
  international: <Crown className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  politician: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  investor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  celebrity: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  tech: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  international: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const categoryLabels: Record<string, string> = {
  all: 'All',
  politician: 'Politicians',
  investor: 'Investors',
  celebrity: 'Celebrities',
  tech: 'Tech Leaders',
  international: 'International',
};

// Fallback featured figures in case API fails - expanded
const FALLBACK_FIGURES: FeaturedFigure[] = [
  // Politicians
  { name: 'Nancy Pelosi', title: 'U.S. House Representative', category: 'politician' },
  { name: 'Dan Crenshaw', title: 'U.S. House Representative', category: 'politician' },
  { name: 'Tommy Tuberville', title: 'U.S. Senator', category: 'politician' },
  { name: 'Marjorie Taylor Greene', title: 'U.S. House Representative', category: 'politician' },
  { name: 'Josh Gottheimer', title: 'U.S. House Representative', category: 'politician' },
  // Investors
  { name: 'Warren Buffett', title: 'Berkshire Hathaway CEO', category: 'investor' },
  { name: 'Michael Burry', title: 'Scion Asset Management', category: 'investor' },
  { name: 'Cathie Wood', title: 'ARK Invest CEO', category: 'investor' },
  { name: 'Bill Ackman', title: 'Pershing Square CEO', category: 'investor' },
  { name: 'Ray Dalio', title: 'Bridgewater Founder', category: 'investor' },
  { name: 'Stanley Druckenmiller', title: 'Duquesne Family Office', category: 'investor' },
  { name: 'George Soros', title: 'Soros Fund Management', category: 'investor' },
  { name: 'Carl Icahn', title: 'Icahn Enterprises', category: 'investor' },
  // Tech
  { name: 'Elon Musk', title: 'Tesla/SpaceX CEO', category: 'tech' },
  { name: 'Jeff Bezos', title: 'Amazon Founder', category: 'tech' },
  { name: 'Mark Zuckerberg', title: 'Meta CEO', category: 'tech' },
  { name: 'Jensen Huang', title: 'NVIDIA CEO', category: 'tech' },
  // Celebrity
  { name: 'Mark Cuban', title: 'Investor & Shark Tank', category: 'celebrity' },
  { name: 'Ashton Kutcher', title: 'A-Grade Investments', category: 'celebrity' },
  { name: 'Jay-Z', title: 'Marcy Venture Partners', category: 'celebrity' },
  { name: 'Serena Williams', title: 'Serena Ventures', category: 'celebrity' },
  // International
  { name: 'Masayoshi Son', title: 'SoftBank CEO', category: 'international' },
  { name: 'Bernard Arnault', title: 'LVMH CEO', category: 'international' },
];

const CelebrityPortfolios = () => {
  const { user } = useAuth();
  const [featuredFigures, setFeaturedFigures] = useState<FeaturedFigure[]>(FALLBACK_FIGURES);
  const [selectedPortfolio, setSelectedPortfolio] = useState<CelebrityPortfolio | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [loadingName, setLoadingName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedHoldings, setSelectedHoldings] = useState<Set<string>>(new Set());
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const guestSessionId = useMemo(() => {
    if (user) return null;
    return getOrCreateGuestSession();
  }, [user]);

  const db = useMemo(() => {
    if (user) return supabase;
    return createSupabaseWithSession(guestSessionId);
  }, [user, guestSessionId]);

  // Fetch featured figures on mount - fallback already set, so this is optional
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-celebrity-portfolio', {
          body: { action: 'list' },
        });
        
        if (!error && data?.figures?.length > 0) {
          setFeaturedFigures(data.figures);
        }
      } catch (err) {
        console.error('Error fetching featured figures:', err);
        // Keep fallback figures - no need to show error toast
      }
    };
    
    fetchFeatured();
  }, []);

  const handleSelectFigure = async (name: string) => {
    setLoadingName(name);
    setIsLoadingPortfolio(true);
    setError(null);
    setSelectedHoldings(new Set());
    
    try {
      // IMPORTANT: do NOT pass `headers` here. In some environments it can replace the
      // underlying required headers and cause the function call to fail.
      // We rely on the session-aware client (db) which already injects `x-session-id`.
      const { data, error: invokeError } = await db.functions.invoke('get-celebrity-portfolio', {
        body: { action: 'fetch', name },
      });

      // Debug (will show in console snapshot on next message)
      console.log('[VIP portfolios] fetch', {
        name,
        isAuthed: Boolean(user),
        guestSessionId,
        hasData: Boolean(data),
        errorCode: data?.errorCode,
        invokeError,
      });
      
      if (invokeError) {
        console.error('Invoke error:', invokeError);
        throw invokeError;
      }
      
      if (data?.errorCode === 'AUTH_REQUIRED') {
        toast.error('Please sign in to view portfolios');
        return;
      }
      
      if (data?.errorCode === 'RATE_LIMIT') {
        toast.error('Too many requests. Please wait a moment.');
        return;
      }
      
      if (data?.portfolio) {
        setSelectedPortfolio(data.portfolio);
      } else if (data?.error) {
        setError(data.error);
      } else {
        setError('No portfolio data available for this person.');
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to load portfolio data. Please try again.');
    } finally {
      setIsLoadingPortfolio(false);
      setLoadingName('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSelectFigure(searchQuery.trim());
    }
  };

  const toggleHoldingSelection = (ticker: string) => {
    setSelectedHoldings(prev => {
      const next = new Set(prev);
      if (next.has(ticker)) {
        next.delete(ticker);
      } else {
        next.add(ticker);
      }
      return next;
    });
  };

  const selectAllHoldings = () => {
    if (selectedPortfolio) {
      const allTickers = new Set(selectedPortfolio.topHoldings.map(h => h.ticker));
      setSelectedHoldings(allTickers);
    }
  };

  const handleCopyToMarkets = () => {
    if (selectedHoldings.size === 0) {
      toast.error('Select at least one stock to copy');
      return;
    }
    
    // Store selected tickers in sessionStorage for the markets page to pick up
    const tickers = Array.from(selectedHoldings);
    sessionStorage.setItem('copyPortfolioTickers', JSON.stringify(tickers));
    
    toast.success(`${tickers.length} stocks ready to trade!`, {
      description: 'Redirecting to Mogul Markets...',
    });
    
    // Navigate to markets page
    window.location.href = '/mogul-markets?from=celebrity-portfolio';
  };

  // Filter suggestions for autocomplete
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return featuredFigures
      .filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.title.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, featuredFigures]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => Math.min(prev + 1, searchSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && searchSuggestions[selectedSuggestionIndex]) {
        handleSelectFigure(searchSuggestions[selectedSuggestionIndex].name);
      } else if (searchQuery.trim()) {
        handleSelectFigure(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Discover new figures via AI
  const handleDiscover = async (category: string) => {
    setIsDiscovering(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-celebrity-portfolio', {
        body: { action: 'discover', category },
      });
      
      if (!error && data?.figures?.length > 0) {
        // Add discovered figures to the list (avoid duplicates)
        setFeaturedFigures(prev => {
          const existingNames = new Set(prev.map(f => f.name.toLowerCase()));
          const newFigures = data.figures.filter(
            (f: FeaturedFigure) => !existingNames.has(f.name.toLowerCase())
          );
          if (newFigures.length > 0) {
            toast.success(`Discovered ${newFigures.length} new ${categoryLabels[category] || category}!`);
            return [...prev, ...newFigures];
          } else {
            toast.info('No new figures found. Try a different category.');
            return prev;
          }
        });
      } else {
        toast.error('Could not discover new figures. Try again later.');
      }
    } catch (err) {
      console.error('Discovery error:', err);
      toast.error('Discovery failed. Please try again.');
    } finally {
      setIsDiscovering(false);
    }
  };

  const filteredFigures = featuredFigures.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Full-screen loading overlay when fetching portfolio */}
      {isLoadingPortfolio && loadingName && (
        <PortfolioLoadingOverlay name={loadingName} />
      )}
      
      <main className="flex-1 container py-6 md:py-8 pb-24 md:pb-8">
        <Breadcrumb currentPage="Celebrity Portfolios" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Celebrity <span className="gradient-gold-text">Portfolios</span>
            </h1>
          </div>
          
          {selectedPortfolio && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPortfolio(null)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          )}
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-3 text-sm">
              <Crown className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-muted-foreground">
                View publicly disclosed portfolios of politicians, investors, and public figures. 
                Copy their trades to your Mogul Markets paper trading portfolio!
              </p>
            </div>
          </CardContent>
        </Card>

        {!selectedPortfolio ? (
          <>
            {/* Search Bar with Autocomplete */}
            <div ref={searchWrapperRef} className="relative mb-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name or search for any public figure..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-10 pr-20"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2"
                    disabled={!searchQuery.trim() || isLoadingPortfolio}
                  >
                    {isLoadingPortfolio ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                  </Button>
                </div>
              </form>

              {/* Autocomplete dropdown */}
              {showSuggestions && searchQuery.length >= 2 && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <ul>
                    {searchSuggestions.map((figure, index) => (
                      <li
                        key={figure.name}
                        onClick={() => {
                          handleSelectFigure(figure.name);
                          setShowSuggestions(false);
                        }}
                        className={cn(
                          "px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors",
                          index === selectedSuggestionIndex ? "bg-primary/20" : "hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          categoryColors[figure.category] || 'bg-muted'
                        )}>
                          {categoryIcons[figure.category] || <User className="h-4 w-4" />}
                        </div>
                        <div>
                          <span className="font-medium">{figure.name}</span>
                          <p className="text-xs text-muted-foreground">{figure.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'politician', 'investor', 'celebrity', 'tech', 'international'].map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "gap-2",
                      activeCategory === cat && "bg-primary text-primary-foreground"
                    )}
                  >
                    {cat !== 'all' && categoryIcons[cat]}
                    {categoryLabels[cat]}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {cat === 'all' 
                        ? featuredFigures.length 
                        : featuredFigures.filter(f => f.category === cat).length
                      }
                    </Badge>
                  </Button>
                ))}
                
                {/* Discover More Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDiscover(activeCategory === 'all' ? 'investor' : activeCategory)}
                  disabled={isDiscovering}
                  className="ml-auto border-primary/50 text-primary hover:bg-primary/10"
                >
                  {isDiscovering ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Discover More
                </Button>
              </div>
            </div>

            {/* Featured Figures Grid */}
            {isLoadingList ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFigures.map((figure) => (
                  <Card 
                    key={figure.name}
                    className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                    onClick={() => handleSelectFigure(figure.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            categoryColors[figure.category] || 'bg-muted'
                          )}>
                            {categoryIcons[figure.category] || <User className="h-4 w-4" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{figure.name}</h3>
                            <p className="text-sm text-muted-foreground">{figure.title}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Portfolio Detail View */
          <div className="space-y-6">
            {/* Portfolio Header */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-transparent">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      categoryColors[selectedPortfolio.category] || 'bg-muted'
                    )}>
                      {categoryIcons[selectedPortfolio.category] || <User className="h-6 w-6" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPortfolio.name}</h2>
                      <p className="text-muted-foreground">{selectedPortfolio.title}</p>
                    </div>
                  </div>
                  
                  {selectedPortfolio.totalValue && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Est. Portfolio Value</p>
                      <p className="text-xl font-bold gradient-gold-text">{selectedPortfolio.totalValue}</p>
                    </div>
                  )}
                </div>
                
                {selectedPortfolio.portfolioSummary && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {selectedPortfolio.portfolioSummary}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPortfolio.lastUpdated && (
                    <Badge variant="outline" className="text-xs">
                      Updated: {selectedPortfolio.lastUpdated}
                    </Badge>
                  )}
                  {selectedPortfolio.dataSource && (
                    <Badge variant="outline" className="text-xs">
                      Source: {selectedPortfolio.dataSource}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Holdings List */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Top Holdings</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllHoldings}
                      className="text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCopyToMarkets}
                      disabled={selectedHoldings.size === 0}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy to Markets ({selectedHoldings.size})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedPortfolio.topHoldings.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No holdings data available</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {selectedPortfolio.topHoldings.map((holding) => (
                        <div
                          key={holding.ticker}
                          onClick={() => toggleHoldingSelection(holding.ticker)}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            selectedHoldings.has(holding.ticker)
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-primary/30 hover:bg-card/80"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                selectedHoldings.has(holding.ticker)
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              )}>
                                {selectedHoldings.has(holding.ticker) && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{holding.ticker}</span>
                                  {holding.recentAction && (
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "text-xs",
                                        holding.recentAction === 'buy' && "border-emerald-500/30 text-emerald-400",
                                        holding.recentAction === 'sell' && "border-red-500/30 text-red-400",
                                        holding.recentAction === 'hold' && "border-muted-foreground/30 text-muted-foreground"
                                      )}
                                    >
                                      {holding.recentAction === 'buy' && <TrendingUp className="h-3 w-3 mr-1" />}
                                      {holding.recentAction === 'sell' && <TrendingDown className="h-3 w-3 mr-1" />}
                                      {holding.recentAction.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{holding.companyName}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {holding.value && (
                                <p className="font-medium">{holding.value}</p>
                              )}
                              {holding.percentOfPortfolio && (
                                <p className="text-xs text-muted-foreground">
                                  {holding.percentOfPortfolio.toFixed(1)}% of portfolio
                                </p>
                              )}
                              {holding.reportDate && (
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                  {holding.reportDate}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="py-3 px-4">
                <p className="text-xs text-amber-400/80">
                  <strong>Disclaimer:</strong> Portfolio data is based on public disclosures and may not reflect current holdings. 
                  This information is for educational purposes only and should not be considered investment advice. 
                  Mogul Markets uses paper trading only.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Card className="mt-6 border-red-500/30 bg-red-500/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default CelebrityPortfolios;
