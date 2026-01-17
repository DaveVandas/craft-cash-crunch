import { Link } from 'react-router-dom';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';

const CompactCategories = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={cn(
            "group flex items-center gap-2 px-4 py-2 rounded-full",
            "border border-border/50 bg-card/50 hover:bg-card",
            "hover:border-primary/50 hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
            "transition-all duration-300"
          )}
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            {category.icon}
          </span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CompactCategories;
