import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flame, Clock, Target, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingVariantB = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
                <Flame className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Wake Up Call</span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
                You're Not Broke. <br />
                <span className="gradient-gold-text">You're Just Uninformed.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                The average person will earn $2.7 million in their lifetime. 
                Drake made that last Tuesday. 
                <span className="text-foreground font-medium block mt-2">
                  What do they know that you don't?
                </span>
              </p>

              {/* Checklist */}
              <ul className="space-y-3 mb-8">
                {[
                  "See exactly how fast celebrities earn money",
                  "Compare your salary to the world's richest",
                  "Learn the mindset of billionaires daily",
                  "Get motivated to level up your income"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6 shadow-gold">
                  <Link to="/">
                    Show Me The Money
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                100% free • Takes 10 seconds • No BS
              </p>
            </div>

            {/* Visual/Stats Column */}
            <div className="relative">
              <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-gold-lg">
                <h3 className="font-serif text-xl font-bold mb-6 text-center">
                  Right Now, As You Read This...
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <p className="font-bold">Elon Musk</p>
                      <p className="text-sm text-muted-foreground">Just earned</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$45,000</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <p className="font-bold">Taylor Swift</p>
                      <p className="text-sm text-muted-foreground">Just earned</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$12,500</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                    <div>
                      <p className="font-bold">LeBron James</p>
                      <p className="text-sm text-muted-foreground">Just earned</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">$8,200</p>
                  </div>

                  <div className="text-center pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      ...in the time it took you to read this
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Gap Section */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
              The Gap Is <span className="gradient-gold-text">Insane</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Here's what you're really competing against
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold text-primary mb-2">3.7 seconds</p>
              <p className="text-muted-foreground">
                Time for Jeff Bezos to earn median US salary ($56K)
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold text-primary mb-2">$444/second</p>
              <p className="text-muted-foreground">
                What top hedge fund managers earn while sleeping
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border/50">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-4xl font-bold text-primary mb-2">1,000x</p>
              <p className="text-muted-foreground">
                More than minimum wage workers per hour
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How They Think Section */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-16">
              How Killers <span className="gradient-gold-text">Actually Think</span>
            </h2>

            <div className="space-y-8">
              {[
                {
                  quote: "I think it's possible for ordinary people to choose to be extraordinary.",
                  author: "Elon Musk",
                  context: "Built 4 billion-dollar companies"
                },
                {
                  quote: "The biggest risk is not taking any risk.",
                  author: "Mark Zuckerberg",
                  context: "Became billionaire at 23"
                },
                {
                  quote: "I never dreamed about success. I worked for it.",
                  author: "Estée Lauder",
                  context: "Built $100B beauty empire"
                }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-border/50">
                  <blockquote className="font-serif text-xl md:text-2xl mb-4">
                    "{item.quote}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{item.author}</p>
                    <p className="text-sm text-muted-foreground">{item.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Time to <span className="gradient-gold-text">Level Up</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Every second you wait, they're getting richer. Start understanding the game.
            </p>
            <Button asChild size="lg" className="text-lg px-10 py-6 shadow-gold">
              <Link to="/">
                Get My Reality Check
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Wealth Perspective. Knowledge is power.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingVariantB;
