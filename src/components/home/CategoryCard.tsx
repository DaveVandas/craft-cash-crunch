import { Link } from 'react-router-dom';
import { CategoryInfo } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: CategoryInfo;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.id}`}>
      <Card 
        className={cn(
          "group relative overflow-hidden border-border/50 bg-card/50 hover:bg-card transition-all duration-300",
          "hover:border-primary/50 hover:shadow-gold cursor-pointer",
          "animate-slide-up"
        )}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div 
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-lg text-3xl",
                "bg-gradient-to-br", category.gradient,
                "shadow-lg group-hover:scale-110 transition-transform duration-300"
              )}
            >
              {category.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
