import { useEffect } from 'react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpdateNotification = () => {
  const { needRefresh, applyUpdate, dismissUpdate } = usePWAUpdate();

  useEffect(() => {
    if (needRefresh) {
      toast.custom(
        (t) => (
          <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 shadow-lg">
            <RefreshCw className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">New version available!</p>
              <p className="text-sm text-muted-foreground">Tap to update the app</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  dismissUpdate();
                  toast.dismiss(t);
                }}
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  applyUpdate();
                  toast.dismiss(t);
                }}
              >
                Update
              </Button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
        }
      );
    }
  }, [needRefresh, applyUpdate, dismissUpdate]);

  return null;
};

export default UpdateNotification;
