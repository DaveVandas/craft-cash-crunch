import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SalaryInput from '@/components/calculator/SalaryInput';
import RealityCheckResult from '@/components/calculator/RealityCheckResult';
import RealityCheckShareCard from '@/components/calculator/RealityCheckShareCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCelebritySearch } from '@/hooks/useCelebritySearch';
import { Celebrity } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const popularCelebrities = [
  { name: 'Elon Musk', earnings: 23500000000, emoji: '🚀' },
  { name: 'LeBron James', earnings: 119500000, emoji: '🏀' },
  { name: 'Taylor Swift', earnings: 185000000, emoji: '🎤' },
  { name: 'Cristiano Ronaldo', earnings: 260000000, emoji: '⚽' },
  { name: 'Beyoncé', earnings: 115000000, emoji: '👑' },
  { name: 'Jeff Bezos', earnings: 8500000000, emoji: '📦' },
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
        toast.success(`Found ${result.name}!`);
      } else {
        toast.error('Celebrity not found. Try another name.');
      }
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
