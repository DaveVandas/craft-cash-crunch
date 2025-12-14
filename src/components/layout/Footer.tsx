import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <span className="font-serif text-lg font-semibold gradient-gold-text">
              Wealth Perspective
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Putting wealth into perspective, one mind-blowing comparison at a time.
          </p>
          
          <p className="text-xs text-muted-foreground">
            Data powered by AI • For entertainment purposes
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/30 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About & FAQ
            </Link>
            <span className="text-border">•</span>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <span className="text-border">•</span>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/70 text-center max-w-2xl">
            Disclaimer: Earnings and net worth figures are estimates based on publicly available information and may not reflect actual values. 
            Wealth calculations can vary significantly due to complex financial structures, investments, and undisclosed assets.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
