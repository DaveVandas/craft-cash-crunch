import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PremiumShareIconButtonProps {
  size?: 'sm' | 'default';
  onClick?: () => void;
  className?: string;
  iconOnly?: boolean; // Force icon-only mode (no text)
}

const PremiumShareIconButton = forwardRef<HTMLButtonElement, PremiumShareIconButtonProps>(
  ({ size = 'default', onClick, className, iconOnly = false }, ref) => {
    const isSmall = size === 'sm';
    
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={cn(
          `relative overflow-hidden flex items-center justify-center
          bg-gradient-to-r from-amber-500/20 to-yellow-500/10 
          border border-amber-500/40 
          hover:from-amber-500/30 hover:to-yellow-500/20 
          hover:border-amber-400/60 
          hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] 
          transition-all duration-300`,
          iconOnly 
            ? (isSmall ? 'h-7 w-7 min-w-7 p-0' : 'h-8 w-8 min-w-8 p-0')
            : (isSmall ? 'h-7 px-2 text-xs gap-1' : 'h-8 px-3 text-xs gap-1.5'),
          className
        )}
      >
        <Sparkles className={cn(
          'text-amber-500 shrink-0',
          isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'
        )} />
        {!iconOnly && <span className="text-amber-500 font-medium">Share</span>}
        
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </Button>
    );
  }
);

PremiumShareIconButton.displayName = 'PremiumShareIconButton';

export default PremiumShareIconButton;
