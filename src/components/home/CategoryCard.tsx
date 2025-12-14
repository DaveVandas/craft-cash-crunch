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
          "hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] cursor-pointer",
          "animate-slide-up"
        )}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Gold shimmer border on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg border-2 border-primary/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </div>
        
        <CardContent className="p-6 relative z-10">
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
