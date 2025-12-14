import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search any celebrity, athlete, or billionaire..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-24 h-14 text-lg bg-card border-border/50 focus:border-primary/50 transition-colors"
        />
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
