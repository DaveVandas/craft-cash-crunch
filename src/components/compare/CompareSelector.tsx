import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Celebrity } from '@/lib/types';

interface CompareSelectorProps {
  label: string;
  selected: Celebrity | null;
  onSearch: (query: string) => Promise<Celebrity | null>;
  loading: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const CompareSelector = ({ label, selected, onSearch, loading }: CompareSelectorProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (query.trim()) {
      await onSearch(query.trim());
    }
  };

  if (selected) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSearch('')}
              className="text-xs"
            >
              Change
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={selected.imageUrl} alt={selected.name} className="object-cover rounded-lg" />
              <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold">
                {getInitials(selected.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{selected.name}</h3>
              <p className="text-sm text-muted-foreground">{selected.profession}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-6">
        <span className="text-sm text-muted-foreground block mb-4">{label}</span>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for someone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompareSelector;
