import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getCategoryById } from '@/lib/categories';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage: string;
  showHome?: boolean;
}

const Breadcrumb = ({ items = [], currentPage, showHome = true }: BreadcrumbProps) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap py-3"
    >
      {showHome && (
        <>
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        </>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {item.href ? (
            <Link 
              to={item.href}
              className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 shrink-0">
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </span>
          )}
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        </div>
      ))}
      
      <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
        {currentPage}
      </span>
    </nav>
  );
};

// Helper to generate breadcrumbs for category pages
export const getCategoryBreadcrumb = (categoryId: string): BreadcrumbItem | null => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  return {
    label: category.name,
    href: `/category/${category.id}`,
    icon: category.icon,
  };
};

export default Breadcrumb;
