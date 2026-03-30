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
              Last updated: March 2026
            </p>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="prose prose-invert max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using Wealth Perspective, owned and operated by Northspan Industries, LLC, 
                  you accept and agree to be bound by these Terms of Service. If you do not agree to these 
                  terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  Wealth Perspective provides earnings and wealth comparisons sourced from Forbes, Bloomberg, 
                  and other leading financial publications. The information is intended for entertainment and 
                  educational purposes only and should not be considered financial advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Paper Trading Simulation</h2>
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">Mogul Markets is an educational paper trading simulation.</strong> By 
                  using Mogul Markets, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>All trading is done with virtual currency that has no real-world monetary value</li>
                  <li>No actual securities are purchased, sold, or held on your behalf</li>
                  <li>Stock prices shown may be delayed and should not be used for real trading decisions</li>
                  <li>VIP Portfolio data is based on public SEC filings and may not reflect current holdings</li>
                  <li>Simulated results do not guarantee or indicate future real-world performance</li>
                  <li>This is not a brokerage, investment advisory, or financial planning service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Disclaimer of Accuracy</h2>
                <p className="text-muted-foreground">
                  All earnings and net worth figures are estimates based on published wealth rankings and 
                  financial reports from sources including Forbes, Bloomberg, and SEC filings. We do not 
                  guarantee the accuracy of any figures. Actual wealth may differ significantly due to 
                  private holdings, complex financial structures, and undisclosed assets. Users should not 
                  rely on this information for any financial decision-making.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Payments & Refund Policy</h2>
                <p className="text-muted-foreground mb-3">
                  Wealth Perspective offers a one-time lifetime access purchase. Before purchasing, 
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
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Account & Deletion</h2>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the security of your account credentials. You may 
                  delete your account at any time from the user menu, which will permanently remove all 
                  your personal data, trading history, and preferences. Account deletion is immediate 
                  and irreversible. Purchases are non-refundable even after account deletion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Use of Service</h2>
                <p className="text-muted-foreground">You agree to:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Use Wealth Perspective only for lawful purposes</li>
                  <li>Not misrepresent information from this service as verified financial data</li>
                  <li>Not attempt to circumvent usage limits or access restrictions</li>
                  <li>Not scrape, automate, or programmatically access the service without permission</li>
                  <li>Not use the service to harass, defame, or infringe on anyone's rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The service, including its design, features, and content, is owned by Northspan Industries, LLC 
                  and is protected by applicable intellectual property laws. You may share generated 
                  comparison cards for personal, non-commercial use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Wealth Perspective and Northspan Industries, LLC shall not be liable for any damages arising 
                  from the use or inability to use our service, or from any information provided through the 
                  service. This includes but is not limited to direct, indirect, incidental, or consequential 
                  damages. In no event shall our total liability exceed the amount you paid for the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless Northspan Industries, LLC and its officers, 
                  directors, and employees from any claims, losses, or damages arising from your use of 
                  the service or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  United States, without regard to conflicts of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Material changes will be 
                  communicated through the app. Continued use of the service after changes constitutes 
                  acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at{' '}
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

export default Terms;
