import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites, FavoriteContent } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  content: FavoriteContent;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const FavoriteButton = ({ content, className, size = 'default' }: FavoriteButtonProps) => {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favoriteId = isFavorited(content);
  const isFav = !!favoriteId;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(content);
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      onClick={handleClick}
      className={cn(
        'transition-all duration-300',
        isFav && 'text-red-500 hover:text-red-600',
        className
      )}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          iconSize,
          'transition-all duration-300',
          isFav && 'fill-current scale-110'
        )}
      />
    </Button>
  );
};

export default FavoriteButton;
