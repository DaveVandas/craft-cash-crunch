import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getCategoryById } from '@/lib/categories';

interface ProfileBreadcrumbProps {
  celebrityName: string;
  category?: string;
}

const ProfileBreadcrumb = ({ celebrityName, category }: ProfileBreadcrumbProps) => {
  const categoryInfo = category ? getCategoryById(category) : null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-2"
    >
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
      
      {categoryInfo ? (
        <>
          <Link 
            to={`/category/${categoryInfo.id}`}
            className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
          >
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.name}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        </>
      ) : null}
      
      <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
        {celebrityName}
      </span>
    </nav>
  );
};

export default ProfileBreadcrumb;
