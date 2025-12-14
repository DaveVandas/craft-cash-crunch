import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              About <span className="gradient-gold-text">Wealth Perspective</span>
            </h1>
            <p className="text-muted-foreground">
              Making wealth tangible, one mind-blowing comparison at a time.
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 mb-8">
            <CardHeader>
              <CardTitle>What We Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Wealth Perspective helps you understand just how much the world's wealthiest individuals earn 
                by putting their income into relatable, tangible comparisons.
              </p>
              <p>
                Ever wondered how long it takes a billionaire to earn your yearly salary? Or how many houses 
                they could buy per hour? We answer those questions in entertaining and eye-opening ways.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 mb-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use AI to gather and analyze publicly available information about celebrities, 
                athletes, entrepreneurs, and other public figures to estimate their annual earnings.
              </p>
              <p>
                Our calculations factor in various income sources including salaries, endorsements, 
                business ventures, and investment returns where publicly known.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="accuracy">
                  <AccordionTrigger>How accurate is the data?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our earnings estimates are based on publicly available information and AI analysis. 
                    While we strive for accuracy, actual wealth and earnings can be difficult to calculate 
                    due to complex financial structures, private investments, and undisclosed assets. 
                    Our figures should be considered estimates for entertainment purposes.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="sources">
                  <AccordionTrigger>Where does the data come from?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We aggregate information from various public sources including news reports, 
                    financial filings, Forbes lists, and other publicly available data. Our AI 
                    processes this information to generate earnings estimates.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="update">
                  <AccordionTrigger>How often is data updated?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Our AI pulls from current public information, so estimates reflect the most 
                    recently available data. However, real-time wealth changes (like stock fluctuations) 
                    may not be immediately reflected.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="purpose">
                  <AccordionTrigger>What's the purpose of this app?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Wealth Perspective is designed for entertainment and perspective. We aim to make 
                    abstract wealth figures more tangible and relatable through creative comparisons, 
                    helping people understand the scale of extreme wealth in a fun, engaging way.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
