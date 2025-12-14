import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  DollarSign, TrendingUp, Clock, Activity, Crown
} from 'lucide-react';

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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-get-users');

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setUsers(data.users);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
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
  const estimatedRevenue = paidUsers * 4.99;

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

  const handleRefresh = () => {
    fetchUsers();
    fetchTrends();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
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
      </div>
    );
  }

  if (error?.includes('Forbidden')) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Monitor your app's performance and users</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

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
                {paidUsers} × $4.99
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

        {/* Tabs for Users and Trends */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
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
          </TabsList>

          <TabsContent value="users">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
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
              <CardHeader>
                <CardTitle>Top Searched Celebrities</CardTitle>
                <CardDescription>
                  Most popular celebrity searches across all users
                </CardDescription>
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
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
