import { useState, useEffect } from 'react';
import { Celebrity } from '@/lib/types';
import { formatCompactCurrency, calculateTimeToEarn } from '@/lib/earnings';
import { getAvatarEmoji } from '@/lib/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Scale, TrendingUp, Clock, Crown, Equal } from 'lucide-react';
import CompareShareCard from './CompareShareCard';

interface CompareResultProps {
  person1: Celebrity;
  person2: Celebrity;
}

const CompareResult = ({ person1, person2 }: CompareResultProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState(0);
  
  const maxEarnings = Math.max(person1.annualEarnings, person2.annualEarnings);
  const minEarnings = Math.min(person1.annualEarnings, person2.annualEarnings);
  const person1Percent = (person1.annualEarnings / maxEarnings) * 100;
  const person2Percent = (person2.annualEarnings / maxEarnings) * 100;
  
  // Consider it a tie if earnings are within 5% of each other
  const isTie = minEarnings > 0 && (maxEarnings / minEarnings) < 1.05;
  
  const ratio = maxEarnings / minEarnings;
  
  const richer = person1.annualEarnings >= person2.annualEarnings ? person1 : person2;
  const poorer = person1.annualEarnings >= person2.annualEarnings ? person2 : person1;
  
  const timeForRicherToEarnPoorersYearly = calculateTimeToEarn(
    poorer.annualEarnings,
    richer.annualEarnings
  );

  // Intro animation sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setIntroPhase(1), 100)); // Person 1 slides in
    timers.push(setTimeout(() => setIntroPhase(2), 400)); // Person 2 slides in
    timers.push(setTimeout(() => setIntroPhase(3), 700)); // VS appears
    timers.push(setTimeout(() => setIntroPhase(4), 1200)); // Flash effect
    timers.push(setTimeout(() => setShowIntro(false), 1800)); // Show results
    
    return () => timers.forEach(t => clearTimeout(t));
  }, [person1.id, person2.id]);

  if (showIntro) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-8 min-h-[300px]">
        {/* Flash effect */}
        <div 
          className={`absolute inset-0 bg-primary/20 transition-opacity duration-300 ${
            introPhase >= 4 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ animation: introPhase >= 4 ? 'pulse 0.3s ease-out' : 'none' }}
        />
        
        <div className="relative flex items-center justify-center gap-4 md:gap-8 h-full min-h-[250px]">
          {/* Person 1 - Slides from left */}
          <div 
            className={`flex flex-col items-center gap-3 transition-all duration-500 ease-out ${
              introPhase >= 1 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-20'
            }`}
          >
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/50 shadow-xl shadow-primary/20">
                <AvatarImage src={person1.imageUrl} alt={person1.name} className="object-cover" />
                <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary/20 to-primary/10">
                  {getAvatarEmoji(person1.profession)}
                </AvatarFallback>
              </Avatar>
              {!isTie && person1 === richer && (
                <div className="absolute -top-2 -right-2">
                  <Crown className="h-8 w-8 text-primary fill-primary drop-shadow-lg" />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-serif font-bold text-lg md:text-xl">{person1.name}</p>
              <p className="text-sm text-muted-foreground">{person1.profession}</p>
            </div>
          </div>

          {/* VS Badge */}
          <div 
            className={`transition-all duration-300 ease-out ${
              introPhase >= 3 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-0'
            }`}
          >
            <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-amber-600 shadow-lg shadow-primary/40 animate-pulse">
              <Scale className="h-8 w-8 md:h-10 md:w-10 text-background" />
            </div>
          </div>

          {/* Person 2 - Slides from right */}
          <div 
            className={`flex flex-col items-center gap-3 transition-all duration-500 ease-out ${
              introPhase >= 2 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/50 shadow-xl shadow-primary/20">
                <AvatarImage src={person2.imageUrl} alt={person2.name} className="object-cover" />
                <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary/20 to-primary/10">
                  {getAvatarEmoji(person2.profession)}
                </AvatarFallback>
              </Avatar>
              {!isTie && person2 === richer && (
                <div className="absolute -top-2 -right-2">
                  <Crown className="h-8 w-8 text-primary fill-primary drop-shadow-lg" />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-serif font-bold text-lg md:text-xl">{person2.name}</p>
              <p className="text-sm text-muted-foreground">{person2.profession}</p>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className={`absolute bottom-6 left-0 right-0 text-center transition-opacity duration-300 ${
          introPhase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-sm text-primary font-medium animate-pulse">
            Calculating wealth showdown...
          </p>
        </div>
      </div>
    );
  }

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
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={person1.imageUrl} alt={person1.name} className="object-cover" />
                    <AvatarFallback className="text-sm">{getAvatarEmoji(person1.profession)}</AvatarFallback>
                  </Avatar>
                  {!isTie && person1 === richer && <Crown className="h-4 w-4 text-primary fill-primary" />}
                  <span className="font-medium">{person1.name}</span>
                </div>
                <span className="text-primary font-mono">
                  {formatCompactCurrency(person1.annualEarnings)}/yr
                </span>
              </div>
              <Progress value={person1Percent} className="h-3" />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={person2.imageUrl} alt={person2.name} className="object-cover" />
                    <AvatarFallback className="text-sm">{getAvatarEmoji(person2.profession)}</AvatarFallback>
                  </Avatar>
                  {!isTie && person2 === richer && <Crown className="h-4 w-4 text-primary fill-primary" />}
                  <span className="font-medium">{person2.name}</span>
                </div>
                <span className="text-primary font-mono">
                  {formatCompactCurrency(person2.annualEarnings)}/yr
                </span>
              </div>
              <Progress value={person2Percent} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {isTie ? (
        /* Tie Result */
        <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Equal className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-gold-text">It's a Draw!</span>
              <Equal className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground">
              {person1.name} and {person2.name} earn approximately the same amount annually
            </p>
            <p className="text-3xl font-bold text-primary mt-4">
              ~{formatCompactCurrency(person1.annualEarnings)}/yr
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Winner Result */
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50 animate-fade-in" style={{ animationDelay: '0.3s' }}>
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

            <Card className="border-border/50 bg-card/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

          <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 animate-fade-in" style={{ animationDelay: '0.5s' }}>
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
        </>
      )}

      {/* Share Card */}
      <CompareShareCard person1={person1} person2={person2} />
    </div>
  );
};

export default CompareResult;
