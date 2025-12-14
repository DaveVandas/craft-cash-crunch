import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, calculateTimeToEarn } from '@/lib/earnings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Scale, TrendingUp, Clock } from 'lucide-react';

interface CompareResultProps {
  person1: Celebrity;
  person2: Celebrity;
}

const CompareResult = ({ person1, person2 }: CompareResultProps) => {
  const maxEarnings = Math.max(person1.annualEarnings, person2.annualEarnings);
  const person1Percent = (person1.annualEarnings / maxEarnings) * 100;
  const person2Percent = (person2.annualEarnings / maxEarnings) * 100;
  
  const ratio = person1.annualEarnings > person2.annualEarnings
    ? person1.annualEarnings / person2.annualEarnings
    : person2.annualEarnings / person1.annualEarnings;
  
  const richer = person1.annualEarnings > person2.annualEarnings ? person1 : person2;
  const poorer = person1.annualEarnings > person2.annualEarnings ? person2 : person1;
  
  const timeForRicherToEarnPoorersYearly = calculateTimeToEarn(
    poorer.annualEarnings,
    richer.annualEarnings
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Earnings Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{person1.name}</span>
                <span className="text-primary font-mono">
                  {formatCompactCurrency(person1.annualEarnings)}/yr
                </span>
              </div>
              <Progress value={person1Percent} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{person2.name}</span>
                <span className="text-primary font-mono">
                  {formatCompactCurrency(person2.annualEarnings)}/yr
                </span>
              </div>
              <Progress value={person2Percent} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Earnings Ratio</span>
            </div>
            <p className="text-2xl font-bold">
              <span className="text-primary">{richer.name}</span> makes
            </p>
            <p className="text-4xl font-bold gradient-gold-text mt-2">
              {ratio.toFixed(1)}x
            </p>
            <p className="text-muted-foreground mt-2">
              more than {poorer.name}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Time Comparison</span>
            </div>
            <p className="text-lg">
              {richer.name} earns {poorer.name}'s entire yearly salary in just...
            </p>
            <p className="text-4xl font-bold gradient-gold-text mt-4">
              {timeForRicherToEarnPoorersYearly}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-6 text-center">
          <p className="text-lg">
            🎯 <span className="font-bold text-primary">{richer.name}</span>{' '}
            makes approximately{' '}
            <span className="font-bold gradient-gold-text">
              {formatCompactCurrency(richer.annualEarnings - poorer.annualEarnings)}
            </span>{' '}
            more per year than {poorer.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompareResult;
