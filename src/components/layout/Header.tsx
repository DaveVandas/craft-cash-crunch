import { Link, useNavigate } from 'react-router-dom';
import { Search, LogIn, LogOut, Crown, User, Volume2, VolumeX, Gem, Shield, Heart, Share2, Sparkles, MessageSquare, TrendingUp, QrCode, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import InviteFriendsModal from '@/components/invite/InviteFriendsModal';
import FavoritesDropdown from '@/components/favorites/FavoritesDropdown';
import BetaFeedbackModal from '@/components/beta/BetaFeedbackModal';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/contexts/SoundContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePricing } from '@/hooks/usePricing';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

// Theme toggle menu item for mobile dropdown
const ThemeToggleMenuItem = () => {
  const { setTheme, theme } = useTheme();
  
  return (
    <div className="px-2 py-2">
      <p className="text-xs text-muted-foreground mb-2 px-2">Appearance</p>
      <div className="flex gap-1">
        <button
          onClick={() => setTheme('light')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
            theme === 'light' ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted'
          }`}
        >
          <Sun className="h-4 w-4" />
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
            theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted'
          }`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { user, accessInfo, signOut, initiatePayment, paymentLoading } = useAuth();
  const { enabled: soundEnabled, toggle: toggleSound } = useSound();
  const { profile } = useUserProfile();
  const { regularPrice } = usePricing();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isBetaUser, setIsBetaUser] = useState(false);

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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return '👤';
  };

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
          {/* Theme Toggle - Desktop only (lg+) */}
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>

          {/* Sound Toggle - Desktop only */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleSound} className="h-9 w-9 hidden md:flex">
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

          {/* Share App Button - Desktop only */}
          <Button 
            variant="ghost" 
            onClick={() => setInviteModalOpen(true)} 
            className="h-9 px-3 hidden md:flex"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            <span className="text-sm">Share</span>
          </Button>

          {user ? (
            <>
              {/* Notifications */}
              <NotificationsDropdown />
              {/* Only show upgrade button if accessInfo loaded AND user is NOT premium - Desktop only */}
              {accessInfo && !isPremium && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={initiatePayment}
                      disabled={paymentLoading}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hidden sm:flex"
                    >
                      {paymentLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Crown className="h-4 w-4 mr-2" />
                      )}
                      <span>{paymentLoading ? 'Processing...' : 'Unlock Unlimited'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{regularPrice} one-time • All sales final</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`${isPremium ? 'border-primary bg-gradient-to-br from-primary/20 to-amber-500/20 hover:from-primary/30 hover:to-amber-500/30' : 'border-primary/50'}`}
                  >
                    {isPremium ? (
                      <Crown className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{profile?.display_name || user.email}</p>
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
                  {/* Theme Toggle - Mobile/Tablet only (below lg breakpoint) */}
                  <div className="lg:hidden">
                    <DropdownMenuSeparator />
                    <ThemeToggleMenuItem />
                  </div>
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