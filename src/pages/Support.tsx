import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageMeta from '@/components/seo/PageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Mail, LifeBuoy, ShieldCheck, FileText, Trash2 } from 'lucide-react';

const SUPPORT_EMAIL = 'wealthperspective@earningsexplorer.shop';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I create an account or sign in?',
    a: 'Tap Sign In and either use your email address and a password, or continue with Apple or Google. You can browse a limited number of searches without an account.',
  },
  {
    q: 'I forgot my password. What do I do?',
    a: 'On the Sign In screen, choose "Forgot password". We will email you a secure link to set a new password. If the email does not arrive within a few minutes, check your spam folder and then contact us.',
  },
  {
    q: 'How do I unlock full access?',
    a: 'Lifetime access is a one-time purchase. In the mobile app it is purchased through your device\u2019s in-app purchase system; on the web it is handled by our payment processor. Once purchased, full access is tied to your account.',
  },
  {
    q: 'I already paid on another device — how do I get my access back?',
    a: 'Your lifetime access is tied to your account, so simply signing in with the same email restores it anywhere. If you bought through the mobile app and it is not showing, open the account menu in the iOS or Android app and choose "Restore Purchases" to re-check your store purchase history. On the web, sign in with the same account and your access appears automatically — if it does not, email support.',
  },

  {
    q: 'Is Mogul Markets real trading?',
    a: 'No. Mogul Markets is a paper-trading simulation using virtual money for education and entertainment only. No real securities are bought or sold, and nothing in the app is financial advice.',
  },
  {
    q: 'Where do the earnings figures come from?',
    a: 'Estimates are compiled from publicly reported figures from leading wealth-tracking publications and public filings. They are estimates, not audited financials, and can change as new data is published.',
  },
  {
    q: 'How is my personal data handled?',
    a: 'We store only what is needed to run your account. Salary figures you enter in Reality Check are processed on your device and are never stored on our servers. See the Privacy Policy for full details.',
  },
  {
    q: 'How do I delete my account and data?',
    a: 'Open the Delete Account page from the link below (also available in the app under your account menu). Deletion is permanent and removes your profile and saved data.',
  },
  {
    q: 'The app is not loading data. What should I try?',
    a: 'Check your internet connection, then fully close and reopen the app. If the problem continues, email us with your device model and iOS version so we can investigate.',
  },
];

const Support = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="Support & Help Center"
        description="Get help with Wealth Perspective: account and sign-in issues, purchases and restores, data questions, privacy, and how to contact our support team."
        path="/support"
      />
      <Header />

      <main className="flex-1 container py-8 md:py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/30">
            <LifeBuoy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Support <span className="gradient-gold-text">Center</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Questions, account help, purchases and privacy — all in one place.
            </p>
          </div>
        </div>

        <Card className="mb-6 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact our support team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Email us any time and a real person will reply, typically within 1–2 business days.
              Please include your account email, your device model, and a short description of the
              issue.
            </p>
            <p className="font-medium text-foreground break-all">{SUPPORT_EMAIL}</p>
            <Button asChild className="w-full sm:w-auto">
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Wealth%20Perspective%20Support`}>
                Email Support
              </a>
            </Button>
            <p className="text-xs">
              Wealth Perspective is published by Northspan Industries, LLC.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={faq.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button asChild variant="outline" className="justify-start">
            <Link to="/privacy">
              <ShieldCheck className="h-4 w-4 mr-2" /> Privacy Policy
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link to="/terms">
              <FileText className="h-4 w-4 mr-2" /> Terms of Service
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link to="/delete-account">
              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/70">
          Mogul Markets is a paper-trading simulation for education and entertainment. Wealth
          figures are estimates compiled from public sources and are not financial advice.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
