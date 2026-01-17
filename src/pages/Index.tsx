import { useEffect, useLayoutEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
      <Header />
      <OnboardingTour />
      <ExitIntentPopup />
      <SocialProofNotifications />

      <main className="flex-1 animate-fade-in">
        {/* Hero Section - Split Layout */}
        <section className="relative py-6 md:py-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* Left side - Title, subtitle, search */}
              <div className="animate-fade-in">
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-left">
                  See Wealth in <span className="gradient-gold-text">Perspective</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mb-5 text-left max-w-lg">
                  Master the game of money. Explore wealth, build side income, and trade like a <span className="gradient-gold-text font-semibold">mogul</span>.
                </p>
                
                <div className="space-y-2">
                  <SearchBarWithAutocomplete />
                  <DailyWealthFact />
                </div>
              </div>

              {/* Right side - Featured Mogul Spotlight */}
              <div className="animate-fade-in lg:animate-slide-in-right" data-tour="celebrity-spotlight">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">👑</span>
                  <h2 className="font-serif text-base font-bold">
                    Today's <span className="gradient-gold-text">Mogul</span>
                  </h2>
                </div>
                <HeroSpotlight />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="container mb-6">
          <TrendingSearches />
        </section>

        {/* Browse Categories - Horizontal Scroll */}
        <section className="container mb-8">
          <h2 className="font-serif text-lg font-bold mb-3">Browse by Category</h2>
          <CompactCategories />
        </section>

        {/* Featured Tools - Side Hustle & Mogul Markets */}
        <section className="container mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MogulMarketsPreview />
            <SideHustlePreview />
          </div>
        </section>

        {/* Other Mogul Tools */}
        <section className="container mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛠️</span>
            <h2 className="font-serif text-lg font-bold">
              More <span className="gradient-gold-text">Mogul</span> Tools
            </h2>
          </div>
          <QuickActions />
        </section>

        {/* Rich Habits Quote */}
        <section className="container mb-8">
          <RichHabits />
        </section>

        {/* Wealth Wisdom Promo */}
        <section className="container pb-16">
          <WealthWisdomPromo />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
