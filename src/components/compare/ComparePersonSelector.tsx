import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Check, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Celebrity } from '@/lib/types';
import { getAvatarEmoji } from '@/lib/avatar';
import { useCelebrityData } from '@/hooks/useCelebrityData';
import { supabase } from '@/integrations/supabase/client';
import { filterCelebritySuggestions, CelebritySuggestion, formatNetWorthShort } from '@/lib/celebritySuggestions';

interface ComparePersonSelectorProps {
  label: string;
  selected: Celebrity | null;
  onSelect: (person: Celebrity | null) => void;
  placeholder?: string;
}

const ComparePersonSelector = ({ label, selected, onSelect, placeholder = "Search anyone..." }: ComparePersonSelectorProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CelebritySuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [previewPerson, setPreviewPerson] = useState<Celebrity | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  const { fetchCelebrity } = useCelebrityData();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setPreviewPerson(null);
        return;
      }

      setLoadingSuggestions(true);
      try {
        // Get trending data to boost scores
        const { data: trendingData } = await supabase
          .from('search_trends')
          .select('celebrity_name, search_count, category')
          .ilike('celebrity_name', `%${query}%`)
          .order('search_count', { ascending: false })
          .limit(20);

        const trending = (trendingData || []).map(d => ({
          name: d.celebrity_name,
          searchCount: d.search_count,
          category: d.category || undefined,
        }));

        // Filter and rank from our comprehensive list
        const filtered = filterCelebritySuggestions(query, 8, trending);
        setSuggestions(filtered);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Fallback to just static suggestions
        const filtered = filterCelebritySuggestions(query, 8);
        setSuggestions(filtered);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load preview when user hovers or selects a suggestion
  const loadPreview = async (name: string) => {
    setLoadingPreview(true);
    setPreviewPerson(null);
    try {
      const person = await fetchCelebrity(name);
      if (person) {
        setPreviewPerson(person);
      }
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Confirm selection from preview
  const confirmSelection = () => {
    if (previewPerson) {
      onSelect(previewPerson);
      setQuery('');
      setPreviewPerson(null);
      setShowDropdown(false);
    }
  };

  // Handle suggestion click - load preview first
  const handleSuggestionClick = async (name: string) => {
    await loadPreview(name);
  };

  // Handle direct search (Enter key with custom query)
  const handleDirectSearch = async () => {
    if (query.trim()) {
      await loadPreview(query.trim());
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
      if (previewPerson) {
        confirmSelection();
      } else if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex].name);
      } else if (query.trim()) {
        handleDirectSearch();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setPreviewPerson(null);
    }
  };

  const clearSelection = () => {
    onSelect(null);
    setQuery('');
    setPreviewPerson(null);
  };

  const formatNetWorth = (netWorth: number) => {
    if (netWorth >= 1e9) return `$${(netWorth / 1e9).toFixed(1)}B`;
    if (netWorth >= 1e6) return `$${(netWorth / 1e6).toFixed(0)}M`;
    return `$${netWorth.toLocaleString()}`;
  };

  // If person is already selected, show the selected card
  if (selected) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearSelection}
              className="text-xs h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Change
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 ring-2 ring-primary/30 shadow-lg">
              <AvatarImage src={selected.imageUrl} alt={selected.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xl">
                {selected.emoji || getAvatarEmoji(selected.profession)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{selected.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{selected.profession}</p>
              <p className="text-sm font-semibold text-primary">{formatNetWorth(selected.netWorth)}</p>
            </div>
            <Check className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">{label}</span>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
                setSelectedIndex(-1);
                setPreviewPerson(null);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
              autoComplete="off"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setQuery('');
                  setPreviewPerson(null);
                  inputRef.current?.focus();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Preview Card - Shows when a person is being previewed */}
          {(loadingPreview || previewPerson) && (
            <div className="mt-3 p-3 rounded-lg border border-primary/30 bg-primary/5 animate-fade-in">
              {loadingPreview ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Loading preview...</span>
                </div>
              ) : previewPerson && (
                <>
                  <p className="text-xs font-medium text-primary mb-2">Is this who you meant?</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={previewPerson.imageUrl} alt={previewPerson.name} className="object-cover" />
                      <AvatarFallback className="text-lg">
                        {previewPerson.emoji || getAvatarEmoji(previewPerson.profession)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{previewPerson.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{previewPerson.profession}</p>
                      <p className="text-xs font-medium text-primary">{formatNetWorth(previewPerson.netWorth)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={confirmSelection}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Yes, Select
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setPreviewPerson(null);
                        inputRef.current?.focus();
                      }}
                    >
                      No, Search Again
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Dropdown */}
      {showDropdown && query.length >= 2 && !previewPerson && !loadingPreview && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
          {loadingSuggestions ? (
            <div className="p-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <p className="px-3 py-2 text-xs text-muted-foreground bg-muted/50 border-b border-border">
                Click to preview before selecting
              </p>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.name}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      index === selectedIndex ? 'bg-primary/20' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{suggestion.name}</span>
                      </div>
                      {suggestion.profession && (
                        <p className="text-xs text-muted-foreground ml-6 truncate">
                          {suggestion.profession}
                          {suggestion.netWorth ? ` • ${formatNetWorthShort(suggestion.netWorth)}` : ''}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </li>
                ))}
              </ul>
              <button
                onClick={handleDirectSearch}
                className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-primary/10 border-t border-border transition-colors"
              >
                Search for "{query}" →
              </button>
            </>
          ) : (
            <button
              onClick={handleDirectSearch}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>Search for "<strong>{query}</strong>"</span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparePersonSelector;
