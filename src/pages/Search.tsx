import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { useAuth } from '@/contexts/AuthContext';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency } from '@/lib/earnings';
import { validateCelebrityName, sanitizeSearchQuery } from '@/lib/validation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawQuery = searchParams.get('q') || '';
  const displayQuery = sanitizeSearchQuery(rawQuery);
  const { searchCelebrity, error: searchError } = useCelebritySearch();
  const { user } = useAuth();
  const [result, setResult] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [accessDenied, setAccessDenied] = useState<'signin' | 'upgrade' | null>(null);
  const [searching, setSearching] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (rawQuery) {
      const validatedQuery = validateCelebrityName(rawQuery);
      
      if (!validatedQuery) {
        setValidationError(true);
        setResult(null);
        setAccessDenied(null);
        setAiError(false);
        return;
      }
      
      // Check auth before searching; paywall is handled inside the search hook
      if (!user) {
        setAccessDenied('signin');
        setResult(null);
        setValidationError(false);
        setSearching(false);
        setAiError(false);
        return;
      }
      
      setValidationError(false);
      setAccessDenied(null);
      setAiError(false);
      setSearching(true);
      searchCelebrity(validatedQuery).then((res) => {
        setResult(res);
        // If no result and there was a search error, show AI error state
        if (!res && searchError) {
          setAiError(true);
        }
        setSearching(false);
      });
    } else {
      setResult(null);
      setValidationError(false);
      setAccessDenied(null);
      setSearching(false);
      setAiError(false);
    }
  }, [rawQuery, searchCelebrity, user, searchError]);

  const handleUpgrade = async () => {
    const { data } = await supabase.functions.invoke('create-payment');
    if (data?.url) window.open(data.url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-bold mb-6 text-center">
            Search <span className="gradient-gold-text">Anyone</span>
          </h1>
          <div className="mb-8">
            <SearchBar />
          </div>

          {searching && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {!searching && accessDenied === 'signin' && (
            <Card className="border-primary/30 bg-card/50 animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="font-semibold text-xl mb-2">Sign In Required</h3>
                <p className="text-muted-foreground mb-6">
                  Create a free account to search for celebrities and see their earnings.
                </p>
                <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
                  Sign In / Sign Up
                </Button>
              </CardContent>
            </Card>
          )}

          {!searching && accessDenied === 'upgrade' && (
            <Card className="border-primary/30 bg-card/50 animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-semibold text-xl mb-2">Free Searches Used</h3>
                <p className="text-muted-foreground mb-2">
                  You've used all 3 of your free searches.
                </p>
                <p className="text-muted-foreground mb-6">
                  Unlock <span className="text-primary font-semibold">unlimited access</span> for just $4.99 — one time, forever.
                </p>
                <Button onClick={handleUpgrade} className="bg-primary hover:bg-primary/90">
                  Unlock Unlimited Access — $4.99
                </Button>
              </CardContent>
            </Card>
          )}

          {!searching && !accessDenied && validationError && displayQuery && (
            <p className="text-center text-muted-foreground">
              Invalid search query. Please use only letters, spaces, and hyphens.
            </p>
          )}

          {!searching && !accessDenied && !validationError && aiError && displayQuery && !result && (
            <Card className="border-destructive/30 bg-card/50 animate-fade-in">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Couldn't Fetch Data</h3>
                <p className="text-muted-foreground mb-4">
                  We're having trouble fetching data for "{displayQuery}" right now.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  This is usually temporary. Please try again in a moment.
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {!searching && !accessDenied && !validationError && result && (
            <Link to={`/profile/${result.id}`}>
              <Card className="border-primary/30 bg-card/50 hover:bg-card transition-colors cursor-pointer animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center text-3xl">
                      💰
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl">{result.name}</h3>
                      <p className="text-muted-foreground">{result.profession}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Annual</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCompactCurrency(result.annualEarnings)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {!searching && !accessDenied && !validationError && !aiError && displayQuery && !result && (
            <p className="text-center text-muted-foreground">
              No results found for "{displayQuery}". Try another search.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
