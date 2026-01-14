import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Order {
  id: string;
  ticker: string;
  company_name: string;
  order_type: 'buy' | 'sell' | 'short' | 'cover';
  shares: number;
  price_per_share: number;
  total_amount: number;
  executed_at: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-8 text-center">
          <History className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No trades yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          Recent Trades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {orders.map((order) => {
              const isBuy = order.order_type === 'buy';
              
              return (
                <div
                  key={order.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    isBuy 
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-full",
                      isBuy ? "bg-emerald-500/20" : "bg-red-500/20"
                    )}>
                      {isBuy ? (
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs font-semibold uppercase",
                          isBuy ? "text-emerald-400" : "text-red-400"
                        )}>
                          {order.order_type}
                        </span>
                        <span className="font-bold">{order.ticker}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.shares} @ ${order.price_per_share.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      isBuy ? "text-foreground" : "text-emerald-400"
                    )}>
                      {isBuy ? '-' : '+'}${order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.executed_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
