import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  addAlert,
  checkAlerts,
  getAlerts,
  removeAlert,
  type PriceAlert,
} from '@/lib/priceAlerts';

/**
 * Native price alerts panel. Alerts live on the device and fire a local
 * notification when the target is crossed (checked on app open/resume).
 */
const PriceAlertsCard = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  const handleAdd = async () => {
    const sym = symbol.trim().toUpperCase();
    const target = parseFloat(price);
    if (!sym || !Number.isFinite(target) || target <= 0) {
      toast.error('Enter a ticker and a valid target price.');
      return;
    }
    const next = await addAlert(sym, target, direction);
    setAlerts(next);
    setSymbol('');
    setPrice('');
    toast.success(
      isNative
        ? `Alert set — we'll notify you when ${sym} goes ${direction} $${target.toFixed(2)}.`
        : `Alert saved for ${sym}. Install the app to get push alerts.`,
    );
    checkAlerts().then(setAlerts);
  };

  const handleRemove = async (id: string) => {
    setAlerts(await removeAlert(id));
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BellRing className="h-4 w-4 text-primary" />
          Price Alerts
          <Badge variant="secondary" className="ml-auto text-[10px]">
            On-device
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Ticker (AAPL)"
            className="sm:w-36"
            maxLength={8}
          />
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Target price"
            inputMode="decimal"
            className="sm:w-36"
          />
          <Button
            type="button"
            variant="outline"
            className="sm:w-32"
            onClick={() => setDirection((d) => (d === 'above' ? 'below' : 'above'))}
          >
            {direction === 'above' ? 'Goes above' : 'Drops below'}
          </Button>
          <Button type="button" onClick={handleAdd} className="sm:flex-1">
            <Bell className="h-4 w-4 mr-2" />
            Set alert
          </Button>
        </div>

        {alerts.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No alerts yet. Set one and your phone will notify you when the price hits your target.
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm"
              >
                <span className="truncate">
                  <span className="font-semibold">{a.symbol}</span>{' '}
                  {a.direction === 'above' ? '≥' : '≤'} ${a.targetPrice.toFixed(2)}
                  {a.triggeredAt && (
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Triggered
                    </Badge>
                  )}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove alert for ${a.symbol}`}
                  onClick={() => handleRemove(a.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceAlertsCard;
