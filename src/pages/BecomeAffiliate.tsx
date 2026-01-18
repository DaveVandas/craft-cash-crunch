import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  DollarSign, 
  Share2, 
  Users, 
  TrendingUp, 
  Gift, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Crown
} from 'lucide-react';

export default function BecomeAffiliate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    payout_method: 'paypal',
    payout_details: '',
    social_platform: '',
    followers_count: '',
  });

  const generateAffiliateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'MOG-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to become an affiliate');
      navigate('/auth');
      return;
    }

    if (!formData.display_name || !formData.email || !formData.payout_details) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const affiliateCode = generateAffiliateCode();

      const { error } = await supabase.from('affiliates').insert({
        user_id: user.id,
        affiliate_code: affiliateCode,
        display_name: formData.display_name,
        email: formData.email,
        commission_rate: 1.00, // Standard rate for public signups
        payout_method: formData.payout_method,
        payout_details: formData.payout_details,
        is_vip: false,
        status: 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('You already have an affiliate application');
        } else {
          throw error;
        }
        return;
      }

      setSubmitted(true);
      toast.success('Application submitted! We\'ll review it shortly.');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Tiered Commission = MORE $$$',
      description: 'Earn $1 per signup for your first 1,000 referrals. After that? $2 PER SIGNUP FOREVER. 🚀',
    },
    {
      icon: Share2,
      title: 'One Viral Post = Life Changing',
      description: '20,000 downloads from one TikTok = $1,000 (first 1K) + $38,000 (next 19K) = $39,000! 💰',
    },
    {
      icon: Users,
      title: 'No Limit',
      description: 'There\'s no cap on how many referrals you can make. The more you share, the more you earn!',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your referrals, see your tier progress, and watch your earnings grow in real-time.',
    },
    {
      icon: Gift,
      title: 'Flexible Payouts',
      description: 'Get paid via PayPal, Cash App, Venmo, or bank transfer - your choice!',
    },
    {
      icon: Zap,
      title: 'Instant Approval',
      description: 'Most applications are approved within 24 hours so you can start earning fast.',
    },
  ];

  const steps = [
    { step: 1, title: 'Apply', description: 'Fill out the quick form below' },
    { step: 2, title: 'Get Approved', description: 'We\'ll review and approve your application' },
    { step: 3, title: 'Share', description: 'Post one TikTok showing the app' },
    { step: 4, title: 'Earn', description: '$1 → first 1K, then $2 forever!' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-primary/10 text-foreground border-primary/50">
            <Crown className="w-3 h-3 mr-1 text-primary" />
            Join the Mogul Movement
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Build Your{' '}
            <span className="text-primary">Mogul Empire?</span> 👑
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            One TikTok could pay you <span className="text-primary font-bold">$39,000</span>. 
            Join our elite mogul network and start earning like the wealthy do.
          </p>
          
          {/* Tier Breakdown */}
          <div className="max-w-xl mx-auto bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 rounded-xl p-6 border border-primary/20">
            <h3 className="font-bold text-lg mb-3 flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Mogul Commission Tiers
              <Crown className="w-5 h-5 text-primary" />
            </h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-primary">$1</div>
                <div className="text-sm text-muted-foreground">per signup</div>
                <div className="text-xs mt-1">First 1,000 referrals</div>
              </div>
              <div className="bg-card/50 rounded-lg p-4 border border-primary/30">
                <div className="text-2xl font-bold text-amber-400">$2</div>
                <div className="text-sm text-muted-foreground">per signup</div>
                <div className="text-xs mt-1">After 1,000 — FOREVER</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong className="text-foreground">Example:</strong> 20K downloads = $1,000 (first 1K) + $38,000 (next 19K) = <span className="text-primary font-bold">$39,000</span>
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Your Path to Mogul Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                <Card className="bg-card/50 border-border/50 text-center p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Moguls Choose Us 👑</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form or Success */}
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <Card className="bg-gradient-to-br from-amber-500/20 via-primary/20 to-green-500/10 border-amber-500/30">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-4">
                  <Crown className="w-16 h-16 text-amber-400" />
                  <CheckCircle className="w-8 h-8 text-green-400 absolute -bottom-1 -right-1" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to the Mogul Family! 👑</h2>
                <p className="text-muted-foreground mb-4">
                  Congratulations on taking the first step toward building your empire! 
                  Our team will review your application and you'll receive your mogul credentials 
                  within 24 hours. Get ready to start earning like the elite!
                </p>
                <Button onClick={() => navigate('/')} className="gap-2">
                  <Crown className="w-4 h-4" />
                  Return to Your Kingdom
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-card/80 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Claim Your Mogul Status
                  <Crown className="w-5 h-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.display_name}
                      onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payout Method *</Label>
                      <Select
                        value={formData.payout_method}
                        onValueChange={value => setFormData({ ...formData, payout_method: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="cashapp">Cash App</SelectItem>
                          <SelectItem value="venmo">Venmo</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payout_details">Payout Username/Email *</Label>
                      <Input
                        id="payout_details"
                        placeholder="@cashapptag or email"
                        value={formData.payout_details}
                        onChange={e => setFormData({ ...formData, payout_details: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="social">Main Social Platform (optional)</Label>
                      <Select
                        value={formData.social_platform}
                        onValueChange={value => setFormData({ ...formData, social_platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter/X</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="followers">Follower Count (optional)</Label>
                      <Input
                        id="followers"
                        placeholder="e.g., 5000"
                        value={formData.followers_count}
                        onChange={e => setFormData({ ...formData, followers_count: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full gap-2" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <Crown className="w-4 h-4" />
                      {isSubmitting ? 'Joining the Elite...' : 'Join the Mogul Movement'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      By applying, you agree to join our elite mogul network. Earn $1/signup for first 1,000 referrals, then $2/signup forever! 👑
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">When do I get paid?</h3>
                <p className="text-muted-foreground text-sm">
                  Payouts are processed weekly for all confirmed referrals. You'll need a minimum of $10 in earnings to request a payout.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">How are referrals tracked?</h3>
                <p className="text-muted-foreground text-sm">
                  When someone clicks your unique link, a cookie is stored for 30 days. If they sign up within that time, you get credit!
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Can I share on multiple platforms?</h3>
                <p className="text-muted-foreground text-sm">
                  Absolutely! Share your link on Instagram, TikTok, YouTube, your blog, or anywhere else. The more you share, the more you earn!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
