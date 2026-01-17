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
              "group flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl min-w-[90px]",
              "border border-border/50 bg-card/50 hover:bg-card",
              "hover:border-primary/50 hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
              "transition-all duration-300 flex-shrink-0"
            )}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {category.icon}
            </span>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CompactCategories;
