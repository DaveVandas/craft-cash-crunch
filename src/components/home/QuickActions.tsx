import { Link } from 'react-router-dom';
import { Calculator, GitCompareArrows, Brain, Rocket, HardHat, Skull, TrendingUp, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const actions = [
  {
    icon: Calculator,
    title: 'Reality Check',
    description: 'See how fast celebrities earn your salary',
    href: '/calculator',
    emoji: '💭'
  },
  {
    icon: GitCompareArrows,
    title: 'Side by Side',
    description: 'Compare any two celebrities head-to-head',
    href: '/compare',
    emoji: '⚔️'
  },
  {
    icon: TrendingUp,
    title: 'Mogul Markets',
    description: 'Paper trade stocks with virtual cash',
    href: '/mogul-markets',
    emoji: '📈',
    badge: 'NEW'
  },
  {
    icon: Brain,
    title: 'Wealth Quiz',
    description: 'Guess who earns more and test your knowledge',
    href: '/quiz',
    emoji: '🧠'
  },
  {
    icon: Rocket,
    title: 'Side Hustle',
    description: 'Calculate your extra income potential',
    href: '/side-hustle',
    emoji: '🚀'
  },
  {
    icon: HardHat,
    title: 'Trades vs Degree',
    description: 'Compare skilled trades to college grads',
    href: '/trades',
    emoji: '🔧'
  },
  {
    icon: Skull,
    title: 'Debt Destroyer',
    description: 'Find the fastest path to debt freedom',
    href: '/debt-destroyer',
    emoji: '💀'
  }
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-tour="quick-actions">
      {actions.map((action) => (
        <Link key={action.href} to={action.href} className="group block">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 border-l-4 border-l-primary/40 bg-card/30 hover:bg-card/80 hover:border-primary/40 hover:border-l-primary transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] h-full">
            {/* Emoji */}
            <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {action.emoji}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                {action.badge && (
                  <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0 h-4 font-bold animate-pulse">
                    {action.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {action.description}
              </p>
            </div>
            
            {/* Arrow */}
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
