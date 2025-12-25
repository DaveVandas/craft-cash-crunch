import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Rocket, Eye, Lightbulb, Users, ArrowRight, Play } from 'lucide-react';

const LandingVariantC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container relative z-10 text-center px-4 py-20">
          {/* Eyebrow */}
          <p className="text-primary font-medium mb-4 tracking-wide">
            50,000+ PEOPLE ALREADY GET IT
          </p>

          {/* Main headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Your Salary in <br />
            <span className="gradient-gold-text">42 Seconds</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
            That's how long it takes Rihanna to earn what you make in a month.
          </p>
          <p className="text-lg text-foreground font-medium max-w-2xl mx-auto mb-10">
            Not to make you feel bad. To make you think different.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg px-10 py-6 shadow-gold">
              <Link to="/calculator">
                <Play className="mr-2 h-5 w-5" />
                Enter Your Salary
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/">
                Explore Celebrities
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> 2M+ comparisons made
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" /> 50K+ users
            </span>
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> Daily insights
            </span>
          </div>
        </div>
      </section>

      {/* The Simple Truth */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8">
              Here's The Simple Truth
            </h2>
            
            <div className="text-lg md:text-xl text-muted-foreground space-y-6 mb-12">
              <p>
                Most people work their whole lives without ever understanding how money <span className="text-foreground">really</span> works at the top.
              </p>
              <p>
                We're not here to make you jealous. We're here to show you what's possible when you think bigger.
              </p>
              <p className="text-foreground font-medium">
                Because you can't become something you can't even imagine.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <p className="text-4xl font-bold text-primary mb-2">$142,000</p>
                <p className="text-muted-foreground">Average lifetime savings in America</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <p className="text-4xl font-bold text-primary mb-2">$142,000</p>
                <p className="text-muted-foreground">What Cristiano Ronaldo earns in 8 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Discover */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-16">
            What You'll <span className="gradient-gold-text">Discover</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Eye className="h-8 w-8" />,
                title: "Real-Time Wealth",
                desc: "Watch billionaires earn money live. It'll blow your mind."
              },
              {
                icon: <Rocket className="h-8 w-8" />,
                title: "Your Reality Check",
                desc: "Compare your income to anyone. Prepare to be motivated."
              },
              {
                icon: <Lightbulb className="h-8 w-8" />,
                title: "Daily Wisdom",
                desc: "Quotes and lessons from the minds that built empires."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Perspective",
                desc: "See wealth in ways that change how you think about money."
              }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border/50 text-center hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mindset Section */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8">
              It's Not About <span className="gradient-gold-text">The Money</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              It's about understanding that the rules you've been taught might not be the rules the winners play by.
            </p>

            <div className="bg-card rounded-2xl border border-primary/20 p-8 md:p-12 shadow-gold">
              <p className="font-serif text-2xl md:text-3xl mb-6">
                "The difference between ordinary and extraordinary is just that little <span className="text-primary">extra</span>."
              </p>
              <p className="text-muted-foreground">
                — Jimmy Johnson
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-primary/5 to-transparent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Start Thinking <span className="gradient-gold-text">Bigger</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              It takes 10 seconds. It might change your perspective forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-10 py-6 shadow-gold">
                <Link to="/">
                  Explore Wealth Perspective
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free forever • No signup required to start
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Wealth Perspective. Think bigger. Earn bigger.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingVariantC;
