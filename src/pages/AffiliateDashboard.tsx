import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AffiliateShareCard } from '@/components/affiliate/AffiliateShareCard';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  Crown,
  Sparkles
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AffiliateData {
  id: string;
  affiliate_code: string;
  display_name: string;
  email: string;
  commission_rate: number;
  is_vip: boolean;
  total_referrals: number;
  total_earnings: number;
  pending_payout: number;
  status: string;
  created_at: string;
}

interface ReferralData {
  id: string;
  referred_email: string | null;
  commission_amount: number;
  status: string;
  created_at: string;
  converted_at: string | null;
}

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchAffiliateData();
  }, [user, navigate]);

  const fetchAffiliateData = async () => {
    if (!user) return;

    try {
      // Fetch affiliate info
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateError) {
        if (affiliateError.code === 'PGRST116') {
          // No affiliate record found
          navigate('/become-affiliate');
          return;
        }
        throw affiliateError;
      }

      setAffiliate(affiliateData);

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false });

      if (!referralsError && referralsData) {
        setReferrals(referralsData);
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <Badge className="bg-green-500/20 text-green-400">Converted</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-blue-500/20 text-blue-400">Paid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!affiliate) {
    return null;
  }

  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const convertedReferrals = referrals.filter(r => r.status === 'converted' || r.status === 'paid').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            {affiliate.is_vip && (
              <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
                <Crown className="w-3 h-3" />
                VIP
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Welcome back, {affiliate.display_name}! Track your referrals and earnings here.
          </p>
          {affiliate.status === 'pending' && (
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Clock className="w-3 h-3 mr-1" />
              Application Pending Review
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    ${affiliate.commission_rate.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${affiliate.total_earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {affiliate.total_referrals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Pending Payout</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${affiliate.pending_payout.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="share" className="space-y-6">
          <TabsList>
            <TabsTrigger value="share" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Share Card
            </TabsTrigger>
            <TabsTrigger value="referrals" className="gap-2">
              <Users className="w-4 h-4" />
              Referrals ({referrals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Shareable Mogul Card
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Download or share this card with your audience. The QR code links directly to your referral!
                </p>
              </CardHeader>
              <CardContent>
                <AffiliateShareCard
                  affiliateCode={affiliate.affiliate_code}
                  displayName={affiliate.display_name}
                  commissionRate={affiliate.commission_rate}
                  isVip={affiliate.is_vip}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{convertedReferrals} converted</span>
                  <span>{pendingReferrals} pending</span>
                </div>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No referrals yet. Share your card to start earning!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map(referral => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {referral.referred_email || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(referral.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-green-400">
                            +${referral.commission_amount.toFixed(2)}
                          </span>
                          {getStatusBadge(referral.status)}
                        </div>
                      </div>
                    ))}
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
}
