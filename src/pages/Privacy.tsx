import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="prose prose-invert max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect minimal information necessary to provide our service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Email address (when you create an account)</li>
                  <li>Usage data (searches performed, pages visited)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Salary Information</h2>
                <p className="text-muted-foreground">
                  When you use our Reality Check calculator, the salary you enter is processed locally 
                  in your browser for comparison purposes only. We do not store, transmit, or collect 
                  your salary information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  We use collected information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Provide and maintain our service</li>
                  <li>Process payments for premium features</li>
                  <li>Track usage to enforce free tier limits</li>
                  <li>Improve our service based on usage patterns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information. 
                  Payment processing is handled securely by Stripe, and we do not store your payment 
                  card details.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
                <p className="text-muted-foreground">
                  We use third-party services including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Stripe for payment processing</li>
                  <li>AI services for data analysis</li>
                  <li>Analytics to understand usage patterns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
                <p className="text-muted-foreground">
                  We use essential cookies to maintain your session and preferences. These are necessary 
                  for the service to function properly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to access, correct, or delete your personal information. 
                  You can delete your account at any time, which will remove all associated data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:vandasdave@gmail.com" className="text-primary hover:underline">
                    vandasdave@gmail.com
                  </a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Privacy;
