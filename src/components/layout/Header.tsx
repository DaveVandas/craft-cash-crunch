import { Link } from 'react-router-dom';
import { Search, Calculator, GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="font-serif text-xl font-bold gradient-gold-text">
            Wealth Perspective
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/search" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>
          <Link 
            to="/compare" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitCompareArrows className="h-4 w-4" />
            <span>Compare</span>
          </Link>
          <Link 
            to="/calculator" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Calculator className="h-4 w-4" />
            <span>Reality Check</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/calculator">
            <Button variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
              <Calculator className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Your Salary</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
