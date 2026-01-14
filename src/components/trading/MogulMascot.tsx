import { cn } from '@/lib/utils';

interface MogulMascotProps {
  mood?: 'neutral' | 'happy' | 'excited' | 'worried';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSpeech?: boolean;
  speech?: string;
}

export function MogulMascot({ 
  mood = 'neutral',
  size = 'md',
  className,
  showSpeech = false,
  speech,
}: MogulMascotProps) {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🎩😊';
      case 'excited':
        return '🎩🤑';
      case 'worried':
        return '🎩😰';
      default:
        return '🎩🧐';
    }
  };

  const getDefaultSpeech = () => {
    switch (mood) {
      case 'happy':
        return "Excellent move, old sport!";
      case 'excited':
        return "The money printer goes BRRR!";
      case 'worried':
        return "Perhaps we should diversify...";
      default:
        return "Time to make some moves!";
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size]
      )}>
        {/* Main mascot */}
        <span className="animate-bounce" style={{ animationDuration: '2s' }}>
          {getMoodEmoji()}
        </span>
        
        {/* Decorative elements based on mood */}
        {mood === 'excited' && (
          <>
            <span className="absolute -top-2 -right-2 text-lg animate-ping">✨</span>
            <span className="absolute -bottom-1 -left-2 text-lg animate-ping" style={{ animationDelay: '0.5s' }}>💰</span>
          </>
        )}
        
        {mood === 'happy' && (
          <span className="absolute -top-1 -right-1 text-lg animate-pulse">⭐</span>
        )}
      </div>
      
      {showSpeech && (
        <div className="relative bg-card border border-primary/30 rounded-xl px-4 py-2 max-w-xs">
          {/* Speech bubble pointer */}
          <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-primary/30" />
          <p className="text-sm font-medium text-foreground/90 italic">
            "{speech || getDefaultSpeech()}"
          </p>
        </div>
      )}
    </div>
  );
}
