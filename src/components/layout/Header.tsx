import { Link, useNavigate } from 'react-router-dom';
import { Search, Calculator, GitCompareArrows, LogIn, LogOut, Crown, User, Volume2, VolumeX, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/contexts/SoundContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const navigate = useNavigate();
  const { user, accessInfo, signOut, initiatePayment } = useAuth();
  const { enabled: soundEnabled, toggle: toggleSound } = useSound();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isPremium = accessInfo?.hasLifetimeAccess === true || (accessInfo?.searchesRemaining ?? 0) < 0;

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
          {/* Sound Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleSound} className="h-9 w-9">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{soundEnabled ? 'Mute sounds' : 'Enable sounds'}</p>
            </TooltipContent>
          </Tooltip>
          
          {user ? (
            <>
              {/* Only show upgrade button if accessInfo loaded AND user is NOT premium */}
              {accessInfo && !isPremium && (
                <Button 
                  onClick={initiatePayment}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Unlock Unlimited</span>
                  <span className="sm:hidden">$4.99</span>
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {isPremium ? (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-primary bg-gradient-to-br from-primary/20 to-amber-500/20 hover:from-primary/30 hover:to-amber-500/30"
                    >
                      <Gem className="h-4 w-4 text-primary" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" className="border-primary/50">
                      <User className="h-4 w-4" />
                    </Button>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    {isPremium ? (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Gem className="h-3 w-3" /> Lifetime VIP Access
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {accessInfo?.searchesRemaining ?? 0} searches remaining
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {accessInfo && !isPremium && (
                    <DropdownMenuItem onClick={initiatePayment}>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Unlimited
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
