import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, LogOut, Crown, User, Volume2, VolumeX, Gem, Shield, Heart, Share2, Sparkles, MessageSquare, TrendingUp, Menu, Calculator, GitCompareArrows, BookOpen, QrCode, RefreshCw, Loader2 } from 'lucide-react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { toast } from 'sonner';
import InviteFriendsModal from '@/components/invite/InviteFriendsModal';
import FavoritesDropdown from '@/components/favorites/FavoritesDropdown';
import BetaFeedbackModal from '@/components/beta/BetaFeedbackModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/contexts/SoundContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const navigate = useNavigate();
  const { user, accessInfo, signOut, initiatePayment, paymentLoading } = useAuth();
  const { enabled: soundEnabled, toggle: toggleSound } = useSound();
  const { checkForUpdates, isChecking, needRefresh, applyUpdate } = usePWAUpdate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isBetaUser, setIsBetaUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCheckForUpdates = async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate || needRefresh) {
      applyUpdate();
    } else {
      toast.success("You're on the latest version!");
    }
  };

  useEffect(() => {
    const checkRoles = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsBetaUser(false);
        setIsAffiliate(false);
        return;
      }
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      setIsAdmin(data === true);
      
      // Check beta access from accessInfo
      setIsBetaUser(!!(accessInfo as any)?.hasBetaAccess);

      // Check if user is an approved affiliate
      const { data: affiliateData } = await supabase
        .from('affiliates')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsAffiliate(affiliateData?.status === 'approved');
    };
    checkRoles();
  }, [user, accessInfo]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isPremium = accessInfo?.hasLifetimeAccess === true || (accessInfo?.searchesRemaining ?? 0) < 0;

  const navLinks = [
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/mogul-markets', icon: TrendingUp, label: 'Mogul Markets', highlight: true },
    { to: '/compare', icon: GitCompareArrows, label: 'Compare' },
    { to: '/calculator', icon: Calculator, label: 'Reality Check' },
    { to: '/wealth-wisdom', icon: BookOpen, label: 'Wisdom' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="font-serif text-xl font-bold gradient-gold-text">
            Wealth Perspective
          </span>
        </Link>

        {/* Desktop Navigation - simplified to just Search and Mogul Markets */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/search" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link 
            to="/mogul-markets" 
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors relative group"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Mogul Markets</span>
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <span className="font-serif gradient-gold-text">Menu</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      link.highlight 
                        ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                    {link.highlight && <Sparkles className="h-4 w-4 text-amber-500 ml-auto" />}
                  </Link>
                ))}
                
                {/* Check for Updates button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCheckForUpdates();
                  }}
                  disabled={isChecking}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full text-left mt-4 border-t border-border pt-4"
                >
                  <RefreshCw className={`h-5 w-5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span className="font-medium">
                    {isChecking ? 'Checking...' : 'Check for Updates'}
                  </span>
                </button>
              </nav>
            </SheetContent>
          </Sheet>

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

          {/* Share App Button */}
          <Button 
            variant="ghost" 
            onClick={() => setInviteModalOpen(true)} 
            className="h-9 px-3"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            <span className="text-sm hidden sm:inline">Share</span>
          </Button>

          {user ? (
            <>
              {/* Only show upgrade button if accessInfo loaded AND user is NOT premium */}
              {accessInfo && !isPremium && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={initiatePayment}
                      disabled={paymentLoading}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      {paymentLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Crown className="h-4 w-4 mr-2" />
                      )}
                      <span className="hidden sm:inline">{paymentLoading ? 'Processing...' : 'Unlock Unlimited'}</span>
                      <span className="sm:hidden">{paymentLoading ? '...' : '$6.99'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>$6.99 one-time • All sales final</p>
                  </TooltipContent>
                </Tooltip>
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
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  {isAffiliate && (
                    <DropdownMenuItem onClick={() => navigate('/affiliate-dashboard')}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Affiliate Dashboard
                    </DropdownMenuItem>
                  )}
                  {isBetaUser && (
                    <DropdownMenuItem onClick={() => setFeedbackModalOpen(true)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Give Feedback
                    </DropdownMenuItem>
                  )}
                  {accessInfo && !isPremium && (
                    <DropdownMenuItem onClick={initiatePayment} disabled={paymentLoading}>
                      {paymentLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Crown className="h-4 w-4 mr-2" />
                      )}
                      {paymentLoading ? 'Processing...' : 'Upgrade to Unlimited'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Heart className="h-4 w-4 mr-2" />
                      My Favorites
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-72 p-0">
                      <FavoritesDropdown />
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </Button>
          )}
        </div>
        
        <InviteFriendsModal open={inviteModalOpen} onOpenChange={setInviteModalOpen} />
        <BetaFeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
      </div>
    </header>
  );
};

export default Header;
