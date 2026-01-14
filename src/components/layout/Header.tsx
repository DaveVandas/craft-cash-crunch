import { Link, useNavigate } from 'react-router-dom';
import { Search, Calculator, GitCompareArrows, LogIn, LogOut, Crown, User, Volume2, VolumeX, Gem, Shield, Heart, Share2, BookOpen, Sparkles, MessageSquare, TrendingUp } from 'lucide-react';
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

const Header = () => {
  const navigate = useNavigate();
  const { user, accessInfo, signOut, initiatePayment } = useAuth();
  const { enabled: soundEnabled, toggle: toggleSound } = useSound();
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isBetaUser, setIsBetaUser] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsBetaUser(false);
        return;
      }
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      setIsAdmin(data === true);
      
      // Check beta access from accessInfo
      setIsBetaUser(!!(accessInfo as any)?.hasBetaAccess);
    };
    checkRoles();
  }, [user, accessInfo]);

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
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link 
            to="/compare" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <GitCompareArrows className="h-4 w-4" />
            <span>Compare</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link 
            to="/calculator" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <Calculator className="h-4 w-4" />
            <span>Reality Check</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
          </Link>
          <Link 
            to="/wealth-wisdom" 
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <BookOpen className="h-4 w-4" />
            <span>Wisdom</span>
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
            <span className="text-sm">Share</span>
          </Button>

          {user ? (
            <>
              {/* Only show upgrade button if accessInfo loaded AND user is NOT premium */}
              {accessInfo && !isPremium && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={initiatePayment}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Unlock Unlimited</span>
                      <span className="sm:hidden">$4.99</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>$4.99 one-time • All sales final</p>
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
                  {isBetaUser && (
                    <DropdownMenuItem onClick={() => setFeedbackModalOpen(true)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Give Feedback
                    </DropdownMenuItem>
                  )}
                  {accessInfo && !isPremium && (
                    <DropdownMenuItem onClick={initiatePayment}>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Unlimited
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
            <Link to="/auth">
              <Button variant="outline" className="border-primary/50 hover:border-primary hover:bg-primary/10">
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
        
        <InviteFriendsModal open={inviteModalOpen} onOpenChange={setInviteModalOpen} />
        <BetaFeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
      </div>
    </header>
  );
};

export default Header;
