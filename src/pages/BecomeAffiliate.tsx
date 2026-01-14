import { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export default function BecomeAffiliate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
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
      title: 'Earn $1 Per Signup',
      description: 'Get paid for every new user who signs up through your unique link.',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your personalized link on social media, blogs, or with friends.',
    },
    {
      icon: Users,
      title: 'No Limit',
      description: 'There\'s no cap on how many referrals you can make. The more you share, the more you earn!',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your referrals and earnings in real-time from your dashboard.',
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
    { step: 3, title: 'Share', description: 'Share your unique link with your audience' },
    { step: 4, title: 'Earn', description: 'Get $1 for every new signup!' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Affiliate Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Turn Your Influence Into{' '}
            <span className="text-primary">Mogul Cash</span> 💰
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn money by sharing Wealth Perspective with your friends, followers, and community. 
            It's simple: share your link, they sign up, you get paid!
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
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
          <h2 className="text-2xl font-bold text-center mb-8">Why Become an Affiliate?</h2>
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
            <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Application Submitted! 🎉</h2>
                <p className="text-muted-foreground mb-4">
                  We've received your affiliate application. Our team will review it and 
                  you'll receive an email once approved. This usually takes less than 24 hours.
                </p>
                <Button onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-center">Apply to Become an Affiliate</CardTitle>
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
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      By applying, you agree to our affiliate terms. Standard commission rate is $1 per signup.
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
