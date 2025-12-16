import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import CompareResult from '@/components/compare/CompareResult';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { Celebrity } from '@/lib/types';
import { getAvatarEmoji } from '@/lib/avatar';
import { Scale, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Compare = () => {
  const location = useLocation();
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [person1, setPerson1] = useState<Celebrity | null>(null);
  const [person2, setPerson2] = useState<Celebrity | null>(null);
  const { fetchCelebrity, loading } = useCelebrityData();

  // Handle navigation from favorites with pre-loaded data
  useEffect(() => {
    if (location.state?.person1 && location.state?.person2) {
      setPerson1(location.state.person1);
      setPerson2(location.state.person2);
      setQuery1(location.state.person1.name);
      setQuery2(location.state.person2.name);
    }
  }, [location.state]);

  const handleCompare = async () => {
    if (!query1.trim() || !query2.trim()) return;
    
    const [result1, result2] = await Promise.all([
      fetchCelebrity(query1.trim()),
      fetchCelebrity(query2.trim())
    ]);
    
    setPerson1(result1);
    setPerson2(result2);
  };

  const clearPerson1 = () => {
    setPerson1(null);
    setQuery1('');
  };

  const clearPerson2 = () => {
    setPerson2(null);
    setQuery2('');
  };

  const bothReady = query1.trim() && query2.trim();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <PaywallGate>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Wealth <span className="gradient-gold-text">Showdown</span> ⚖️
            </h1>
            <p className="text-muted-foreground">
              Pick your tycoons and see who's stacking more cash.
            </p>
          </div>

          {/* Search Layout */}
          <Card className="border-border/50 bg-card/50 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Tycoon 1 Input */}
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground block mb-2">Tycoon #1</label>
                  {person1 ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                        <AvatarImage src={person1.imageUrl} alt={person1.name} className="object-cover" />
                        <AvatarFallback className="text-lg">{person1.emoji || getAvatarEmoji(person1.profession)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{person1.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{person1.profession}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearPerson1}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Elon Musk"
                        value={query1}
                        onChange={(e) => setQuery1(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && bothReady && handleCompare()}
                        className="pl-10"
                      />
                    </div>
                  )}
                </div>

                {/* VS Badge */}
                <div className="flex items-center justify-center md:pt-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amber-600 shadow-lg shadow-primary/30">
                    <Scale className="h-6 w-6 text-background" />
                  </div>
                </div>

                {/* Tycoon 2 Input */}
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground block mb-2">Tycoon #2</label>
                  {person2 ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                        <AvatarImage src={person2.imageUrl} alt={person2.name} className="object-cover" />
                        <AvatarFallback className="text-lg">{person2.emoji || getAvatarEmoji(person2.profession)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{person2.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{person2.profession}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearPerson2}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Jeff Bezos"
                        value={query2}
                        onChange={(e) => setQuery2(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && bothReady && handleCompare()}
                        className="pl-10"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Compare Button */}
              {(!person1 || !person2) && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleCompare} 
                    disabled={loading || !bothReady}
                    className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 px-8"
                    size="lg"
                  >
                    {loading ? 'Searching...' : 'Compare Wealth'}
                    <Scale className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {person1 && person2 && (
            <CompareResult person1={person1} person2={person2} />
          )}
        </div>
        </PaywallGate>
      </main>
      <Footer />
    </div>
  );
};

export default Compare;
