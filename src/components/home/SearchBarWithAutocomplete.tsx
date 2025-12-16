import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface SearchBarWithAutocompleteProps {
  placeholder?: string;
  categoryId?: string;
}

interface Suggestion {
  name: string;
  searchCount: number;
}

// Popular fallback suggestions by category
const POPULAR_BY_CATEGORY: Record<string, string[]> = {
  'athletes': ['LeBron James', 'Cristiano Ronaldo', 'Lionel Messi', 'Patrick Mahomes', 'Stephen Curry', 'Serena Williams', 'Tom Brady', 'Tiger Woods', 'Lewis Hamilton', 'Shohei Ohtani'],
  'hollywood': ['Dwayne Johnson', 'Scarlett Johansson', 'Tom Cruise', 'Leonardo DiCaprio', 'Margot Robbie', 'Robert Downey Jr', 'Ryan Reynolds', 'Jennifer Lawrence', 'Brad Pitt', 'Chris Hemsworth'],
  'musicians': ['Taylor Swift', 'Drake', 'Beyoncé', 'Ed Sheeran', 'Bad Bunny', 'The Weeknd', 'Rihanna', 'Travis Scott', 'Billie Eilish', 'Adele'],
  'tech-billionaires': ['Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg', 'Bill Gates', 'Sundar Pichai', 'Tim Cook', 'Jensen Huang', 'Satya Nadella', 'Larry Ellison', 'Sam Altman'],
  'politicians': ['Donald Trump', 'Joe Biden', 'Barack Obama', 'Vladimir Putin', 'Emmanuel Macron', 'Rishi Sunak', 'Justin Trudeau', 'Angela Merkel', 'Nancy Pelosi', 'Bernie Sanders'],
  'influencers': ['MrBeast', 'Kylie Jenner', 'Logan Paul', 'PewDiePie', 'Charli D\'Amelio', 'Kim Kardashian', 'Jake Paul', 'KSI', 'Ninja', 'Pokimane'],
  'historical': ['John D. Rockefeller', 'Andrew Carnegie', 'Mansa Musa', 'Henry Ford', 'Cleopatra', 'Genghis Khan', 'J.P. Morgan', 'Cornelius Vanderbilt', 'King Solomon', 'Augustus Caesar'],
};

// General popular celebrities
const POPULAR_CELEBRITIES = [
  'Elon Musk', 'Taylor Swift', 'LeBron James', 'Beyoncé', 'Jeff Bezos',
  'Cristiano Ronaldo', 'Kim Kardashian', 'Drake', 'Oprah Winfrey', 'Jay-Z',
  'Rihanna', 'Michael Jordan', 'Lionel Messi', 'The Rock', 'Kanye West'
];

const SearchBarWithAutocomplete = ({ placeholder = "Search any celebrity, athlete, or billionaire...", categoryId }: SearchBarWithAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from search_trends
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Get category-specific popular celebrities
      const popularPool = categoryId ? (POPULAR_BY_CATEGORY[categoryId] || POPULAR_CELEBRITIES) : POPULAR_CELEBRITIES;
      
      if (query.length < 1) {
        // Show popular suggestions when focused but no query
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // Build query for trending data
        let dbQuery = supabase
          .from('search_trends')
          .select('celebrity_name, search_count, category')
          .ilike('celebrity_name', `%${query}%`)
          .order('search_count', { ascending: false })
          .limit(5);

        // Filter by category if provided
        if (categoryId) {
          dbQuery = dbQuery.eq('category', categoryId);
        }

        const { data: trendingData } = await dbQuery;

        const trendingSuggestions: Suggestion[] = (trendingData || []).map(d => ({
          name: d.celebrity_name,
          searchCount: d.search_count
        }));

        // Add popular matches if we don't have enough
        const popularMatches = popularPool
          .filter(name => name.toLowerCase().includes(query.toLowerCase()))
          .filter(name => !trendingSuggestions.find(s => s.name.toLowerCase() === name.toLowerCase()))
          .slice(0, 5 - trendingSuggestions.length)
          .map(name => ({ name, searchCount: 0 }));

        setSuggestions([...trendingSuggestions, ...popularMatches].slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounce);
  }, [query, categoryId]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex].name);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-24 h-14 text-lg bg-card border-border/50 focus:border-primary/50 transition-colors"
          autoComplete="off"
        />
        <Button 
          type="button"
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {loading ? (
            <div className="p-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.name}
                  onClick={() => handleSearch(suggestion.name)}
                  className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                    index === selectedIndex ? 'bg-primary/20' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span>{suggestion.name}</span>
                  </div>
                  {suggestion.searchCount > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {suggestion.searchCount} searches
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No matches found. Press Enter to search anyway!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarWithAutocomplete;
