import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const SoundToggle = ({ enabled, onToggle }: SoundToggleProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-9 w-9"
        >
          {enabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{enabled ? 'Mute sounds' : 'Enable sounds'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SoundToggle;
