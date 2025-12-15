import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Gift, Users, Copy, Share2, CheckCircle, Clock, Mail } from 'lucide-react';

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  created_at: string;
}

const Referral = () => {
  const { user, accessInfo } = useAuth();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Generate or fetch referral code
    const code = `WP-${user.id.slice(0, 8).toUpperCase()}`;
    setReferralCode(code);

    // Fetch existing referrals
    fetchReferrals();
  }, [user, navigate]);

  const fetchReferrals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReferrals(data);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
  };

  const handleSendInvite = async () => {
    if (!email || !user) return;

    setLoading(true);
    try {
      // Check if already invited
      const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id)
        .eq('referred_email', email)
        .single();

      if (existing) {
        toast({
          title: 'Already invited',
          description: 'This email has already been invited',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Create referral record
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_email: email,
          referral_code: referralCode,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Invite sent!',
        description: `Invitation sent to ${email}`,
      });

      setEmail('');
      fetchReferrals();
    } catch (err) {
      console.error('Error sending invite:', err);
      toast({
        title: 'Error',
        description: 'Failed to send invite',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const convertedCount = referrals.filter(r => r.status === 'converted').length;
  const pendingCount = referrals.filter(r => r.status === 'pending').length;
  const rewardUnlocked = convertedCount >= 3;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">Invite Friends, Earn Rewards</h1>
            <p className="text-muted-foreground">
              Invite 3 friends who sign up and get <span className="text-primary font-semibold">lifetime access free</span>!
            </p>
          </div>

          {/* Progress Card */}
          <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 via-card to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Your Progress</span>
                <span className="text-primary font-bold">{convertedCount}/3 Friends</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-3 rounded-full ${
                      i <= convertedCount ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                ))}
              </div>

              {rewardUnlocked ? (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Reward unlocked! Lifetime access is yours!</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {3 - convertedCount} more friend{3 - convertedCount !== 1 ? 's' : ''} needed to unlock lifetime access
                </p>
              )}
            </CardContent>
          </Card>

          {/* Referral Code */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono text-lg text-center bg-secondary"
                />
                <Button variant="outline" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full" onClick={handleCopyLink}>
                <Share2 className="mr-2 h-4 w-4" />
                Copy Referral Link
              </Button>
            </CardContent>
          </Card>

          {/* Send Invite */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Invite by Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSendInvite} disabled={loading || !email}>
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referrals List */}
          {referrals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Your Invites ({referrals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <span className="text-sm truncate flex-1">{referral.referred_email}</span>
                      <div className="flex items-center gap-2">
                        {referral.status === 'converted' ? (
                          <span className="flex items-center gap-1 text-xs text-green-500">
                            <CheckCircle className="h-3 w-3" />
                            Joined
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Referral;
