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
      </div>
    </footer>
  );
};

export default Footer;
