import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { SoundProvider } from "@/contexts/SoundContext";
import { FeaturedCelebrityProvider } from "@/contexts/FeaturedCelebrityContext";
import ProfileSetupGuard from "@/components/onboarding/ProfileSetupGuard";
import UpdateNotification from "@/components/pwa/UpdateNotification";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { PaperTradingDisclaimerSplash } from "@/components/disclaimer/PaperTradingDisclaimerSplash";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Calculator from "./pages/Calculator";
import Compare from "./pages/Compare";
import Search from "./pages/Search";
import Share from "./pages/Share";
import Category from "./pages/Category";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Quiz from "./pages/Quiz";
import Referral from "./pages/Referral";
import SideHustle from "./pages/SideHustle";
import WealthWisdom from "./pages/WealthWisdom";
import Trades from "./pages/Trades";
import MogulMarkets from "./pages/MogulMarkets";
import MogulAcademy from "./pages/MogulAcademy";
import DebtDestroyer from "./pages/DebtDestroyer";
import CelebrityPortfolios from "./pages/CelebrityPortfolios";
import LandingVariantA from "./pages/landing/LandingVariantA";
import LandingVariantB from "./pages/landing/LandingVariantB";
import LandingVariantC from "./pages/landing/LandingVariantC";
import LandingVariantD from "./pages/landing/LandingVariantD";
import BetaInvite from "./pages/BetaInvite";
import BecomeAffiliate from "./pages/BecomeAffiliate";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import AffiliateReferral from "./pages/AffiliateReferral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <SoundProvider>
            <FeaturedCelebrityProvider>
              <ProfileSetupGuard>
                <Toaster />
                <Sonner />
                <UpdateNotification />
                <InstallPrompt />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/category/:id" element={<Category />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/share" element={<Share />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/referral" element={<Referral />} />
                    <Route path="/side-hustle" element={<SideHustle />} />
                    <Route path="/wealth-wisdom" element={<WealthWisdom />} />
                    <Route path="/trades" element={<Trades />} />
                    <Route path="/mogul-markets" element={<MogulMarkets />} />
                    <Route path="/mogul-academy" element={<MogulAcademy />} />
                    <Route path="/debt-destroyer" element={<DebtDestroyer />} />
                    <Route path="/celebrity-portfolios" element={<CelebrityPortfolios />} />
                    <Route path="/landing/a" element={<LandingVariantA />} />
                    <Route path="/landing/b" element={<LandingVariantB />} />
                    <Route path="/landing/c" element={<LandingVariantC />} />
                    <Route path="/landing/d" element={<LandingVariantD />} />
                    <Route path="/beta" element={<BetaInvite />} />
                    <Route path="/become-affiliate" element={<BecomeAffiliate />} />
                    <Route path="/affiliate-dashboard" element={<AffiliateDashboard />} />
                    <Route path="/ref/:code" element={<AffiliateReferral />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ProfileSetupGuard>
            </FeaturedCelebrityProvider>
          </SoundProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
