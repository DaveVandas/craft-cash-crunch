import { Link } from 'react-router-dom';
import { Calculator, GitCompareArrows, Share2, Brain, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const actions = [
  {
    icon: Calculator,
    title: 'Reality Check',
    description: 'Compare your salary to the rich & famous',
    href: '/calculator',
    color: 'text-emerald-400'
  },
  {
    icon: GitCompareArrows,
    title: 'Side by Side',
    description: 'Compare any two people head-to-head',
    href: '/compare',
    color: 'text-blue-400'
  },
  {
    icon: Rocket,
    title: 'Side Hustle',
    description: 'Calculate your hustle potential',
    href: '/side-hustle',
    color: 'text-amber-400'
  },
  {
    icon: Brain,
    title: 'Wealth Quiz',
    description: 'Test your knowledge of celebrity earnings',
    href: '/quiz',
    color: 'text-purple-400'
  }
];

const QuickActions = () => {
  return (
    <>
      {actions.map((action) => (
        <Link key={action.href} to={action.href}>
          <Card className="relative overflow-hidden border-border/50 bg-card/50 hover:bg-card transition-all duration-300 cursor-pointer group hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
            {/* Gold shimmer border on hover */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 rounded-lg border-2 border-primary/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </div>
            
            <CardContent className="p-3 flex items-center gap-2 relative z-10">
              <div className={`p-1.5 rounded-full bg-secondary group-hover:scale-110 transition-transform flex-shrink-0 ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs group-hover:text-primary transition-colors truncate">
                  {action.title}
                </h3>
                <p className="text-[10px] text-foreground/70 font-medium truncate">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default QuickActions;
