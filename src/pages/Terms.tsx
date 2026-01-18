import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="prose prose-invert max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using Wealth Perspective, you accept and agree to be bound by these 
                  Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  Wealth Perspective provides earnings and wealth comparisons sourced from Forbes, Bloomberg, 
                  and other leading financial publications. The information is intended for entertainment and 
                  educational purposes and should not be considered financial advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Disclaimer of Accuracy</h2>
                <p className="text-muted-foreground">
                  All earnings and net worth figures are estimates based on published wealth rankings and 
                  financial reports from sources including Forbes, Bloomberg, and SEC filings. We do not 
                  guarantee the accuracy of any figures. Actual wealth may differ significantly due to 
                  private holdings, complex financial structures, and undisclosed assets.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Payments & Refund Policy</h2>
                <p className="text-muted-foreground mb-3">
                  Wealth Perspective offers a one-time lifetime access purchase for $6.99. Before purchasing, 
                  all users receive <strong className="text-foreground">3 free searches</strong> to explore the service and determine if it 
                  meets their needs.
                </p>
                <p className="text-muted-foreground mb-3">
                  <strong className="text-foreground">All sales are final.</strong> Due to the digital nature of this product and the 
                  immediate access granted upon purchase, we do not offer refunds, returns, or exchanges. 
                  By completing your purchase, you acknowledge that you have had the opportunity to try the 
                  service with free searches and agree to this no-refund policy.
                </p>
                <p className="text-muted-foreground">
                  If you experience technical issues preventing access to paid features, please contact us 
                  and we will work to resolve the issue.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Use of Service</h2>
                <p className="text-muted-foreground">
                  You agree to use Wealth Perspective only for lawful purposes and in accordance with 
                  these Terms. You agree not to misrepresent information from this service as verified 
                  financial data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The service, including its design, features, and content, is owned by Wealth Perspective 
                  and is protected by applicable intellectual property laws. You may share generated 
                  comparison cards for personal, non-commercial use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Wealth Perspective shall not be liable for any damages arising from the use or inability 
                  to use our service, or from any information provided through the service. This includes 
                  but is not limited to direct, indirect, incidental, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Continued use of the service 
                  after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us through our website.
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

export default Terms;
