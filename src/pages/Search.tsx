import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import SearchBar from '@/components/home/SearchBar';
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency } from '@/lib/earnings';
import { validateCelebrityName, sanitizeSearchQuery } from '@/lib/validation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarEmoji } from '@/lib/avatar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const displayQuery = sanitizeSearchQuery(rawQuery);
  const { searchCelebrity, error: searchError } = useCelebritySearch();

  const [result, setResult] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);
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
        setSearching(false);
        return;
      }

      const validatedQuery = validateCelebrityName(rawQuery);

      if (!validatedQuery) {
        setValidationError(true);
        setResult(null);
        setSearching(false);
        return;
      }

      setValidationError(false);
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
  }, [rawQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <PaywallGate>
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
          {!searching && validationError && displayQuery && (
            <p className="text-center text-muted-foreground">Invalid search query. Please use only letters, spaces, and hyphens.</p>
          )}

          {!searching && !validationError && displayQuery && !result && !searchError && (
            <p className="text-center text-muted-foreground">No results found for "{displayQuery}". Try another search.</p>
          )}

          {!searching && !validationError && displayQuery && !result && searchError && !timedOut && (
            <p className="text-center text-muted-foreground">{searchError}</p>
          )}

          {!searching && timedOut && (
            <p className="text-center text-muted-foreground">That search took too long — try again.</p>
          )}

          {!searching && !validationError && result && (
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
        </PaywallGate>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
