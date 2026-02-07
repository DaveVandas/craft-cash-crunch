import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Share2, RefreshCw, Download, TrendingUp, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ShareAnalytics {
  id: string;
  story_id: string;
  story_title: string;
  platform: string;
  shared_at: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  native: 'hsl(var(--primary))',
  whatsapp: '#25D366',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  instagram: '#E4405F',
  tiktok: '#000000',
  copy: 'hsl(var(--muted-foreground))',
};

const StoryShareAnalytics = () => {
  const [shares, setShares] = useState<ShareAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShares = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('story_share_analytics')
        .select('*')
        .order('shared_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      setShares(data || []);
    } catch (err) {
      console.error('Failed to fetch share analytics:', err);
      toast.error('Failed to load share analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShares();
  }, []);

  // Stats by story
  const storyStats = useMemo(() => {
    const stats: Record<string, { title: string; count: number }> = {};
    shares.forEach((s) => {
      if (!stats[s.story_id]) {
        stats[s.story_id] = { title: s.story_title, count: 0 };
      }
      stats[s.story_id].count++;
    });
    return Object.entries(stats)
      .map(([id, data]) => ({ story_id: id, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [shares]);

  // Stats by platform
  const platformStats = useMemo(() => {
    const stats: Record<string, number> = {};
    shares.forEach((s) => {
      stats[s.platform] = (stats[s.platform] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([platform, count]) => ({ 
        platform, 
        count,
        color: PLATFORM_COLORS[platform] || 'hsl(var(--muted-foreground))'
      }))
      .sort((a, b) => b.count - a.count);
  }, [shares]);

  // Shares over last 7 days
  const dailyShares = useMemo(() => {
    const data: { date: string; shares: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayShares = shares.filter((s) => {
        return s.shared_at.split('T')[0] === dateStr;
      });
      
      data.push({
        date: displayDate,
        shares: dayShares.length,
      });
    }
    return data;
  }, [shares]);

  const totalShares = shares.length;
  const sharesToday = shares.filter((s) => {
    const today = new Date().toISOString().split('T')[0];
    return s.shared_at.split('T')[0] === today;
  }).length;

  const exportCSV = () => {
    const headers = ['Story', 'Platform', 'Shared At'];
    const rows = shares.map((s) => [s.story_title, s.platform, s.shared_at]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'story-shares-export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Shares exported successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Total Shares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalShares}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Shares Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{sharesToday}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Stories Shared
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{storyStats.length}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              Top Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold capitalize">
              {platformStats[0]?.platform || '—'}
            </p>
            <p className="text-sm text-muted-foreground">
              {platformStats[0]?.count || 0} shares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Shares Chart */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Shares (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyShares}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="shares" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Shares by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="platform"
                  >
                    {platformStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {platformStats.slice(0, 5).map((p) => (
                <Badge key={p.platform} variant="outline" className="capitalize">
                  {p.platform}: {p.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Stories Table */}
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Shared Stories</CardTitle>
            <CardDescription>Stories ranked by share count</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline" size="sm" disabled={shares.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={fetchShares} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {storyStats.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No shares tracked yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Story</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storyStats.map((story, i) => (
                  <TableRow key={story.story_id}>
                    <TableCell className="font-bold text-primary">{i + 1}</TableCell>
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{story.count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Shares */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Recent Shares</CardTitle>
          <CardDescription>Last 20 share events</CardDescription>
        </CardHeader>
        <CardContent>
          {shares.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No shares tracked yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Story</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shares.slice(0, 20).map((share) => (
                  <TableRow key={share.id}>
                    <TableCell className="font-medium max-w-xs truncate">{share.story_title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{share.platform}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(share.shared_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryShareAnalytics;
