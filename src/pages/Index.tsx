import { useEffect, useLayoutEffect } from 'react';
import Header from '@/components/layout/Header';
import PageMeta from '@/components/seo/PageMeta';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import SearchBarWithAutocomplete from '@/components/home/SearchBarWithAutocomplete';
import QuickActions from '@/components/home/QuickActions';
import TrendingSearches from '@/components/home/TrendingSearches';
import CompactCategories from '@/components/home/CompactCategories';
import DailyWealthFact from '@/components/home/DailyWealthFact';
import WealthWisdomPromo from '@/components/home/WealthWisdomPromo';
import RichHabits from '@/components/home/RichHabits';
import ExitIntentPopup from '@/components/effects/ExitIntentPopup';
import SocialProofNotifications from '@/components/engagement/SocialProofNotifications';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import SideHustlePreview from '@/components/home/SideHustlePreview';
import MogulMarketsPreview from '@/components/home/MogulMarketsPreview';
import HeroSpotlight from '@/components/home/HeroSpotlight';
import { DownloadAppSection } from '@/components/home/DownloadAppSection';
import { useAffiliateAttribution } from '@/hooks/useAffiliateAttribution';

const Index = () => {
  // Track affiliate referral from ?ref=CODE query param
  useAffiliateAttribution();
  // Scroll to top immediately on any navigation to this page (including back)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Also handle popstate (back/forward button) which may not trigger remount
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="See Wealth in Perspective"
        description="Master the game of money. Explore celebrity wealth, build side income, and trade like a mogul with our wealth comparison tools."
        image="/og-image.png"
        path="/"
      />
      <Header />
      <OnboardingTour />
      <ExitIntentPopup />
      <SocialProofNotifications />

      <main className="flex-1 animate-fade-in pb-20 md:pb-0">
        {/* Hero Section - Premium Split Layout */}
        <section className="relative py-8 md:py-12 overflow-hidden">
          {/* Subtle background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left side - Title, subtitle, search */}
              <div className="animate-fade-in space-y-6">
                <div className="space-y-3">
                  <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    See Wealth in{' '}
                    <span className="gradient-gold-text relative">
                      Perspective
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                        <path d="M0,6 Q50,0 100,6 T200,6" stroke="currentColor" strokeWidth="3" fill="none" />
                      </svg>
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                    Master the game of money. Explore wealth, build side income, and trade like a{' '}
                    <span className="gradient-gold-text font-semibold">mogul</span>.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <SearchBarWithAutocomplete />
                  <DailyWealthFact />
                </div>
              </div>

              {/* Right side - Featured Mogul Spotlight */}
              <div className="animate-fade-in lg:animate-slide-in-right" data-tour="celebrity-spotlight">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-lg">👑</span>
                  </div>
                  <h2 className="font-serif text-lg font-bold">
                    Today's <span className="gradient-gold-text">Mogul</span>
                  </h2>
                </div>
                <HeroSpotlight />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="container mb-8">
          <TrendingSearches />
        </section>

        {/* Browse Categories */}
        <section className="container mb-10">
          <SectionHeader icon="📂" title="Browse by" highlight="Category" />
          <CompactCategories />
        </section>

        {/* Featured Tools - Side Hustle & Mogul Markets */}
        <section className="container mb-10">
          <SectionHeader icon="⚡" title="Featured" highlight="Tools" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MogulMarketsPreview />
            <SideHustlePreview />
          </div>
        </section>

        {/* Other Mogul Tools */}
        <section className="container mb-10">
          <SectionHeader icon="🛠️" title="More Mogul" highlight="Tools" />
          <QuickActions />
        </section>

        {/* Rich Habits Quote */}
        <section className="container mb-10">
          <RichHabits />
        </section>

        {/* Download App Section */}
        <section className="container mb-10">
          <DownloadAppSection />
        </section>

        {/* Wealth Wisdom Promo */}
        <section className="container pb-16">
          <WealthWisdomPromo />
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

// Reusable polished section header component
function SectionHeader({ icon, title, highlight }: { icon: string; title: string; highlight: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-sm">
        <span className="text-lg">{icon}</span>
      </div>
      <h2 className="font-serif text-xl font-bold">
        {title} <span className="gradient-gold-text">{highlight}</span>
      </h2>
    </div>
  );
}

export default Index;
