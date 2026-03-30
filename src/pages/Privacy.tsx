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
              Last updated: March 2026
            </p>
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="prose prose-invert max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground">
                  Wealth Perspective, owned and operated by Northspan Industries, LLC, collects minimal 
                  information necessary to provide our service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Email address (when you create an account)</li>
                  <li>Display name and avatar (optional, if you set up a profile)</li>
                  <li>Usage data (searches performed, pages visited, features used)</li>
                  <li>Payment information (processed securely through Stripe — we never store card details)</li>
                  <li>Device information (browser type, operating system, screen size for responsive design)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Salary Information</h2>
                <p className="text-muted-foreground">
                  When you use our Reality Check calculator, the salary you enter is processed locally 
                  in your browser for comparison purposes only. <strong className="text-foreground">We do not store, transmit, or collect 
                  your salary information.</strong> It never leaves your device.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Paper Trading Data</h2>
                <p className="text-muted-foreground">
                  Mogul Markets is a paper trading simulation using virtual currency. Your simulated 
                  trading portfolio, order history, and positions are stored in our database to maintain 
                  your experience across sessions. This data involves no real financial transactions 
                  and has no monetary value.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. How We Use Your Information</h2>
                <p className="text-muted-foreground">We use collected information to:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Provide, maintain, and improve our service</li>
                  <li>Process payments for premium features</li>
                  <li>Track usage to enforce free tier limits</li>
                  <li>Send in-app notifications about your account activity</li>
                  <li>Detect and prevent abuse, fraud, and unauthorized access</li>
                  <li>Analyze usage patterns to improve the user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures including encrypted data transmission (TLS/SSL), 
                  secure authentication, and Row-Level Security policies to ensure your data is only accessible 
                  by you. Payment processing is handled securely by Stripe, and we never store your payment 
                  card details on our servers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Third-Party Services</h2>
                <p className="text-muted-foreground">We use third-party services including:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Stripe for secure payment processing</li>
                  <li>AI services for celebrity data analysis and content generation</li>
                  <li>Financial data APIs for stock price information (delayed, not real-time)</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  These services have their own privacy policies. We only share the minimum data 
                  necessary for them to function.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies & Local Storage</h2>
                <p className="text-muted-foreground">
                  We use essential cookies and browser local storage to maintain your session, 
                  preferences (like theme and sound settings), and authentication state. These are 
                  necessary for the service to function properly. We do not use third-party advertising 
                  or tracking cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your data for as long as your account is active. Guest session data 
                  (for non-registered users) is automatically deleted after 7 days of inactivity. 
                  When you delete your account, all associated personal data is permanently removed 
                  from our systems.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Your Rights</h2>
                <p className="text-muted-foreground">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information in your profile</li>
                  <li>Delete your account and all associated data at any time</li>
                  <li>Export your data upon request</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  You can delete your account from the user menu in the app header. Account deletion 
                  is immediate and permanent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Wealth Perspective is not directed at children under 13. We do not knowingly collect 
                  personal information from children. If we become aware that a child under 13 has 
                  provided personal information, we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of material 
                  changes by posting the updated policy on this page with a revised date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or wish to exercise your data rights, 
                  please contact us at{' '}
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
