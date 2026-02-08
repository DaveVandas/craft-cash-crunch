import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Share2, TrendingUp, Smartphone, Monitor, Twitter } from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#000000',
  facebook: '#1877F2',
  whatsapp: '#25D366',
  linkedin: '#0A66C2',
  instagram: '#E4405F',
  tiktok: '#000000',
  native: '#6366F1',
  copy: '#8B5CF6',
  'save-image': '#F59E0B',
};

const FEATURE_COLORS = [
  '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#06B6D4', '#84CC16',
];

interface ShareAnalyticsData {
  total_shares: number;
  by_platform: { platform: string; count: number }[];
  by_feature: { feature: string; count: number }[];
  by_device: { device_type: string; count: number }[];
  by_day: { date: string; count: number }[];
  twitter_shares: number;
  mobile_shares: number;
}

async function fetchShareAnalytics(): Promise<ShareAnalyticsData> {
  // Get total shares
  const { count: total_shares } = await supabase
    .from('share_analytics')
    .select('*', { count: 'exact', head: true });

  // Get shares by platform
  const { data: platformData } = await supabase
    .from('share_analytics')
    .select('platform')
    .then(async (result) => {
      if (!result.data) return { data: [] };
      const counts: Record<string, number> = {};
      result.data.forEach((row) => {
        counts[row.platform] = (counts[row.platform] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .map(([platform, count]) => ({ platform, count }))
          .sort((a, b) => b.count - a.count),
      };
    });

  // Get shares by feature
  const { data: featureData } = await supabase
    .from('share_analytics')
    .select('feature')
    .then(async (result) => {
      if (!result.data) return { data: [] };
      const counts: Record<string, number> = {};
      result.data.forEach((row) => {
        counts[row.feature] = (counts[row.feature] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .map(([feature, count]) => ({ feature, count }))
          .sort((a, b) => b.count - a.count),
      };
    });

  // Get shares by device
  const { data: deviceData } = await supabase
    .from('share_analytics')
    .select('device_type')
    .then(async (result) => {
      if (!result.data) return { data: [] };
      const counts: Record<string, number> = {};
      result.data.forEach((row) => {
        const device = row.device_type || 'unknown';
        counts[device] = (counts[device] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .map(([device_type, count]) => ({ device_type, count }))
          .sort((a, b) => b.count - a.count),
      };
    });

  // Get shares by day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: dayData } = await supabase
    .from('share_analytics')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .then(async (result) => {
      if (!result.data) return { data: [] };
      const counts: Record<string, number> = {};
      result.data.forEach((row) => {
        const date = new Date(row.created_at).toISOString().split('T')[0];
        counts[date] = (counts[date] || 0) + 1;
      });
      return {
        data: Object.entries(counts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      };
    });

  // Calculate specific metrics
  const twitter_shares = platformData?.filter((p) => p.platform === 'twitter').reduce((acc, p) => acc + p.count, 0) || 0;
  const mobile_shares = deviceData?.filter((d) => d.device_type === 'mobile').reduce((acc, d) => acc + d.count, 0) || 0;

  return {
    total_shares: total_shares || 0,
    by_platform: platformData || [],
    by_feature: featureData || [],
    by_device: deviceData || [],
    by_day: dayData || [],
    twitter_shares,
    mobile_shares,
  };
}

const ShareAnalytics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['share-analytics'],
    queryFn: fetchShareAnalytics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading share analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-destructive">
          Failed to load analytics
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const twitterPercent = data.total_shares > 0 ? Math.round((data.twitter_shares / data.total_shares) * 100) : 0;
  const mobilePercent = data.total_shares > 0 ? Math.round((data.mobile_shares / data.total_shares) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_shares}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Twitter/X Shares</CardTitle>
            <Twitter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.twitter_shares}</div>
            <p className="text-xs text-muted-foreground">{twitterPercent}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Shares</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mobile_shares}</div>
            <p className="text-xs text-muted-foreground">{mobilePercent}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {data.by_platform[0]?.platform || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.by_platform[0]?.count || 0} shares
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">By Platform</TabsTrigger>
          <TabsTrigger value="features">By Feature</TabsTrigger>
          <TabsTrigger value="devices">By Device</TabsTrigger>
          <TabsTrigger value="trend">7-Day Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Shares by Platform</CardTitle>
              <CardDescription>Which platforms are driving the most shares</CardDescription>
            </CardHeader>
            <CardContent>
              {data.by_platform.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No share data yet. Shares will appear here once users start sharing.
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.by_platform}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Shares">
                        {data.by_platform.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PLATFORM_COLORS[entry.platform] || '#6366F1'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Shares by Feature</CardTitle>
              <CardDescription>Which features are getting shared the most</CardDescription>
            </CardHeader>
            <CardContent>
              {data.by_feature.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No share data yet.
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.by_feature}
                        dataKey="count"
                        nameKey="feature"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ feature, count }) => `${feature}: ${count}`}
                      >
                        {data.by_feature.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={FEATURE_COLORS[index % FEATURE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Shares by Device</CardTitle>
              <CardDescription>Mobile vs Desktop share behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {data.by_device.map((device) => (
                  <div key={device.device_type} className="flex items-center gap-2">
                    {device.device_type === 'mobile' ? (
                      <Smartphone className="h-5 w-5" />
                    ) : (
                      <Monitor className="h-5 w-5" />
                    )}
                    <span className="capitalize font-medium">{device.device_type}</span>
                    <Badge variant="secondary">{device.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Share Trend</CardTitle>
              <CardDescription>Daily share activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {data.by_day.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent share data.
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.by_day}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Bar dataKey="count" name="Shares" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareAnalytics;
