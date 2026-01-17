import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Crown,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react';
import LandingShareButtons from '@/components/landing/LandingShareButtons';

interface AffiliateInfo {
  id: string;
  display_name: string;
  affiliate_code: string;
}

const AFFILIATE_CODE_KEY = 'wp_affiliate_referral_code';

const AffiliateReferral = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<AffiliateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const fetchAffiliate = async () => {
      if (!code) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('affiliates')
          .select('id, display_name, affiliate_code')
          .eq('affiliate_code', code.toUpperCase())
          .eq('status', 'approved')
          .single();

        if (fetchError || !data) {
          setError(true);
        } else {
          setAffiliate(data);
          // Store the affiliate code for attribution after signup
          localStorage.setItem(AFFILIATE_CODE_KEY, data.affiliate_code);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliate();
  }, [code]);

  const handleGetStarted = () => {
    // Navigate to auth with referral context
    navigate('/auth?ref=' + (affiliate?.affiliate_code || ''));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !affiliate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4">Invalid Referral Link</h1>
          <p className="text-muted-foreground mb-8">
            This referral link is invalid or has expired.
          </p>
          <Button asChild>
            <Link to="/">
              Go to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        <div className="container relative z-10 text-center px-4 py-20">
          {/* Share Button - Top Right */}
          <div className="absolute top-6 right-6 z-20">
            <LandingShareButtons 
              shareText={`🔥 ${affiliate.display_name} invited you to check out this app that shows how fast billionaires make money!`}
              shareUrl={`https://earningsexplorer.shop/ref/${affiliate.affiliate_code}`}
            />
          </div>

          {/* Referral Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Invited by <span className="font-bold">{affiliate.display_name}</span>
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            See How Fast <br />
            <span className="gradient-gold-text">Billionaires Make Money</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Your friend {affiliate.display_name} thinks you'll love this.
            <span className="text-foreground font-medium block mt-2">
              And honestly? They're probably right.
            </span>
          </p>

          {/* Quick Value Props */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Free to explore
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Mind-blowing stats
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Daily wealth insights
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="text-lg px-8 py-6 shadow-gold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/">
                Explore First
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Join 50,000+ users seeing wealth differently
          </p>
        </div>
      </section>

      {/* What You'll Discover */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-4">
            What You'll <span className="gradient-gold-text">Discover</span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            The app that makes wealth tangible
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <TrendingUp className="h-7 w-7" />,
                title: "Live Earnings",
                desc: "Watch celebrities earn money in real-time. Per second. Per minute. It's wild."
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: "Reality Check",
                desc: "See how fast celebs earn your entire salary. Prepare to be humbled."
              },
              {
                icon: <Crown className="h-7 w-7" />,
                title: "Wealth Quiz",
                desc: "Test your knowledge with gamified quizzes. Win bragging rights."
              },
              {
                icon: <Sparkles className="h-7 w-7" />,
                title: "Daily Wisdom",
                desc: "Mindset lessons from billionaires. Think like the 1%."
              }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-border/50">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">50,000+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="w-px h-12 bg-border/50 hidden md:block" />
            <div>
              <p className="text-3xl font-bold text-primary">2M+</p>
              <p className="text-sm text-muted-foreground">Comparisons Made</p>
            </div>
            <div className="w-px h-12 bg-border/50 hidden md:block" />
            <div>
              <p className="text-3xl font-bold text-primary">4.8★</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shocking Stats */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-16">
              Mind-Blowing <span className="gradient-gold-text">Examples</span>
            </h2>

            <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden shadow-gold-lg">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <p className="font-bold">Elon Musk</p>
                      <p className="text-sm text-muted-foreground">Per hour</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$1,200,000</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <p className="font-bold">Taylor Swift</p>
                      <p className="text-sm text-muted-foreground">Per concert</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$13,000,000</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <p className="font-bold">Jeff Bezos</p>
                      <p className="text-sm text-muted-foreground">Per minute</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$142,000</p>
                  </div>

                  <div className="text-center pt-4 border-t border-border/50">
                    <p className="text-muted-foreground">
                      Ready to see how you compare?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                {affiliate.display_name} is waiting for you!
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Ready to See <span className="gradient-gold-text">The Truth?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join your friend and 50,000+ others seeing wealth in perspective.
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="text-lg px-10 py-6 shadow-gold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Wealth Perspective. See money differently.</p>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateReferral;

// Export the storage key for use in Auth page
export { AFFILIATE_CODE_KEY };
