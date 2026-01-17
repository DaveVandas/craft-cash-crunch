import { Link } from 'react-router-dom';
import { Calculator, GitCompareArrows, Brain, Rocket, HardHat, Skull, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const actions = [
  {
    icon: Calculator,
    title: 'Reality Check',
    tagline: 'How do you stack up?',
    description: 'Enter your salary and see how long it takes celebrities to earn what you make in a year.',
    href: '/calculator',
  },
  {
    icon: GitCompareArrows,
    title: 'Side by Side',
    tagline: 'The ultimate showdown',
    description: 'Pick any two celebrities and compare their earnings, net worth, and lifestyle stats head-to-head.',
    href: '/compare',
  },
  {
    icon: TrendingUp,
    title: 'Mogul Markets',
    tagline: 'Trade like the elite',
    description: 'Practice stock trading with virtual cash. Build your portfolio and track your performance.',
    href: '/mogul-markets',
  },
  {
    icon: HardHat,
    title: 'Who Needs College?',
    tagline: 'Degree vs skilled trades',
    description: 'Compare lifetime earnings between college graduates and skilled tradespeople.',
    href: '/trades',
  },
  {
    icon: Rocket,
    title: 'Side Hustle',
    tagline: 'Unlock extra income',
    description: 'Calculate how much you could earn from popular side hustles based on your available time.',
    href: '/side-hustle',
  },
  {
    icon: Brain,
    title: 'Wealth Quiz',
    tagline: 'Test your knowledge',
    description: 'Can you guess who earns more? Challenge yourself with our celebrity earnings trivia.',
    href: '/quiz',
  },
  {
    icon: Skull,
    title: 'Debt Destroyer',
    tagline: 'Crush your debt',
    description: 'Compare avalanche vs snowball payoff strategies and see how much interest you can save.',
    href: '/debt-destroyer',
  }
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-tour="quick-actions">
      {actions.map((action) => (
        <Link key={action.href} to={action.href} className="group">
          <Card className="relative h-full overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/60 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)] hover:-translate-y-1">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent" />
            
            {/* Gold shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_ease-in-out]" />
            </div>
            
            <CardContent className="p-5 flex flex-col h-full relative z-10">
              {/* Icon with mogul ring */}
              <div className="mb-4 relative w-fit">
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md group-hover:bg-primary/30 transition-colors" />
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 group-hover:border-primary/50 transition-colors">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-primary/80 font-semibold mb-2 uppercase tracking-wide">
                  {action.tagline}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
              
              {/* Footer action hint */}
              <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Try it now
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
