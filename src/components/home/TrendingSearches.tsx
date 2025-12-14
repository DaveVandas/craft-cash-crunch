import { Link } from 'react-router-dom';
import { TrendingUp, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { nameToSlug } from '@/lib/validation';

const trendingSearches = [
  { name: 'Taylor Swift', searches: '12.4K', hot: true },
  { name: 'Elon Musk', searches: '9.8K', hot: true },
  { name: 'LeBron James', searches: '7.2K', hot: false },
  { name: 'Cristiano Ronaldo', searches: '6.9K', hot: false },
  { name: 'MrBeast', searches: '5.4K', hot: true },
];

const TrendingSearches = () => {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {trendingSearches.map((person, index) => (
          <Link
            key={person.name}
            to={`/profile/${nameToSlug(person.name)}`}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-mono text-sm w-4">
                {index + 1}
              </span>
              <span className="font-medium group-hover:text-primary transition-colors">
                {person.name}
              </span>
              {person.hot && (
                <Flame className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {person.searches}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingSearches;
