import { Link } from 'react-router-dom';

const MobileFooter = () => {
  return (
    <div className="md:hidden bg-card/50 border-t border-border/30 py-3 px-4 mb-16">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
        <Link 
          to="/about" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          About
        </Link>
        <span className="text-border/50">•</span>
        <Link 
          to="/terms" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms
        </Link>
        <span className="text-border/50">•</span>
        <Link 
          to="/privacy" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy
        </Link>
        <span className="text-border/50">•</span>
        <a 
          href="mailto:vandasdave@gmail.com" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Contact
        </a>
      </div>
      <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
        © {new Date().getFullYear()} Wealth Perspective
      </p>
    </div>
  );
};

export default MobileFooter;
