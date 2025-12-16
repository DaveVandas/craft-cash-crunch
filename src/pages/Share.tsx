import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaywallGate from '@/components/paywall/PaywallGate';
import SearchBar from '@/components/home/SearchBar';
import ShareCard from '@/components/share/ShareCard';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { Celebrity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Share2 } from 'lucide-react';

const Share = () => {
  const { fetchCelebrity, loading } = useCelebrityData();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (name: string) => {
    setSearched(true);
    const result = await fetchCelebrity(name);
    setCelebrity(result);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PaywallGate>
        <section className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-pink-500/20 text-pink-400">
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold">
                  Share Cards
                </h1>
                <p className="text-muted-foreground">Generate shareable wealth graphics</p>
              </div>
            </div>

            <div className="max-w-xl mb-12">
              <p className="text-muted-foreground mb-6">
                Search for any celebrity to create a shareable card with their mind-blowing earnings stats.
              </p>
              <SearchBarWithCallback onSearch={handleSearch} />
            </div>

            {loading && (
              <div className="max-w-xl">
                <Skeleton className="h-64 w-full mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}

            {!loading && celebrity && (
              <div className="max-w-xl animate-fade-in">
                <ShareCard celebrity={celebrity} />
              </div>
            )}

            {!loading && searched && !celebrity && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Couldn't find that person. Try another search.</p>
              </div>
            )}
          </div>
        </section>
        </PaywallGate>
      </main>
      <Footer />
    </div>
  );
};

// Wrapper component to handle search with callback
const SearchBarWithCallback = ({ onSearch }: { onSearch: (name: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search any celebrity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-24 h-14 text-lg bg-card border border-border/50 rounded-md focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate
        </button>
      </div>
    </form>
  );
};

export default Share;
