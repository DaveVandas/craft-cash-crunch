import { Heart, Trash2, User, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites, ProfileFavorite, ComparisonFavorite } from '@/hooks/useFavorites';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAvatarEmoji } from '@/lib/avatar';
import { formatCurrency } from '@/lib/earnings';
import { nameToSlug } from '@/lib/validation';

interface FavoritesDropdownProps {
  onClose?: () => void;
}

const FavoritesDropdown = ({ onClose }: FavoritesDropdownProps) => {
  const { favorites, removeFavorite, loading } = useFavorites();
  const navigate = useNavigate();

  const handleProfileClick = (celebrity: ProfileFavorite['celebrity']) => {
    navigate(`/profile/${nameToSlug(celebrity.name)}`);
    onClose?.();
  };

  const handleComparisonClick = (person1: ComparisonFavorite['person1'], person2: ComparisonFavorite['person2']) => {
    // Navigate to compare page - the state will need to be set differently
    navigate('/compare', { state: { person1, person2 } });
    onClose?.();
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Heart className="h-5 w-5 animate-pulse mx-auto mb-2" />
        Loading favorites...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="p-6 text-center">
        <Heart className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No favorites yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Tap the heart on profiles or comparisons to save them
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-80">
      <div className="p-2 space-y-1">
        {favorites.map((fav) => {
          if (fav.favorite_type === 'profile') {
            const content = fav.content as ProfileFavorite;
            return (
              <div
                key={fav.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer group transition-colors"
                onClick={() => handleProfileClick(content.celebrity)}
              >
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={content.celebrity.imageUrl} alt={content.celebrity.name} className="object-cover" />
                  <AvatarFallback>{getAvatarEmoji(content.celebrity.profession)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{content.celebrity.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatCurrency(content.celebrity.annualEarnings)}/year
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          }

          if (fav.favorite_type === 'comparison') {
            const content = fav.content as ComparisonFavorite;
            return (
              <div
                key={fav.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer group transition-colors"
                onClick={() => handleComparisonClick(content.person1, content.person2)}
              >
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={content.person1.imageUrl} alt={content.person1.name} className="object-cover" />
                    <AvatarFallback className="text-xs">{getAvatarEmoji(content.person1.profession)}</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={content.person2.imageUrl} alt={content.person2.name} className="object-cover" />
                    <AvatarFallback className="text-xs">{getAvatarEmoji(content.person2.profession)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {content.person1.name} vs {content.person2.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Wealth Showdown</p>
                </div>
                <div className="flex items-center gap-1">
                  <Scale className="h-3 w-3 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </ScrollArea>
  );
};

export default FavoritesDropdown;
