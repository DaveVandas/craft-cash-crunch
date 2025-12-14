import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CompareSelector from '@/components/compare/CompareSelector';
import CompareResult from '@/components/compare/CompareResult';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { Celebrity } from '@/lib/types';
import { GitCompareArrows } from 'lucide-react';

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
              Side by <span className="gradient-gold-text">Side</span> ⚖️
            </h1>
            <p className="text-muted-foreground">
              Compare any two people and see who's making more dough.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <CompareSelector
              label="Person 1"
              selected={person1}
              onSearch={handleSearch1}
              loading={loading}
            />
            <div className="hidden md:flex items-center justify-center">
              <GitCompareArrows className="h-8 w-8 text-primary" />
            </div>
            <CompareSelector
              label="Person 2"
              selected={person2}
              onSearch={handleSearch2}
              loading={loading}
            />
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
