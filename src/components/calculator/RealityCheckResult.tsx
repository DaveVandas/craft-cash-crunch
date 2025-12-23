import { useMemo } from 'react';
import { calculateTimeToEarn, formatCompactCurrency, formatLargeCurrency } from '@/lib/earnings';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, TrendingUp, DollarSign, Rocket, ArrowDown, User } from 'lucide-react';
import { useEarningsTicker } from '@/hooks/useEarningsTicker';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
const TRANSITION_MESSAGES = [
  {
    headline: "Real talk? This next part might sting a little. 🫣",
    body: "But here's the thing — every mogul started somewhere. The gap you're about to see? It's not a wall, it's a blueprint. Scroll down and I'll show you exactly how to start closing it."
  },
  {
    headline: "Okay, deep breath... 😤",
    body: "What you're about to see might hurt. But pain is temporary — hustle is forever. Keep scrolling and I'll show you how to flip the script."
  },
  {
    headline: "No sugarcoating here. 🍬❌",
    body: "These numbers are wild. But remember: comparison is the thief of joy... unless you use it as fuel. Let's turn that frustration into motivation below."
  },
  {
    headline: "Brace yourself, champ. 💪",
    body: "This reality check hits different. But every empire started with a single brick. Stick with me — the path forward is just below."
  },
  {
    headline: "Warning: ego check incoming. 😅",
    body: "Look, these numbers aren't meant to discourage you — they're meant to ignite you. The gap is real, but so is your potential. Let's build."
  },
  {
    headline: "This might feel like a gut punch. 🥊",
    body: "But champions get back up. The wealth gap is massive, sure — but every journey starts with awareness. Your comeback plan is waiting below."
  }
];

interface RealityCheckResultProps {
  userSalary: number;
  celebrityName: string;
  celebrityAnnualEarnings: number;
  celebrityImageUrl?: string;
}

const RealityCheckResult = ({ 
  userSalary, 
  celebrityName, 
  celebrityAnnualEarnings,
  celebrityImageUrl
}: RealityCheckResultProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  
  const { currentEarnings, breakdown } = useEarningsTicker({ 
    annualEarnings: userSalary 
  });
  
  const { currentEarnings: celebEarnings, breakdown: celebBreakdown } = useEarningsTicker({ 
    annualEarnings: celebrityAnnualEarnings 
  });

  // Pick a random message each time celebrity changes
  const transitionMessage = useMemo(() => {
    return TRANSITION_MESSAGES[Math.floor(Math.random() * TRANSITION_MESSAGES.length)];
  }, [celebrityName]);

  if (!userSalary || userSalary <= 0) return null;

  const timeToEarnUserSalary = calculateTimeToEarn(userSalary, celebrityAnnualEarnings);
  const ratio = Math.round(celebrityAnnualEarnings / userSalary);
  const yearsToCatchUp = Math.round(celebrityAnnualEarnings / userSalary);

  // Determine winner and assign emojis
  const userWins = userSalary >= celebrityAnnualEarnings;
  const winnerEmoji = '😎';
  const humbledEmoji = '😅';

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Avatar Face-off */}
      <Card className="border-primary/30 bg-gradient-to-r from-emerald-950/20 via-card to-primary/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* User Avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-2 ring-emerald-500/50 mx-auto">
                  <AvatarImage 
                    src={profile?.avatar_url || undefined} 
                    alt="You" 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                    <User className="h-8 w-8 md:h-10 md:w-10" />
                  </AvatarFallback>
                </Avatar>
                {/* Emoji overlay */}
                <span className="absolute -bottom-1 -right-1 text-2xl md:text-3xl drop-shadow-lg">
                  {userWins ? winnerEmoji : humbledEmoji}
                </span>
              </div>
              <p className="text-sm font-medium text-emerald-400 mt-2">
                {profile?.display_name || user?.email?.split('@')[0] || 'You'}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCompactCurrency(userSalary)}/yr
              </p>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">VS</div>
              <div className="text-xs text-primary font-medium">{ratio.toLocaleString()}x gap</div>
            </div>

            {/* Celebrity Avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-2 ring-primary/50 mx-auto">
                  <AvatarImage 
                    src={celebrityImageUrl} 
                    alt={celebrityName} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    💰
                  </AvatarFallback>
                </Avatar>
                {/* Emoji overlay */}
                <span className="absolute -bottom-1 -right-1 text-2xl md:text-3xl drop-shadow-lg">
                  {userWins ? humbledEmoji : winnerEmoji}
                </span>
              </div>
              <p className="text-sm font-medium text-primary mt-2">{celebrityName}</p>
              <p className="text-xs text-muted-foreground">
                {formatCompactCurrency(celebrityAnnualEarnings)}/yr
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-primary">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">Reality Check Results</span>
      </div>

      {/* Empathetic Transition Message */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-card to-amber-900/10 overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-amber-500/20">
              <Rocket className="h-6 w-6 text-amber-400" />
            </div>
          </div>
          <p className="text-lg font-semibold text-amber-200 mb-2">
            {transitionMessage.headline}
          </p>
          <p className="text-muted-foreground mb-3">
            {transitionMessage.body}
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-medium">
            <span>Side hustle strategies below</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </CardContent>
      </Card>

      {/* Combined Results Card */}
      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left: Your Live Earnings */}
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Your Live Earnings</span>
              </div>
              <div className="text-center mb-3">
                <p className="text-xs text-muted-foreground mb-1">Earned since opening</p>
                <div className="font-mono text-2xl md:text-3xl font-bold text-emerald-400 ticker-number">
                  {formatLargeCurrency(currentEarnings)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">Per Second</p>
                  <p className="font-mono text-xs font-semibold text-emerald-400">${breakdown.perSecond.toFixed(4)}</p>
                </div>
                <div className="text-center p-2 rounded bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">Per Hour</p>
                  <p className="font-mono text-xs font-semibold text-emerald-400">${breakdown.perHour.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Right: Celebrity Live Earnings */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{celebrityName}'s Live Earnings</span>
              </div>
              <div className="text-center mb-3">
                <p className="text-xs text-muted-foreground mb-1">Earned since opening</p>
                <div className="font-mono text-2xl md:text-3xl font-bold text-primary ticker-number">
                  {formatLargeCurrency(celebEarnings)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center p-2 rounded bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">Per Second</p>
                  <p className="font-mono text-xs font-semibold text-primary">${celebBreakdown.perSecond.toFixed(2)}</p>
                </div>
                <div className="text-center p-2 rounded bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">Per Hour</p>
                  <p className="font-mono text-xs font-semibold text-primary">${celebBreakdown.perHour.toLocaleString()}</p>
                </div>
              </div>
              {/* Quick comparison stats */}
              <div className="pt-2 border-t border-border/30 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Earns your salary in</span>
                  <span className="font-semibold text-primary">{timeToEarnUserSalary}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Makes</span>
                  <span className="font-semibold text-amber-400">{ratio.toLocaleString()}x more</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Takeaway */}
      <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          💡 {celebrityName} makes <span className="font-bold text-primary">{formatCompactCurrency(celebrityAnnualEarnings)}</span>/year — 
          but every mogul started somewhere!
        </p>
      </div>
    </div>
  );
};

export default RealityCheckResult;
