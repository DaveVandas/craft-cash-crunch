import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AffiliateShareCard } from '@/components/affiliate/AffiliateShareCard';
import { LandingPageAnalytics } from '@/components/affiliate/LandingPageAnalytics';
import { SocialMediaKitCard } from '@/components/affiliate/SocialMediaKitCard';
import { QuickPostCard } from '@/components/affiliate/QuickPostCard';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  Crown,
  Sparkles,
  Rocket,
  Target,
  FileText,
  ExternalLink,
  Mail,
  Image,
  Send
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
  tax_id_collected: boolean | null;
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
  const [referralsByVariant, setReferralsByVariant] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchAffiliateData = useCallback(async () => {
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

      // Fetch landing page analytics from user_access table
      const { data: variantData, error: variantError } = await supabase
        .from('user_access')
        .select('source_variant')
        .eq('referred_by_code', affiliateData.affiliate_code);

      if (!variantError && variantData) {
        const variantCounts: Record<string, number> = {};
        variantData.forEach((row) => {
          const variant = row.source_variant || 'direct';
          variantCounts[variant] = (variantCounts[variant] || 0) + 1;
        });
        setReferralsByVariant(variantCounts);
      }
    } catch (_error) {
      // Error fetching affiliate data - handled by loading state
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchAffiliateData();
  }, [user, navigate, fetchAffiliateData]);

  // Real-time subscription for affiliate updates
  useEffect(() => {
    if (!affiliate?.id) return;

    const channel = supabase
      .channel('affiliate-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'affiliates',
          filter: `id=eq.${affiliate.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setAffiliate(payload.new as AffiliateData);
            // Show toast for earnings updates
            const oldEarnings = (payload.old as AffiliateData)?.total_earnings || 0;
            const newEarnings = (payload.new as AffiliateData).total_earnings || 0;
            if (newEarnings > oldEarnings) {
              const earned = newEarnings - oldEarnings;
              toast.success(`💰 Cha-Ching! You just earned $${earned.toFixed(2)}!`);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'affiliate_referrals',
          filter: `affiliate_id=eq.${affiliate.id}`,
        },
        (payload) => {
          if (payload.new) {
            setReferrals((prev) => [payload.new as ReferralData, ...prev]);
            toast.success('🎉 New signup! Someone just used your link!');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'affiliate_referrals',
          filter: `affiliate_id=eq.${affiliate.id}`,
        },
        (payload) => {
          if (payload.new) {
            setReferrals((prev) =>
              prev.map((r) =>
                r.id === (payload.new as ReferralData).id
                  ? (payload.new as ReferralData)
                  : r
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [affiliate?.id]);

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
        <main className="container mx-auto px-4 py-8 pb-20 md:pb-0 max-w-6xl">
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
        <MobileNav />
      </div>
    );
  }

  if (!affiliate) {
    return null;
  }

  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const convertedReferrals = referrals.filter(r => r.status === 'converted' || r.status === 'paid').length;
  
  // Tier progress calculation
  const TIER_THRESHOLD = 1000;
  const tierProgress = Math.min((affiliate.total_referrals / TIER_THRESHOLD) * 100, 100);
  const referralsToNextTier = Math.max(TIER_THRESHOLD - affiliate.total_referrals, 0);
  const hasReachedTier2 = affiliate.total_referrals >= TIER_THRESHOLD;
  const currentTierRate = hasReachedTier2 ? 2 : 1;
  const potentialEarningsAtTier2 = affiliate.total_referrals >= TIER_THRESHOLD 
    ? 0 
    : (TIER_THRESHOLD - affiliate.total_referrals) * 1; // What they'd miss at $1 tier

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-0 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">
              <span className="text-primary">{affiliate.display_name}</span>'s Empire
            </h1>
            {affiliate.is_vip && (
              <Badge className="bg-gradient-to-r from-amber-500/30 to-primary/30 text-amber-400 border-amber-500/50 gap-1">
                <Crown className="w-3 h-3" />
                VIP Mogul
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Welcome back, <span className="text-primary font-semibold">Mogul {affiliate.display_name}</span>! 
            Your empire awaits — keep building that wealth! 👑
          </p>
          {affiliate.status === 'pending' && (
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Clock className="w-3 h-3 mr-1" />
              Application Pending Review — Your journey to mogul status begins soon!
            </Badge>
          )}
        </div>

        {/* Tier Progress Card */}
        <Card className={`mb-8 border-2 ${hasReachedTier2 ? 'bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 border-amber-500/50' : 'bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/30'}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {hasReachedTier2 ? (
                  <div className="p-3 rounded-full bg-amber-500/20">
                    <Crown className="h-8 w-8 text-amber-400" />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-primary/20">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">
                    {hasReachedTier2 ? '👑 MOGUL ELITE STATUS!' : 'Path to Mogul Elite'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {hasReachedTier2 
                      ? 'You\'ve reached the top! Earning $2 per signup forever like a true mogul!' 
                      : `${referralsToNextTier.toLocaleString()} referrals until you unlock elite mogul status!`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  <span className={hasReachedTier2 ? 'text-amber-400' : 'text-primary'}>${currentTierRate}</span>
                  <span className="text-lg text-muted-foreground">/signup</span>
                </div>
                <p className="text-xs text-muted-foreground">Current Rate</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {affiliate.total_referrals.toLocaleString()} / {TIER_THRESHOLD.toLocaleString()} referrals
                </span>
                <span className="font-mono">{tierProgress.toFixed(1)}%</span>
              </div>
              <Progress value={tierProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$1/signup</span>
                <span className={hasReachedTier2 ? 'text-amber-400 font-bold' : ''}>$2/signup FOREVER 🔥</span>
              </div>
            </div>
            
            {!hasReachedTier2 && (
              <div className="mt-4 p-3 bg-card/50 rounded-lg border border-border/50">
                <p className="text-sm text-center">
                  <span className="text-muted-foreground">True moguls don't stop at Tier 1. </span>
                  <span className="text-amber-400 font-bold">Hit 1,000 and DOUBLE your empire!</span>
                  <span className="text-muted-foreground"> Every referral is a step toward greatness 👑</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* W-9 Tax Alert - Shows when approaching $600 threshold */}
        {affiliate.total_earnings >= 500 && !affiliate.tax_id_collected && (
          <Card className="mb-8 border-2 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 border-amber-500/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="p-3 rounded-full bg-amber-500/20 flex-shrink-0">
                  <FileText className="h-8 w-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    📋 Tax Document Required - W-9 Form
                    {affiliate.total_earnings >= 600 && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Action Required</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {affiliate.total_earnings >= 600 
                      ? `You've earned $${affiliate.total_earnings.toFixed(2)} — you've crossed the IRS $600 reporting threshold!`
                      : `You've earned $${affiliate.total_earnings.toFixed(2)} — you're approaching the IRS $600 reporting threshold.`
                    } 
                    {' '}We need your W-9 form to issue your 1099-NEC at year end.
                  </p>
                  
                  <div className="mt-4 p-4 bg-card/50 rounded-lg border border-border/50">
                    <h4 className="font-medium text-sm mb-2">How to submit your W-9:</h4>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">1.</span>
                        <span>Download the official IRS W-9 form</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">2.</span>
                        <span>Fill in your legal name, address, and SSN or EIN</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">3.</span>
                        <span>Sign and date the form</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">4.</span>
                        <span>Email your completed W-9 to: <strong className="text-foreground">hello@wealthperspective.app</strong></span>
                      </li>
                    </ol>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <a
                      href="https://www.irs.gov/pub/irs-pdf/fw9.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button className="gap-2">
                        <FileText className="h-4 w-4" />
                        Download W-9 Form
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                    <a
                      href="mailto:hello@wealthperspective.app?subject=W-9%20Submission%20-%20Affiliate%20Code%3A%20" 
                      className="inline-flex"
                    >
                      <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email Your W-9
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* W-9 Submitted Confirmation */}
        {affiliate.tax_id_collected && (
          <Card className="mb-8 border-2 bg-gradient-to-r from-green-500/20 to-green-500/5 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <FileText className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-green-400">W-9 Form Received ✓</p>
                  <p className="text-xs text-muted-foreground">
                    Your tax information is on file. You'll receive your 1099-NEC by January 31st if your earnings exceed $600.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Commission Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    ${currentTierRate.toFixed(2)}
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

        <Tabs defaultValue="quick-post" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick-post" className="gap-2">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Post</span>
            </TabsTrigger>
            <TabsTrigger value="media-kit" className="gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Media Kit</span>
            </TabsTrigger>
            <TabsTrigger value="share" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">QR Card</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{referrals.length}</span>
              <span className="sm:hidden">{referrals.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick-post">
            <QuickPostCard 
              affiliateCode={affiliate.affiliate_code}
              displayName={affiliate.display_name}
            />
          </TabsContent>

          <TabsContent value="media-kit">
            <SocialMediaKitCard affiliateCode={affiliate.affiliate_code} />
          </TabsContent>

          <TabsContent value="share">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Shareable QR Card
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Download or share this card. The QR code links directly to your referral page!
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

          <TabsContent value="analytics">
            <LandingPageAnalytics 
              affiliateCode={affiliate.affiliate_code} 
              referralsByVariant={referralsByVariant}
            />
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Your Mogul Network
                </CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{convertedReferrals} moguls recruited</span>
                  <span>{pendingReferrals} pending verification</span>
                </div>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Crown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Your empire starts with one share!</p>
                    <p className="text-sm mt-1">Every mogul was once a beginner. Start building your network today! 👑</p>
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
      <MobileNav />
    </div>
  );
}
