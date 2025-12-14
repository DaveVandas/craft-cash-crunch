import { calculateTimeToEarn, formatCompactCurrency } from '@/lib/earnings';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, TrendingUp, Calendar } from 'lucide-react';

interface RealityCheckResultProps {
  userSalary: number;
  celebrityName: string;
  celebrityAnnualEarnings: number;
}

const RealityCheckResult = ({ 
  userSalary, 
  celebrityName, 
  celebrityAnnualEarnings 
}: RealityCheckResultProps) => {
  if (!userSalary || userSalary <= 0) return null;

  const timeToEarnUserSalary = calculateTimeToEarn(userSalary, celebrityAnnualEarnings);
  const ratio = Math.round(celebrityAnnualEarnings / userSalary);
  const yearsToCatchUp = Math.round(celebrityAnnualEarnings / userSalary);

  const stats = [
    {
      icon: Clock,
      label: `${celebrityName} earns your yearly salary in`,
      value: timeToEarnUserSalary,
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      label: 'They make',
      value: `${ratio.toLocaleString()}x`,
      suffix: 'what you make',
      color: 'text-emerald-400'
    },
    {
      icon: Calendar,
      label: 'It would take you',
      value: `${yearsToCatchUp.toLocaleString()} years`,
      suffix: 'to earn what they make in 1 year',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-primary">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">Reality Check Results</span>
      </div>

      <div className="grid gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label}
            className="border-border/50 bg-card/50 overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.suffix && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {stat.suffix}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-lg mb-2">
            💡 While {celebrityName} makes{' '}
            <span className="font-bold text-primary">
              {formatCompactCurrency(celebrityAnnualEarnings)}
            </span>{' '}
            per year...
          </p>
          <p className="text-muted-foreground">
            Remember: wealth isn't everything. But it sure makes for some wild comparisons! 🎉
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealityCheckResult;
