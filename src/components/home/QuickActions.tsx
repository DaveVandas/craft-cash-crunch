import { Link } from 'react-router-dom';
import { Calculator, GitCompareArrows, Share2 } from 'lucide-react';
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
    icon: Share2,
    title: 'Share Cards',
    description: 'Generate shareable wealth graphics',
    href: '/share',
    color: 'text-pink-400'
  }
];

const QuickActions = () => {
  return (
    <>
      {actions.map((action, index) => (
        <Link key={action.href} to={action.href}>
          <Card 
            className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full bg-secondary mb-4 group-hover:scale-110 transition-transform ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default QuickActions;
