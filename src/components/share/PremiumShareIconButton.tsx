import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PremiumShareIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Premium gold share icon button with glow effect
 * Use this for share dropdown triggers throughout the app
 */
const PremiumShareIconButton = forwardRef<HTMLButtonElement, PremiumShareIconButtonProps>(
  ({ className, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-7 w-7',
      default: 'h-8 w-8',
      lg: 'h-10 w-10',
    };

    const iconSizes = {
      sm: 'h-3.5 w-3.5',
      default: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses[size],
          'relative overflow-hidden rounded-full',
          'bg-gradient-to-br from-amber-500/20 to-yellow-500/10',
          'border border-amber-500/30',
          'hover:from-amber-500/30 hover:to-yellow-500/20',
          'hover:border-amber-400/50',
          'hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]',
          'transition-all duration-300',
          'group',
          className
        )}
        {...props}
      >
        <Sparkles 
          className={cn(
            iconSizes[size],
            'text-amber-500 group-hover:text-amber-400 transition-colors'
          )} 
        />
        {/* Subtle shimmer on hover */}
        <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </span>
      </Button>
    );
  }
);

PremiumShareIconButton.displayName = 'PremiumShareIconButton';

export default PremiumShareIconButton;
