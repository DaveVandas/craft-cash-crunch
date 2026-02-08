import { Link } from 'react-router-dom';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const CompactCategories = () => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 pb-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={cn(
              "group relative flex flex-col items-center gap-2 px-5 py-4 rounded-xl min-w-[100px]",
              "border border-border/50 bg-gradient-to-br from-card/80 to-card/40",
              "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
              "transition-all duration-300 flex-shrink-0 overflow-hidden"
            )}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon with background */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300 shadow-sm">
              <span className="text-2xl">{category.icon}</span>
            </div>
            
            <span className="relative text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="bg-primary/10 [&>div]:bg-primary/40" />
    </ScrollArea>
  );
};

export default CompactCategories;
