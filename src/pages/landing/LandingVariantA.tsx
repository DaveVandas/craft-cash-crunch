import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Zap, DollarSign, ArrowRight, Star } from 'lucide-react';
import LandingShareButtons from '@/components/landing/LandingShareButtons';

const LandingVariantA = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10 text-center px-4 py-20">
          {/* Share Button - Top Right */}
          <div className="absolute top-6 right-6 z-20">
            <LandingShareButtons />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Think Like The 1%</span>
          </div>

          {/* Main headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Ever Wonder How <br />
            <span className="gradient-gold-text">The Rich Really Think?</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            While you're working 40 hours a week, Elon Musk just made what you'll earn in 10 lifetimes. 
            <span className="text-foreground font-medium"> Let that sink in.</span>
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">$1.2M</p>
              <p className="text-sm text-muted-foreground">Jeff Bezos earns per hour</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">$3.8B</p>
              <p className="text-sm text-muted-foreground">MrBeast's net worth at 26</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">42 sec</p>
              <p className="text-sm text-muted-foreground">For Rihanna to earn $1,000</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-gold">
              <Link to="/">
                See Your Reality Check
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/calculator">
                Compare Your Salary
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Free to start • No credit card required • Join 50,000+ users
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <p className="text-muted-foreground">Featured on:</p>
            <span className="text-xl font-bold">TechCrunch</span>
            <span className="text-xl font-bold">Forbes</span>
            <span className="text-xl font-bold">Business Insider</span>
            <span className="text-xl font-bold">The Hustle</span>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-4">
            Stop Dreaming. <span className="gradient-gold-text">Start Understanding.</span>
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Knowledge is the first step to building wealth. See exactly how the elite stack their chips.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Real-Time Earnings</h3>
              <p className="text-muted-foreground">
                Watch celebrities earn money in real-time. See your monthly salary tick by in seconds for billionaires.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Salary Comparisons</h3>
              <p className="text-muted-foreground">
                Enter your salary and see how long it takes famous people to earn what you make in a year. It's humbling. It's motivating.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">Wealth Wisdom</h3>
              <p className="text-muted-foreground">
                Daily quotes and mindset lessons from billionaires. Learn how they think differently about money, time, and success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-card/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-serif text-2xl md:text-3xl mb-6">
              "This app completely changed how I think about money and time. Seeing Kylie Jenner earn my rent in 4 minutes was the wake-up call I needed to start my side hustle."
            </blockquote>
            <p className="text-muted-foreground">
              — Marcus T., Entrepreneur
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Ready to See <span className="gradient-gold-text">The Truth?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              The game isn't rigged. You just don't know the rules yet.
            </p>
            <Button asChild size="lg" className="text-lg px-10 py-6 shadow-gold">
              <Link to="/">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
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

export default LandingVariantA;
