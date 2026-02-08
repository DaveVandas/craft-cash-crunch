import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Shield, Users, CreditCard, Search, RefreshCw, ArrowLeft, 
  DollarSign, TrendingUp, Clock, Activity, Crown, Download, BarChart3,
  Cpu, Zap, AlertTriangle, Megaphone, ExternalLink, FlaskConical, Link2, Rocket, Share2
} from 'lucide-react';
import BetaManagement from '@/components/admin/BetaManagement';
import { AffiliateManagement } from '@/components/admin/AffiliateManagement';
import { RevenueDashboard } from '@/components/admin/RevenueDashboard';
import DeploymentGuide from '@/components/admin/DeploymentGuide';
import StoryShareAnalytics from '@/components/admin/StoryShareAnalytics';
import ShareAnalytics from '@/components/admin/ShareAnalytics';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  has_lifetime_access: boolean;
  search_count: number;
  stripe_customer_id: string | null;
  roles: string[];
}

interface SearchTrend {
  celebrity_name: string;
  celebrity_slug: string;
  search_count: number;
  category: string | null;
  last_searched_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [trends, setTrends] = useState<SearchTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-get-users');

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setUsers(data?.users ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      const details = (() => {
        try {
          if (err && typeof err === 'object') {
            return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
          }
          return String(err);
        } catch {
          return String(err);
        }
      })();

      setError(message);
      setErrorDetails(details);

      if (message.includes('Forbidden')) {
        toast.error('You do not have admin access');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const { data, error } = await supabase
        .from('search_trends')
        .select('*')
        .order('search_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTrends(data || []);
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchUsers();
      fetchTrends();
    }
  }, [user, authLoading, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Stats calculations
  const totalUsers = users.length;
  const paidUsers = users.filter((u) => u.has_lifetime_access).length;
  const freeUsers = totalUsers - paidUsers;
  const totalSearches = users.reduce((sum, u) => sum + u.search_count, 0);
  const estimatedRevenue = paidUsers * 6.99;

  // Recent activity (users who signed in within last 7 days)
  const recentlyActive = users.filter((u) => {
    if (!u.last_sign_in_at) return false;
    const lastSignIn = new Date(u.last_sign_in_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastSignIn > weekAgo;
  }).length;

  // New users today
  const newUsersToday = users.filter((u) => {
    const created = new Date(u.created_at);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  // New users this week
  const newUsersThisWeek = users.filter((u) => {
    const created = new Date(u.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created > weekAgo;
  }).length;

  // Chart data: signups over last 14 days
  const signupChartData = useMemo(() => {
    const data: { date: string; signups: number; paid: number; revenue: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayUsers = users.filter((u) => {
        const created = new Date(u.created_at);
        return created.toISOString().split('T')[0] === dateStr;
      });
      
      const paidCount = dayUsers.filter((u) => u.has_lifetime_access).length;
      
      data.push({
        date: displayDate,
        signups: dayUsers.length,
        paid: paidCount,
        revenue: paidCount * 6.99,
      });
    }
    return data;
  }, [users]);

  // Pie chart data for user breakdown
  const userBreakdownData = useMemo(() => [
    { name: 'Paid Users', value: paidUsers, color: 'hsl(var(--primary))' },
    { name: 'Free Users', value: freeUsers, color: 'hsl(var(--muted-foreground))' },
  ], [paidUsers, freeUsers]);

  // Top categories from trends
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    trends.forEach((t) => {
      const cat = t.category || 'Unknown';
      categories[cat] = (categories[cat] || 0) + t.search_count;
    });
    return Object.entries(categories)
      .map(([name, searches]) => ({ name, searches }))
      .sort((a, b) => b.searches - a.searches)
      .slice(0, 6);
  }, [trends]);

  // CSV Export functions
  const exportUsersCSV = () => {
    const headers = ['Email', 'Status', 'Searches', 'Roles', 'Joined', 'Last Sign In'];
    const rows = users.map((u) => [
      u.email,
      u.has_lifetime_access ? 'Lifetime' : 'Free',
      u.search_count.toString(),
      u.roles.join('; '),
      u.created_at,
      u.last_sign_in_at || 'Never',
    ]);
    
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    downloadCSV(csvContent, 'users-export.csv');
    toast.success('Users exported successfully');
  };

  const exportTrendsCSV = () => {
    const headers = ['Celebrity', 'Category', 'Search Count', 'Last Searched'];
    const rows = trends.map((t) => [
      t.celebrity_name,
      t.category || 'Unknown',
      t.search_count.toString(),
      t.last_searched_at,
    ]);
    
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    downloadCSV(csvContent, 'search-trends-export.csv');
    toast.success('Trends exported successfully');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleRefresh = () => {
    fetchUsers();
    fetchTrends();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8 pb-20 md:pb-0">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (error?.includes('Forbidden')) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 pb-20 md:pb-0 text-center">
          <div className="max-w-md mx-auto">
            <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8 pb-20 md:pb-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Monitor your app's performance and users</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportUsersCSV} variant="outline" size="sm" disabled={loading || users.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
            <Button onClick={handleRefresh} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
         </div>

         {error && !error.includes('Forbidden') && (
           <Card className="border-destructive/30 bg-destructive/5 mb-6">
             <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-base">
                 <AlertTriangle className="h-4 w-4 text-destructive" />
                 Admin data failed to load
               </CardTitle>
               <CardDescription>
                 Your dashboard shows 0s because the backend request failed.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
               <div className="flex flex-wrap items-center gap-2">
                 <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
                   <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                   Retry users
                 </Button>
                 <Button variant="outline" size="sm" onClick={fetchTrends} disabled={loading}>
                   <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                   Retry trends
                 </Button>
               </div>

               <p className="text-sm text-foreground">{error}</p>

               {errorDetails && (
                 <details className="rounded-md border border-border bg-card p-3">
                   <summary className="cursor-pointer text-sm text-muted-foreground">Technical details</summary>
                   <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-muted-foreground">{errorDetails}</pre>
                 </details>
               )}
             </CardContent>
           </Card>
         )}

         {/* Revenue & Key Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Est. Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">${estimatedRevenue.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {paidUsers} × $6.99
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUsers}</p>
              <p className="text-sm text-muted-foreground">
                +{newUsersToday} today, +{newUsersThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0}%</p>
              <p className="text-sm text-muted-foreground">
                {paidUsers} paid / {freeUsers} free
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active (7d)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{recentlyActive}</p>
              <p className="text-sm text-muted-foreground">
                {totalUsers > 0 ? Math.round((recentlyActive / totalUsers) * 100) : 0}% of users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Signups & Revenue Chart */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Signups & Revenue (14 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={signupChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                        return [value, name === 'signups' ? 'Signups' : 'Paid'];
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="signups" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      name="signups"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="paid" 
                      stroke="hsl(var(--chart-2))" 
                      fill="hsl(var(--chart-2))" 
                      fillOpacity={0.3}
                      name="paid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Search Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="searches" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No category data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Total Searches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalSearches.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {totalUsers > 0 ? (totalSearches / totalUsers).toFixed(1) : 0} avg per user
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Searches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{trends.length}</p>
              <p className="text-sm text-muted-foreground">
                unique celebrities searched
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Usage & Cost Estimator */}
        <Card className="border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              AI Usage & Cost Estimator
            </CardTitle>
            <CardDescription>
              Estimated costs based on AI (Gemini 2.5 Flash) usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Current Usage Stats */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  Current AI Calls (Total)
                </div>
                <p className="text-2xl font-bold">{totalSearches.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">1 search = 1 AI call</p>
              </div>
              
              {/* Estimated Cost To Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Est. AI Cost To Date
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${(totalSearches * 0.0001).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">~$0.0001 per call</p>
              </div>
              
              {/* Avg Daily Searches */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Avg Searches/Day (est.)
                </div>
                <p className="text-2xl font-bold">
                  {users.length > 0 ? Math.round(totalSearches / Math.max(1, Math.ceil((Date.now() - new Date(users.reduce((min, u) => u.created_at < min ? u.created_at : min, users[0]?.created_at || new Date().toISOString())).getTime()) / 86400000))) : 0}
                </p>
                <p className="text-xs text-muted-foreground">based on historical data</p>
              </div>
            </div>

            {/* Cost Projections Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Scenario</TableHead>
                    <TableHead className="text-center">Daily Users</TableHead>
                    <TableHead className="text-center">Searches/User</TableHead>
                    <TableHead className="text-center">Daily AI Calls</TableHead>
                    <TableHead className="text-center">Monthly AI Calls</TableHead>
                    <TableHead className="text-right">Est. Monthly Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Current (Your App)</TableCell>
                    <TableCell className="text-center">{recentlyActive}</TableCell>
                    <TableCell className="text-center">{totalUsers > 0 ? (totalSearches / totalUsers).toFixed(1) : '—'}</TableCell>
                    <TableCell className="text-center">{Math.round(recentlyActive * (totalUsers > 0 ? totalSearches / totalUsers : 0))}</TableCell>
                    <TableCell className="text-center">{(Math.round(recentlyActive * (totalUsers > 0 ? totalSearches / totalUsers : 0)) * 30).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">${(Math.round(recentlyActive * (totalUsers > 0 ? totalSearches / totalUsers : 0)) * 30 * 0.0001).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Small Scale</TableCell>
                    <TableCell className="text-center">100</TableCell>
                    <TableCell className="text-center">10</TableCell>
                    <TableCell className="text-center">1,000</TableCell>
                    <TableCell className="text-center">30,000</TableCell>
                    <TableCell className="text-right font-medium">$3.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medium Scale</TableCell>
                    <TableCell className="text-center">500</TableCell>
                    <TableCell className="text-center">15</TableCell>
                    <TableCell className="text-center">7,500</TableCell>
                    <TableCell className="text-center">225,000</TableCell>
                    <TableCell className="text-right font-medium">$22.50</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5 border-primary/20">
                    <TableCell className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      Your Question: 1K Users
                    </TableCell>
                    <TableCell className="text-center font-bold">1,000</TableCell>
                    <TableCell className="text-center font-bold">20</TableCell>
                    <TableCell className="text-center font-bold">20,000</TableCell>
                    <TableCell className="text-center font-bold">600,000</TableCell>
                    <TableCell className="text-right font-bold text-primary">$60.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Large Scale</TableCell>
                    <TableCell className="text-center">5,000</TableCell>
                    <TableCell className="text-center">20</TableCell>
                    <TableCell className="text-center">100,000</TableCell>
                    <TableCell className="text-center">3,000,000</TableCell>
                    <TableCell className="text-right font-medium">$300.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Viral Scale</TableCell>
                    <TableCell className="text-center">10,000</TableCell>
                    <TableCell className="text-center">25</TableCell>
                    <TableCell className="text-center">250,000</TableCell>
                    <TableCell className="text-center">7,500,000</TableCell>
                    <TableCell className="text-right font-medium">$750.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Cost Breakdown
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Model:</strong> Gemini 2.5 Flash (~$0.075/1M input tokens, ~$0.30/1M output tokens)</li>
                <li>• <strong>Per Search:</strong> ~500 input tokens + ~200 output tokens = ~$0.0001 per call</li>
                <li>• <strong>For 1,000 daily users × 20 searches:</strong> 600K calls/month = <span className="text-primary font-semibold">~$60/month</span></li>
                <li>• <strong>Revenue at that scale:</strong> If 10% convert at $4.99 = 100 × $4.99 = <span className="text-green-500 font-semibold">$499/month revenue</span></li>
                <li>• <strong>Net profit margin:</strong> $499 - $60 = <span className="text-green-500 font-semibold">$439/month (~88% margin)</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Users and Trends */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="revenue" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Search Trends
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              Recent Signups
            </TabsTrigger>
            <TabsTrigger value="beta" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              Beta Testers
            </TabsTrigger>
            <TabsTrigger value="landing" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Landing Pages
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="gap-2">
              <Link2 className="h-4 w-4" />
              Affiliates
            </TabsTrigger>
            <TabsTrigger value="deployment" className="gap-2">
              <Rocket className="h-4 w-4" />
              Deployment
            </TabsTrigger>
            <TabsTrigger value="shares" className="gap-2">
              <Share2 className="h-4 w-4" />
              Story Shares
            </TabsTrigger>
            <TabsTrigger value="share-analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Share Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <RevenueDashboard users={users} />
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    View and manage all registered users
                  </CardDescription>
                </div>
                <Button onClick={exportUsersCSV} variant="outline" size="sm" disabled={users.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Searches</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Last Sign In</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.email}</TableCell>
                            <TableCell>
                              {u.has_lifetime_access ? (
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Lifetime
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Free</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">{u.search_count}</TableCell>
                            <TableCell>
                              {u.roles.length > 0 ? (
                                <div className="flex gap-1">
                                  {u.roles.map((role) => (
                                    <Badge
                                      key={role}
                                      variant="outline"
                                      className={role === 'admin' ? 'border-amber-500 text-amber-500' : ''}
                                    >
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(u.created_at)}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(u.last_sign_in_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Searched Celebrities</CardTitle>
                  <CardDescription>
                    Most popular celebrity searches across all users
                  </CardDescription>
                </div>
                <Button onClick={exportTrendsCSV} variant="outline" size="sm" disabled={trends.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {trends.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No search data yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Celebrity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-center">Searches</TableHead>
                          <TableHead>Last Searched</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trends.map((trend, index) => (
                          <TableRow key={trend.celebrity_slug}>
                            <TableCell className="font-bold text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">{trend.celebrity_name}</TableCell>
                            <TableCell>
                              {trend.category ? (
                                <Badge variant="outline">{trend.category}</Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {trend.search_count}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatRelativeTime(trend.last_searched_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>
                  Users who signed up in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Searches So Far</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users
                          .filter((u) => {
                            const created = new Date(u.created_at);
                            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                            return created > weekAgo;
                          })
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((u) => (
                            <TableRow key={u.id}>
                              <TableCell className="font-medium">{u.email}</TableCell>
                              <TableCell>
                                {u.has_lifetime_access ? (
                                  <Badge className="bg-primary/20 text-primary border-primary/30">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Paid
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Free</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatRelativeTime(u.created_at)}
                              </TableCell>
                              <TableCell>{u.search_count}</TableCell>
                            </TableRow>
                          ))}
                        {users.filter((u) => {
                          const created = new Date(u.created_at);
                          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                          return created > weekAgo;
                        }).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No new signups in the last 7 days
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Beta Testers Tab */}
          <TabsContent value="beta">
            <BetaManagement />
          </TabsContent>

          {/* Landing Pages Tab */}
          <TabsContent value="landing">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Landing Page Variations
                </CardTitle>
                <CardDescription>
                  Promotional landing pages to drive signups. Share these links or use them in marketing campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Variant A */}
                  <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-primary border-primary/30">Variant A</Badge>
                      <span className="text-xs text-muted-foreground">Aspirational</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">"Think Like The 1%"</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Focus on stats and the wealth gap. Creates urgency with real-time earnings comparisons. Best for social media ads.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <a href="/landing/a" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/landing/a`);
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>

                  {/* Variant B */}
                  <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-destructive border-destructive/30">Variant B</Badge>
                      <span className="text-xs text-muted-foreground">Wake-Up Call</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">"You're Not Broke"</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Direct, confrontational approach. Shows real-time earnings while reading. Great for email campaigns.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <a href="/landing/b" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/landing/b`);
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>

                  {/* Variant C */}
                  <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="border-chart-2/30 text-[hsl(var(--chart-2))]">Variant C</Badge>
                      <span className="text-xs text-muted-foreground">Inspirational</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">"Your Salary in 42 Seconds"</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Softer, more inspirational tone. Focus on perspective and thinking bigger. Best for content marketing.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <a href="/landing/c" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/landing/c`);
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>

                  {/* Variant D */}
                  <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="border-chart-4/30 text-[hsl(var(--chart-4))]">Variant D</Badge>
                      <span className="text-xs text-muted-foreground">Affiliate</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">"Earn $39,000"</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Affiliate-focused hybrid page. Combines earning potential with app value props. Best for affiliate recruitment.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <a href="/landing/d" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/landing/d`);
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Usage Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Variant A:</strong> Best for Facebook/Instagram ads targeting aspiring entrepreneurs</li>
                    <li>• <strong>Variant B:</strong> Works well for email marketing and retargeting campaigns</li>
                    <li>• <strong>Variant C:</strong> Great for SEO content, blog posts, and organic social</li>
                    <li>• <strong>Variant D:</strong> Perfect for recruiting affiliates and showcasing earning potential</li>
                    <li>• Test each variant with different audiences to see which converts best</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <AffiliateManagement />
          </TabsContent>

          {/* Deployment Guide Tab */}
          <TabsContent value="deployment">
            <DeploymentGuide />
          </TabsContent>

          {/* Story Share Analytics Tab */}
          <TabsContent value="shares">
            <StoryShareAnalytics />
          </TabsContent>

          {/* Share Analytics Tab (All Shares) */}
          <TabsContent value="share-analytics">
            <ShareAnalytics />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Admin;
