import { Crown, TrendingUp, Briefcase, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioLoadingOverlayProps {
  name: string;
}

const loadingPhrases = [
  'Accessing VIP data vault...',
  'Decrypting portfolio holdings...',
  'Analyzing market positions...',
  'Gathering insider intel...',
  'Loading mogul strategy...',
];

export const PortfolioLoadingOverlay = ({ name }: PortfolioLoadingOverlayProps) => {
  // Pick a random phrase on mount
  const phrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      {/* Animated Crown */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping">
          <Crown className="h-16 w-16 text-primary/30" />
        </div>
        <Crown className="h-16 w-16 text-primary animate-pulse" />
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold gradient-gold-text mb-2 text-center px-4">
        {name}
      </h2>

      {/* Loading phrase */}
      <p className="text-muted-foreground text-sm mb-8 animate-pulse">
        {phrase}
      </p>

      {/* Animated icons row */}
      <div className="flex items-center gap-6">
        {[TrendingUp, Briefcase, DollarSign].map((Icon, idx) => (
          <div
            key={idx}
            className={cn(
              "p-3 rounded-full bg-primary/10 border border-primary/20",
              "animate-bounce"
            )}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
          style={{
            width: '40%',
            animation: 'loading 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};
