import { Link, useNavigate } from 'react-router-dom';

const MobileFooter = () => {
  const navigate = useNavigate();

  const handleNavigation = (to: string) => {
    navigate(to);
    // Scroll to top after navigation
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
  };

  return (
    <div className="md:hidden bg-card/50 border-t border-border/30 py-3 px-4 mb-16">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
        <button 
          onClick={() => handleNavigation('/about')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          About
        </button>
        <span className="text-border/50">•</span>
        <button 
          onClick={() => handleNavigation('/terms')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms
        </button>
        <span className="text-border/50">•</span>
        <button 
          onClick={() => handleNavigation('/privacy')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy
        </button>
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
