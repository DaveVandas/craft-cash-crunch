import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/home/SearchBar';
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency } from '@/lib/earnings';
import { validateCelebrityName, sanitizeSearchQuery } from '@/lib/validation';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Search = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const displayQuery = sanitizeSearchQuery(rawQuery);
  const { searchCelebrity, loading } = useCelebritySearch();
  const [result, setResult] = useState<Celebrity | null>(null);
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    if (rawQuery) {
      // Validate the search query before making API call
      const validatedQuery = validateCelebrityName(rawQuery);
      
      if (!validatedQuery) {
        setValidationError(true);
        setResult(null);
        return;
      }
      
      setValidationError(false);
      searchCelebrity(validatedQuery).then(setResult);
    } else {
      setResult(null);
      setValidationError(false);
    }
  }, [rawQuery, searchCelebrity]);

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

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {!loading && validationError && displayQuery && (
            <p className="text-center text-muted-foreground">
              Invalid search query. Please use only letters, spaces, and hyphens.
            </p>
          )}

          {!loading && !validationError && result && (
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

          {!loading && !validationError && displayQuery && !result && (
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
