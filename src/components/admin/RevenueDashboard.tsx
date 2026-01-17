import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, Users, 
  CreditCard, Percent, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  has_lifetime_access: boolean;
  search_count: number;
  stripe_customer_id: string | null;
  stripe_payment_intent_id?: string | null;
  roles: string[];
}

interface Affiliate {
  id: string;
  display_name: string;
  email: string;
  affiliate_code: string;
  status: string;
  commission_rate: number;
  total_referrals: number;
  total_earnings: number;
  pending_payout: number;
}

interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at: string | null;
}

interface RevenueDashboardProps {
  users: AdminUser[];
  affiliates?: Affiliate[];
  payouts?: Payout[];
}

const PRICE_PER_SALE = 6.99;
const STRIPE_FEE_PERCENT = 2.9;
const STRIPE_FEE_FIXED = 0.30;

export const RevenueDashboard = ({ users, affiliates = [], payouts = [] }: RevenueDashboardProps) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Calculate net revenue per sale after Stripe fees
  const netRevenuePerSale = PRICE_PER_SALE - (PRICE_PER_SALE * STRIPE_FEE_PERCENT / 100) - STRIPE_FEE_FIXED;

  // Get paid users with their payment dates
  const paidUsers = useMemo(() => {
    return users.filter(u => u.has_lifetime_access);
  }, [users]);

  // Revenue calculations
  const grossRevenue = paidUsers.length * PRICE_PER_SALE;
  const stripeFees = paidUsers.length * ((PRICE_PER_SALE * STRIPE_FEE_PERCENT / 100) + STRIPE_FEE_FIXED);
  const totalAffiliatePayouts = affiliates.reduce((sum, a) => sum + a.total_earnings, 0);
  const pendingAffiliatePayouts = affiliates.reduce((sum, a) => sum + a.pending_payout, 0);
  const netRevenue = grossRevenue - stripeFees - totalAffiliatePayouts;

  // Conversion rate
  const conversionRate = users.length > 0 ? (paidUsers.length / users.length) * 100 : 0;

  // Daily revenue data for the last 30 days
  const dailyRevenueData = useMemo(() => {
    const data: { date: string; displayDate: string; sales: number; revenue: number; netRevenue: number; signups: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const daySignups = users.filter(u => u.created_at.split('T')[0] === dateStr);
      const daySales = daySignups.filter(u => u.has_lifetime_access);
      const dayRevenue = daySales.length * PRICE_PER_SALE;
      const dayNetRevenue = daySales.length * netRevenuePerSale;
      
      data.push({
        date: dateStr,
        displayDate,
        sales: daySales.length,
        revenue: dayRevenue,
        netRevenue: dayNetRevenue,
        signups: daySignups.length,
      });
    }
    return data;
  }, [users, netRevenuePerSale]);

  // Weekly revenue data
  const weeklyRevenueData = useMemo(() => {
    const data: { week: string; sales: number; revenue: number; netRevenue: number; signups: number; conversion: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      const weekSignups = users.filter(u => {
        const created = new Date(u.created_at);
        return created >= weekStart && created <= weekEnd;
      });
      const weekSales = weekSignups.filter(u => u.has_lifetime_access);
      
      data.push({
        week: weekLabel,
        sales: weekSales.length,
        revenue: weekSales.length * PRICE_PER_SALE,
        netRevenue: weekSales.length * netRevenuePerSale,
        signups: weekSignups.length,
        conversion: weekSignups.length > 0 ? (weekSales.length / weekSignups.length) * 100 : 0,
      });
    }
    return data;
  }, [users, netRevenuePerSale]);

  // Monthly revenue data
  const monthlyRevenueData = useMemo(() => {
    const data: { month: string; sales: number; revenue: number; netRevenue: number; signups: number; conversion: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const monthSignups = users.filter(u => u.created_at.slice(0, 7) === monthStr);
      const monthSales = monthSignups.filter(u => u.has_lifetime_access);
      
      data.push({
        month: monthLabel,
        sales: monthSales.length,
        revenue: monthSales.length * PRICE_PER_SALE,
        netRevenue: monthSales.length * netRevenuePerSale,
        signups: monthSignups.length,
        conversion: monthSignups.length > 0 ? (monthSales.length / monthSignups.length) * 100 : 0,
      });
    }
    return data;
  }, [users, netRevenuePerSale]);

  // Today's stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySignups = users.filter(u => u.created_at.split('T')[0] === todayStr);
  const todaySales = todaySignups.filter(u => u.has_lifetime_access);
  const todayRevenue = todaySales.length * PRICE_PER_SALE;

  // This week's stats
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekSignups = users.filter(u => new Date(u.created_at) > weekAgo);
  const thisWeekSales = thisWeekSignups.filter(u => u.has_lifetime_access);
  const thisWeekRevenue = thisWeekSales.length * PRICE_PER_SALE;

  // This month's stats
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const thisMonthSignups = users.filter(u => new Date(u.created_at) > monthAgo);
  const thisMonthSales = thisMonthSignups.filter(u => u.has_lifetime_access);
  const thisMonthRevenue = thisMonthSales.length * PRICE_PER_SALE;

  // Compare to previous period
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const prevWeekSignups = users.filter(u => {
    const created = new Date(u.created_at);
    return created > twoWeeksAgo && created <= weekAgo;
  });
  const prevWeekSales = prevWeekSignups.filter(u => u.has_lifetime_access);
  const weekOverWeekGrowth = prevWeekSales.length > 0 
    ? ((thisWeekSales.length - prevWeekSales.length) / prevWeekSales.length) * 100 
    : thisWeekSales.length > 0 ? 100 : 0;

  const chartData = timeRange === 'daily' ? dailyRevenueData : 
                    timeRange === 'weekly' ? weeklyRevenueData : 
                    monthlyRevenueData;

  const xAxisKey = timeRange === 'daily' ? 'displayDate' : 
                   timeRange === 'weekly' ? 'week' : 'month';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Gross Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">${grossRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {paidUsers.length} sales × ${PRICE_PER_SALE}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Net Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${netRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              After fees & payouts
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Conversion Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">
              {paidUsers.length} / {users.length} users
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              {weekOverWeekGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              Week over Week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${weekOverWeekGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {weekOverWeekGrowth >= 0 ? '+' : ''}{weekOverWeekGrowth.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {thisWeekSales.length} vs {prevWeekSales.length} sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Period Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${todayRevenue.toFixed(2)}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{todaySales.length} sales</span>
              <span>•</span>
              <span>{todaySignups.length} signups</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${thisWeekRevenue.toFixed(2)}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{thisWeekSales.length} sales</span>
              <span>•</span>
              <span>{thisWeekSignups.length} signups</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${thisMonthRevenue.toFixed(2)}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{thisMonthSales.length} sales</span>
              <span>•</span>
              <span>{thisMonthSignups.length} signups</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Over Time
              </CardTitle>
              <CardDescription>Track your sales and revenue trends</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={timeRange === 'daily' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </Button>
              <Button 
                variant={timeRange === 'weekly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </Button>
              <Button 
                variant={timeRange === 'monthly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey={xAxisKey} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue' || name === 'netRevenue') return [`$${value.toFixed(2)}`, name === 'revenue' ? 'Gross Revenue' : 'Net Revenue'];
                    if (name === 'conversion') return [`${value.toFixed(1)}%`, 'Conversion'];
                    return [value, name === 'sales' ? 'Sales' : 'Signups'];
                  }}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2}
                  name="revenue"
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="netRevenue" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.2}
                  name="netRevenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  dot={false}
                  name="sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel & Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Breakdown */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Gross Revenue</span>
                <span className="font-bold text-lg">${grossRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  Stripe Fees (2.9% + $0.30)
                </span>
                <span className="font-semibold text-red-500">-${stripeFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-amber-500" />
                  Affiliate Payouts
                </span>
                <span className="font-semibold text-amber-500">-${totalAffiliatePayouts.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="font-semibold flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                    Net Revenue
                  </span>
                  <span className="font-bold text-xl text-primary">${netRevenue.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground pt-2">
                Profit Margin: <span className="font-semibold text-primary">{grossRevenue > 0 ? ((netRevenue / grossRevenue) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Payouts Summary */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Affiliate Performance
            </CardTitle>
            <CardDescription>Commission payouts and pending amounts</CardDescription>
          </CardHeader>
          <CardContent>
            {affiliates.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-2xl font-bold">{affiliates.length}</p>
                    <p className="text-sm text-muted-foreground">Active Affiliates</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-2xl font-bold">{affiliates.reduce((sum, a) => sum + a.total_referrals, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-muted-foreground">Total Paid Out</span>
                    <span className="font-semibold">${totalAffiliatePayouts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                    <span className="text-muted-foreground">Pending Payouts</span>
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      ${pendingAffiliatePayouts.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                {/* Top Affiliates */}
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Top Performers</p>
                  <div className="space-y-2">
                    {affiliates
                      .sort((a, b) => b.total_earnings - a.total_earnings)
                      .slice(0, 3)
                      .map((affiliate, i) => (
                        <div key={affiliate.id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                            <span className="text-sm">{affiliate.display_name}</span>
                          </div>
                          <span className="text-sm font-semibold">${affiliate.total_earnings.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No affiliates yet</p>
                <p className="text-sm">Create affiliate links to start tracking referrals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-Sale Economics */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Per-Sale Economics
          </CardTitle>
          <CardDescription>Revenue breakdown for each $6.99 sale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">% of Sale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Sale Price</TableCell>
                  <TableCell className="text-right">${PRICE_PER_SALE.toFixed(2)}</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Stripe Fee (2.9%)</TableCell>
                  <TableCell className="text-right text-red-500">-${(PRICE_PER_SALE * STRIPE_FEE_PERCENT / 100).toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{STRIPE_FEE_PERCENT}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Stripe Fixed Fee</TableCell>
                  <TableCell className="text-right text-red-500">-${STRIPE_FEE_FIXED.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{((STRIPE_FEE_FIXED / PRICE_PER_SALE) * 100).toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Avg Affiliate Commission</TableCell>
                  <TableCell className="text-right text-amber-500">-$1.50</TableCell>
                  <TableCell className="text-right text-muted-foreground">21.5%</TableCell>
                </TableRow>
                <TableRow className="bg-primary/5 border-t-2">
                  <TableCell className="font-bold">Net per Direct Sale</TableCell>
                  <TableCell className="text-right font-bold text-primary">${netRevenuePerSale.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold text-primary">{((netRevenuePerSale / PRICE_PER_SALE) * 100).toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow className="bg-muted/30">
                  <TableCell className="font-bold">Net per Affiliate Sale</TableCell>
                  <TableCell className="text-right font-bold">${(netRevenuePerSale - 1.50).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">{(((netRevenuePerSale - 1.50) / PRICE_PER_SALE) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
