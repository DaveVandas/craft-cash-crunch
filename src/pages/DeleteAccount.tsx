import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeleteAccountDialog } from '@/components/account/DeleteAccountDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2, Shield, AlertTriangle, User, LogIn } from 'lucide-react';

const DeleteAccount = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Delete Your Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Request permanent deletion of your Wealth Perspective account and associated data.
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 mb-6">
            <CardContent className="p-6 space-y-6">
              {/* Immediate action for logged-in users */}
              {user ? (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <h2 className="font-semibold">Permanently Delete Your Account</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    You are currently signed in as <strong className="text-foreground">{user.email}</strong>. 
                    Click the button below to permanently delete your account and all associated data.
                  </p>
                  <DeleteAccountDialog />
                </div>
              ) : (
                <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <LogIn className="h-5 w-5" />
                    <h2 className="font-semibold">Sign In Required</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    To delete your account, please sign in first. Once signed in, visit your 
                    account settings and select <strong>Delete Account</strong>.
                  </p>
                  <Button asChild variant="default" className="gap-2">
                    <Link to="/auth">
                      <User className="h-4 w-4" />
                      Sign In to Delete Account
                    </Link>
                  </Button>
                </div>
              )}

              {/* What gets deleted */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-muted-foreground" />
                  What Data Is Deleted
                </h2>
                <p className="text-muted-foreground text-sm mb-2">
                  When you delete your account, the following data is permanently removed:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                  <li>Your profile information (display name, avatar, preferences)</li>
                  <li>Trading portfolio and all paper trading history</li>
                  <li>Favorited celebrities and saved searches</li>
                  <li>Quiz scores, achievements, and streak data</li>
                  <li>Payment and subscription access records</li>
                  <li>Affiliate referral links and earnings data</li>
                  <li>Notification preferences and message history</li>
                </ul>
              </section>

              {/* Data retention */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Data Retention
                </h2>
                <p className="text-muted-foreground text-sm">
                  For legal and financial compliance, we retain anonymized transaction records 
                  for a maximum of <strong className="text-foreground">7 years</strong>. These records 
                  cannot be linked back to you personally. All other personal data is deleted immediately 
                  upon account deletion.
                </p>
              </section>

              {/* Contact support */}
              <section className="bg-muted/30 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-foreground mb-2">Need Help?</h2>
                <p className="text-muted-foreground text-sm">
                  If you experience issues deleting your account, contact us at{' '}
                  <a 
                    href="mailto:hello@wealthperspective.app" 
                    className="text-primary hover:underline"
                  >
                    hello@wealthperspective.app
                  </a>
                  . We will process your deletion request within 30 days.
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

export default DeleteAccount;
