import { Link, useLocation } from 'react-router-dom';
import { Home, Search, TrendingUp, Brain, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RefreshCw, Calculator, GitCompareArrows, BookOpen, Sparkles, Skull, GraduationCap } from 'lucide-react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { toast } from 'sonner';

const MobileNav = () => {
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { checkForUpdates, isChecking, needRefresh, applyUpdate } = usePWAUpdate();

  const handleCheckForUpdates = async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate || needRefresh) {
      applyUpdate();
    } else {
      toast.success("You're on the latest version!");
    }
  };

  const mainNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/mogul-markets', icon: TrendingUp, label: 'Markets', highlight: true },
    { to: '/quiz', icon: Brain, label: 'Quiz' },
  ];

  const moreNavItems = [
    { to: '/compare', icon: GitCompareArrows, label: 'Compare' },
    { to: '/calculator', icon: Calculator, label: 'Reality Check' },
    { to: '/trades', icon: GraduationCap, label: 'Trades vs Degree' },
    { to: '/debt-destroyer', icon: Skull, label: 'Debt Destroyer' },
    { to: '/wealth-wisdom', icon: BookOpen, label: 'Wealth Wisdom' },
    { to: '/side-hustle', icon: Sparkles, label: 'Side Hustle' },
  ];

  const legalNavItems = [
    { to: '/about', label: 'About & FAQ' },
    { to: '/terms', label: 'Terms' },
    { to: '/privacy', label: 'Privacy' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mainNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[56px] py-2 transition-colors touch-manipulation ${
              isActive(item.to)
                ? 'text-primary'
                : 'text-muted-foreground active:text-foreground'
            } ${item.highlight && !isActive(item.to) ? 'text-amber-500' : ''}`}
          >
            <item.icon className={`h-5 w-5 mb-1 ${isActive(item.to) ? 'scale-110' : ''} transition-transform pointer-events-none`} />
            <span className="text-[10px] font-medium pointer-events-none">{item.label}</span>
          </Link>
        ))}

        {/* More Menu */}
        <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[56px] py-2 transition-colors touch-manipulation ${
                moreMenuOpen
                  ? 'text-primary'
                  : 'text-muted-foreground active:text-foreground'
              }`}
            >
              <MoreHorizontal className="h-5 w-5 mb-1 pointer-events-none" />
              <span className="text-[10px] font-medium pointer-events-none">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl pb-20">
            <SheetHeader className="pb-4">
              <SheetTitle className="flex items-center gap-2 justify-center">
                <span className="text-xl">🛠️</span>
                <span className="font-serif gradient-gold-text">More Tools</span>
              </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 pb-6">
              {moreNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreMenuOpen(false)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                    isActive(item.to)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Legal Links */}
            <div className="border-t border-border/40 pt-4 pb-2">
              <div className="flex items-center justify-center gap-4 mb-3">
                {legalNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreMenuOpen(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <a 
                href="mailto:vandasdave@gmail.com" 
                className="block text-center text-xs text-primary hover:text-primary/80 transition-colors mb-3"
              >
                📧 Contact: vandasdave@gmail.com
              </a>
            </div>
            
            {/* Check for Updates */}
            <div className="border-t border-border/40 pt-3 pb-2">
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  handleCheckForUpdates();
                }}
                disabled={isChecking}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">
                  {isChecking ? 'Checking...' : 'Check for Updates'}
                </span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNav;