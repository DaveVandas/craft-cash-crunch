import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone,
  Share2,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';
import LandingShareButtons from '@/components/landing/LandingShareButtons';

const LandingVariantD = () => {
  // Calculate example earnings
  const tier1Signups = 1000;
  const tier2Signups = 19000;
  const totalEarnings = (tier1Signups * 1) + (tier2Signups * 2); // $39,000

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        <div className="container relative z-10 text-center px-4 py-20">
          {/* Share Button - Top Right */}
          <div className="absolute top-6 right-6 z-20">
            <LandingShareButtons 
              shareText="💰 I found an app that shows how fast billionaires make money AND pays you to share it! Check it out 👇"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8 animate-pulse">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-orange-500 font-medium">Get Paid To Share</span>
          </div>

          {/* Main headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            One TikTok Could <br />
            <span className="gradient-gold-text">Pay You $39,000</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
            While you're watching billionaires make money...
            <span className="text-foreground font-medium block mt-2">
              Why not get paid to share it?
            </span>
          </p>

          {/* Quick Value Props */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Free to join
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Instant commissions
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              No limit on earnings
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-gold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
              <Link to="/become-affiliate">
                <DollarSign className="mr-2 h-5 w-5" />
                Start Earning Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/">
                <Sparkles className="mr-2 h-5 w-5" />
                Explore The App First
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Already 50,000+ users • $1-2 per signup you bring
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-4">
            How It <span className="gradient-gold-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Three simple steps to start earning
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">1</div>
              <h3 className="font-serif text-xl font-bold mb-3">Sign Up Free</h3>
              <p className="text-muted-foreground">
                Get your unique affiliate link in seconds. No approval wait.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <h3 className="font-serif text-xl font-bold mb-3">Share Everywhere</h3>
              <p className="text-muted-foreground">
                Post on TikTok, Instagram, Twitter, or send to friends directly.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">3</div>
              <h3 className="font-serif text-xl font-bold mb-3">Get Paid</h3>
              <p className="text-muted-foreground">
                Earn $1-2 for every person who signs up through your link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator Visual */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-16">
              The <span className="gradient-gold-text">Math</span> Is Simple
            </h2>

            <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden shadow-gold-lg">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-6">
                      If your video goes viral...
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 rounded-xl bg-background/50">
                        <span>First 1,000 signups</span>
                        <span className="font-bold text-primary">$1,000</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-background/50">
                        <span>Next 19,000 signups</span>
                        <span className="font-bold text-primary">$38,000</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-primary/10 border border-primary/30">
                        <span className="font-bold">Total from ONE video</span>
                        <span className="font-bold text-2xl gradient-gold-text">${totalEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 mb-4">
                      <Crown className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Average viral TikTok gets 500K-2M views. <br />
                      <span className="text-foreground font-medium">Even 1% converting = life-changing money.</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Is The App */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-4">
            What You'll Be <span className="gradient-gold-text">Sharing</span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            An app that's genuinely mind-blowing — makes it easy to share
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <TrendingUp className="h-7 w-7" />,
                title: "Live Earnings Ticker",
                desc: "Watch billionaires make money in real-time. It's hypnotizing."
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: "Reality Check Tool",
                desc: "See how fast celebs earn your entire salary. Prepare to be shook."
              },
              {
                icon: <Smartphone className="h-7 w-7" />,
                title: "Wealth Quiz",
                desc: "Test your knowledge with gamified quizzes. Addictively fun."
              },
              {
                icon: <Sparkles className="h-7 w-7" />,
                title: "Daily Wisdom",
                desc: "Mindset lessons from billionaires. Actual value, not fluff."
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

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                Try The App Yourself
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
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
              <p className="text-3xl font-bold text-primary">$1-$2</p>
              <p className="text-sm text-muted-foreground">Per Signup</p>
            </div>
            <div className="w-px h-12 bg-border/50 hidden md:block" />
            <div>
              <p className="text-3xl font-bold text-primary">Instant</p>
              <p className="text-sm text-muted-foreground">Commission Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">Free Forever • No Hidden Fees</span>
            </div>

            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Ready to <span className="gradient-gold-text">Cash In?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands making money by sharing an app people actually love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-10 py-6 shadow-gold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
                <Link to="/become-affiliate">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Become an Affiliate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <LandingShareButtons 
                shareText="💰 Found an app that pays you to share it! Earn $1-2 per signup. Check it out 👇"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Wealth Perspective. Share wealth, earn wealth.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingVariantD;
