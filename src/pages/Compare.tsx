import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CompareSelector from '@/components/compare/CompareSelector';
import CompareResult from '@/components/compare/CompareResult';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { Celebrity } from '@/lib/types';
import { Swords } from 'lucide-react';

const Compare = () => {
  const [person1, setPerson1] = useState<Celebrity | null>(null);
  const [person2, setPerson2] = useState<Celebrity | null>(null);
  const { fetchCelebrity, loading } = useCelebrityData();

  const handleSearch1 = async (query: string) => {
    if (!query) { setPerson1(null); return null; }
    const result = await fetchCelebrity(query);
    setPerson1(result);
    return result;
  };

  const handleSearch2 = async (query: string) => {
    if (!query) { setPerson2(null); return null; }
    const result = await fetchCelebrity(query);
    setPerson2(result);
    return result;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Wealth <span className="gradient-gold-text">Showdown</span> ⚔️
            </h1>
            <p className="text-muted-foreground">
              Pick your fighters and see who's stacking more cash.
            </p>
          </div>

          {/* Boxing Matchup Style Layout */}
          <div className="relative flex flex-col md:flex-row items-stretch gap-4 md:gap-0 mb-8">
            {/* Person 1 */}
            <div className="flex-1">
              <CompareSelector
                label="Challenger 1"
                selected={person1}
                onSearch={handleSearch1}
                loading={loading}
              />
            </div>
            
            {/* VS Badge */}
            <div className="flex items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-amber-600 shadow-lg shadow-primary/30 ring-4 ring-background">
                <Swords className="h-7 w-7 text-background" />
              </div>
            </div>
            
            {/* Person 2 */}
            <div className="flex-1 md:pl-8">
              <CompareSelector
                label="Challenger 2"
                selected={person2}
                onSearch={handleSearch2}
                loading={loading}
              />
            </div>
          </div>

          {person1 && person2 && (
            <CompareResult person1={person1} person2={person2} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Compare;
