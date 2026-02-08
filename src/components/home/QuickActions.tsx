import { Link } from 'react-router-dom';
import { Calculator, GitCompareArrows, Brain, HardHat, Skull, ChevronRight } from 'lucide-react';

const actions = [
  {
    icon: Calculator,
    title: 'Reality Check',
    description: 'See how fast celebrities earn your salary',
    href: '/calculator',
    emoji: '💭',
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    icon: GitCompareArrows,
    title: 'Side by Side',
    description: 'Compare any two celebrities head-to-head',
    href: '/compare',
    emoji: '⚔️',
    gradient: 'from-purple-500/20 to-pink-500/10',
  },
  {
    icon: Brain,
    title: 'Wealth Quiz',
    description: 'Guess who earns more and test your knowledge',
    href: '/quiz',
    emoji: '🧠',
    gradient: 'from-amber-500/20 to-orange-500/10',
  },
  {
    icon: HardHat,
    title: 'Trades vs Degree',
    description: 'Compare skilled trades to college grads',
    href: '/trades',
    emoji: '🔧',
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    icon: Skull,
    title: 'Debt Destroyer',
    description: 'Find the fastest path to debt freedom',
    href: '/debt-destroyer',
    emoji: '💀',
    gradient: 'from-red-500/20 to-rose-500/10',
  }
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" data-tour="quick-actions">
      {actions.map((action) => (
        <Link key={action.href} to={action.href} className="group block">
          <div className={`relative overflow-hidden flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-gradient-to-br ${action.gradient} hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full`}>
            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Icon container */}
            <div className="relative w-12 h-12 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300 shadow-sm">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{action.emoji}</span>
            </div>
            
            <div className="relative flex-1 min-w-0">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {action.description}
              </p>
            </div>
            
            {/* Arrow */}
            <ChevronRight className="relative h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
