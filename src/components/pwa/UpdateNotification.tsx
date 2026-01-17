import { useEffect } from 'react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { toast } from 'sonner';
import { RefreshCw, X } from 'lucide-react';

const UpdateNotification = () => {
  const { needRefresh, applyUpdate, dismissUpdate } = usePWAUpdate();

  useEffect(() => {
    if (needRefresh) {
      toast(
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-primary animate-spin" />
          <div className="flex-1">
            <p className="font-medium">New version available!</p>
            <p className="text-sm text-muted-foreground">Tap to update the app</p>
          </div>
        </div>,
        {
          duration: Infinity,
          action: {
            label: 'Update',
            onClick: applyUpdate,
          },
          cancel: {
            label: 'Later',
            onClick: dismissUpdate,
          },
        }
      );
    }
  }, [needRefresh, applyUpdate, dismissUpdate]);

  return null;
};

export default UpdateNotification;
