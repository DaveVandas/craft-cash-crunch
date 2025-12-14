import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SalaryInput from '@/components/calculator/SalaryInput';
import RealityCheckResult from '@/components/calculator/RealityCheckResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const celebrities = [
  { name: 'Elon Musk', earnings: 23500000000, emoji: '🚀' },
  { name: 'LeBron James', earnings: 119500000, emoji: '🏀' },
  { name: 'Taylor Swift', earnings: 185000000, emoji: '🎤' },
  { name: 'Cristiano Ronaldo', earnings: 260000000, emoji: '⚽' },
  { name: 'Beyoncé', earnings: 115000000, emoji: '👑' },
  { name: 'Jeff Bezos', earnings: 8500000000, emoji: '📦' },
];

const Calculator = () => {
  const [salary, setSalary] = useState(0);
  const [selectedCeleb, setSelectedCeleb] = useState(celebrities[0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Reality <span className="gradient-gold-text">Check</span> 💭
            </h1>
            <p className="text-muted-foreground">
              Prepare to have your mind blown. Enter your salary and see how it compares.
            </p>
          </div>

          <div className="space-y-6">
            <SalaryInput onSalaryChange={setSalary} currentSalary={salary} />

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Compare with</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {celebrities.map((celeb) => (
                    <Button
                      key={celeb.name}
                      variant={selectedCeleb.name === celeb.name ? "default" : "outline"}
                      className="h-auto py-3 flex-col"
                      onClick={() => setSelectedCeleb(celeb)}
                    >
                      <span className="text-xl mb-1">{celeb.emoji}</span>
                      <span className="text-xs">{celeb.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <RealityCheckResult
              userSalary={salary}
              celebrityName={selectedCeleb.name}
              celebrityAnnualEarnings={selectedCeleb.earnings}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
