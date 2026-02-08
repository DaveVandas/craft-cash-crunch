import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageMeta from '@/components/seo/PageMeta';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import PaywallGate from '@/components/paywall/PaywallGate';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import CompareResult from '@/components/compare/CompareResult';
import ComparePersonSelector from '@/components/compare/ComparePersonSelector';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { Celebrity, Category } from '@/lib/types';
import { getSimilarCelebrities, getCategoryEmoji } from '@/lib/similarCelebrities';
import { Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Compare = () => {
  const location = useLocation();
  const [person1, setPerson1] = useState<Celebrity | null>(null);
  const [person2, setPerson2] = useState<Celebrity | null>(null);
  const { fetchCelebrity, loading } = useCelebrityData();

  // Handle navigation from profile or favorites with pre-loaded data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (location.state?.person1) {
      setPerson1(location.state.person1);
    }
    if (location.state?.person2) {
      setPerson2(location.state.person2);
    }
  }, [location.state]);

  // Get suggested comparisons based on person1's category
  const suggestions = useMemo(() => {
    if (!person1?.category) return [];
    return getSimilarCelebrities(person1.name, person1.category as Category, 6);
  }, [person1]);

  const handleSuggestionClick = async (name: string) => {
    const result = await fetchCelebrity(name);
    setPerson2(result);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="Wealth Showdown"
        description="Compare the earnings of any two celebrities, athletes, or billionaires. See who's stacking more cash in our head-to-head wealth comparison."
        image="/og-compare.png"
        path="/compare"
      />
      <Header />
      <main className="flex-1 container py-8 md:py-12 pb-24 md:pb-12 animate-fade-in">
        <PaywallGate>
        <div className="max-w-4xl mx-auto">
          <Breadcrumb currentPage="Compare" />
          
          {/* Premium Hero Header */}
          <div className="relative text-center mb-10 animate-fade-in">
            {/* Decorative background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-lg">⚔️</span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Wealth Showdown</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Who's Making{' '}
              <span className="gradient-gold-text">More?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Pick your tycoons and see who's stacking more cash.
            </p>
          </div>

          {/* Selection Layout */}
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-start mb-8">
            {/* Tycoon 1 Selector */}
            <ComparePersonSelector
              label="Tycoon #1"
              selected={person1}
              onSelect={setPerson1}
              placeholder="e.g. Elon Musk, Drake Maye..."
            />

            {/* VS Badge - Premium */}
            <div className="flex items-center justify-center py-4 md:pt-8">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-xl shadow-primary/30 border border-primary/50">
                <Scale className="h-7 w-7 text-primary-foreground" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary-foreground/80 animate-pulse" />
              </div>
            </div>

            {/* Tycoon 2 Selector */}
            <ComparePersonSelector
              label="Tycoon #2"
              selected={person2}
              onSelect={setPerson2}
              placeholder="e.g. Jeff Bezos, Kid Rock..."
            />
          </div>

          {/* Category Suggestions */}
          {person1 && !person2 && suggestions.length > 0 && (
            <Card className="border-border/50 bg-card/50 mb-8 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">You might like to compare with</h3>
                  <span className="text-lg">{getCategoryEmoji(person1.category as Category)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {suggestions.map((celeb) => (
                    <Button
                      key={celeb.name}
                      variant="outline"
                      className="h-auto py-3 px-4 justify-start border-border/50 hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => handleSuggestionClick(celeb.name)}
                      disabled={loading}
                    >
                      <span className="mr-2 text-lg">{celeb.emoji}</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">{celeb.name}</p>
                        <p className="text-xs text-muted-foreground">{celeb.netWorth}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {person1 && person2 && (
            <CompareResult person1={person1} person2={person2} />
          )}
        </div>
        </PaywallGate>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Compare;
