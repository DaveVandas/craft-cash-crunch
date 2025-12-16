import { useState, useEffect, useRef } from 'react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarEmoji } from '@/lib/avatar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawQuery = searchParams.get('q') || '';
  const displayQuery = sanitizeSearchQuery(rawQuery);
  const { searchCelebrity } = useCelebritySearch();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [result, setResult] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [accessDenied, setAccessDenied] = useState<'signin' | 'upgrade' | null>(null);
  const [searching, setSearching] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Avoid re-running the search effect due to searchCelebrity callback identity changes.
  const searchCelebrityRef = useRef(searchCelebrity);
  useEffect(() => {
    searchCelebrityRef.current = searchCelebrity;
  }, [searchCelebrity]);

  useEffect(() => {
    let cancelled = false;

    const performSearch = async () => {
      if (!rawQuery) {
        setResult(null);
        setValidationError(false);
        setAccessDenied(null);
        setSearching(false);
        return;
      }

      const validatedQuery = validateCelebrityName(rawQuery);

      if (!validatedQuery) {
        setValidationError(true);
        setResult(null);
        setAccessDenied(null);
        setSearching(false);
        return;
      }

      // Keep existing behavior: this page requires auth (Reality Check allows anonymous sampling)
      if (!userId) {
        setAccessDenied('signin');
        setResult(null);
        setValidationError(false);
        setSearching(false);
        return;
      }

      setValidationError(false);
      setAccessDenied(null);
      setTimedOut(false);
      setSearching(true);

      try {
        const timeoutMs = 15000;
        const res = await Promise.race([
          searchCelebrityRef.current(validatedQuery),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('SEARCH_TIMEOUT')), timeoutMs)),
        ]);

        if (!cancelled) setResult(res as Celebrity | null);
      } catch (error) {
        console.error('Search error:', error);
        if (!cancelled) {
          setResult(null);
          setTimedOut(error instanceof Error && error.message === 'SEARCH_TIMEOUT');
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    };

    performSearch();
    return () => {
      cancelled = true;
    };
  }, [rawQuery, userId]);

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
                  Sign in (or create an account) to unlock full earnings profiles.
                  <span className="block mt-2 text-sm">
                    You'll get <span className="text-primary font-semibold">3 free searches</span> to start, then it's{' '}
                    <span className="text-primary font-semibold">$4.99 once</span> for unlimited lifetime access.
                  </span>
                </p>
                <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
                  Sign In to Unlock
                </Button>
              </CardContent>
            </Card>
          )}

          {!searching && accessDenied === 'upgrade' && (
            <Card className="border-primary/30 bg-card/50 animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-semibold text-xl mb-2">Free Searches Used</h3>
                <p className="text-muted-foreground mb-2">You've used all 3 of your free searches.</p>
                <p className="text-muted-foreground mb-6">
                  Unlock <span className="text-primary font-semibold">unlimited access</span> for just $4.99 — one time,
                  forever.
                </p>
                <Button onClick={handleUpgrade} className="bg-primary hover:bg-primary/90">
                  Unlock Unlimited Access — $4.99
                </Button>
                <p className="text-xs text-muted-foreground/60 mt-3">
                  All sales final.{' '}
                  <Link to="/terms" className="underline hover:text-muted-foreground">
                    Terms
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}

          {!searching && !accessDenied && validationError && displayQuery && (
            <p className="text-center text-muted-foreground">Invalid search query. Please use only letters, spaces, and hyphens.</p>
          )}

          {!searching && !accessDenied && !validationError && displayQuery && !result && (
            <p className="text-center text-muted-foreground">No results found for "{displayQuery}". Try another search.</p>
          )}

          {!searching && !accessDenied && !validationError && result && (
            <Link to={`/profile/${result.id}`}>
              <Card className="border-primary/30 bg-card/50 hover:bg-card transition-colors cursor-pointer animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-lg shadow-md shadow-primary/10 ring-2 ring-primary/30">
                      <AvatarImage
                        src={result.imageUrl}
                        alt={result.name}
                        className="object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '';
                        }}
                      />
                      <AvatarFallback className="rounded-lg bg-secondary text-2xl">
                        {result.emoji || getAvatarEmoji(result.profession)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl">{result.name}</h3>
                      <p className="text-muted-foreground">{result.profession}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Annual</p>
                      <p className="text-xl font-bold text-primary">{formatCompactCurrency(result.annualEarnings)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
