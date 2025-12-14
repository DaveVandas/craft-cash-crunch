import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const wealthFacts = [
  "Jeff Bezos earns the median US annual salary every 11.5 seconds.",
  "Taylor Swift's Eras Tour grossed $2.2 billion — more than the GDP of 30 countries.",
  "Elon Musk could give every person on Earth $3 and still have billions left.",
  "LeBron James makes more in one game than most Americans earn in 5 years.",
  "Cristiano Ronaldo earns $1.6 million per Instagram post.",
  "Beyoncé's net worth could fund NASA for 3 months.",
  "MrBeast spends more on a single video than most movies cost to make.",
  "Apple makes $1.7 million every 5 minutes.",
  "The top 1% own more wealth than the bottom 90% combined.",
  "A billionaire spending $1,000 is like you spending less than a penny.",
];

const DailyWealthFact = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get today's fact based on date
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setFactIndex(dayOfYear % wealthFacts.length);
  }, []);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % wealthFacts.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const shuffleFact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setFactIndex(prev => (prev + 1) % wealthFacts.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary font-medium mb-1">Daily Wealth Fact</p>
          <p 
            className={`text-sm text-foreground transition-all duration-300 ${
              isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {wealthFacts[factIndex]}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 flex-shrink-0"
          onClick={shuffleFact}
        >
          <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyWealthFact;
